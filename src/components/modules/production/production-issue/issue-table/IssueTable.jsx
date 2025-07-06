import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    Text,
    Menu,
    Paper,
    Badge,
    Grid
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconDotsVertical,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {getIndexEntityData} from "../../../../../store/core/crudSlice.js";
import tableCss from "../../../../../assets/css/Table.module.css";
import "@mantine/carousel/styles.css";
import _IssueSearch from "./_IssueSearch.jsx";
import ProductionNavigation from "../../common/ProductionNavigation.jsx";

function IssueTable() {
    const {type} = useParams()
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 155;

    const scrollViewportRef = useRef(null);

    const navigate = useNavigate();
    const perPage = 20;
    const [page, setPage] = useState(1);
    const [allDataLoaded, setAllDataLoaded] = useState(false);

    const [indexData, setIndexData] = useState({data: [], total: 0});
    const [fetching, setFetching] = useState(false);

    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
    const productFilterData = useSelector(
        (state) => state.inventoryCrudSlice.productFilterData
    );
    const fetchingReload = useSelector((state) => state.crudSlice.fetching);
    const fetchData = async (loadPage = 1, reset = false) => {
        setFetching(true);

        const value = {
            url: "production/issue",
            param: {
                term: searchKeyword,
                page: loadPage,
                offset: perPage,
                type: type,
            },
        };

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.rejected.match(resultAction)) {
                console.error("Error:", resultAction);
            } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                const newData = resultAction.payload?.data ?? [];
                const total = resultAction.payload?.total ?? 0;

                if (reset) {
                    setIndexData({data: newData, total});
                } else {
                    setIndexData((prev) => ({
                        ...prev,
                        data: [...prev.data, ...newData],
                    }));
                }

                setPage(loadPage);
                if (newData.length < perPage || indexData.data.length + newData.length >= total) {
                    setAllDataLoaded(true);
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setAllDataLoaded(false);
        fetchData(1, true);
    }, [searchKeyword, productFilterData, fetchingReload,type]);

    const handleScrollToBottom = () => {
        if (!fetching && !allDataLoaded) {
            fetchData(page + 1);
        }
    };

    const statusMap = {
        "In-progress": { color: "blue", label: "In Progress" },
        "Approved": { color: "red", label: "Approved" },
        "Rejected": { color: "red", label: "Rejected" },
    };

    return (
        <>
            <Grid columns={24} gutter={{base: 8}}>
                <Grid.Col span={1}>
                    <ProductionNavigation module={"production-issue"} type={"production-issue"}/>
                </Grid.Col>
                <Grid.Col span={23}>
                    <Box pl="xs" pr={8} pt="6" pb="4" className="boxBackground borderRadiusAll border-bottom-none">
                        <_IssueSearch module="production-issue"/>
                    </Box>

                    <Box className="borderRadiusAll border-top-none">
                        <DataTable
                            classNames={tableCss}
                            records={indexData.data}
                            columns={[
                                {
                                    accessor: "index",
                                    title: t("S/N"),
                                    textAlignment: "right",
                                    render: (item) => indexData.data.indexOf(item) + 1,
                                },
                                {accessor: "created_date", title: t("Created")},
                                {accessor: "issue_date", title: t("IssueDate")},
                                {accessor: "issued_name", title: t("IssueBy")},
                                {accessor: "issue_type", title: t("IssueType")},
                                {accessor: "warehouse_name", title: t("Warehouse")},
                                {accessor: "vendor_name", title: t("Vendor")},
                                {
                                    accessor: "process",
                                    title: t("Status"),
                                    render: (item) => {
                                        const badge = statusMap[item.process] || { color: "gray", label: item.process };
                                        return <Badge color={badge.color}>{badge.label}</Badge>;
                                    },
                                },
                                {accessor: "approved_name", title: t("ApprovedBy")},
                                {
                                    accessor: "action",
                                    title: t("Action"),
                                    textAlign: "right",
                                    render: (item) => (
                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <Menu position="bottom-end" withArrow trigger="hover" openDelay={100}
                                                  closeDelay={400}>
                                                <Menu.Target>
                                                    <ActionIcon size="sm" variant="outline" color='var(--theme-primary-color-6)' radius="xl">
                                                        <IconDotsVertical height={18} width={18} stroke={1.5}/>
                                                    </ActionIcon>
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    {item.process==='In-progress' &&
                                                        <Menu.Item
                                                            onClick={() => {
                                                                type==='general' && navigate(`/production/issue-production-general/${item.id}`);
                                                                type==='batch' && navigate(`/production/issue-production-batch/${item.id}`);
                                                            }}
                                                        >
                                                            {t("Edit")}
                                                        </Menu.Item>
                                                    }
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Group>
                                    ),
                                },
                            ]}

                            fetching={fetching}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={height}
                            scrollViewportRef={scrollViewportRef}
                            onScrollToBottom={handleScrollToBottom}
                        />
                        <Paper p="md" mt="sm" withBorder>
                            <Group justify="space-between">
                                <Text size="sm">
                                    Showing <b>{indexData.data.length}</b> of <b>{indexData.total}</b> products
                                </Text>
                                {!allDataLoaded && (
                                    <Text size="xs" color="dimmed">
                                        {fetching && !allDataLoaded && (
                                            <Text size="xs" color="dimmed">
                                                {t("LoadingProducts")}...
                                            </Text>
                                        )}
                                    </Text>
                                )}
                            </Group>
                        </Paper>
                    </Box>
                </Grid.Col>
            </Grid>
        </>
    );
}

export default IssueTable;
