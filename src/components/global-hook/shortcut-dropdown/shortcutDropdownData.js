import { IconCode } from "@tabler/icons-react";

const shortcutDropdownData = (t, configData) => {
  return [
    {
      group: "Core",
      actions: configData?.domain?.modules?.includes("core")
        ? [
            {
              id: "customer",
              label: t("CustomerN"),
              description: t("WhereWePresentTheCustomerInformationN"),
              isShow: true,
            },
            {
              id: "user",
              label: t("UserN"),
              description: t("WhereWePresentTheUserInformationN"),
              isShow: true,
            },
            {
              id: "vendor",
              label: t("VendorN"),
              description: t("WhereWePresentTheVendorInformationN"),
              isShow: true,
            },
            {
              id: "setting",
              label: t("CoreSettingN"),
              description: t("WhereWePresentTheVendorInformationN"),
              isShow: true,
            },
            {
              id: "warehouse",
              label: t("WarehouseN"),
              description: t("WhereWePresentTheWarehouseInformationN"),
              isShow: configData?.sku_warehouse == true ? true : false,
            },
            {
              id: "marketing-executive",
              label: t("MarketingExecutiveN"),
              description: t("WhereWePresentTheVendorInformationN"),
              isShow: true,
            },
            {
              id: "file-upload",
              label: t("ManageFileN"),
              description: t("WhereWePresentTheFileInformation"),
              isShow: true,
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
              isShow: true,
            },
            {
              id: "sales-invoice",
              label: t("NewSalesN"),
              description: t("WhereWePresentTheSalesInvoiceInformationN"),
              isShow: true,
            },
              {
                  id: "sales-return",
                  label: t("SalesReturn"),
                  description: t("WhereWePresentThePurchaseReturnInformationN"),
                  isShow: true
              },
              /*{
                  id: "sales-return-invoice",
                  label: t("SalesReturnNew"),
                  description: t("WhereWePresentThePurchaseReturnInformationN"),
                  isShow: true
              },*/
            {
              id: "purchase",
              label: t("PurchaseN"),
              description: t("WhereWePresentThePurchaseInformationN"),
              isShow: true,
            },
            {
              id: "purchase-invoice",
              label: t("NewPurchaseN"),
              description: t("WhereWePresentThePurchaseInvoiceInformationN"),
              isShow: true,
            },
              {
                  id: "purchase-return",
                  label: t("PurchaseReturn"),
                  description: t("WhereWePresentThePurchaseReturnInformationN"),
                  isShow: true
              },
              {
                  id: "purchase-return-invoice",
                  label: t("PurchaseReturnNew"),
                  description: t("WhereWePresentThePurchaseReturnInformationN"),
                  isShow: true
              },
            {
              id: "opening-stock",
              label: t("NewOpeningN"),
              description: t("WhereWePresentThePurchaseInvoiceInformationN"),
              isShow: true,
            },
            {
              id: "opening-approve-stock",
              label: t("OpeningApproveN"),
              description: t("WhereWePresentThePurchaseInvoiceInformationN"),
              isShow: true,
            },
            {
              id: "invoice-batch",
              label: t("InvoiceBatchN"),
              description: t("WhereWePresentTheInvoiceBatchInformationN"),
              isShow: true,
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
              isShow: true,
            },
            {
              id: "category-group",
              label: t("CategoryGroupnN"),
              description: t("WhereWePresentTheCategoryGroupInformationN"),
              isShow: true,
            },
            {
              id: "product",
              label: t("ProductN"),
              description: t("WhereWePresentTheProductInformationN"),
              isShow: true,
            },
            {
              id: "product-settings",
              label: t("ProductSettingN"),
              description: t("WhereWePresentTheInvoiceBatchInformationN"),
              isShow: true,
            },
            {
              id: "particular",
              label: t("ParticularSettingN"),
              description: t("WhereWePresentTheInvoiceBatchInformationN"),
              isShow: true,
            },
            {
              id: "config",
              label: t("InventoryConfigurationN"),
              description: t("WhereWePresentTheInvoiceBatchInformationN"),
              isShow: true,
            },
            {
              id: "stock",
              label: t("StockN"),
              description: t("WhereWePresentTheInvoiceBatchInformationN"),
              isShow: true,
            },
            {
              id: "opening-stock",
              label: t("OpeningStockN"),
              description: t("WhereWePresentTheInvoiceBatchInformationN"),
              isShow: true,
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
              isShow: true,
            },
            {
              id: "setting",
              label: t("ProductionSettingN"),
              description: t("WhereWePresentTheProductionInformationN"),
              isShow: true,
            },
            {
              id: "config",
              label: t("ProductionConfigurationN"),
              description: t("WhereWePresentTheProductionInhouseInformationN"),
              isShow: true,
            },
            {
              id: "batch",
              label: t("ProductionInhouseN"),
              description: t("WhereWePresentTheProductionInhouseInformationN"),
              isShow: true,
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
              isShow: true,
            },
            {
              id: "dashboard",
              label: t("B2BManagement"),
              description: t("WhereWePresentTheDomainInformationN"),
              isShow: true,
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
              isShow: true,
            },
            {
              id: "voucher-entry",
              label: t("VoucherEntryN"),
              description: t("WhereWePresentTheVoucherInformationN"),
              isShow: true,
            },
            {
              id: "ledger",
              label: t("LedgerN"),
              description: t("WhereWePresentTheLedgerInformationN"),
              isShow: true,
            },
            {
              id: "head-group",
              label: t("HeadGroupN"),
              description: t("WhereWePresentTheHeadGroupInformationN"),
              isShow: true,
            },
            {
              id: "head-subgroup",
              label: t("HeadSubGroupN"),
              description: t("WhereWePresentTheHeadSubGroupInformationN"),
              isShow: true,
            },
            {
              id: "balance-sheet",
              label: t("BalanceSheet"),
              description: t("WhereWePresentTheBalanceSheetInformationN"),
              isShow: true,
            },
            {
              id: "balance-entry",
              label: t("BalanceEntry"),
              description: t("WhereWePresentTheBalanceEntryInformationN"),
              isShow: true,
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
              isShow: configData?.child_domain_exists,
            },
            {
              id: "requisition",
              label: t("RequisitionN"),
              description: t("WhereWePresentTheTransactionModeInformationN"),
              isShow: true,
            },
            {
              id: "new-requisition",
              label: t("NewRequisitionN"),
              description: t("WhereWePresentTheTransactionModeInformationN"),
              isShow: true,
            },
          ]
        : [],
    },
  ];
};
export default shortcutDropdownData;
