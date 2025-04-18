import React, {useEffect, useState, useCallback} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    Text,
    Grid,
    TextInput,
    LoadingOverlay,
} from "@mantine/core";
import {
    getIndexEntityData,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import _Search from "../common/_Search.jsx";
import {getHotkeyHandler} from "@mantine/hooks";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import _ManageBranchAndFranchise from "../common/_ManageBranchAndFranchise.jsx";

// Sub-components
const PercentColumn = React.memo(({item}) => (
    <Group justify="center" gap={4} noWrap mt={10}>
        <Text w={80} ta="center">{item.percent_mode || "0"}</Text>
        <Text w={80} ta="center">{item.purchase_percent || "0"}</Text>
        <Text w={80} ta="center">{item.mrp_percent || "0"}</Text>
    </Group>
));

const CentralInfoColumn = React.memo(({item}) => (
    <Group justify="center" gap={4} noWrap mt={10}>
        <Text w={50} ta="center">{item.center_stock || "0"}</Text>
        <Text w={50} ta="center">{item.center_purchase_price || "0"}</Text>
        <Text w={80} ta="center">{item.center_sales_price || "0"}</Text>
    </Group>
));

const PriceInputCell = React.memo(({item}) => {
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

export default function ProductTable({id}) {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {mainAreaHeight} = useOutletContext();
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
    const [selectedDomainId, setSelectedDomainId] = useState(id);
    const [reloadList, setReloadList] = useState(true)

    const fetchData = useCallback(async () => {
        try {
            setState(prev => ({...prev, fetching: true, error: null}));

            // Fetch product data
            const productResult = await dispatch(getIndexEntityData({
                url: `domain/b2b/sub-domain/product/${selectedDomainId}`,
                param: {
                    term: searchKeyword,
                    page: state.page,
                    offset: perPage,
                }
            }));

            if (getIndexEntityData.fulfilled.match(productResult)) {
                setState(prev => ({...prev, indexData: productResult.payload}));
            }
        } catch (err) {
            setState(prev => ({...prev, error: err.message}));
            console.error("Error:", err);
        } finally {
            setState(prev => ({...prev, fetching: false, reloadList: false}));
            setReloadList(false)
        }
    }, [dispatch, state.selectedDomainId, searchKeyword, state.page, reloadList]);

    useEffect(() => {
        fetchData();
    }, [fetchData, reloadList]);

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
        {accessor: "name", title: t("Name"),width:'25%'},
        {accessor: "category_name", title: t("Category"),width:'10%'},
        {
            accessor: "category_percent",
            title: (
                <Box>
                    <Text fw={500} ta={"center"} mb={5}>
                        {t("Percent(%)")}
                    </Text>
                    <Group justify="center" gap={4} noWrap>
                        <Text fz="xs" c="dimmed" w={80} ta="center">
                            {t("Mode")}
                        </Text>
                        <Text fz="xs" c="dimmed" w={80} ta="center">
                            {t("MRP")}
                        </Text>
                        <Text fz="xs" c="dimmed" w={80} ta="center">
                            {t("Purchase")}
                        </Text>
                    </Group>
                </Box>
            ),
            textAlign: "center",
            render: (item) => <PercentColumn item={item}/>,
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
                        <Text fz="xs" c="dimmed" w={50} ta="center">
                            {t("Purchase")}
                        </Text>
                        <Text fz="xs" c="dimmed" w={80} ta="center">
                            {t("Sales")}
                        </Text>
                    </Group>
                </Box>
            ),
            textAlign: "center",
            render: (item) => <CentralInfoColumn item={item}/>,
        },
        {
            accessor: "category_id",
            title: (
                <Box>
                    <Text fw={500} mb={5}>
                        {t("Domain")}
                    </Text>
                    <Group justify="center" gap={4} noWrap>
                        <Text fz="xs" c="dimmed" w={100} ta="center">
                            {t("Purchase")}
                        </Text>
                        <Text fz="xs" c="dimmed" w={100} ta="center">
                            {t("Sales")}
                        </Text>
                    </Group>
                </Box>
            ),
            textAlign: "center",
            render: (item) => <PriceInputCell item={item}/>,
        },
    ];

    return (
        <>
            <LoadingOverlay
                visible={state.reloadList || reloadList}
                zIndex={1000}
                overlayProps={{radius: "sm", blur: 2}}
            />

            <Grid columns={24} gutter={{base: 8}}>
                <Grid.Col span={4}>
                    <_ManageBranchAndFranchise
                        classes={classes}
                        setSelectedDomainId={setSelectedDomainId}
                        selectedDomainId={selectedDomainId}
                        setReloadList={setReloadList}
                        id={id}
                        module={'product'}
                    />
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
                            <_Search module={"product"}/>
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
                                    totalRecords={state.indexData.total || 0}
                                    recordsPerPage={perPage}
                                    page={state.page}
                                    onPageChange={handlePageChange}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={height}
                                    scrollAreaProps={{type: "never"}}
                                />
                            )}
                        </Box>
                    </Box>
                </Grid.Col>
            </Grid>
        </>
    );
}