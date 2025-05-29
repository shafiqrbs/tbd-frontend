import { Box, Title, ScrollArea, Grid, Center } from "@mantine/core";
import { useTranslation } from "react-i18next";
import React from "react";
import scrollbar from "../../../../assets/css/Scrollbar.module.css";

export default function DomainDetailsSection({ domainConfig, height }) {
  const { t } = useTranslation();
  return (
    <>
      <Box bg={"white"} p={"xs"} pb={"xs"} className={"borderRadiusAll"}>
        <Box
          h={48}
          pl={`xs`}
          pr={8}
          pt={"xs"}
          mb={"6"}
          className={"boxBackground borderRadiusAll"}
        >
          <Title order={6} pt={4}>
            {t("DomainDetails")}
          </Title>
        </Box>
        <Box className="borderRadiusAll" h={height}>
          <ScrollArea h={height} scrollbarSize={2}  classNames={scrollbar}>
              <Box p={'md'}>
                {/* Basic Domain Info */}
                <Grid columns={24}>
                  <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                    {t("Name")}
                  </Grid.Col>
                  <Grid.Col span={1}>:</Grid.Col>
                  <Grid.Col span={14}>{domainConfig?.name}</Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                    {t("Mobile")}
                  </Grid.Col>
                  <Grid.Col span={1}>:</Grid.Col>
                  <Grid.Col span={14}>{domainConfig?.mobile}</Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                    {t("Email")}
                  </Grid.Col>
                  <Grid.Col span={1}>:</Grid.Col>
                  <Grid.Col span={14}>{domainConfig?.email}</Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                    {t("Address")}
                  </Grid.Col>
                  <Grid.Col span={1}>:</Grid.Col>
                  <Grid.Col span={14}>{domainConfig?.address}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                  <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                    {t("UniqueCode")}
                  </Grid.Col>
                  <Grid.Col span={1}>:</Grid.Col>
                  <Grid.Col span={14}>{domainConfig?.unique_code}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                  <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                    {t("Status")}
                  </Grid.Col>
                  <Grid.Col span={1}>:</Grid.Col>
                  <Grid.Col span={14}>
                    {domainConfig?.status === 1 ? t("Active") : t("Inactive")}
                  </Grid.Col>
                </Grid>



                {/* Product Configuration */}
                {domainConfig?.inventory_config?.config_product && (
                    <>
                      <Box ml={'-md'} pl={'md'} p={'xs'} mb={'xs'} ta="left" bg={'gray.1'}>
                        <Title order={6} pt={'4'}>{t('ProductConfiguration')}</Title>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("Brand")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.is_brand
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("Color")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.is_color
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("Size")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.is_size
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("Grade")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.is_grade
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("Model")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.is_model
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("MultiPrice")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.is_multi_price
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("Measurement")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.is_measurement
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("ProductGallery")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.is_product_gallery
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SKU")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.is_sku
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      {/* Barcode Settings */}
                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("BarcodeBrand")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.barcode_brand
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("BarcodeColor")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.barcode_color
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("BarcodeSize")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.barcode_size
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("BarcodePrint")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.barcode_print
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("BarcodePriceHide")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.barcode_price_hide
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      {/* SKU Settings */}
                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SKUCategory")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.sku_category
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SKUBrand")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.sku_brand
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SKUModel")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.sku_model
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SKUColor")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.sku_color
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SKUSize")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product?.sku_size
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SKUWarehouse")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_product
                              ?.sku_warehouse
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>
                    </>
                )}

                {/* Sales Configuration */}
                {domainConfig?.inventory_config?.config_sales && (
                    <>

                      <Box ml={'-md'} pl={'md'} p={'xs'} mb={'xs'} ta="left" bg={'gray.1'}>
                        <Title order={6} pt={'4'}>{t("SalesConfiguration")}</Title>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("DefaultCustomerGroup")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {
                            domainConfig?.inventory_config?.config_sales
                                ?.default_customer_group?.name || '-'
                          }
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SearchByCategory")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.search_by_category
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SearchByVendor")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.search_by_vendor
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SearchByProductNature")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.search_by_product_nature
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SearchByWarehouse")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.search_by_warehouse
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("ShowProduct")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.show_product
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("ZeroStock")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales?.zero_stock
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("MeasurementEnable")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.is_measurement_enable
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("ZeroReceiveAllow")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.is_zero_receive_allow
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("DueSalesWithoutCustomer")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.due_sales_without_customer
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("ItemSalesPercent")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.item_sales_percent
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("MultiPrice")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.is_multi_price
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SalesAutoApproved")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.is_sales_auto_approved
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("DiscountWithCustomer")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_sales
                              ?.discount_with_customer
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>
                    </>
                )}

                {/* Purchase Configuration */}
                {domainConfig?.inventory_config?.config_purchase && (
                    <>

                      <Box ml={'-md'} pl={'md'} p={'xs'} mb={'xs'} ta="left" bg={'gray.1'}>
                        <Title order={6} pt={'4'}>{t("PurchaseConfiguration")}</Title>
                      </Box>
                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("DefaultVendorGroup")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {
                            domainConfig?.inventory_config?.config_purchase
                                ?.default_vendor_group?.name || '-'
                          }
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SearchByVendor")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_purchase
                              ?.search_by_vendor
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SearchByProductNature")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_purchase
                              ?.search_by_product_nature
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SearchByCategory")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_purchase
                              ?.search_by_category
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("SearchByWarehouse")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_purchase
                              ?.search_by_warehouse
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("ShowProduct")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_purchase
                              ?.show_product
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("MeasurementEnable")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_purchase
                              ?.is_measurement_enable
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("PurchaseAutoApproved")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_purchase
                              ?.is_purchase_auto_approved
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>
                    </>
                )}

                {/* Production Configuration */}
                {domainConfig?.production_config && (
                    <>
                      <Box ml={'-md'} pl={'md'} p={'xs'} mb={'xs'} ta="left" bg={'gray.1'}>
                        <Title order={6} pt={'4'}>{t("ProductionConfiguration")}</Title>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("Warehouse")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.production_config?.is_warehouse
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("Measurement")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.production_config?.is_measurement
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("IssueWithWarehouse")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.production_config?.issue_with_warehouse
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("IssueByProductionBatch")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.production_config
                              ?.issue_by_production_batch
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>
                    </>
                )}

                {/* Discount Configuration */}
                {domainConfig?.inventory_config?.config_discount && (
                    <>
                      <Box ml={'-md'} pl={'md'} p={'xs'} mb={'xs'} ta="left" bg={'gray.1'}>
                        <Title order={6} pt={'4'}>{t("DiscountConfiguration")}</Title>
                      </Box>
                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("Name")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_discount?.name ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("MaxDiscount")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_discount
                              ?.max_discount || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("DiscountWithCustomer")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_discount
                              ?.discount_with_customer
                              ? t("Yes")
                              : t("No")}
                        </Grid.Col>
                      </Grid>
                    </>
                )}


                {/* Accounting Configuration */}
                {domainConfig?.account_config && (
                    <>
                      <Box ml={'-md'} pl={'md'} p={'xs'} mb={'xs'} ta="left" bg={'gray.1'}>
                        <Title order={6} pt={'4'}>{t("AccountingConfiguration")}</Title>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("FinancialStartDate")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.financial_start_date ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("FinancialEndDate")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.financial_end_date ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("AccountBank")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_bank?.name || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("AccountCash")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_cash?.name || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("AccountCategory")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_category?.name ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("AccountCustomer")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_customer?.name ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("AccountMobile")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_mobile?.name ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("AccountProductGroup")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.account_product_group?.name || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("AccountUser")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_user?.name || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("AccountVendor")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_vendor?.name ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("VoucherPurchase")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.voucher_purchase?.name ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("VoucherPurchaseReturn")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.voucher_purchase_return?.name ||"-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("VoucherSales")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.voucher_sales?.name || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("VoucherSalesReturn")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.voucher_sales_return ?.name || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("VoucherStockOpening")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.voucher_stock_opening?.name || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"300"} fz={"xs"}>
                          {t("VoucherStockReconciliation")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.voucher_stock_reconciliation?.name || "-"}
                        </Grid.Col>
                      </Grid>
                    </>
                )}
            </Box>
          </ScrollArea>
        </Box>
      </Box>
    </>
  );
}
