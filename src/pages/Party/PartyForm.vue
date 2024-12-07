<template>
  <CommonForm
    :schema-name="schemaName"
    :name="name"
    v-slot="{ doc }"
  >
    <div class="flex flex-col h-full">
      <!-- Tabs Header -->
      <div v-if="doc?.role === 'Customer'" class="border-b">
        <div class="flex space-x-4 px-4">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="currentTab = tab.value"
            :class="[
              'py-4 px-2 -mb-px font-medium text-sm',
              currentTab === tab.value
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-auto">
        <!-- Details Tab (Default Form) -->
        <div v-if="currentTab === 'details'" class="p-4">
          <slot name="form"></slot>
        </div>

        <!-- Customer Prices Tab -->
        <div v-else-if="currentTab === 'prices' && doc?.name" class="h-full">
          <CustomerPriceTab :customer="doc.name" />
        </div>
      </div>
    </div>
  </CommonForm>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CommonForm from '../CommonForm/CommonForm.vue';
import CustomerPriceTab from '../../components/CustomerPrices/CustomerPriceTab.vue';
import { t } from 'fyo';

defineProps<{
  name: string;
  schemaName: string;
}>();

const currentTab = ref('details');

const tabs = computed(() => [
  { label: t`Details`, value: 'details' },
  { label: t`Items`, value: 'prices' }
]);
</script>

<style scoped>
.border-b {
  border-bottom-width: 1px;
}
</style> 