const getSpotlightDropdownData = (t) => {

    return ([
        {
            group: t('Core'),
            actions: [
                {
                    id: 'customer',
                    label: t('Customer'),
                    description: t('WhereWePresentTheCustomerInformation'),

                },
                {
                    id: 'user',
                    label: t('User'),
                    description: t('WhereWePresentTheUserInformation'),


                },
                {
                    id: 'vendor',
                    label: t('Vendor'),
                    description: t('WhereWePresentTheVendorInformation'),

                },
            ],
        },

        {
            group: t('Inventory'),
            actions: [
                {
                    id: 'category',
                    label: t('Category'),
                    description: t('WhereWePresentTheCategoryInformation'),

                },
                {
                    id: 'category-group',
                    label: t('CategoryGroup'),
                    description: t('WhereWePresentTheCategoryGroupInformation'),

                },
                {
                    id: 'product',
                    label: t('Product'),
                    description: t('WhereWePresentTheProductInformation'),

                },
                {
                    id: 'config',
                    label: t('Configuration'),
                    description: t('WhereWePresentTheConfigurationInformation'),

                },
                {
                    id: 'sales',
                    label: t('Sales'),
                    description: t('WhereWePresentTheSalesInformation'),

                },
                {
                    id: 'sales-invoice',
                    label: t('NewSales'),
                    description: t('WhereWePresentTheSalesInvoiceInformation'),

                },
                {
                    id: 'purchase',
                    label: t('Purchase'),
                    description: t('WhereWePresentThePurchaseInformation'),

                },
                {
                    id: 'purchase-invoice',
                    label: t('NewPurchase'),
                    description: t('WhereWePresentThePurchaseInvoiceInformation'),

                },
                {
                    id: 'invoice-batch',
                    label: t('InvoiceBatch'),
                    description: t('WhereWePresentTheInvoiceBatchInformation'),

                },
            ],
        },
        {
            group: t('Production'),
            actions: [
                {
                    id: 'production',
                    label: t('Production'),
                    description: t('WhereWePresentTheProductionInformation'),

                },
                {
                    id: 'production-inhouse',
                    label: t('ProductionInhouse'),
                    description: t('WhereWePresentTheProductionInformation'),


                },
                {
                    id: 'production-receipe',
                    label: t('ProductionReceipe'),
                    description: t('WhereWePresentTheProductionInformation'),


                },
            ],
        },
        {
            group: t('Domain'),
            actions: [
                {
                    id: '',
                    label: t('Domain'),
                    description: t('WhereWePresentTheDomainInformation'),

                },
            ],
        },
        {
            group: t('Accounting'),
            actions: [
                {
                    id: 'transaction-mode',
                    label: t('TransactionMode'),
                    description: t('WhereWePresentTheTransactionModeInformation'),

                },
                {
                    id: 'voucher-entry',
                    label: t('VoucherEntry'),
                    description: t('WhereWePresentTheVoucherInformation'),

                },
                {
                    id: 'ledger',
                    label: t('Ledger'),
                    description: t('WhereWePresentTheLedgerInformation'),

                },
                {
                    id: 'head-group',
                    label: t('HeadGroup'),
                    description: t('WhereWePresentTheHeadGroupInformation'),

                },
                {
                    id: 'head-subgroup',
                    label: t('HeadSubGroup'),
                    description: t('WhereWePresentTheHeadSubGroupInformation'),

                },
            ],
        }
    ]);

};
export default getSpotlightDropdownData;
