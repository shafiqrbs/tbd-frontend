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
    ...(product_config.is_sku === 1
        ? [{ id: "skuManagement", displayName: "Sku Management" }]
        : []),
    ...(product_config.is_measurement === 1
        ? [{ id: "productMeasurement", displayName: "Product Measurement" }]
        : []),
    ...(product_config.is_product_gallery === 1
        ? [{ id: "productGallery", displayName: "Product Gallery" }]
        : []),
    ...(domainConfigData?.inventory_config?.hs_code_enable === 1 && domainConfigData?.inventory_config?.vat_integration === 1
        ? [{ id: "vatManagement", displayName: "Vat Management" }]
        : []),
  ];
  const perPage = 50;
  const [page, setPage] = useState(1);

  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const [indexData, setIndexData] = useState([]);
  const [reload, setReload] = useState(true);

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
      }finally {
        setReload(false)
      }
    };

    fetchData();
  }, [
    dispatch,
    searchKeyword,
    page,
    perPage,reload
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
      case "skuManagement":
        return <_SkuManagement id={id} productConfig={product_config} />;
      case "productMeasurement":
        return <_ProductMeasurement id={id} />;
      case "productGallery":
        return <_ProductGallery id={id} />;
      case "vatManagement":
        return <_VatManagement id={id} />;
      default:
        return <_UpdateProduct categoryDropdown={categoryDropdown} />;
    }
  };
 // console.log(domainConfigData?.inventory_config?.vat_enable);
  return (
    <Box>
      <Grid columns={32} gutter={{ base: 8 }}>
        <Grid.Col span={6}>
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
        <Grid.Col span={26}>
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
      </Grid>
    </Box>
  );
}
export default ProductUpdateForm;
