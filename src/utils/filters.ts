import { ModelNameEnum } from 'models/types';

export const routeFilters = {
  SalesItems: { for: ['in', ['Sales', 'Both']] },
  PurchaseItems: { for: ['in', ['Purchases', 'Both']] },
  Items: { for: 'Both' },
  PurchasePayments: {
    referenceType: ModelNameEnum.PurchaseInvoice,
  },
  SalesPayments: {
    referenceType: ModelNameEnum.SalesInvoice,
  },
  Suppliers: { role: ['in', ['Supplier', 'Both']] },
  Customers: { role: ['in', ['Customer', 'Both']] },
  Party: { role: 'Both' },
};

export const createFilters = {
  SalesItems: { for: 'Sales' },
  PurchaseItems: { for: 'Purchases' },
  Items: { for: 'Both' },
  PurchasePayments: { paymentType: 'Pay' },
  SalesPayments: { paymentType: 'Receive' },
  Suppliers: { role: 'Supplier' },
  Customers: { role: 'Customer' },
  Party: { role: 'Both' },
};

// Export the formatting functions directly
export function formatCurrency(value: number): string {
  // Your currency formatting logic
  return value.toFixed(2);
}

export function formatDate(date: string | Date): string {
  // Your date formatting logic
  return new Date(date).toLocaleDateString();
}
