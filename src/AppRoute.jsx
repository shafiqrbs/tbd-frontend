import { Routes, Route, Navigate } from "react-router-dom";
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
import ProtectedModule from "./routes/ProtectedModule.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import IssueIndex from "./components/modules/production/production-issue/issue-table/issueIndex.jsx";
import BalanceSheetIndex from "./components/modules/accounting/balance-sheet/BalanceSheetIndex.jsx";
import BalanceEntryIndex from "./components/modules/accounting/balance-entry/BalanceEntryIndex.jsx";
import DomainUserIndex from "./components/modules/domain/master-user/DomainUserIndex";
import LedgerViewIndex from "./components/modules/accounting/ledger-view/LedgerViewIndex.jsx";
import WarehouseListIndex from "./components/modules/core/warehouse-list/WarehouseListIndex.jsx";
import HeadDomainIndex from "./components/modules/domain/head-group/HeadDomainIndex";
import LedgerDomainIndex from "./components/modules/domain/ledger/LedgerDomainIndex";
import WarehouseIssueIndex from "./components/modules/inventory/warehouse-issue/WarehouseIssueIndex.jsx";
import InoutIndex from "./components/modules/procurement/in-out/InoutIndex.jsx";
import ProductBatch from "./components/modules/production/production-inhouse/product-batch/ProductBatchIndex.jsx";
import ProductionIssueReport from "./components/modules/report/production/ProductionIssueReport.jsx";
import ProductionMatrixReport from "./components/modules/report/production/ProductionMatrixReport.jsx";

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
				<Route path="/core" element={<ProtectedModule modules={["core"]} />}>
					<Route path="file-upload/">
						<Route path="" element={
							<ProtectedRoute roles={["role_domain", "role_core_admin"]}>
								<FileUploadIndex />
							</ProtectedRoute>
						} />
					</Route>
					<Route
						path="customer"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin", "role_core_manager"]}>
								<CustomerIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="customer/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin", "role_core_manager"]}>
								<CustomerIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="user"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin"]}>
								<UserIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="user/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin"]}>
								<UserIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="vendor"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin", "role_core_manager"]}>
								<VendorIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="vendor/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin", "role_core_manager"]}>
								<VendorIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="setting"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin"]}>
								<SettingsIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="setting/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin"]}>
								<SettingsIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="warehouse"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin", "role_core_manager"]}>
								<WarehouseIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="warehouse/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin", "role_core_manager"]}>
								<WarehouseIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="warehouse-list"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin", "role_core_manager"]}>
								<WarehouseListIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="marketing-executive"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin", "role_core_manager"]}>
								<MarketingExecutiveIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="marketing-executive/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_core_admin", "role_core_manager"]}>
								<MarketingExecutiveIndex />
							</ProtectedRoute>
						}
					/>
				</Route>
				<Route path="/inventory" element={<ProtectedModule modules={["sales-purchase", "inventory"]} />}>
					<Route
						path="warehouse-issue"
						element={
							<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager"]}>
								<WarehouseIssueIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="sales/edit/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager"]}>
								<SalesEdit />
							</ProtectedRoute>
						}
					/>
					<Route
						path="sales"
						element={
							<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager", "role_sales_purchase_operator"]}>
								<SalesIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="sales-invoice"
						element={
							<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager", "role_sales_purchase_operator"]}>
								<SalesInvoice />
							</ProtectedRoute>
						}
					/>
					<Route
						path="purchase/edit/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager"]}>
								<PurchaseEdit />
							</ProtectedRoute>
						}
					/>
					<Route
						path="purchase"
						element={
							<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager", "role_sales_purchase_operator"]}>
								<PurchaseIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="purchase-invoice"
						element={
							<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager", "role_sales_purchase_operator"]}>
								<PurchaseInvoice />
							</ProtectedRoute>
						}
					/>
					<Route
						path="opening-stock"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<OpeningStockIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="opening-approve-stock"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin"]}>
								<OpeningApproveIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="product"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<ProductIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="product/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<ProductIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="category"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<CategoryIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="category/:categoryId"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<CategoryIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="category-group"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<CategoryGroupIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="category-group/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<CategoryGroupIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="config"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin"]}>
								<InventoryConfigurationIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="invoice-batch"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<InvoiceBatchIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="particular"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<ParticularIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="particular/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<ParticularIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="product-settings"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin"]}>
								<ProductSettingsIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="product-settings/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin"]}>
								<ProductSettingsIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="stock"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager", "role_inventory_stock"]}>
								<StockIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="stock-reconciliation"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<ReconciliationIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="stock-reconciliation/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<ReconciliationIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="stock-transfer"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<TransferIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="stock-transfer/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<TransferIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="coupon-code"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<CouponIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="coupon-code/:id"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<CouponIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="barcode-print"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<BarcodePrintIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="product-batch"
						element={
							<ProtectedRoute roles={["role_domain", "role_inventory_admin", "role_inventory_manager"]}>
								<ProductBatch />
							</ProtectedRoute>
						}
					/>
				</Route>
				<Route path="/discount" element={<ProtectedModule modules={["sales-purchase", "inventory"]} />}>
					<Route path="" element={
						<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager"]}>
							<DiscountDashboard />
						</ProtectedRoute>
					} />
					<Route path="users" element={
						<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin"]}>
							<DiscountUserIndex />
						</ProtectedRoute>
					} />
					<Route path="config" element={
						<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin"]}>
							<DiscountConfigIndex />
						</ProtectedRoute>
					} />
				</Route>
				<Route path="/production" element={<ProtectedModule modules={["production"]} />}>
					<Route path="items" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin", "role_production_approval"]}>
							<RecipeItemsIndex />
						</ProtectedRoute>
					} />
					<Route path="recipe-update/:id" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin", "role_production_approval"]}>
							<RecipeIndex />
						</ProtectedRoute>
					} />
					<Route path="setting" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin"]}>
							<ProductionSettingIndex />
						</ProtectedRoute>
					} />
					<Route path="setting/:id" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin"]}>
							<ProductionSettingIndex />
						</ProtectedRoute>
					} />
					<Route path="config" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin"]}>
							<ProductionConfigurationIndex />
						</ProtectedRoute>
					} />
					<Route path="batch" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin", "role_production_approval", "role_production_operator"]}>
							<BatchIndex />
						</ProtectedRoute>
					} />
					<Route path="batch/:id" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin", "role_production_approval", "role_production_operator"]}>
							<InhouseIndex />
						</ProtectedRoute>
					} />
					<Route path="issue-production-general/:id" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin", "role_production_approval"]}>
							<GeneralIssueIndex />
						</ProtectedRoute>
					} />
					<Route path="issue-production/:type" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin", "role_production_approval"]}>
							<IssueIndex />
						</ProtectedRoute>
					} />
					<Route path="issue-production-batch/:id" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin", "role_production_approval"]}>
							<BatchIssueIndex />
						</ProtectedRoute>
					} />
					<Route path="user-warehouse" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin", "role_production_approval"]}>
							<IssueWarehouseIndex />
						</ProtectedRoute>
					} />
					<Route path="user-warehouse/:id" element={
						<ProtectedRoute roles={["role_domain", "role_production_admin", "role_production_approval"]}>
							<IssueWarehouseIndex />
						</ProtectedRoute>
					} />
				</Route>
				<Route path="/domain" element={<ProtectedModule modules={["domain"]} />}>
					<Route path="" element={
						<ProtectedRoute roles={["role_domain"]}>
							<DomainIndex />
						</ProtectedRoute>
					} />
					<Route path="user" element={
						<ProtectedRoute roles={["role_domain"]}>
							<DomainUserIndex />
						</ProtectedRoute>
					} />
					<Route path="head" element={
						<ProtectedRoute roles={["role_domain"]}>
							<HeadDomainIndex />
						</ProtectedRoute>
					} />
					<Route path="sub-head" element={
						<ProtectedRoute roles={["role_domain"]}>
							<HeadSubGroupIndex />
						</ProtectedRoute>
					} />
					<Route path="ledger" element={
						<ProtectedRoute roles={["role_domain"]}>
							<LedgerDomainIndex />
						</ProtectedRoute>
					} />
					<Route path="edit/:id" element={
						<ProtectedRoute roles={["role_domain"]}>
							<DomainIndex />
						</ProtectedRoute>
					} />
					<Route path="config/:id" element={
						<ProtectedRoute roles={["role_domain"]}>
							<ConfigurationIndex />
						</ProtectedRoute>
					} />
					<Route path="sitemap" element={
						<ProtectedRoute roles={["role_domain"]}>
							<SitemapIndex />
						</ProtectedRoute>
					} />
					<Route path="sitemap/:id" element={
						<ProtectedRoute roles={["role_domain"]}>
							<SitemapIndex />
						</ProtectedRoute>
					} />
					<Route path="branch-management" element={
						<ProtectedRoute roles={["role_domain"]}>
							<BranchManagementIndex />
						</ProtectedRoute>
					} />

				</Route>
				<Route path="/accounting" element={<ProtectedModule modules={["accounting"]} />}>
					<Route path="entry" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin", "role_accounting_voucher_entry"]}>
							<VoucherIndex type={'index'}/>
						</ProtectedRoute>
					} />
					<Route path="voucher-entry" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin", "role_accounting_voucher_entry"]}>
							<VoucherIndex type={'create'}/>
						</ProtectedRoute>
					} />
					<Route path="ledger" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin", "role_accounting_voucher_entry"]}>
							<LedgerIndex />
						</ProtectedRoute>
					} />
					<Route path="ledger/:id" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin", "role_accounting_voucher_entry"]}>
							<LedgerIndex />
						</ProtectedRoute>
					} />
					<Route path="ledger/view/:id" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin", "role_accounting_voucher_entry"]}>
							<LedgerViewIndex />
						</ProtectedRoute>
					} />
					<Route path="head-group" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<HeadGroupIndex />
						</ProtectedRoute>
					} />
					<Route path="head-group/:id" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<HeadGroupIndex />
						</ProtectedRoute>
					} />
					<Route path="head-subgroup" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<HeadSubGroupIndex />
						</ProtectedRoute>
					} />
					<Route path="head-subgroup/:id" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<HeadSubGroupIndex />
						</ProtectedRoute>
					} />
					<Route path="transaction-mode" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<TransactionModeIndex />
						</ProtectedRoute>
					} />
					<Route path="voucher-create" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin", "role_accounting_voucher_entry"]}>
							<VoucherCreateIndex />
						</ProtectedRoute>
					} />
					<Route path="voucher-create/:id" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin", "role_accounting_voucher_entry"]}>
							<VoucherCreateIndex />
						</ProtectedRoute>
					} />
					<Route path="transaction-mode/:id" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<TransactionModeIndex />
						</ProtectedRoute>
					} />
					<Route path="config" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<AccountingConfig />
						</ProtectedRoute>
					} />
					<Route path="modalIndex" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<SampleModalIndex />
						</ProtectedRoute>
					} />
					<Route path="balance-sheet" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<BalanceSheetIndex />
						</ProtectedRoute>
					} />
					<Route path="balance-entry" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin"]}>
							<BalanceEntryIndex />
						</ProtectedRoute>
					} />
				</Route>
				<Route path="/procurement" element={<ProtectedModule modules={["procurement"]} />}>
					<Route path="requisition" element={
						<ProtectedRoute roles={["role_domain", "role_procurement_admin", "role_procurement_operator"]}>
							<Requisition />
						</ProtectedRoute>
					} />
					<Route path="new-requisition" element={
						<ProtectedRoute roles={["role_domain", "role_procurement_admin", "role_procurement_operator"]}>
							<RequisitionInvoice />
						</ProtectedRoute>
					} />
					<Route path="requisition/edit/:id" element={
						<ProtectedRoute roles={["role_domain", "role_procurement_admin", "role_procurement_operator"]}>
							<RequisitionUpdate />
						</ProtectedRoute>
					} />
					<Route path="requisition-board" element={
						<ProtectedRoute roles={["role_domain", "role_procurement_admin", "role_procurement_approval"]}>
							<MatrixIndex />
						</ProtectedRoute>
					} />
					<Route path="inout" element={
						<ProtectedRoute roles={["role_domain", "role_procurement_admin", "role_procurement_approval"]}>
							<InoutIndex />
						</ProtectedRoute>
					} />
				</Route>
				<Route path="/reporting" element={<ProtectedModule modules={["accounting", "sales-purchase", "inventory", "production"]} />}>
					<Route path="reports" element={
						<ProtectedRoute roles={["role_domain", "role_accounting_admin", "role_sales_purchase_admin", "role_inventory_admin", "role_production_admin"]}>
							<ReportIndex />
						</ProtectedRoute>
					} />
				</Route>
				<Route path="sitemap" element={
					<ProtectedRoute roles={["role_domain"]}>
						<Sitemap />
					</ProtectedRoute>
				} />
				<Route path="/pos" element={<ProtectedModule modules={["sales-purchase"]} />}>
					<Route path="bakery" element={
						<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager", "role_sales_purchase_operator"]}>
							<BakeryIndex />
						</ProtectedRoute>
					} />
				</Route>
				<Route path="/b2b" element={<ProtectedModule modules={["sales-purchase"]} />}>
					<Route path="dashboard" element={
						<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin"]}>
							<DashboardIndexB2B />
						</ProtectedRoute>
					} />
					<Route path="domain" element={
						<ProtectedRoute roles={["role_domain"]}>
							<B2bDomainIndex />
						</ProtectedRoute>
					} />
					<Route path="master-user" element={
						<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin"]}>
							<B2bUserIndex />
						</ProtectedRoute>
					} />
					<Route path="sub-domain/category/:id" element={
						<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager"]}>
							<CategoryIndexB2B />
						</ProtectedRoute>
					} />
					<Route path="sub-domain/product/:id" element={
						<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin", "role_sales_purchase_manager"]}>
							<ProductIndexB2B />
						</ProtectedRoute>
					} />
					<Route path="sub-domain/setting/:id" element={
						<ProtectedRoute roles={["role_domain", "role_sales_purchase_admin"]}>
							<SettingIndexB2B />
						</ProtectedRoute>
					} />
				</Route>

				<Route path="report" element={<ProtectedModule modules={["accounting", "sales-purchase", "inventory", "production"]} />}>
					<Route path="production" element={<ProtectedModule modules={["production"]} />}>
						<Route path="issue" element={
							<ProtectedRoute roles={["role_production_admin"]}>
								<ProductionIssueReport />
							</ProtectedRoute>
						} />
						<Route path="matrix" element={
							<ProtectedRoute roles={["role_production_admin"]}>
								<ProductionMatrixReport />
							</ProtectedRoute>
						} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default AppRoute;
