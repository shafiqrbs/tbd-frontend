import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Group,
  Box,
  Text,
  Grid,
  TextInput,
  ScrollArea,
  Card,
  LoadingOverlay,
} from "@mantine/core";
import {
  getIndexEntityData,
  storeEntityData,
} from "../../../../store/core/crudSlice.js";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import _Search from "../common/_Search.jsx";
import { getHotkeyHandler } from "@mantine/hooks";
import classes from "../../../../assets/css/FeaturesCards.module.css";

// Sub-components
const PercentColumn = React.memo(({ item }) => (
    <Group justify="center" gap={4} noWrap mt={10}>
      <Text w={80} ta="center">{item.percent_mode || "0"}</Text>
      <Text w={80} ta="center">{item.mrp_percent || "0"}</Text>
      <Text w={80} ta="center">{item.purchase_percent || "0"}</Text>
    </Group>
));

const CentralInfoColumn = React.memo(({ item }) => (
    <Group justify="center" gap={4} noWrap mt={10}>
      <Text w={50} ta="center">{item.center_stock || "0"}</Text>
      <Text w={80} ta="center">{item.center_sales_price || "0"}</Text>
      <Text w={50} ta="center">{item.center_purchase_price || "0"}</Text>
    </Group>
));

const PriceInputCell = React.memo(({ item }) => {
  const [values, setValues] = useState({
    sales: item.sub_domain_sales_price,
    purchase: item.sub_domain_purchase_price
  });
  const dispatch = useDispatch();

  const handleChange = useCallback((field, value) => {
    setValues(prev => ({...prev, [field]: value}));
  }, []);

  const handleBlur = useCallback((field) => {
    dispatch(storeEntityData({
      url: 'domain/b2b/inline-update/product',
      data: {
        stock_id: item.id,
        b2b_id: item.b2b_id,
        field_name: field === 'sales' ? 'sales_price' : 'purchase_price',
        value: values[field],
      },
    }));
  }, [values, item.id, item.b2b_id, dispatch]);

  return (
      <Group justify="center" gap={4} noWrap mt={10}>
        <TextInput
            w={100}
            type="number"
            size="xs"
            value={Number(values.purchase)}
            onChange={(e) => handleChange('purchase', e.target.value)}
            onBlur={() => handleBlur('purchase')}
            onKeyDown={getHotkeyHandler([
              ['Enter', () => document.getElementById(`purchase-input-${item.id}`)?.focus()]
            ])}
            id={`purchase-input-${item.id}`}
        />
        <TextInput
            w={100}
            type="number"
            size="xs"
            value={Number(values.sales)}
            onChange={(e) => handleChange('sales', e.target.value)}
            onBlur={() => handleBlur('sales')}
            onKeyDown={getHotkeyHandler([
              ['Enter', () => document.getElementById(`sales-input-${item.id}`)?.focus()]
            ])}
            id={`sales-input-${item.id}`}
        />
      </Group>
  );
});

const SubDomainList = React.memo(({
                                    data,
                                    height,
                                    selectedDomainId,
                                    onSelect
                                  }) => (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      {data?.map((item) => (
          <Box
              key={item.id}
              className={`${classes["pressable-card"]} border-radius`}
              mih={40}
              mt={"4"}
              bg={item.id == selectedDomainId ? "gray.6" : "gray.1"}
              onClick={() => onSelect(item.id)}
              style={{ cursor: "pointer", borderRadius: 4 }}
          >
            <Text
                size={"sm"}
                pl={14}
                pt={8}
                fw={500}
                c={item.id == selectedDomainId ? "white" : "black"}
            >
              {item.name}
            </Text>
          </Box>
      ))}
    </ScrollArea>
));

export default function ProductTable({ id }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { mainAreaHeight } = useOutletContext();
  const navigate = useNavigate();

  const height = mainAreaHeight - 120;
  const perPage = 50;

  const [state, setState] = useState({
    page: 1,
    reloadList: true,
    fetching: false,
    indexData: [],
    subDomainData: [],
    selectedDomainId: id,
    error: null
  });

  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const productFilterData = useSelector((state) => state.inventoryCrudSlice.productFilterData);

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({...prev, fetching: true, error: null}));

      // Fetch subdomain data
      const subDomainResult = await dispatch(getIndexEntityData({
        url: 'domain/b2b/sub-domain',
        param: {}
      }));

      // Fetch product data
      const productResult = await dispatch(getIndexEntityData({
        url: `domain/b2b/sub-domain/product/${state.selectedDomainId}`,
        param: {
          term: searchKeyword,
          page: state.page,
          offset: perPage,
        }
      }));

      if (getIndexEntityData.fulfilled.match(subDomainResult)) {
        setState(prev => ({...prev, subDomainData: subDomainResult.payload}));
      }

      if (getIndexEntityData.fulfilled.match(productResult)) {
        setState(prev => ({...prev, indexData: productResult.payload}));
      }
    } catch (err) {
      setState(prev => ({...prev, error: err.message}));
      console.error("Error:", err);
    } finally {
      setState(prev => ({...prev, fetching: false, reloadList: false}));
    }
  }, [dispatch, state.selectedDomainId, searchKeyword, state.page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDomainSelect = useCallback((domainId) => {
    setState(prev => ({
      ...prev,
      selectedDomainId: domainId,
      reloadList: true,
      page: 1
    }));
    navigate(`/b2b/sub-domain/product/${domainId}`);
  }, [navigate]);

  const handlePageChange = useCallback((p) => {
    setState(prev => ({...prev, page: p, fetching: true}));
  }, []);

  const columns = [
    {
      accessor: "index",
      title: t("S/N"),
      textAlignment: "right",
      render: (item) => state.indexData.data.indexOf(item) + 1,
    },
    { accessor: "name", title: t("Name") },
    { accessor: "category_name", title: t("Category") },
    {
      accessor: "category_percent",
      title: (
          <Box>
            <Text fw={500} ta={"center"} mb={5}>
              {t("Percent")}
            </Text>
            <Group justify="center" gap={4} noWrap>
              <Text fz="xs" c="dimmed" w={80} ta="center">
                {t("PercentMode")}
              </Text>
              <Text fz="xs" c="dimmed" w={80} ta="center">
                {t("MRPPercent")}
              </Text>
              <Text fz="xs" c="dimmed" w={80} ta="center">
                {t("PurchasePercent")}
              </Text>
            </Group>
          </Box>
      ),
      textAlign: "center",
      render: (item) => <PercentColumn item={item} />,
    },
    {
      accessor: "central",
      title: (
          <Box>
            <Text fw={500} mb={5}>
              {t("Central")}
            </Text>
            <Group justify="center" gap={4} noWrap>
              <Text fz="xs" c="dimmed" w={50} ta="center">
                {t("Stock")}
              </Text>
              <Text fz="xs" c="dimmed" w={80} ta="center">
                {t("SalesPrice")}
              </Text>
              <Text fz="xs" c="dimmed" w={50} ta="center">
                {t("PurchasePrice")}
              </Text>
            </Group>
          </Box>
      ),
      textAlign: "center",
      render: (item) => <CentralInfoColumn item={item} />,
    },
    {
      accessor: "category_id",
      title: (
          <Box>
            <Text fw={500} mb={5}>
              {t("Branch")}
            </Text>
            <Group justify="center" gap={4} noWrap>
              <Text fz="xs" c="dimmed" w={100} ta="center">
                {t("PurchasePrice")}
              </Text>
              <Text fz="xs" c="dimmed" w={100} ta="center">
                {t("SalesPrice")}
              </Text>
            </Group>
          </Box>
      ),
      textAlign: "center",
      render: (item) => <PriceInputCell item={item} />,
    },
  ];

  return (
      <>
        <LoadingOverlay
            visible={state.reloadList}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Grid columns={24} gutter={{ base: 8 }}>
          <Grid.Col span={4}>
            <Card shadow="md" radius="md" className={classes.card} padding="lg">
              <Grid gutter={{ base: 2 }}>
                <Grid.Col span={10}>
                  <Text fz="md" fw={500} className={classes.cardTitle}>
                    {t("ManageBranchAndFranchise")}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid columns={9} gutter={{ base: 8 }}>
                <Grid.Col span={9}>
                  <Box bg={"white"}>
                    <Box mt={8} pt={"8"}>
                      <SubDomainList
                          data={state.subDomainData?.data || []}
                          height={height}
                          selectedDomainId={state.selectedDomainId}
                          onSelect={handleDomainSelect}
                      />
                    </Box>
                  </Box>
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
          <Grid.Col span={20}>
            <Box p={"xs"} bg={"white"} className={"borderRadiusAll"}>
              <Box
                  pl={`xs`}
                  pb={"xs"}
                  pr={8}
                  pt={"xs"}
                  mb={"xs"}
                  className={"boxBackground borderRadiusAll"}
              >
                <_Search module={"product"} />
              </Box>
              <Box className={"borderRadiusAll"}>
                {state.error ? (
                    <Text color="red">{state.error}</Text>
                ) : (
                    <DataTable
                        classNames={{
                          root: tableCss.root,
                          table: tableCss.table,
                          header: tableCss.header,
                          footer: tableCss.footer,
                          pagination: tableCss.pagination,
                        }}
                        records={state.indexData.data || []}
                        columns={columns}
                        fetching={state.fetching}
                        totalRecords={state.indexData.total || 0}
                        recordsPerPage={perPage}
                        page={state.page}
                        onPageChange={handlePageChange}
                        loaderSize="xs"
                        loaderColor="grape"
                        height={height}
                        scrollAreaProps={{ type: "never" }}
                    />
                )}
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </>
  );
}