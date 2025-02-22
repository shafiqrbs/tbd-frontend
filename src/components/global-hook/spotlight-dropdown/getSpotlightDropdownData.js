const getSpotlightDropdownData = (t, configData) => {
  return [
    {
      group: "Core",
      actions: configData?.domain?.modules?.includes("core")
        ? [
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
              id: "warehouse",
              label: t("Warehouse"),
              description: t("WhereWePresentTheWarehouseInformationN"),
            },
            {
              id: "marketing-executive",
              label: t("MarketingExecutiveN"),
              description: t("WhereWePresentTheVendorInformationN"),
            },
            {
              id: "file-upload",
              label: t("ManageFile"),
              description: t("WhereWePresentTheFileInformation"),
            },
          ]
        : [],
    },
    {
      group: "Sales & Purchase",
      actions: configData?.domain?.modules?.includes("sales-purchase")
        ? [
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
            {
              id: "opening-stock",
              label: t("NewOpeningN"),
              description: t("WhereWePresentThePurchaseInvoiceInformationN"),
            },
            {
              id: "opening-approve-stock",
              label: t("OpeningApproveN"),
              description: t("WhereWePresentThePurchaseInvoiceInformationN"),
            },
            {
              id: "invoice-batch",
              label: t("InvoiceBatchN"),
              description: t("WhereWePresentTheInvoiceBatchInformationN"),
            },
          ]
        : [],
    },
    {
      group: "Inventory",
      actions: configData?.domain?.modules?.includes("inventory")
        ? [
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
            {
              id: "stock",
              label: t("StockN"),
              description: t("WhereWePresentTheInvoiceBatchInformationN"),
            },
            {
              id: "opening-stock",
              label: t("OpeningStockN"),
              description: t("WhereWePresentTheInvoiceBatchInformationN"),
            },
          ]
        : [],
    },
    {
      group: "Production",
      actions: configData?.domain?.modules?.includes("production")
        ? [
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
          ]
        : [],
    },
    {
      group: "Domain",
      actions: configData?.domain?.modules?.includes("domain")
        ? [
            {
              id: "",
              label: t("DomainN"),
              description: t("WhereWePresentTheDomainInformationN"),
            },
          ]
        : [],
    },
    {
      group: "Accounting",
      actions: configData?.domain?.modules?.includes("accounting")
        ? [
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
          ]
        : [],
    },
    {
      group: "Procurement",
      actions: configData?.domain?.modules?.includes("procurement")
        ? [
            {
              id: "requisition-board",
              label: t("AllRequisitionN"),
              description: t("WhereWePresentTheDomainInformationN"),
            },
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
          ]
        : [],
    },
  ].filter((group) => group.actions.length > 0);
};
export default getSpotlightDropdownData;
