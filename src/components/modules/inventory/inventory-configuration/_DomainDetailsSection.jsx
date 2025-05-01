import { Box, Title, ScrollArea, Grid, Center } from "@mantine/core";
import { useTranslation } from "react-i18next";
import React from "react";

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
            {t("SettingsDetails")}
          </Title>
        </Box>
        <Box className="borderRadiusAll" h={height}>
          <ScrollArea h={height - 32} >
              <Box p={'md'}>
            <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
              <Title order={6} pt={'4'}>{t('DomainDetails')}</Title>
            </Box>

            {/* Basic Domain Info */}
            <Grid columns={24}>
              <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                {t("Name")}
              </Grid.Col>
              <Grid.Col span={1}>:</Grid.Col>
              <Grid.Col span={14}>{domainConfig?.name}</Grid.Col>
            </Grid>

            <Grid columns={24}>
              <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                {t("Mobile")}
              </Grid.Col>
              <Grid.Col span={1}>:</Grid.Col>
              <Grid.Col span={14}>{domainConfig?.mobile}</Grid.Col>
            </Grid>

            <Grid columns={24}>
              <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                {t("Email")}
              </Grid.Col>
              <Grid.Col span={1}>:</Grid.Col>
              <Grid.Col span={14}>{domainConfig?.email}</Grid.Col>
            </Grid>

            <Grid columns={24}>
              <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                {t("Address")}
              </Grid.Col>
              <Grid.Col span={1}>:</Grid.Col>
              <Grid.Col span={14}>{domainConfig?.address}</Grid.Col>
            </Grid>

            <Grid columns={24}>
              <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                {t("Status")}
              </Grid.Col>
              <Grid.Col span={1}>:</Grid.Col>
              <Grid.Col span={14}>
                {domainConfig?.status === 1 ? t("Active") : t("Inactive")}
              </Grid.Col>
            </Grid>

            <Grid columns={24}>
              <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                {t("UniqueCode")}
              </Grid.Col>
              <Grid.Col span={1}>:</Grid.Col>
              <Grid.Col span={14}>{domainConfig?.unique_code}</Grid.Col>
            </Grid>

                {/* Sales Configuration */}
                {domainConfig?.inventory_config?.config_sales && (
                    <>
                      <Box mt={"lg"} mb={"lg"}>
                        <Center>
                          <Title order={6} fz={16}>
                            {t("SalesConfiguration")}
                          </Title>
                        </Center>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("DefaultCustomerGroup")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {
                            domainConfig?.inventory_config?.config_sales
                                ?.default_customer_group_id
                          }
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                      <Box mt={"lg"} mb={"lg"}>
                        <Center>
                          <Title order={6} fz={16}>
                            {t("PurchaseConfiguration")}
                          </Title>
                        </Center>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("DefaultVendorGroup")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {
                            domainConfig?.inventory_config?.config_purchase
                                ?.default_vendor_group_id
                          }
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                      <Box mt={"lg"} mb={"lg"}>
                        <Center>
                          <Title order={6} fz={16}>
                            {t("ProductionConfiguration")}
                          </Title>
                        </Center>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                      <Box mt={"lg"} mb={"lg"}>
                        <Center>
                          <Title order={6} fz={16}>
                            {t("DiscountConfiguration")}
                          </Title>
                        </Center>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("Name")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_discount?.name ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("MaxDiscount")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.inventory_config?.config_discount
                              ?.max_discount || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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

                {/* Product Configuration */}
                {domainConfig?.inventory_config?.config_product && (
                    <>
                      <Box mt={"lg"} mb={"lg"}>
                        <Center>
                          <Title order={6} fz={16}>
                            {t("ProductConfiguration")}
                          </Title>
                        </Center>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
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

                {/* Accounting Configuration */}
                {domainConfig?.account_config && (
                    <>
                      <Box mt={"lg"} mb={"lg"}>
                        <Center>
                          <Title order={6} fz={16}>
                            {t("AccountingConfiguration")}
                          </Title>
                        </Center>
                      </Box>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("FinancialStartDate")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.financial_start_date ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("FinancialEndDate")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.financial_end_date ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("AccountBank")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_bank_id || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("AccountCash")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_cash_id || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("AccountCategory")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_category_id ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("AccountCustomer")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_customer_id ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("AccountMobile")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_mobile_id ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("AccountProductGroup")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.account_product_group_id || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("AccountUser")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_user_id || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("AccountVendor")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.account_vendor_id ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("VoucherPurchase")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.voucher_purchase_id ||
                          "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("VoucherPurchaseReturn")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.voucher_purchase_return_id || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("VoucherSales")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config?.voucher_sales_id || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("VoucherSalesReturn")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.voucher_sales_return_id || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("VoucherStockOpening")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.voucher_stock_opening_id || "-"}
                        </Grid.Col>
                      </Grid>

                      <Grid columns={24}>
                        <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                          {t("VoucherStockReconciliation")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={14}>
                          {domainConfig?.account_config
                              ?.voucher_stock_reconciliation_id || "-"}
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
