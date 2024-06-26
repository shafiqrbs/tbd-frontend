const getSpotlightDropdownData = (t) => {

    return ([
        {
            group: 'Core',
            actions: [
                {
                    id: 'customer',
                    label: 'Customer',
                    description: 'WhereWePresentTheCustomerInformation',

                },
                {
                    id: 'user',
                    label: 'User',
                    description: 'WhereWePresentTheUserInformation',


                },
                {
                    id: 'vendor',
                    label: 'Vendor',
                    description: 'WhereWePresentTheVendorInformation',

                },
            ],
        },

        {
            group: 'Inventory',
            actions: [
                {
                    id: 'category',
                    label: 'Category',
                    description: 'WhereWePresentTheCategoryInformation',

                },
                {
                    id: 'category-group',
                    label: 'CategoryGroup',
                    description: 'WhereWePresentTheCategoryGroupInformation',

                },
                {
                    id: 'product',
                    label: 'Product',
                    description: 'WhereWePresentTheProductInformation',

                },
                {
                    id: 'config',
                    label: 'Configuration',
                    description: 'WhereWePresentTheConfigurationInformation',

                },
                {
                    id: 'sales',
                    label: 'Sales',
                    description: 'WhereWePresentTheSalesInformation',

                },
                {
                    id: 'sales-invoice',
                    label: 'NewSales',
                    description: 'WhereWePresentTheSalesInvoiceInformation',

                },
                {
                    id: 'purchase',
                    label: 'Purchase',
                    description: 'WhereWePresentThePurchaseInformation',

                },
                {
                    id: 'purchase-invoice',
                    label: 'NewPurchase',
                    description: 'WhereWePresentThePurchaseInvoiceInformation',

                },
                {
                    id: 'invoice-batch',
                    label: 'InvoiceBatch',
                    description: 'WhereWePresentTheInvoiceBatchInformation',

                },
            ],
        },
        {
            group: 'Production',
            actions: [
                {
                    id: 'production',
                    label: 'Production',
                    description: 'WhereWePresentTheProductionInformation',

                },
                {
                    id: 'production-inhouse',
                    label: 'ProductionInhouse',
                    description: 'WhereWePresentTheProductionInformation',


                },
                {
                    id: 'production-receipe',
                    label: 'ProductionReceipe',
                    description: 'WhereWePresentTheProductionInformation',


                },
            ],
        },
        {
            group: 'Domain',
            actions: [
                {
                    id: '',
                    label: 'Domain',
                    description: 'WhereWePresentTheDomainInformation',

                },
            ],
        },
        {
            group: 'Accounting',
            actions: [
                {
                    id: 'transaction-mode',
                    label: 'TransactionMode',
                    description: 'WhereWePresentTheTransactionModeInformation',

                },
                {
                    id: 'voucher-entry',
                    label: 'VoucherEntry',
                    description: 'WhereWePresentTheVoucherInformation',

                },
                {
                    id: 'ledger',
                    label: 'Ledger',
                    description: 'WhereWePresentTheLedgerInformation',

                },
                {
                    id: 'head-group',
                    label: 'HeadGroup',
                    description: 'WhereWePresentTheHeadGroupInformation',

                },
                {
                    id: 'head-subgroup',
                    label: 'HeadSubGroup',
                    description: 'WhereWePresentTheHeadSubGroupInformation',

                },
            ],
        }
    ]);

};
export default getSpotlightDropdownData;
