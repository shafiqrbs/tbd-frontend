const getSpotlightDropdownData = (t) => {

    return ([
        {
            group: 'Core',
            actions: [
                {
                    id: 'customer',
                    label: t('CustomerN'),
                    description: t('WhereWePresentTheCustomerInformationN'),

                },
                {
                    id: 'user',
                    label: t('UserN'),
                    description: t('WhereWePresentTheUserInformationN'),


                },
                {
                    id: 'vendor',
                    label: t('VendorN'),
                    description: t('WhereWePresentTheVendorInformationN'),

                },
            ],
        },

        {
            group: 'Inventory',
            actions: [
                {
                    id: 'category',
                    label: t('CategoryN'),
                    description: t('WhereWePresentTheCategoryInformationN'),

                },
                {
                    id: 'category-group',
                    label: t('CategoryGroupnN'),
                    description: t('WhereWePresentTheCategoryGroupInformationN'),

                },
                {
                    id: 'product',
                    label: t('ProductN'),
                    description: t('WhereWePresentTheProductInformationN'),

                },
                {
                    id: 'config',
                    label: t('ConfigurationN'),
                    description: t('WhereWePresentTheConfigurationInformationN'),

                },
                {
                    id: 'sales',
                    label: t('SalesN'),
                    description: t('WhereWePresentTheSalesInformationN'),

                },
                {
                    id: 'sales-invoice',
                    label: t('NewSalesN'),
                    description: t('WhereWePresentTheSalesInvoiceInformationN'),

                },
                {
                    id: 'purchase',
                    label: t('PurchaseN'),
                    description: t('WhereWePresentThePurchaseInformationN'),

                },
                {
                    id: 'purchase-invoice',
                    label: t('NewPurchaseN'),
                    description: t('WhereWePresentThePurchaseInvoiceInformationN'),

                },
                {
                    id: 'invoice-batch',
                    label: t('InvoiceBatchN'),
                    description: t('WhereWePresentTheInvoiceBatchInformationN'),

                },
            ],
        },
        {
            group: 'Production',
            actions: [
                {
                    id: 'production',
                    label: t('ProductionN'),
                    description: t('WhereWePresentTheProductionInformationN'),

                },
                {
                    id: 'production-inhouse',
                    label: t('ProductionInhouseN'),
                    description: t('WhereWePresentTheProductionInhouseInformationN'),


                },
                {
                    id: 'production-receipe',
                    label: t('ProductionReceipeN'),
                    description: t('WhereWePresentTheProductionReceipeInformationN'),


                },
            ],
        },
        {
            group: 'Domain',
            actions: [
                {
                    id: '',
                    label: t('DomainN'),
                    description: t('WhereWePresentTheDomainInformationN'),

                },
            ],
        },
        {
            group: 'Accounting',
            actions: [
                {
                    id: 'transaction-mode',
                    label: t('TransactionModeN'),
                    description: t('WhereWePresentTheTransactionModeInformationN'),

                },
                {
                    id: 'voucher-entry',
                    label: t('VoucherEntryN'),
                    description: t('WhereWePresentTheVoucherInformationN'),

                },
                {
                    id: 'ledger',
                    label: t('LedgerN'),
                    description: t('WhereWePresentTheLedgerInformationN'),

                },
                {
                    id: 'head-group',
                    label: t('HeadGroupN'),
                    description: t('WhereWePresentTheHeadGroupInformationN'),

                },
                {
                    id: 'head-subgroup',
                    label: t('HeadSubGroupN'),
                    description: t('WhereWePresentTheHeadSubGroupInformationN'),

                },
            ],
        }
    ]);

};
export default getSpotlightDropdownData;
