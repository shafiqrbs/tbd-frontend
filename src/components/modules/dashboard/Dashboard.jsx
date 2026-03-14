import React, {useEffect, useState} from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Button,
  Group,
  Tabs,
  rem,
  Text,
  Tooltip,
  Flex,
  LoadingOverlay,
  Badge,
  Title,
  Card,
  SimpleGrid,
  Container,
  useMantineTheme,
  ScrollArea,
  Grid,
  List,
  ThemeIcon,
  NavLink, Box,
} from "@mantine/core";
import {
  IconGauge,
  IconUser,
  IconCookie,
  IconBuildingStore,
  IconBasket,
  IconShoppingBagSearch,
  IconShoppingBagPlus,
  IconShoppingCartUp,
  IconMoneybag,
  IconUsersGroup,
  IconUsers,
  IconFileTypePdf,
  IconCurrencyMonero,
  IconShoppingCart,
  IconShoppingBag,
  IconListDetails,
  IconCategory,
  IconCategory2,
  IconReport,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import {
  IconCircleCheck,
  IconColorFilter,
  IconList,
  IconX,
} from "@tabler/icons-react";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import classes from "../../../assets/css/FeaturesCards.module.css";
import SalesSummaryCard from "./common/SalesSummaryCard";
import TransactionModesCard from "./common/TransactionModesCard";
import TopSellingProductsCard from "./common/TopSellingProductsCard";
import TodaysOverviewCard from "./common/TodaysOverviewCard";
import PurchaseSummaryCard from "./common/PurchaseSummaryCard";
import {getIndexEntityData} from "../../../store/accounting/crudSlice";
import {useDispatch} from "react-redux";
import useDomainConfig from "../../global-hook/config-data/useDomainConfig";
import getAccessControl from "../../global-hook/access_control/getAccessControl";
import {useAuth} from "../../context/AuthContext";



function Dashboard() {
  const { t, i18n } = useTranslation();
  const { domainConfig } = useDomainConfig();
  const { configData, isLoading } = useAuth(); // Use auth context instead of localStorage
  const userRole = getAccessControl();
  const iconStyle = { width: rem(12), height: rem(12) };
  const [activeTab, setActiveTab] = useState("ThreeGrid");
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [isFormSubmit, setFormSubmit] = useState(false);
  const [formSubmitData, setFormSubmitData] = useState([]);
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190; //TabList height 104
  const cardHeight = (height - 166) / 2;
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const checkDomainConfig = () => {
      const domainConfigData = localStorage.getItem("domain-config-data");
      const inventoryConfig = JSON.parse(domainConfigData || "{}")?.inventory_config;
      if (!inventoryConfig?.id) {
        console.log("redirect to login from MainDashboard");
        navigate("/login");
      }
    };
    const timeoutId = setTimeout(checkDomainConfig, 500);
    return () => clearTimeout(timeoutId);
  }, [navigate]);
  const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))
  const isWarehouse = domainConfigData?.inventory_config?.sku_warehouse
  // const indexData = useSelector((state) => state.crudSlice.indexEntityData)
  const [indexData,setIndexData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const value = {
        url: 'inventory/report/daily-summary',
        param: {
          start_date: '2026-03-15',
          end_date: '2026-03-15',
        }
      };
      try {
        const resultAction = await dispatch(getIndexEntityData(value));
        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload);
        }
      } catch (error) {
        console.error("Unexpected error in fetchData:", error);
      }
    };
    fetchData();
  }, []);
  const sales = indexData?.data?.sales;
  const transactionModes = indexData?.data?.transactionModes;
  console.log(transactionModes);
  const dailyData={
    "totalSales": sales?.totalSales,
    "totalDiscount": sales?.totalDiscount ?? 0,
    "totalPayment": sales?.totalPayment ?? 0,
    "totalDue": sales?.totalDue,
    "totalInvoices":sales?.totalInvoices,
    "transactionModes": [
      {
        "name": "Bkash",
        "amount": 14000,
        "count": 1
      },
      {
        "name": "Foodpanda",
        "amount": 1159,
        "count": 2
      },
      {
        "name": "Nagad",
        "amount": 500,
        "count": 1
      },
      {
        "name": "Cash",
        "amount": 151,
        "count": 1
      }
    ],
    "topProducts": [
      {
        "name": "Almond Cookies",
        "totalQuantity": 2,
        "totalAmount": 1400,
        "salesPrice": 700
      },
      {
        "name": "Blackforest Cake 1kg",
        "totalQuantity": 1,
        "totalAmount": 2200,
        "salesPrice": 2200
      },
      {
        "name": "Baby Bun (6 Pcs)",
        "totalQuantity": 1,
        "totalAmount": 60,
        "salesPrice": 60
      },
      {
        "name": "Cake slice",
        "totalQuantity": 1,
        "totalAmount": 50,
        "salesPrice": 50
      },
      {
        "name": "Baby Bun (4 Pcs)",
        "totalQuantity": 1,
        "totalAmount": 50,
        "salesPrice": 50
      },
      {
        "name": "Blueberry Cake 500gm",
        "totalQuantity": 1,
        "totalAmount": 12050,
        "salesPrice": 12050
      }
    ],
    "salesList": [
      {
        "id": 2,
        "created": "17-02-2026, 10:13 pm",
        "invoice": "771344790388",
        "sub_total": 700,
        "total": 700,
        "approved_by_id": "",
        "payment": 700,
        "discount": 0,
        "is_domain_sales_completed": null,
        "discount_calculation": 0,
        "discount_type": "flat",
        "invoice_batch_id": null,
        "customerId": "",
        "customerName": null,
        "customerMobile": null,
        "createdByUser": "Sandra",
        "createdByName": null,
        "createdById": "",
        "salesById": "",
        "salesByUser": null,
        "salesByName": null,
        "process": "approved",
        "mode_name": "Foodpanda",
        "customer_address": "",
        "customer_group": null,
        "balance": null,
        "sales_items": "[{\"id\":1,\"stock_item_id\":2045,\"invoice_id\":null,\"display_name\":\"Almond Cookies\",\"quantity\":1,\"purchase_price\":0,\"sales_price\":700,\"custom_price\":0,\"is_print\":0,\"sub_total\":700,\"batches\":\"[]\",\"created_at\":\"2026-02-17 16:13:07\",\"updated_at\":\"2026-02-17T16:13:07.769Z\"}]",
        "multi_transaction": 0,
        "payments": "[{\"transaction_mode_id\":103,\"transaction_mode_name\":\"Foodpanda\",\"amount\":700}]",
        "created_at": "2026-02-17 16:13:10",
        "updated_at": "2026-02-17T16:13:10.388Z"
      },
      {
        "id": 1,
        "created": "17-02-2026, 10:13 pm",
        "invoice": "771344781556",
        "sub_total": 15110,
        "total": 15110,
        "approved_by_id": 17,
        "payment": 15110,
        "discount": 0,
        "is_domain_sales_completed": null,
        "discount_calculation": 0,
        "discount_type": "flat",
        "invoice_batch_id": null,
        "customerId": "",
        "customerName": null,
        "customerMobile": null,
        "createdByUser": "Sandra",
        "createdByName": null,
        "createdById": 17,
        "salesById": 17,
        "salesByUser": "PB",
        "salesByName": "Premium Branch",
        "process": "approved",
        "mode_name": "Multiple",
        "customer_address": "",
        "customer_group": null,
        "balance": null,
        "sales_items": "[{\"id\":6,\"stock_item_id\":2045,\"invoice_id\":null,\"display_name\":\"Almond Cookies\",\"quantity\":1,\"purchase_price\":0,\"sales_price\":700,\"custom_price\":0,\"is_print\":0,\"sub_total\":700,\"batches\":\"[]\",\"created_at\":\"2026-02-17 16:12:38\",\"updated_at\":\"2026-02-17T16:12:38.380Z\"},{\"id\":5,\"stock_item_id\":1976,\"invoice_id\":null,\"display_name\":\"Blackforest Cake 1kg\",\"quantity\":1,\"purchase_price\":0,\"sales_price\":2200,\"custom_price\":0,\"is_print\":0,\"sub_total\":2200,\"batches\":\"[]\",\"created_at\":\"2026-02-17 16:12:37\",\"updated_at\":\"2026-02-17T16:12:37.234Z\"},{\"id\":4,\"stock_item_id\":1942,\"invoice_id\":null,\"display_name\":\"Baby Bun (6 Pcs)\",\"quantity\":1,\"purchase_price\":0,\"sales_price\":60,\"custom_price\":0,\"is_print\":0,\"sub_total\":60,\"batches\":\"[]\",\"created_at\":\"2026-02-17 16:12:35\",\"updated_at\":\"2026-02-17T16:12:35.348Z\"},{\"id\":3,\"stock_item_id\":1953,\"invoice_id\":null,\"display_name\":\"Cake slice\",\"quantity\":1,\"purchase_price\":0,\"sales_price\":50,\"custom_price\":0,\"is_print\":0,\"sub_total\":50,\"batches\":\"[]\",\"created_at\":\"2026-02-17 16:12:34\",\"updated_at\":\"2026-02-17T16:12:34.547Z\"},{\"id\":2,\"stock_item_id\":1943,\"invoice_id\":null,\"display_name\":\"Baby Bun (4 Pcs)\",\"quantity\":1,\"purchase_price\":0,\"sales_price\":50,\"custom_price\":0,\"is_print\":0,\"sub_total\":50,\"batches\":\"[]\",\"created_at\":\"2026-02-17 16:12:33\",\"updated_at\":\"2026-02-17T16:12:33.268Z\"},{\"id\":1,\"stock_item_id\":1986,\"invoice_id\":null,\"display_name\":\"Blueberry Cake 500gm\",\"quantity\":1,\"purchase_price\":0,\"sales_price\":12050,\"custom_price\":0,\"is_print\":0,\"sub_total\":12050,\"batches\":\"[]\",\"created_at\":\"2026-02-17 16:05:16\",\"updated_at\":\"2026-02-17T16:05:16.360Z\"}]",
        "multi_transaction": 1,
        "payments": "[{\"transaction_mode_id\":57,\"transaction_mode_name\":\"Cash\",\"amount\":151},{\"transaction_mode_id\":101,\"transaction_mode_name\":\"Bkash\",\"amount\":14000},{\"transaction_mode_id\":102,\"transaction_mode_name\":\"Nagad\",\"amount\":500},{\"transaction_mode_id\":103,\"transaction_mode_name\":\"Foodpanda\",\"amount\":459}]",
        "created_at": "2026-02-17 16:13:01",
        "updated_at": "2026-02-17T16:13:01.557Z"
      }
    ]
  }

  return (
    <>
      <Container fluid pt="xs">
        <Box>
          <Grid gutter="md" mb="md">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <SalesSummaryCard dailyData={dailyData} cardHeight={cardHeight} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <PurchaseSummaryCard dailyData={dailyData} cardHeight={cardHeight} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TransactionModesCard dailyData={dailyData} cardHeight={cardHeight} />
            </Grid.Col>
           {/* <Grid.Col span={{ base: 12, md: 6 }}>
              <TopSellingProductsCard dailyData={dailyData} cardHeight={cardHeight} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TodaysOverviewCard dailyData={dailyData} cardHeight={cardHeight} />
            </Grid.Col>*/}
          </Grid>
        </Box>
        <ScrollArea h={height-cardHeight+90} scrollbarSize={2} type="never">
          <SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs">
            {domainConfig?.modules?.includes("sales-purchase") &&
            ["role_sales_purchase", "role_domain"].some((value) => userRole.includes(value)) && (
                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                  <Grid gutter={{ base: 2 }}>
                    <Grid.Col span={2}>
                      <IconBuildingStore
                          style={{ width: rem(42), height: rem(42) }}
                          stroke={2}
                          color={theme.colors.teal[6]}
                      />
                    </Grid.Col>
                    <Grid.Col span={10}>
                      <Text fz="md" fw={500} className={classes.cardTitle}>
                        {t("SalesandPurchase")}
                      </Text>
                    </Grid.Col>
                  </Grid>
                  <Box fz="sm" c="dimmed" mt="sm">
                    <List spacing="ms" size="sm" center>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
                              <IconBasket />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/sales"
                            label={t("Sales")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/sales");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/sales", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      {["role_sales", "role_domain"].some((value) =>
                          userRole.includes(value)
                      ) && (
                          <List.Item
                              pl={"xs"}
                              icon={
                                <ThemeIcon
                                    color="teal.6"
                                    size={20}
                                    radius="xl"
                                    variant="outline"
                                >
                                  <IconShoppingBagSearch />
                                </ThemeIcon>
                              }
                          >
                            <NavLink
                                pl={"md"}
                                href="/inventory/sales-invoice"
                                label={t("NewSales")}
                                component="button"
                                onClick={(e) => {
                                  navigate("inventory/sales-invoice");
                                }}
                                onAuxClick={(e) => {
                                  // Handle middle mouse button click for browsers that support it
                                  if (e.button === 1) {
                                    window.open("/inventory/sales-invoice", "_blank");
                                  }
                                }}
                            />
                          </List.Item>
                      )}
                      {["role_purchase", "role_domain"].some((value) =>
                          userRole.includes(value)
                      ) && (
                          <List.Item
                              pl={"xs"}
                              icon={
                                <ThemeIcon
                                    color="teal.6"
                                    size={20}
                                    radius="xl"
                                    variant="outline"
                                >
                                  <IconShoppingBagPlus />
                                </ThemeIcon>
                              }
                          >
                            <NavLink
                                pl={"md"}
                                href="/inventory/purchase"
                                label={t("Purchase")}
                                component="button"
                                onClick={(e) => {
                                  navigate("inventory/purchase");
                                }}
                                onAuxClick={(e) => {
                                  // Handle middle mouse button click for browsers that support it
                                  if (e.button === 1) {
                                    window.open("/inventory/purchase", "_blank");
                                  }
                                }}
                            />
                          </List.Item>
                      )}

                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
                              <IconShoppingCartUp />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/sales-return"
                            label={t("SalesReturn")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/sales-return");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/purchase-return", "_blank");
                              }
                            }}
                        />
                      </List.Item>

                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
                              <IconShoppingCartUp />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/purchase-invoice"
                            label={t("NewPurchase")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/purchase-invoice");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/purchase-invoice", "_blank");
                              }
                            }}
                        />
                      </List.Item>

                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
                              <IconShoppingCartUp />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/purchase-return"
                            label={t("PurchaseReturn")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/purchase-return");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/purchase-return", "_blank");
                              }
                            }}
                        />
                      </List.Item>

                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
                              <IconShoppingCartUp />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/purchase-return-invoice"
                            label={t("PurchaseReturnNew")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/purchase-return-invoice");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/purchase-return-invoice", "_blank");
                              }
                            }}
                        />
                      </List.Item>

                      {configData?.is_batch_invoice === 1 && (
                          <List.Item
                              pl={"xs"}
                              icon={
                                <ThemeIcon
                                    color="teal.6"
                                    size={20}
                                    radius="xl"
                                    variant="outline"
                                >
                                  <IconList />
                                </ThemeIcon>
                              }
                          >
                            <NavLink
                                pl={"md"}
                                href="/inventory/invoice-batch"
                                label={t("InvoiceBatch")}
                                component="button"
                                onClick={(e) => {
                                  navigate("inventory/invoice-batch");
                                }}
                                onAuxClick={(e) => {
                                  // Handle middle mouse button click for browsers that support it
                                  if (e.button === 1) {
                                    window.open("/inventory/invoice-batch", "_blank");
                                  }
                                }}
                            />
                          </List.Item>
                      )}
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
                              <IconList />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/opening-stock"
                            label={t("OpeningStock")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/opening-stock");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/opening-stock", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
                              <IconList />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/opening-approve-stock"
                            label={t("OpeningApprove")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/opening-approve-stock");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/opening-approve-stock", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      {["role_admin", "role_domain"].some((value) =>
                          userRole.includes(value)
                      ) && (
                          <List.Item
                              pl={"xs"}
                              icon={
                                <ThemeIcon
                                    color="teal.6"
                                    size={20}
                                    radius="xl"
                                    variant="outline"
                                >
                                  <IconList />
                                </ThemeIcon>
                              }
                          >
                            <NavLink
                                pl={"md"}
                                href="/inventory/config"
                                label={t("Configuration")}
                                component="button"
                                onClick={(e) => {
                                  navigate("inventory/config");
                                }}
                                onAuxClick={(e) => {
                                  // Handle middle mouse button click for browsers that support it
                                  if (e.button === 1) {
                                    window.open("/inventory/config", "_blank");
                                  }
                                }}
                            />
                          </List.Item>
                      )}
                    </List>
                  </Box>
                </Card>
            )}

            {domainConfig?.modules?.includes("accounting") &&
            ["role_accounting", "role_domain"].some((value) => userRole.includes(value)) && (
                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                  <Grid gutter={{ base: 2 }}>
                    <Grid.Col span={2}>
                      <IconMoneybag
                          style={{ width: rem(42), height: rem(42) }}
                          stroke={2}
                          color={theme.colors.blue[6]}
                      />
                    </Grid.Col>
                    <Grid.Col span={10}>
                      <Text fz="md" fw={500} className={classes.cardTitle}>
                        {t("AccountingandFinancial")}
                      </Text>
                    </Grid.Col>
                  </Grid>
                  <Box fz="sm" c="dimmed" mt="sm">
                    <List spacing="ms" size="sm" center>
                      {["role_accounting"].some((value) => userRole.includes(value)) && (
                          <List.Item
                              pl={"xs"}
                              icon={
                                <ThemeIcon
                                    color="blue.6"
                                    size={20}
                                    radius="xl"
                                    variant="outline"
                                >
                                  <IconBasket />
                                </ThemeIcon>
                              }
                          >
                            <NavLink
                                pl={"md"}
                                href="accounting/voucher-entry"
                                label={t("VoucherEntry")}
                                component="button"
                                onClick={(e) => {
                                  navigate("/accounting/voucher-entry");
                                }}
                                onAuxClick={(e) => {
                                  // Handle middle mouse button click for browsers that support it
                                  if (e.button === 1) {
                                    window.open("/accounting/voucher-entry", "_blank");
                                  }
                                }}
                            />
                          </List.Item>
                      )}

                      {/*
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/sales-invoice" label={t('NewSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/purchase" label={t('ManagePurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>*/}
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconCurrencyMonero />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/accounting/transaction-mode"
                            label={t("TransactionMode")}
                            component="button"
                            onClick={(e) => {
                              navigate("accounting/transaction-mode");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/accounting/transaction-mode", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconBasket />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="accounting/ledger"
                            label={t("Ledger")}
                            component="button"
                            onClick={(e) => {
                              navigate("/accounting/ledger");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/accounting/ledger", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconBasket />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="accounting/head-group"
                            label={t("HeadGroup")}
                            component="button"
                            onClick={(e) => {
                              navigate("/accounting/head-group");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/accounting/head-group", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconBasket />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="accounting/head-subgroup"
                            label={t("HeadSubGroup")}
                            component="button"
                            onClick={(e) => {
                              navigate("/accounting/head-subgroup");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/accounting/head-subgroup", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      {/* <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconBasket /></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/voucher-entry" label={t('SampleModal')} component="button" onClick={(e) => { navigate('/accounting/modalIndex') }} onAuxClick={(e) => {
                                            // Handle middle mouse button click for browsers that support it
                                            if (e.button === 1) {
                                                window.open('/accounting/voucher-entry', '_blank');
                                            }
                                        }} />
                                    </List.Item> */}
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconBasket />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="accounting/balance-sheet"
                            label={t("BalanceSheet")}
                            component="button"
                            onClick={(e) => {
                              navigate("/accounting/balance-sheet");
                            }}
                            onAuxClick={(e) => {
                              if (e.button === 1) {
                                window.open("/accounting/balance-sheet", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconBasket />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="accounting/balance-entry"
                            label={t("BalanceEntry")}
                            component="button"
                            onClick={(e) => {
                              navigate("/accounting/balance-entry");
                            }}
                            onAuxClick={(e) => {
                              if (e.button === 1) {
                                window.open("/accounting/balance-entry", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                    </List>
                  </Box>
                </Card>
            )}
            {domainConfig?.modules?.includes("procurement") &&
            ["role_procurement", "role_domain"].some((value) => userRole.includes(value)) && (
                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                  <Grid gutter={{ base: 2 }}>
                    <Grid.Col span={2}>
                      <IconShoppingCart
                          style={{ width: rem(42), height: rem(42) }}
                          stroke={2}
                          color={theme.colors.blue[6]}
                      />
                    </Grid.Col>
                    <Grid.Col span={10}>
                      <Text fz="md" fw={500} className={classes.cardTitle}>
                        {t("Procurement")}
                      </Text>
                    </Grid.Col>
                  </Grid>
                  <Box fz="sm" c="dimmed" mt="sm">
                    <List spacing="ms" size="sm" center>

                      {domainConfig?.modules?.includes("domain") && (
                          <>
                            <List.Item
                                pl={"xs"}
                                icon={
                                  <ThemeIcon
                                      color="blue.6"
                                      size={20}
                                      radius="xl"
                                      variant="outline"
                                  >
                                    <IconShoppingBag />
                                  </ThemeIcon>
                                }
                            >
                              <NavLink
                                  pl={"md"}
                                  label={t("NewDomainBoard")}
                                  component="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setNewBoardCreateModel(true)
                                  }}
                              />
                            </List.Item>

                            {domainConfig?.modules?.includes("domain") && (
                                <List.Item
                                    pl={"xs"}
                                    icon={
                                      <ThemeIcon
                                          color="blue.6"
                                          size={20}
                                          radius="xl"
                                          variant="outline"
                                      >
                                        <IconShoppingBag />
                                      </ThemeIcon>
                                    }
                                >
                                  <NavLink
                                      pl={"md"}
                                      href="/procurement/requisition-board"
                                      label={t("AllRequisition")}
                                      component="button"
                                      onClick={(e) => {
                                        navigate("/procurement/requisition-board");
                                      }}
                                      onAuxClick={(e) => {
                                        // Handle middle mouse button click for browsers that support it
                                        if (e.button === 1) {
                                          window.open("/procurement/requisition-board", "_blank");
                                        }
                                      }}
                                  />
                                </List.Item>
                            )}

                            <List.Item
                                pl={"xs"}
                                icon={
                                  <ThemeIcon
                                      color="blue.6"
                                      size={20}
                                      radius="xl"
                                      variant="outline"
                                  >
                                    <IconShoppingBag />
                                  </ThemeIcon>
                                }
                            >
                              <NavLink
                                  pl={"md"}
                                  label={t("NewWarehouseBoard")}
                                  component="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setNewWarehouseBoardCreateModel(true)
                                  }}
                              />
                            </List.Item>
                          </>
                      )}

                      {domainConfig?.modules?.includes("domain") && (
                          <List.Item
                              pl={"xs"}
                              icon={
                                <ThemeIcon
                                    color="blue.6"
                                    size={20}
                                    radius="xl"
                                    variant="outline"
                                >
                                  <IconShoppingBag />
                                </ThemeIcon>
                              }
                          >
                            <NavLink
                                pl={"md"}
                                href="/procurement/warehouse/requisition-board"
                                label={t("AllRequisitionWarehouse")}
                                component="button"
                                onClick={(e) => {
                                  navigate("/procurement/warehouse/requisition-board");
                                }}
                                onAuxClick={(e) => {
                                  // Handle middle mouse button click for browsers that support it
                                  if (e.button === 1) {
                                    window.open("/procurement/warehouse/requisition-board", "_blank");
                                  }
                                }}
                            />
                          </List.Item>
                      )}

                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconShoppingBag />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/procurement/requisition"
                            label={t("Requisition")}
                            component="button"
                            onClick={(e) => {
                              navigate("/procurement/requisition");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/procurement/requisition", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconShoppingBagPlus />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/procurement/new-requisition"
                            label={t("NewRequisition")}
                            component="button"
                            onClick={(e) => {
                              navigate("/procurement/new-requisition");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/procurement/new-requisition", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                    </List>
                  </Box>
                </Card>
            )}
            {domainConfig?.modules?.includes("inventory") &&
            ["role_inventory", "role_domain"].some((value) => userRole.includes(value)) && (
                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                  <Grid gutter={{ base: 2 }}>
                    <Grid.Col span={2}>
                      <IconMoneybag
                          style={{ width: rem(42), height: rem(42) }}
                          stroke={2}
                          color={theme.colors.orange[6]}
                      />
                    </Grid.Col>
                    <Grid.Col span={10}>
                      <Text fz="md" fw={500} className={classes.cardTitle}>
                        {t("InventoryandProduct")}
                      </Text>
                    </Grid.Col>
                  </Grid>
                  <Box fz="sm" c="dimmed" mt="sm">
                    <List spacing="ms" size="sm" center>
                      {["role_inventory_stock", "role_domain"].some((value) =>
                          userRole.includes(value)
                      ) && (
                          <List.Item
                              pl={"xs"}
                              icon={
                                <ThemeIcon
                                    color="yellow.6"
                                    size={20}
                                    radius="xl"
                                    variant="outline"
                                >
                                  <IconListDetails />
                                </ThemeIcon>
                              }
                          >
                            <NavLink
                                pl={"md"}
                                href="/inventory/stock"
                                label={t("ManageStock")}
                                component="button"
                                onClick={(e) => {
                                  navigate("inventory/stock");
                                }}
                                onAuxClick={(e) => {
                                  // Handle middle mouse button click for browsers that support it
                                  if (e.button === 1) {
                                    window.open("/inventory/stock", "_blank");
                                  }
                                }}
                            />
                          </List.Item>
                      )}

                      {
                        isWarehouse == 1 &&
                        <List.Item
                            pl={"xs"}
                            icon={
                              <ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
                                <IconListDetails />
                              </ThemeIcon>
                            }
                        >
                          <NavLink
                              pl={"md"}
                              href="/inventory/stock-transfer"
                              label={t("StockTransfer")}
                              component="button"
                              onClick={(e) => {
                                navigate("inventory/stock-transfer");
                              }}
                              onAuxClick={(e) => {
                                // Handle middle mouse button click for browsers that support it
                                if (e.button === 1) {
                                  window.open("/inventory/stock-transfer", "_blank");
                                }
                              }}
                          />
                        </List.Item>
                      }

                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
                              <IconListDetails />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/product"
                            label={t("ManageProduct")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/product");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/product", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
                              <IconCategory />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/category"
                            label={t("Category")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/category");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/category", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
                              <IconCategory2 />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/category-group"
                            label={t("CategoryGroup")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/category-group");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/category-group", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      {/*<List.Item
												pl={"xs"}
												icon={
													<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
														<IconCategory2 />
													</ThemeIcon>
												}
											>
												<NavLink
													pl={"md"}
													href="/inventory/stock-transfer"
													label={t("StockTransfer")}
													component="button"
													onClick={(e) => {
														navigate("inventory/stock-transfer");
													}}
													onAuxClick={(e) => {
														// Handle middle mouse button click for browsers that support it
														if (e.button === 1) {
															window.open("/inventory/stock-transfer", "_blank");
														}
													}}
												/>
											</List.Item>*/}
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
                              <IconCategory2 />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/stock-reconciliation"
                            label={t("StockReconciliation")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/stock-reconciliation");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/stock-reconciliation", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
                              <IconCategory2 />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/coupon-code"
                            label={t("CouponCode")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/coupon-code");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/coupon-code", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
                              <IconCategory2 />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/barcode-print"
                            label={t("BarcodePrint")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/barcode-print");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/barcode-print", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
                              <IconCategory2 />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/particular"
                            label={t("Particular")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/particular");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/particular", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
                              <IconCategory2 />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/config"
                            label={t("Configuration")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/config");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/config", "_blank");
                              }
                            }}
                        />
                      </List.Item>

                    </List>
                  </Box>
                </Card>
            )}
            {domainConfig?.modules?.includes("domain") &&
            ["role_domain", "role_core_admin"].some((value) => userRole.includes(value)) && (
                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                  <Grid gutter={{ base: 2 }}>
                    <Grid.Col span={2}>
                      <IconMoneybag
                          style={{ width: rem(42), height: rem(42) }}
                          stroke={2}
                          color={theme.colors.blue[6]}
                      />
                    </Grid.Col>
                    <Grid.Col span={10}>
                      <Text fz="md" fw={500} className={classes.cardTitle}>
                        {t("ManageDomain")}
                      </Text>
                    </Grid.Col>
                  </Grid>
                  <Box fz="sm" c="dimmed" mt="sm">
                    <List spacing="ms" size="sm" center>
                      {/*<List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconBasket/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/sales" label={t('ManageSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/sales-invoice" label={t('NewSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/purchase" label={t('ManagePurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>*/}
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconCurrencyMonero />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/domain"
                            label={t("ManageDomain")}
                            component="button"
                            onClick={(e) => {
                              navigate("/domain");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/domain", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconCurrencyMonero />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/b2b/dashboard"
                            label={t("B2BManagement")}
                            component="button"
                            onClick={(e) => {
                              navigate("/b2b/dashboard");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/b2b/dashboard", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                              <IconCurrencyMonero />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/discount"
                            label={t("Discount")}
                            component="button"
                            onClick={(e) => {
                              navigate("/discount");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/discount", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                    </List>
                  </Box>
                </Card>
            )}
            {domainConfig?.modules?.includes("core") &&
            ["role_core", "role_domain"]?.some((value) => userRole.includes(value)) && (
                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                  <Grid gutter={{ base: 2 }}>
                    <Grid.Col span={2}>
                      <IconMoneybag
                          style={{ width: rem(42), height: rem(42) }}
                          stroke={2}
                          color={theme.colors.cyan[6]}
                      />
                    </Grid.Col>
                    <Grid.Col span={10}>
                      <Text fz="md" fw={500} className={classes.cardTitle}>
                        {t("CustomerAndVendor")}
                      </Text>
                    </Grid.Col>
                  </Grid>
                  <Box fz="sm" c="dimmed" mt="sm">
                    <List spacing="ms" size="sm" center>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline">
                              <IconUsersGroup />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="core/customer"
                            label={t("ManageCustomers")}
                            component="button"
                            onClick={(e) => {
                              navigate("core/customer");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/core/customer", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline">
                              <IconUsersGroup />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="core/vendor"
                            label={t("ManageVendors")}
                            component="button"
                            onClick={(e) => {
                              navigate("core/vendor");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/core/vendor", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline">
                              <IconUsers />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="core/user"
                            label={t("ManageUsers")}
                            component="button"
                            onClick={(e) => {
                              navigate("core/user");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/core/user", "_blank");
                              }
                            }}
                        />
                      </List.Item>

                      {configData?.sku_warehouse == 1 && (
                          <>
                            <List.Item
                                pl="xs"
                                icon={
                                  <ThemeIcon
                                      color="cyan.6"
                                      size={20}
                                      radius="xl"
                                      variant="outline"
                                  >
                                    <IconUsers />
                                  </ThemeIcon>
                                }
                            >
                              <NavLink
                                  pl="md"
                                  href="/core/warehouse"
                                  label={t("Warehouse")}
                                  component="button"
                                  onClick={() => navigate("/core/warehouse")}
                                  onAuxClick={(e) =>
                                      e.button === 1 &&
                                      window.open("/core/warehouse", "_blank")
                                  }
                              />
                            </List.Item>
                            <List.Item
                                pl="xs"
                                icon={
                                  <ThemeIcon
                                      color="cyan.6"
                                      size={20}
                                      radius="xl"
                                      variant="outline"
                                  >
                                    <IconUsers />
                                  </ThemeIcon>
                                }
                            >
                              <NavLink
                                  pl="md"
                                  href="/core/warehouse-list"
                                  label={t("WarehouseList")}
                                  component="button"
                                  onClick={() => navigate("/core/warehouse-list")}
                                  onAuxClick={(e) =>
                                      e.button === 1 &&
                                      window.open("/core/warehouse-list", "_blank")
                                  }
                              />
                            </List.Item>
                          </>
                      )}

                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline">
                              <IconUsers />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="core/file-upload"
                            label={t("ManageFile")}
                            component="button"
                            onClick={(e) => {
                              navigate("core/file-upload");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/core/file-upload", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline">
                              <IconUsers />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="core/setting"
                            label={t("Setting")}
                            component="button"
                            onClick={(e) => {
                              navigate("core/setting");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/core/setting", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                    </List>
                  </Box>
                </Card>
            )}
            {domainConfig?.modules?.includes("production") &&
            ["role_production", "role_domain"].some((value) => userRole.includes(value)) && (
                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                  <Grid gutter={{ base: 2 }}>
                    <Grid.Col span={2}>
                      <IconShoppingCart
                          style={{ width: rem(42), height: rem(42) }}
                          stroke={2}
                          color={theme.colors.red[6]}
                      />
                    </Grid.Col>
                    <Grid.Col span={10}>
                      <Text fz="md" fw={500} className={classes.cardTitle}>
                        {t("Production")}
                      </Text>
                    </Grid.Col>
                  </Grid>
                  <Box fz="sm" c="dimmed" mt="sm">
                    <List spacing="ms" size="sm" center>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                              <IconShoppingBag />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/production/batch"
                            label={t("ProductionBatch")}
                            component="button"
                            onClick={(e) => {
                              navigate("/production/batch");
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                              <IconShoppingBag />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            label={t("NewBatch")}
                            component="button"
                            onClick={(e) => {
                              handleProductionBatchCreate(e)
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                              <IconShoppingBag />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/production/items"
                            label={t("ProductionItems")}
                            component="button"
                            onClick={(e) => {
                              navigate("/production/items");
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                              <IconShoppingBag />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/production/setting"
                            label={t("ProductionSetting")}
                            component="button"
                            onClick={(e) => {
                              navigate("/production/setting");
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                              <IconShoppingBag />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/production/config"
                            label={t("Configuration")}
                            component="button"
                            onClick={(e) => {
                              navigate("/production/config");
                            }}
                        />
                      </List.Item>
                      <List.Item
                          pl={"xs"}
                          icon={
                            <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                              <IconCategory2 />
                            </ThemeIcon>
                          }
                      >
                        <NavLink
                            pl={"md"}
                            href="/inventory/product-batch"
                            label={t("ProductBatch")}
                            component="button"
                            onClick={(e) => {
                              navigate("inventory/product-batch");
                            }}
                            onAuxClick={(e) => {
                              // Handle middle mouse button click for browsers that support it
                              if (e.button === 1) {
                                window.open("/inventory/product-batch", "_blank");
                              }
                            }}
                        />
                      </List.Item>
                    </List>
                  </Box>
                </Card>
            )}
            {/*{domainConfig?.modules?.includes("production") &&*/}
            {/*	["role_production", "role_domain"].some((value) => userRole.includes(value)) && (*/}
            <Card shadow="md" radius="md" className={classes.card} padding="lg">
              <Grid gutter={{ base: 2 }}>
                <Grid.Col span={2}>
                  <IconReport
                      style={{ width: rem(42), height: rem(42) }}
                      stroke={2}
                      color={theme.colors.red[6]}
                  />
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text fz="md" fw={500} className={classes.cardTitle}>
                    {t("Reporting")}
                  </Text>
                </Grid.Col>
              </Grid>
              <Box fz="sm" c="dimmed" mt="sm">
                <List spacing="ms" size="sm" center>

                  <List.Item
                      pl={"xs"}
                      icon={
                        <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                          <IconShoppingBag />
                        </ThemeIcon>
                      }
                  >
                    <NavLink
                        pl={"md"}
                        href="/report/inventory/item/stock/history"
                        label={t("ItemStockHistory")}
                        component="button"
                        onClick={(e) => {
                          navigate("/report/inventory/item/stock/history");
                        }}
                    />
                  </List.Item>

                  <List.Item
                      pl={"xs"}
                      icon={
                        <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                          <IconShoppingBag />
                        </ThemeIcon>
                      }
                  >
                    <NavLink
                        pl={"md"}
                        href="/report/production/issue"
                        label={t("ProductionIssue")}
                        component="button"
                        onClick={(e) => {
                          navigate("/report/production/issue");
                        }}
                    />
                  </List.Item>

                  <List.Item
                      pl={"xs"}
                      icon={
                        <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                          <IconShoppingBag />
                        </ThemeIcon>
                      }
                  >
                    <NavLink
                        pl={"md"}
                        href="/report/production/daily"
                        label={t("DailyExpenseReport")}
                        component="button"
                        onClick={(e) => {
                          navigate("/report/production/daily");
                        }}
                    />
                  </List.Item>

                  <List.Item
                      pl={"xs"}
                      icon={
                        <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                          <IconShoppingBag />
                        </ThemeIcon>
                      }
                  >
                    <NavLink
                        pl={"md"}
                        href="/report/production/daily-warehouse"
                        label={t("DailyExpenseWarehouseReport")}
                        component="button"
                        onClick={(e) => {
                          navigate("/report/production/daily-warehouse");
                        }}
                    />
                  </List.Item>

                  <List.Item
                      pl={"xs"}
                      icon={
                        <ThemeIcon color="red.6" size={20} radius="xl" variant="outline">
                          <IconShoppingBag />
                        </ThemeIcon>
                      }
                  >
                    <NavLink
                        pl={"md"}
                        href="/report/production/daily-warehouse"
                        label={t("DailySalesWarehouseReport")}
                        component="button"
                        onClick={(e) => {
                          navigate("/report/inventory/daily/sales-warehouse");
                        }}
                    />
                  </List.Item>
                </List>
              </Box>
            </Card>
            {/*)}*/}
          </SimpleGrid>
        </ScrollArea>
      </Container>
    </>
  );
}
export default Dashboard;
