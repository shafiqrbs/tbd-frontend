import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/layout/Layout";
import SampleDashboard from "./components/modules/sample-module/DashBoard";
import "./lang/i18next";
import CustomerIndex from "./components/modules/core/customer/CustomerIndex";
import UserIndex from "./components/modules/core/user/UserIndex";
import VendorIndex from "./components/modules/core/vendor/VendorIndex";
import ProductionConfigurationIndex from "./components/modules/production/configuraton/ConfigurationIndex";
import CategoryGroupIndex from "./components/modules/inventory/category-group/CategoryGroupIndex";
import CategoryIndex from "./components/modules/inventory/category/CategoryIndex";
import ProductIndex from "./components/modules/inventory/product/ProductIndex.jsx";
import SalesIndex from "./components/modules/inventory/sales/SalesIndex";
import SampleInvoice from "./components/modules/sample-module/sample-layout/SampleInvoice";
import SampleIndex from "./components/modules/sample-module/sample-layout/SampleIndex";
import DomainIndex from "./components/modules/domain/domain/DomainIndex";
import TransactionModeIndex from "./components/modules/accounting/transaction-mode/TransactionModeIndex.jsx";
import SalesInvoice from "./components/modules/inventory/sales/SalesInvoice";
import Sitemap from "./components/modules/dashboard/SItemap";
import PurchaseIndex from "./components/modules/inventory/purchase/PurchaseIndex";
import PurchaseInvoice from "./components/modules/inventory/purchase/PurchaseInvoice";
import VoucherIndex from "./components/modules/accounting/voucher-entry/VoucherIndex";
import HeadGroupIndex from "./components/modules/accounting/head-group/HeadGroupIndex";
import HeadSubGroupIndex from "./components/modules/accounting/head-subgroup/HeadSubGroupIndex";
import LedgerIndex from "./components/modules/accounting/ledger/LedgerIndex";
import SalesEdit from "./components/modules/inventory/sales/SalesEdit.jsx";
import PurchaseEdit from "./components/modules/inventory/purchase/PurchaseEdit.jsx";
import SampleModalIndex from "./components/modules/sample3Grid/SampleModalIndex.jsx";
import OpeningApproveIndex from "./components/modules/inventory/opening-stock/OpeningApproveIndex";
import OpeningStockIndex from "./components/modules/inventory/opening-stock/OpeningStockIndex";
import InvoiceBatchIndex from "./components/modules/inventory/invoice-batch/InvoiceBatchIndex.jsx";
import WarehouseIndex from "./components/modules/core/warehouse/WarehouseIndex.jsx";
import MarketingExecutiveIndex from "./components/modules/core/marketing-executive/MarketingExecutiveIndex.jsx";
import ProductSettingsIndex from "./components/modules/inventory/product-settings/ProductSettingsIndex.jsx";
import ProductionSettingIndex from "./components/modules/production/settings/ProductionSettingIndex.jsx";
import RecipeItemsIndex from "./components/modules/production/recipe-items/RecipeItemsIndex.jsx";
import RecipeIndex from "./components/modules/production/recipe-items/recipe/RecipeIndex.jsx";
import InventoryConfigurationIndex from "./components/modules/inventory/inventory-configuration/InventoryConfigurationIndex.jsx";
import ParticularIndex from "./components/modules/inventory/particular/ParticularIndex";
import InhouseIndex from "./components/modules/production/production-inhouse/InhouseIndex.jsx";
import SettingsIndex from "./components/modules/core/settings/SettingsIndex";

import StockIndex from "./components/modules/inventory/stock/StockIndex.jsx";
import ConfigurationIndex from "./components/modules/domain/configuraton/ConfigurationIndex.jsx";
import SitemapIndex from "./components/modules/domain/sitemap/SitemapIndex.jsx";
import BatchIndex from "./components/modules/production/batch/BatchIndex.jsx";
import Requisition from "./components/modules/procurement/purchase-requisition/Requisition.jsx";
import RequisitionInvoice from "./components/modules/procurement/purchase-requisition/RequisitionInvoice.jsx";
import BranchManagementIndex from "./components/modules/domain/branch-management/BranchManagementIndex.jsx";
import AccountingConfig from "./components/modules/accounting/config/ConfigIndex";
import FileUploadIndex from "./components/modules/core/file-upload/FileUploadIndex.jsx";
import MatrixIndex from "./components/modules/procurement/requistion-matrix/MatrixIndex.jsx";
import BakeryIndex from "./components/modules/pos/bakery/BakeryIndex.jsx";
import ReportIndex from "./components/modules/reporting/reports/ReportIndex.jsx";
import RequisitionUpdate from "./components/modules/procurement/purchase-requisition/RequisitionUpdate.jsx";
import ReconciliationIndex from "./components/modules/inventory/stock-reconciliation/ReconciliationIndex.jsx";
import TransferIndex from "./components/modules/inventory/stock-transfer/TransferIndex.jsx";
import CouponIndex from "./components/modules/inventory/coupon-code/CouponIndex.jsx";
import BarcodePrintIndex from "./components/modules/inventory/barcode-print/BarcodePrintIndex.jsx";
import DashboardIndexB2B from "./components/modules/b2b/dashboard/DashboardIndex.jsx";
import CategoryIndexB2B from "./components/modules/b2b/category/CategoryIndex.jsx";
import ProductIndexB2B from "./components/modules/b2b/product/ProductIndex.jsx";
import SettingIndexB2B from "./components/modules/b2b/setting/SettingIndex.jsx";
import B2bDomainIndex from "./components/modules/b2b/domain/B2bDomainIndex.jsx";
import GeneralIssueIndex from "./components/modules/production/production-issue/general-issue/GeneralIssueIndex.jsx";
import BatchIssueIndex from "./components/modules/production/production-issue/batch-issue/BatchIssueIndex.jsx";
import DiscountUserIndex from "./components/modules/discount/user/DiscountUserIndex";
import B2bUserIndex from "./components/modules/b2b/master-user/B2bUserIndex";
import DiscountConfigIndex from "./components/modules/discount/config/DiscountConfigIndex";
import VoucherCreateIndex from "./components/modules/accounting/voucher-create/VoucherCreateIndex.jsx";
import DiscountDashboard from "./components/modules/discount/dashboard/DiscountDashboard";
import IssueWarehouseIndex from "./components/modules/production/production-issue/warehouse/IssueWarehouseIndex.jsx";

function AppRoute() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route path="/sample/">
          <Route path="" element={<SampleDashboard />} />
          <Route path="invoice" element={<SampleInvoice />} />
          <Route path="index" element={<SampleIndex />} />
        </Route>
        <Route path="core/">
          <Route path="file-upload/">
            <Route path="" element={<FileUploadIndex />} />
          </Route>
          <Route path="customer" element={<CustomerIndex />} />
          <Route path="customer/:id" element={<CustomerIndex />} />
          <Route path="user" element={<UserIndex />} />
          <Route path="user/:id" element={<UserIndex />} />
          <Route path="vendor" element={<VendorIndex />} />
          <Route path="vendor/:id" element={<VendorIndex />} />
          <Route path="setting" element={<SettingsIndex />} />
          <Route path="setting/:id" element={<SettingsIndex />} />
          <Route path="warehouse" element={<WarehouseIndex />} />
          <Route path="warehouse/:id" element={<WarehouseIndex />} />
          <Route
            path="marketing-executive"
            element={<MarketingExecutiveIndex />}
          />
          <Route
            path="marketing-executive/:id"
            element={<MarketingExecutiveIndex />}
          />
        </Route>
        <Route path="/inventory/">
          <Route path="sales/edit/:id" element={<SalesEdit />} />
          <Route path="sales" element={<SalesIndex />} />
          <Route path="sales-invoice" element={<SalesInvoice />} />
          <Route path="purchase/edit/:id" element={<PurchaseEdit />} />
          <Route path="purchase" element={<PurchaseIndex />} />
          <Route path="purchase-invoice" element={<PurchaseInvoice />} />
          <Route path="opening-stock" element={<OpeningStockIndex />} />
          <Route
            path="opening-approve-stock"
            element={<OpeningApproveIndex />}
          />
          <Route path="product" element={<ProductIndex />} />
          <Route path="product/:id" element={<ProductIndex />} />
          <Route path="category" element={<CategoryIndex />} />
          <Route path="category/:categoryId" element={<CategoryIndex />} />
          <Route path="category-group" element={<CategoryGroupIndex />} />
          <Route path="category-group/:id" element={<CategoryGroupIndex />} />
          <Route path="config" element={<InventoryConfigurationIndex />} />
          <Route path="invoice-batch" element={<InvoiceBatchIndex />} />
          <Route path="particular" element={<ParticularIndex />} />
          <Route path="particular/:id" element={<ParticularIndex />} />
          <Route path="product-settings" element={<ProductSettingsIndex />} />
          <Route
            path="product-settings/:id"
            element={<ProductSettingsIndex />}
          />
          <Route path="config" element={<InventoryConfigurationIndex />} />
          <Route path="stock" element={<StockIndex />} />
          <Route
            path="stock-reconciliation"
            element={<ReconciliationIndex />}
          />
          <Route
            path="stock-reconciliation/:id"
            element={<ReconciliationIndex />}
          />
          <Route path="stock-transfer" element={<TransferIndex />} />
          <Route path="stock-transfer/:id" element={<TransferIndex />} />
          <Route path="coupon-code" element={<CouponIndex />} />
          <Route path="coupon-code/:id" element={<CouponIndex />} />
          <Route path="barcode-print" element={<BarcodePrintIndex />} />
        </Route>

        <Route path="/discount">
          <Route path="" element={<DiscountDashboard />} />
          <Route path="users" element={<DiscountUserIndex />} />
          <Route path="config" element={<DiscountConfigIndex />} />
        </Route>
        <Route path="/production/">
          <Route path="items" element={<RecipeItemsIndex />} />
          <Route path="recipe-update/:id" element={<RecipeIndex />} />
          <Route path="setting" element={<ProductionSettingIndex />} />
          <Route path="setting/:id" element={<ProductionSettingIndex />} />
          <Route path="config" element={<ProductionConfigurationIndex />} />
          <Route path="batch" element={<BatchIndex />} />
          <Route path="batch/:id" element={<InhouseIndex />} />
          {/*<Route path="issue-production-general" element={<GeneralIssueIndex />}/>*/}
          <Route path="issue-production-general/:id" element={<GeneralIssueIndex />}/>
          {/*<Route path="issue-production-batch" element={<BatchIssueIndex />} />*/}
          <Route path="issue-production-batch/:id" element={<BatchIssueIndex />} />
          <Route path="user-warehouse" element={<IssueWarehouseIndex />}/>
          <Route path="user-warehouse/:id" element={<IssueWarehouseIndex />}/>
        </Route>

        <Route path="/domain/">
          <Route path="" element={<DomainIndex />} />
          <Route path="edit/:id" element={<DomainIndex />} />
          <Route path="config/:id" element={<ConfigurationIndex />} />
          <Route path="sitemap" element={<SitemapIndex />} />
          <Route path="sitemap/:id" element={<SitemapIndex />} />
          <Route path="branch-management" element={<BranchManagementIndex />} />
        </Route>

        <Route path="/accounting/">
          <Route path="voucher-entry" element={<VoucherIndex />} />
          <Route path="ledger" element={<LedgerIndex />} />
          <Route path="ledger/:id" element={<LedgerIndex />} />
          <Route path="head-group" element={<HeadGroupIndex />} />
          <Route path="head-group/:id" element={<HeadGroupIndex />} />
          <Route path="head-subgroup" element={<HeadSubGroupIndex />} />
          <Route path="head-subgroup/:id" element={<HeadSubGroupIndex />} />
          <Route path="transaction-mode" element={<TransactionModeIndex />} />
          <Route path="voucher-create" element={<VoucherCreateIndex />} />
          <Route path="voucher-create/:id" element={<VoucherCreateIndex />} />
          <Route
            path="transaction-mode/:id"
            element={<TransactionModeIndex />}
          />
          <Route path="config" element={<AccountingConfig />} />
          <Route path="modalIndex" element={<SampleModalIndex />} />
        </Route>
        <Route path="/procurement/">
          <Route path="requisition" element={<Requisition />} />
          <Route path="new-requisition" element={<RequisitionInvoice />} />
          <Route path="requisition/edit/:id" element={<RequisitionUpdate />} />
          <Route path="requisition-board" element={<MatrixIndex />} />
        </Route>
        <Route path="/reporting/">
          <Route path="reports" element={<ReportIndex />} />
        </Route>
        <Route path="sitemap" element={<Sitemap />} />
        <Route path="/pos/">
          <Route path="bakery" element={<BakeryIndex />} />
        </Route>
        <Route path="/b2b/">
          <Route path="dashboard" element={<DashboardIndexB2B />} />
          <Route path="domain" element={<B2bDomainIndex />} />
          <Route path="master-user" element={<B2bUserIndex />} />
          <Route path="sub-domain/category/:id" element={<CategoryIndexB2B />} />
          <Route path="sub-domain/product/:id" element={<ProductIndexB2B />} />
          <Route path="sub-domain/setting/:id" element={<SettingIndexB2B />} />
        </Route>
        <Route path="sitemap" element={<Sitemap />} />
      </Route>
    </Routes>
  );
}

export default AppRoute;
