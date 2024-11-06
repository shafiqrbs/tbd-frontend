const getSpotlightDropdownData = (t) => {
  return [
    {
      group: "Core",
      actions: [
        {
          id: "customer",
          label: t("CustomerN"),
          description: t("WhereWePresentTheCustomerInformationN"),
        },
        {
          id: "user",
          label: t("UserN"),
          description: t("WhereWePresentTheUserInformationN"),
        },
        {
          id: "vendor",
          label: t("VendorN"),
          description: t("WhereWePresentTheVendorInformationN"),
        },
        {
          id: "setting",
          label: t("CoreSetting"),
          description: t("WhereWePresentTheVendorInformationN"),
        },
        {
          id: "location",
          label: t("CoreLocation"),
          description: t("WhereWePresentTheVendorInformationN"),
        },
        {
          id: "marketing-executive",
          label: t("MarketingExecutiveN"),
          description: t("WhereWePresentTheVendorInformationN"),
        },
      ],
    },
    {
      group: "Sales & Purchase",
      actions: [
        {
          id: "sales",
          label: t("SalesN"),
          description: t("WhereWePresentTheSalesInformationN"),
        },
        {
          id: "sales-invoice",
          label: t("NewSalesN"),
          description: t("WhereWePresentTheSalesInvoiceInformationN"),
        },
        {
          id: "purchase",
          label: t("PurchaseN"),
          description: t("WhereWePresentThePurchaseInformationN"),
        },
        {
          id: "purchase-invoice",
          label: t("NewPurchaseN"),
          description: t("WhereWePresentThePurchaseInvoiceInformationN"),
        },
      ],
    },
    {
      group: "Inventory",
      actions: [
        {
          id: "category",
          label: t("CategoryN"),
          description: t("WhereWePresentTheCategoryInformationN"),
        },
        {
          id: "category-group",
          label: t("CategoryGroupnN"),
          description: t("WhereWePresentTheCategoryGroupInformationN"),
        },
        {
          id: "product",
          label: t("ProductN"),
          description: t("WhereWePresentTheProductInformationN"),
        },
        {
          id: "invoice-batch",
          label: t("InvoiceBatchN"),
          description: t("WhereWePresentTheInvoiceBatchInformationN"),
        },
        {
          id: "product-settings",
          label: t("ProductSettingN"),
          description: t("WhereWePresentTheInvoiceBatchInformationN"),
        },
        {
          id: "particular",
          label: t("ParticularSettingN"),
          description: t("WhereWePresentTheInvoiceBatchInformationN"),
        },
        {
          id: "config",
          label: t("InventoryConfigurationN"),
          description: t("WhereWePresentTheInvoiceBatchInformationN"),
        },
      ],
    },
    {
      group: "Production",
      actions: [
        {
          id: "items",
          label: t("ProductionReceipeN"),
          description: t("WhereWePresentTheProductionReceipeInformationN"),
        },
        {
          id: "setting",
          label: t("ProductionSetting"),
          description: t("WhereWePresentTheProductionInformationN"),
        },
        {
          id: "config",
          label: t("ProductionConfigurationN"),
          description: t("WhereWePresentTheProductionInhouseInformationN"),
        },
        {
          id: "batch",
          label: t("ProductionInhouseN"),
          description: t("WhereWePresentTheProductionInhouseInformationN"),
        },
      ],
    },
    {
      group: "Domain",
      actions: [
        {
          id: "domain-index",
          label: t("DomainN"),
          description: t("WhereWePresentTheDomainInformationN"),
        },
        // {
        //     id: 'config',
        //     label: t('ConfigurationN'),
        //     description: t('WhereWePresentTheConfigurationInformationN'),

        // },
      ],
    },
    {
      group: "Accounting",
      actions: [
        {
          id: "transaction-mode",
          label: t("TransactionModeN"),
          description: t("WhereWePresentTheTransactionModeInformationN"),
        },
        {
          id: "voucher-entry",
          label: t("VoucherEntryN"),
          description: t("WhereWePresentTheVoucherInformationN"),
        },
        {
          id: "ledger",
          label: t("LedgerN"),
          description: t("WhereWePresentTheLedgerInformationN"),
        },
        {
          id: "head-group",
          label: t("HeadGroupN"),
          description: t("WhereWePresentTheHeadGroupInformationN"),
        },
        {
          id: "head-subgroup",
          label: t("HeadSubGroupN"),
          description: t("WhereWePresentTheHeadSubGroupInformationN"),
        },
      ],
    },
    {
      group: "Procurement",
      actions: [
        {
          id: "requisition",
          label: t("Requisition"),
          description: t("WhereWePresentTheTransactionModeInformationN"),
        },
        {
          id: "new-requisition",
          label: t("NewRequisition"),
          description: t("WhereWePresentTheTransactionModeInformationN"),
        },
      ],
    },
  ];
};
export default getSpotlightDropdownData;
