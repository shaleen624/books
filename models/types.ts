export type InvoiceStatus = 'Draft' | 'Saved' | 'Unpaid' | 'Cancelled' | 'Paid';
export enum ModelNameEnum {
  Account = 'Account',
  AccountingLedgerEntry = 'AccountingLedgerEntry',
  AccountingSettings = 'AccountingSettings',
  Address = 'Address',
  Batch= 'Batch',
  Color = 'Color',
  CompanySettings = 'CompanySettings',
  Currency = 'Currency',
  GetStarted = 'GetStarted',
  Defaults = 'Defaults',
  Item = 'Item',
  UOM = 'UOM',
  UOMConversionItem = 'UOMConversionItem',
  JournalEntry = 'JournalEntry',
  JournalEntryAccount = 'JournalEntryAccount',
  Misc = 'Misc',
  NumberSeries = 'NumberSeries',
  Party = 'Party',
  Payment = 'Payment',
  PaymentFor = 'PaymentFor',
  PrintSettings = 'PrintSettings',
  PrintTemplate = 'PrintTemplate',
  PurchaseInvoice = 'PurchaseInvoice',
  PurchaseInvoiceItem = 'PurchaseInvoiceItem',
  SalesInvoice = 'SalesInvoice',
  SalesInvoiceItem = 'SalesInvoiceItem',
  SetupWizard = 'SetupWizard',
  Tax = 'Tax',
  TaxDetail = 'TaxDetail',
  TaxSummary = 'TaxSummary',
  PatchRun = 'PatchRun',
  SingleValue = 'SingleValue',
  InventorySettings = 'InventorySettings',
  SystemSettings = 'SystemSettings',
  StockMovement = 'StockMovement',
  StockMovementItem = 'StockMovementItem',
  StockLedgerEntry = 'StockLedgerEntry',
  Shipment = 'Shipment',
  ShipmentItem = 'ShipmentItem',
  PurchaseReceipt = 'PurchaseReceipt',
  PurchaseReceiptItem = 'PurchaseReceiptItem',
  Location = 'Location',
}

export type ModelName = keyof typeof ModelNameEnum;
