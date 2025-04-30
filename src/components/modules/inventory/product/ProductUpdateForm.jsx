import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  Grid,
  Box,
  Stack,
  Card,
  ScrollArea,
  Title,
  Text,
  Button,
  Flex,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import _UpdateProduct from "./_UpdateProduct.jsx";
import _ProductMeasurement from "./_ProductMeasurement.jsx";
import _ProductGallery from "./_ProductGallery.jsx";
import _VatManagement from "./_VatManagement.jsx";
import _SkuManagement from "./_SkuManagement.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import { useTranslation } from "react-i18next";

function ProductUpdateForm(props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const { categoryDropdown, domainConfigData } = props;
  const product_config = domainConfigData?.inventory_config?.config_product;
  const [activeTab, setActiveTab] = useState("updateProduct");
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 104;

  // Define the tab mapping with proper identifiers
  const tabConfig = [
    { id: "updateProduct", displayName: "Update Product" },
    { id: "productMeasurement", displayName: "Product Measurement" },
    { id: "productGallery", displayName: "Product Gallery" },
    { id: "vatManagement", displayName: "Vat Management" },
    { id: "skuManagement", displayName: "Sku Management" },
  ];


  const renderForm = () => {
    switch (activeTab) {
      case "updateProduct":
        return <_UpdateProduct categoryDropdown={categoryDropdown} />;
      case "productMeasurement":
        return <_ProductMeasurement id={id} />;
      case "productGallery":
        return <_ProductGallery id={id} />;
      case "vatManagement":
        return <_VatManagement id={id} />;
      case "skuManagement":
        return <_SkuManagement id={id} />;
      default:
        return <_UpdateProduct categoryDropdown={categoryDropdown} />;
    }
  };
  const [isBrand, setBrand] = useState(product_config?.is_brand === 1);

  const [vat_integration, setVat_integration] = useState(
    product_config?.vat_integration === 1
  );
  const [is_measurement, setIs_measurement] = useState(
    product_config?.is_measurement === 1
  );
  const [isColor, setColor] = useState(product_config?.is_color === 1);
  const [isGrade, setGrade] = useState(product_config?.is_grade === 1);
  const [isSize, setSize] = useState(product_config?.is_size === 1);
  const [isModel, setModel] = useState(product_config?.is_model === 1);
  const [isSku, setSku] = useState(product_config?.is_sku === 1);
  const [vatEnable, setVatEnable] = useState(
    domainConfigData?.inventory_config?.vat_enable === 1
  );
  const [isMultiPrice, setIsMultiPrice] = useState(
    product_config?.is_multi_price === 1
  );
  const [is_product_gallery, setIs_product_gallery] = useState(
    product_config?.is_product_gallery === 1
  );
  console.log(domainConfigData?.inventory_config?.vat_enable);

  useEffect(() => {
    setBrand(product_config?.is_brand === 1);
    setVat_integration(product_config?.vat_integration === 1);
    setIs_measurement(product_config?.is_measurement === 1);
    setColor(product_config?.is_color === 1);
    setGrade(product_config?.is_grade === 1);
    setSize(product_config?.is_size === 1);
    setModel(product_config?.is_model === 1);
    setSku(product_config?.is_sku === 1);
    setVatEnable(domainConfigData?.inventory_config?.vat_enable === 1);
    setIsMultiPrice(product_config?.is_multi_price === 1);
    setIs_product_gallery(product_config?.is_product_gallery === 1);
  }, [product_config]);

  return (
    <Box>
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={4}>
          <Card shadow="md" radius="4" className={classes.card} padding="xs">
            <Grid gutter={{ base: 2 }}>
              <Grid.Col span={11}>
                <Text fz="md" fw={500} className={classes.cardTitle}>
                  {t("ProductNavigation")}
                </Text>
              </Grid.Col>
            </Grid>
            <Grid columns={9} gutter={{ base: 1 }}>
              <Grid.Col span={9}>
                <Box bg={"white"}>
                  <Box mt={8} pt={"8"}>
                    <ScrollArea
                      h={height}
                      scrollbarSize={2}
                      scrollbars="y"
                      type="never"
                    >
                      {tabConfig.map((tab) => (
                        <Box
                          key={tab.id}
                          style={{
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          className={`${classes["pressable-card"]} border-radius`}
                          mih={40}
                          mt={"4"}
                          variant="default"
                          onClick={() => setActiveTab(tab.id)}
                          bg={activeTab === tab.id ? "#f8eedf" : "gray.1"}
                        >
                          <Text size={"sm"} pt={8} pl={8} fw={500} c={"black"}>
                            {t(tab.displayName)}
                          </Text>
                        </Box>
                      ))}
                    </ScrollArea>
                  </Box>
                </Box>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
        <Grid.Col span={20}>
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"} mb={"8"}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"8"}
                pb={"10"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid>
                  <Grid.Col span={6}>
                    <Title order={6} pt={"4"}>
                      {t(
                        tabConfig.find((tab) => tab.id === activeTab)
                          ?.displayName || ""
                      )}
                    </Title>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack right align="flex-end">
                      <>
                        {isOnline && (
                          <Button
                            size="xs"
                            className={"btnPrimaryBg"}
                            leftSection={<IconDeviceFloppy size={16} />}
                            onClick={() => {
                              switch (activeTab) {
                                case "updateProduct":
                                  document
                                    .getElementById("UpdateProductFormSubmit")
                                    ?.click();
                                  break;
                                case "productMeasurement":
                                  document
                                    .getElementById(
                                      "ProductMeasurementFormSubmit"
                                    )
                                    ?.click();
                                  break;
                                case "productGallery":
                                  document
                                    .getElementById("ProductGalleryFormSubmit")
                                    ?.click();
                                  break;
                                case "vatManagement":
                                  document
                                    .getElementById("VatManagementFormSubmit")
                                    ?.click();
                                  break;
                                case "skuManagement":
                                  document
                                    .getElementById("SkuManagementFormSubmit")
                                    ?.click();
                                  break;
                                default:
                                  break;
                              }
                            }}
                          >
                            <Flex direction={`column`} gap={0}>
                              <Text fz={14} fw={400}>
                                {t("UpdateAndSave")}
                              </Text>
                            </Flex>
                          </Button>
                        )}
                      </>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Box>
              <Box className={"borderRadiusAll"}>
                {renderForm()}
              </Box>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default ProductUpdateForm;
