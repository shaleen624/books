<template>
  <div class="flex flex-col h-full">
    <!-- Header with search and bulk import -->
    <div class="flex justify-between items-center p-4 border-b">
      <div class="flex gap-4 items-center">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search Items..."
          class="input-text"
        />
        <Button
          :title="t`Import Prices`"
          @click="handleImportDialog"
        >
          {{ t`Import` }}
        </Button>
      </div>
      <div class="text-sm text-gray-600">
        {{ t`Showing ${filteredItems.length} items` }}
      </div>
    </div>

    <!-- Price List -->
    <div class="flex-1 overflow-auto">
      <table class="w-full">
        <thead class="bg-gray-50 sticky top-0">
          <tr>
            <th class="p-3 text-left">{{ t`Item` }}</th>
            <th class="p-3 text-right">{{ t`Default Rate` }}</th>
            <th class="p-3 text-right">{{ t`Customer Rate` }}</th>
            <th class="p-3 text-right">{{ t`Last Modified` }}</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.name" class="border-b">
            <td class="p-3">{{ item.name }}</td>
            <td class="p-3 text-right">{{ formatCurrency(item.defaultRate) }}</td>
            <td class="p-3 text-right">
              <input
                type="number"
                v-model="item.customerRate"
                class="input-text text-right w-24"
                @change="updateRate(item)"
              />
            </td>
            <td class="p-3 text-right text-sm text-gray-600">
              {{ formatDateSafe(item.modified) }}
            </td>
            <td class="p-3 text-right">
              <Button
                small
                @click="showHistory(item)"
                :title="t`View History`"
              >
                {{ t`History` }}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Price History Dialog -->
    <Dialog
      v-model="showHistoryDialog"
      :title="t`Price History`"
      type="info"
      :buttons="[{ label: t`Close`, action: () => showHistoryDialog = false }]"
    >
      <template #body>
        <div v-if="selectedItem">
          <div class="mb-4">
            <h3 class="font-medium">{{ selectedItem.name }}</h3>
          </div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left">{{ t`Date` }}</th>
                <th class="text-right">{{ t`Old Rate` }}</th>
                <th class="text-right">{{ t`New Rate` }}</th>
                <th class="text-left">{{ t`Modified By` }}</th>
                <th class="text-left">{{ t`Source` }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="history in priceHistory" :key="history.modified">
                <td>{{ formatDateSafe(history.modified) }}</td>
                <td class="text-right">{{ formatCurrency(history.oldRate) }}</td>
                <td class="text-right">{{ formatCurrency(history.newRate) }}</td>
                <td>{{ history.modifiedBy }}</td>
                <td>{{ history.source }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Dialog>

    <!-- Import Dialog -->
    <Dialog
      v-model="showImportDialog"
      :title="t`Import Customer Prices`"
      type="info"
      :buttons="[
        { label: t`Import`, action: importPrices, loading: importing },
        { label: t`Cancel`, action: () => showImportDialog = false }
      ]"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block mb-2">{{ t`Upload CSV File` }}</label>
            <input
              type="file"
              accept=".csv"
              @change="handleFileUpload"
              class="block w-full"
            />
          </div>
          <div class="text-sm text-gray-600">
            {{ t`CSV should have columns: Item Name, Rate` }}
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fyo } from '../../initFyo';
import Button from '../Button.vue';
import Dialog from '../Dialog.vue';
import { formatCurrency, formatDate } from '../../utils/filters';
import { showToast } from '../../utils/interactive';
import { t } from 'fyo';
import { DocValueMap } from 'fyo/core/types';

interface Item {
  name: string;
  rate: number;
}

interface CustomerPrice {
  item: string;
  rate: number;
  modified?: string;
}

interface ItemPrice {
  name: string;
  defaultRate: number;
  customerRate: number;
  modified?: string;
  rate?: number;
}

interface PriceHistory {
  oldRate: number;
  newRate: number;
  modified: string;
  modifiedBy: string;
  source: string;
}

const props = defineProps<{
  customer: string;
}>();

const items = ref<ItemPrice[]>([]);
const searchTerm = ref('');
const showHistoryDialog = ref(false);
const showImportDialog = ref(false);
const selectedItem = ref<ItemPrice | null>(null);
const priceHistory = ref<PriceHistory[]>([]);
const importing = ref(false);
const fileToImport = ref<File | null>(null);

const filteredItems = computed(() => {
  if (!searchTerm.value) return items.value;
  
  return items.value.filter(item => 
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

async function loadItems() {
  try {
    const allItems = await fyo.db.getAll('Item');
    const customerPrices = await fyo.db.getAll('CustomerItemPrice', {
      fields: ['item', 'rate', 'modified'],
      filters: { customer: props.customer }
    });
    
    items.value = allItems.map(item => ({
      name: item.name as string,
      defaultRate: item.rate as number,
      customerRate: (customerPrices as any[]).find(p => p.item === item.name)?.rate ?? (item.rate as number),
      modified: (customerPrices as any[]).find(p => p.item === item.name)?.modified
    }));
  } catch (error) {
    console.error('Failed to load items:', error);
    showToast({
      type: 'error',
      message: t`Failed to load items`
    });
  }
}

async function updateRate(item: ItemPrice) {
  try {
    await fyo.db.insert('CustomerItemPrice', {
      name: `${props.customer}-${item.name}`,
      customer: props.customer,
      item: item.name,
      rate: item.customerRate,
      modifiedBy: getUserEmail(),
      source: 'manual'
    });
    
    showToast({
      type: 'success',
      message: t`Price updated successfully`
    });
  } catch (error) {
    showToast({
      type: 'error',
      message: t`Failed to update price`
    });
  }
}

async function showHistory(item: ItemPrice) {
  selectedItem.value = item;
  const history = await fyo.db.getAll('CustomerItemPriceHistory', {
    fields: ['oldRate', 'newRate', 'modified', 'modifiedBy', 'source'],
    filters: {
      customer: props.customer,
      item: item.name
    },
    orderBy: 'modified',
    order: 'desc',
    limit: 5
  });

  priceHistory.value = history.map(h => ({
    oldRate: h.oldRate as number,
    newRate: h.newRate as number,
    modified: h.modified as string,
    modifiedBy: h.modifiedBy as string,
    source: h.source as string
  }));
  
  showHistoryDialog.value = true;
}

async function importPrices() {
  if (!fileToImport.value) return;
  
  importing.value = true;
  try {
    const text = await fileToImport.value.text();
    const rows = text.split('\n').map(row => row.split(','));
    
    for (const [itemName, rateStr] of rows.slice(1)) {
      await fyo.db.insert('CustomerItemPrice', {
        name: `${props.customer}-${itemName.trim()}`,
        customer: props.customer,
        item: itemName.trim(),
        rate: parseFloat(rateStr),
        modifiedBy: getUserEmail(),
        source: 'bulk_import'
      });
    }
    
    showToast({
      type: 'success',
      message: t`Prices imported successfully`
    });
    
    await loadItems();
  } catch (error) {
    showToast({
      type: 'error',
      message: t`Failed to import prices`
    });
  } finally {
    importing.value = false;
    showImportDialog.value = false;
  }
}

const handleImportDialog = () => {
  showImportDialog.value = true;
};

const formatDateSafe = (date: string | undefined) => {
  if (!date) return '';
  return formatDate(date);
};

const getUserEmail = () => {
  return fyo.currentUser?.email ?? 'system';
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    fileToImport.value = input.files[0];
  }
};

onMounted(loadItems);
</script> 