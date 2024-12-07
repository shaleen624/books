<template>
  <!-- Existing template code -->
  <div v-if="showPriceComparison && item.defaultRate !== item.rate" class="text-sm text-gray-500">
    {{ t`Default rate: ${formatCurrency(item.defaultRate)}` }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
// ... other imports

const showPriceComparison = ref(false);

// Load settings
onMounted(async () => {
  const settings = await fyo.doc.getDoc('SystemSettings');
  showPriceComparison.value = settings.showPriceComparison;
});

// Watch for customer changes
watch(() => doc.value.customer, async (newCustomer) => {
  if (!newCustomer) return;
  
  // Update rates for all items
  if (doc.value.items?.length) {
    for (const item of doc.value.items) {
      if (!item.item) continue;
      
      const customerPrice = await fyo.db.getCustomerPrices(newCustomer, [item.item]);
      if (customerPrice.length) {
        item.rate = customerPrice[0].rate;
      }
    }
  }
});

// Modify item selection to include customer prices
async function onItemSelect(item: any) {
  const customer = doc.value.customer;
  if (customer) {
    const customerPrice = await fyo.db.getCustomerPrices(customer, [item.name]);
    if (customerPrice.length) {
      item.rate = customerPrice[0].rate;
    }
  }
  
  // ... rest of the existing item selection code
}

// Add rate change handler
async function onRateChange(item: any) {
  const customer = doc.value.customer;
  if (!customer) return;

  try {
    await fyo.db.updateCustomerPrice(
      customer,
      item.item,
      item.rate,
      fyo.auth.email,
      'invoice'
    );
  } catch (error) {
    console.error('Failed to update customer price:', error);
  }
}
</script> 