import React, { useEffect, useState } from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {
  Grid,
  Box,
  Stack,
  Card,
  ScrollArea,
  Title,
  Text,
  Button,
  Flex, Group, ActionIcon, Input, Menu,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconDeviceFloppy,
  IconPencil,
  IconRefresh,
  IconShoppingBag
} from "@tabler/icons-react";
import _UpdateProduct from "./_UpdateProduct.jsx";
import _ProductMeasurement from "./_ProductMeasurement.jsx";
import _ProductGallery from "./_ProductGallery.jsx";
import _VatManagement from "./_VatManagement.jsx";
import _SkuManagement from "./_SkuManagement.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import { useTranslation } from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";
import {notifications} from "@mantine/notifications";
import {DataTable} from "mantine-datatable";
import {editEntityData, getIndexEntityData, setFormLoading, setInsertType} from "../../../../store/core/crudSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import _ProductSearch from "./_ProductSearch";
import _ProductInlineSearch from "./_ProductInlineSearch";

const PAGE_SIZE = 5;

function ProductUpdateForm(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { categoryDropdown, domainConfigData } = props;
  const product_config = domainConfigData?.inventory_config?.config_product;
  const [activeTab, setActiveTab] = useState("updateProduct");
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 104;
  const [products, setProducts] = useState([]);

  // Define the tab mapping with proper identifiers
  const tabConfig = [
    { id: "updateProduct", displayName: "Update Product" },
    { id: "productMeasurement", displayName: "Product Measurement" },
    { id: "productGallery", displayName: "Product Gallery" },
    { id: "vatManagement", displayName: "Vat Management" },
    { id: "skuManagement", displayName: "Sku Management" },
  ];
  const perPage = 50;
  const [page, setPage] = useState(1);

  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const [indexData, setIndexData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const value = {
        url: "inventory/product",
        param: {
          term: searchKeyword,
          page: page,
          offset: perPage,
          type: "product",
        },
      };
      try {

        const resultAction = await dispatch(getIndexEntityData(value));
        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [
    dispatch,
    searchKeyword,
    page,
    perPage

  ]);

  const start = page * perPage;
  const end = start + perPage;
  const pageData = indexData?.data?.slice(start, end);
  const hasNext = end < indexData?.total;
  const hasPrev = page > 0;

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
 // console.log(domainConfigData?.inventory_config?.vat_enable);

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
      <Grid columns={32} gutter={{ base: 8 }}>
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
          <Box bg={"white"} p={"xs"} mb={"8"}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"8"}
                pb={"10"}
                mb={"4"}
                className={"boxBackground"}
              >
                <Grid>
                  <Grid.Col span={12}>
                    <Title order={6} pt={"4"}>
                      {t(
                        tabConfig.find((tab) => tab.id === activeTab)
                          ?.displayName || ""
                      )}
                    </Title>
                  </Grid.Col>
                </Grid>
              </Box>
              <Box>
                {renderForm()}
              </Box>
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col span={8}>
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"} mb={"8"}>
            <Box bg={"white"}>
              <Box className={"borderRadiusAll"}>
                <DataTable
                    classNames={{
                      root: tableCss.root,
                      table: tableCss.table,
                      header: tableCss.header,
                      footer: tableCss.footer,
                      pagination: tableCss.pagination,
                    }}
                    records={indexData.data}
                    columns={[
                      {
                        accessor: "product_name",
                        title:  <_ProductInlineSearch
                            module={"product"}/>,
                        render: (data, index) => (

                      <Group
                          wrap="nowrap"
                          w="100%"
                          gap={0}
                          mx="auto"
                          justify="space-between"
                      >
                        <Text fz={11} fw={400} ta="left">
                          {index + 1}. {data.product_name}
                        </Text>
                        <Button.Group>
                        <Button
                            size="compact-xs"
                            color={"#f8eedf"}
                            radius={0}
                            w="50"
                            styles={{
                              root: {
                                height: "26px",
                                borderRadius: 0,
                                borderTopColor: "#905923",
                                borderBottomColor: "#905923",
                                borderLeftColor: "#905923",
                              },
                            }}
                            onClick={() => {
                            }}
                        >
                          <Text fz={9} fw={400} c={"black"}>
                            {data.unit_name}
                          </Text>
                        </Button>
                        <Button
                            size="compact-xs"
                            className={genericClass.invoiceAdd}
                            radius={0}
                            w="30"
                            onClick={() => {
                              dispatch(setInsertType("update"));
                              dispatch(
                                  editEntityData("inventory/product/" + data.product_id)
                              );
                              dispatch(setFormLoading(true));
                              navigate(`/inventory/product/${data.product_id}`);
                            }}
                            styles={{
                              root: {
                                height: "26px",
                                borderRadius:0,
                                borderTopRightRadius:
                                    "var(--mantine-radius-sm)",
                                borderBottomRightRadius:
                                    "var(--mantine-radius-sm)",
                              },
                            }}

                        >
                          <Flex direction={`column`} gap={0}>
                            <IconPencil size={12}/>
                          </Flex>
                        </Button>
                        </Button.Group>
                      </Group>
                        ),
                      }
                    ]}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height+14}
                    scrollAreaProps={{
                      scrollbarSize: 4,
                    }}
                />
                <Group wrap="nowrap"
                       w="100%"
                       gap={0}
                       mx="auto"
                       justify="space-between" className={'bodyBackgroundLight'}>
                  <Text  size="xs" pl={'xs'} >Page - {page} / {Math.ceil(indexData.total/perPage)}</Text>
                  <Button.Group mt={'4'} mb={'4'}  mr={'xs'}>
                    <Button variant="default" size="xs" onClick={() => setPage((p) => p - 1)} disabled={!hasPrev}>
                      <IconChevronLeft color="#905923" />
                    </Button>
                    <Button variant="default" size="xs" onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
                      <IconChevronRight color="#905923" />
                    </Button>
                  </Button.Group>
                </Group>
              </Box>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default ProductUpdateForm;
