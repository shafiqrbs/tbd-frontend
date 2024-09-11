import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import SampleDashboard from "./components/modules/sample-module/DashBoard";
import './lang/i18next';
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
import SampleModalIndex from './components/modules/sample3Grid/SampleModalIndex.jsx';
import OpeningApproveIndex from "./components/modules/inventory/opening-stock/OpeningApproveIndex";
import OpeningStockIndex from "./components/modules/inventory/opening-stock/OpeningStockIndex";
import InvoiceBatchIndex from './components/modules/inventory/invoice-batch/InvoiceBatchIndex.jsx';
import LocationIndex from './components/modules/core/location/LocationIndex.jsx';
import MarketingExecutiveIndex from './components/modules/core/marketing-executive/MarketingExecutiveIndex.jsx';
import ProductSettingsIndex from './components/modules/inventory/product-settings/ProductSettingsIndex.jsx';
import ProductionSettingIndex from "./components/modules/production/settings/ProductionSettingIndex.jsx";
import RecipeItemsIndex from "./components/modules/production/recipe-items/RecipeItemsIndex.jsx";
import RecipeIndex from "./components/modules/production/recipe-items/recipe/RecipeIndex.jsx";
import InventoryConfigurationIndex from './components/modules/inventory/inventory-configuration/InventoryConfigurationIndex.jsx';
import ParticularIndex from "./components/modules/inventory/particular/ParticularIndex";
import InhouseIndex from './components/modules/production/production-inhouse/InhouseIndex.jsx';
import SettingsIndex from "./components/modules/core/settings/SettingsIndex";
import StockIndex from './components/modules/inventory/stock/StockIndex.jsx';
import ConfigurationIndex from './components/modules/domain/configuraton/ConfigurationIndex.jsx';
import PosIndex from './components/modules/restaurant-pos/pos-sales/PosIndex.jsx';


function AppRoute() {

    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path="/" element={<Layout />}>
                <Route path="/sample/">
                    <Route path="" element={<SampleDashboard />} />
                    <Route path="invoice" element={<SampleInvoice />} />
                    <Route path="index" element={<SampleIndex />} />
                </Route>
                <Route path="core/">
                    <Route path="customer" element={<CustomerIndex />} />
                    <Route path="customer/:id" element={<CustomerIndex />} />
                    <Route path="user" element={<UserIndex />} />
                    <Route path="user/:id" element={<UserIndex />} />
                    <Route path="vendor" element={<VendorIndex />} />
                    <Route path="vendor/:id" element={<VendorIndex />} />
                    <Route path="setting" element={<SettingsIndex />} />
                    <Route path="setting/:id" element={<SettingsIndex />} />
                    <Route path="location" element={<LocationIndex />} />
                    <Route path="location/:id" element={<LocationIndex />} />
                    <Route path="marketing-executive" element={<MarketingExecutiveIndex />} />
                    <Route path="marketing-executive/:id" element={<MarketingExecutiveIndex />} />

                </Route>
                <Route path="/inventory/">
                    <Route path="sales/edit/:id" element={<SalesEdit />} />
                    <Route path="sales" element={<SalesIndex />} />
                    <Route path="sales-invoice" element={<SalesInvoice />} />
                    <Route path="purchase/edit/:id" element={<PurchaseEdit />} />
                    <Route path="purchase" element={<PurchaseIndex />} />
                    <Route path="purchase-invoice" element={<PurchaseInvoice />} />
                    <Route path="opening-stock" element={<OpeningStockIndex />} />
                    <Route path="opening-approve-stock" element={<OpeningApproveIndex />} />
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
                    <Route path="product-settings/:id" element={<ProductSettingsIndex />} />
                    <Route path="config" element={<InventoryConfigurationIndex />} />
                    <Route path="stock" element={<StockIndex />} />
                </Route>

                <Route path="/production/">
                    <Route path="items" element={<RecipeItemsIndex />} />
                    <Route path="recipe-update/:id" element={<RecipeIndex />} />
                    <Route path="setting" element={<ProductionSettingIndex />} />
                    <Route path="setting/:id" element={<ProductionSettingIndex />} />
                    <Route path="config" element={<ProductionConfigurationIndex />} />
                    <Route path="production-inhouse" element={<InhouseIndex />} />
                </Route>

                <Route path="/domain/">
                    <Route path="domain-index" element={<DomainIndex />} />
                    <Route path="domain-index/:id" element={<DomainIndex />} />
                    <Route path="config/:id" element={<ConfigurationIndex />} />
                </Route>

                <Route path="/accounting/">
                    <Route path="voucher-entry" element={<VoucherIndex />} />
                    <Route path="ledger" element={<LedgerIndex />} />
                    <Route path="ledger/:id" element={<LedgerIndex />} />
                    <Route path="head-subgroup" element={<HeadSubGroupIndex />} />
                    <Route path="head-subgroup/:id" element={<HeadSubGroupIndex />} />
                    <Route path="head-group" element={<HeadGroupIndex />} />
                    <Route path="head-group/:id" element={<HeadGroupIndex />} />
                    <Route path="transaction-mode" element={<TransactionModeIndex />} />
                    <Route path="transaction-mode/:id" element={<TransactionModeIndex />} />
                    <Route path="modalIndex" element={<SampleModalIndex />} />
                </Route>
                <Route path="/pos/">
                    <Route path="pos-index" element={<PosIndex />} />
                </Route>
                <Route path="sitemap" element={<Sitemap />} />
            </Route>
        </Routes>

    )
}

export default AppRoute
