import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import tableCss from "../../../../assets/css/Table.module.css";
import {
    Group,
    Box,
    ActionIcon,
    Text,
    Grid,
    Stack,
    Button,
    ScrollArea,
    Table,
    Menu,
    rem,
    LoadingOverlay, Badge,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconEdit,
    IconPrinter,
    IconReceipt,
    IconDotsVertical,
    IconEyeEdit,
    IconTrashX, IconPencil,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {getIndexEntityData, setFetching, showInstantEntityData} from "../../../../store/inventory/crudSlice.js";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import ShortcutTable from "../../shortcut/ShortcutTable";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import _StockTransferSearch from "./_StockTransferSearch.jsx";

function _StockTransferTable({domainConfigData}) {
    const printRef = useRef();
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 106; //TabList height 104
    const height = mainAreaHeight - 304; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [printA4, setPrintA4] = useState(false);
    const [printPos, setPrintPos] = useState(false);
    const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState("");
    const [indexData, setIndexData] = useState([])
    const fetching = useSelector((state) => state.inventoryCrudSlice.fetching);
    const stockTransferFilterData = useSelector((state) => state.inventoryCrudSlice.stockTransferFilterData);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const [stockTransferViewData, setStockTransferViewData] = useState({});

    useEffect(() => {
        setStockTransferViewData(
            indexData.data && indexData.data[0] && indexData.data[0]
        );
        setSelectedRow(
            indexData.data && indexData.data[0] && indexData.data[0].id
        );
    }, [indexData.data]);

    const rows =
        stockTransferViewData &&
        stockTransferViewData.stock_transfer_items &&
        stockTransferViewData.stock_transfer_items.map((element, index) => (
            <Table.Tr key={`${element.name}-${index}`}>
                <Table.Td fz="xs" width={"20"}>
                    {index + 1}
                </Table.Td>
                <Table.Td ta="left" fz="xs" width={"300"}>
                    {element.name}
                </Table.Td>
                <Table.Td ta="left" fz="xs" width={"300"}>
                    {element.uom}
                </Table.Td>

                <Table.Td ta="center" fz="xs" width={"60"}>
                    {element.quantity}
                </Table.Td>
            </Table.Tr>
        ));


    const fetchData = async () => {
        setFetching(true);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };

        const value = {
            url: "inventory/stock/transfer",
            param: {
                term: stockTransferFilterData.searchKeyword,
                from_warehouse_id: stockTransferFilterData.from_warehouse_id,
                to_warehouse_id: stockTransferFilterData.to_warehouse_id,
                start_date:
                    stockTransferFilterData.start_date &&
                    new Date(stockTransferFilterData.start_date).toLocaleDateString("en-CA", options),
                end_date:
                    stockTransferFilterData.end_date &&
                    new Date(stockTransferFilterData.end_date).toLocaleDateString("en-CA", options),
                page: page,
                offset: perPage,
            },
        };

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.rejected.match(resultAction)) {
                console.error('Error:', resultAction);
            } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                setIndexData(resultAction.payload);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setFetching(false)
        }
    };

// useEffect now only calls fetchData based on dependencies
    useEffect(() => {
        fetchData();
    }, [stockTransferFilterData, page, fetching]);

    const handleStockTransferApprove = (id) => {
        // Open confirmation modal
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red"},
            onCancel: () => {
                console.log("Cancel");
            },
            onConfirm: () => {
                handleConfirmStockTransferApprove(id)
            }, // Separate function for "onConfirm"
        });
    };

    const handleConfirmStockTransferApprove = async (id) => {
        try {
            const resultAction = await dispatch(showInstantEntityData('inventory/stock/transfer/approve/' + id));

            if (showInstantEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    showNotificationComponent(t("ApprovedSuccessfully"), "teal", '', true, 1000, true, "lightgray")
                }
            }
        } catch (error) {
            showNotificationComponent(t("UpdateFailed"), "red", '', true, 1000, true, "lightgray")
        } finally {
            fetchData();
        }
    };

    const handleStockTransferDelete = async (id) => {
        try {
            let resultAction = await dispatch(deleteEntityData('inventory/stock/transfer/' + id));
            if (deleteEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    showNotificationComponent(resultAction.payload.data.message, 'teal', null, false, 1000, true)
                } else {
                    showNotificationComponent('Failed to process', 'red', null, false, 1000, true)
                }
            }
        } catch (error) {
            console.error("Error updating entity:", error);
            showNotificationComponent('Failed to process', 'red', null, false, 1000, true)
        } finally {
            fetchData();
        }
    }

    return (
        <>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={24}>
                        <Box pl={`xs`} pb={'4'} pr={'xs'} pt={'4'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                            <Grid>
                                <Grid.Col>
                                    <Stack>
                                        <_StockTransferSearch/>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={15}>
                        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
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
                                            accessor: "index",
                                            title: "S/N",
                                            textAlignment: "right",
                                            render: (item) => indexData.data.indexOf(item) + 1,
                                        },
                                        {accessor: "created", title: t("Created")},
                                        {
                                            accessor: "id",
                                            title: t("Invoice"),
                                            render: (item) => (
                                                <Text
                                                    component="a"
                                                    size="sm"
                                                    variant="subtle"
                                                    color="var(--theme-secondary-color-8)"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setLoading(true);
                                                        setStockTransferViewData(item);
                                                        setSelectedRow(item.id);
                                                    }}
                                                    style={{cursor: "pointer"}}
                                                >
                                                    {item.id}
                                                </Text>
                                            ),
                                        },
                                        {accessor: "from_warehouse", title: t("fromWarehouse")},
                                        {accessor: "to_warehouse", title: t("toWarehouse")},
                                        {accessor: "created_by", title: t("CreatedBy")},
                                        {
                                            accessor: "process",
                                            title: t("Status"),
                                            width: "130px",
                                            render: (item) => {
                                                const colorMap = {
                                                    Created: "blue",
                                                    Approved: "red",
                                                };

                                                const badgeColor = colorMap[item.process] || "gray"; // fallback color

                                                return item.process && <Badge color={badgeColor}>{item.process}</Badge>;
                                            }
                                        },
                                        {
                                            accessor: "action",
                                            title: "Action",
                                            textAlign: "right",
                                            render: (data) => (
                                                <Group gap={4} justify="right" wrap="nowrap">
                                                    {
                                                        !data.approved_by_id &&
                                                        <Button component="a" size="compact-xs" radius="xs"
                                                                variant="filled" fw={'100'} fz={'12'}
                                                                color='var(--theme-secondary-color-8)'
                                                                mr={'4'}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleStockTransferApprove(data.id)
                                                                }}
                                                        >{t('Approve')}
                                                        </Button>
                                                    }
                                                    <Menu
                                                        position="bottom-end"
                                                        offset={3}
                                                        withArrow
                                                        trigger="hover"
                                                        openDelay={100}
                                                        closeDelay={400}
                                                    >
                                                        <Menu.Target>
                                                            <ActionIcon
                                                                size="sm"
                                                                variant="transparent"
                                                                color='red'
                                                                radius="xl"
                                                                aria-label="Settings"
                                                            >
                                                                <IconDotsVertical
                                                                    height={"18"}
                                                                    width={"18"}
                                                                    stroke={1.5}
                                                                />
                                                            </ActionIcon>
                                                        </Menu.Target>
                                                        <Menu.Dropdown>

                                                            {
                                                                !data.approved_by_id && data.process == "Created" &&
                                                                <Menu.Item
                                                                    onClick={() => {
                                                                        navigate(
                                                                            `/inventory/stock-transfer/edit/${data.id}`
                                                                        );
                                                                    }}
                                                                    target="_blank"
                                                                    component="a"
                                                                    w={"200"}
                                                                    leftSection={
                                                                        <IconPencil
                                                                            style={{
                                                                                width: rem(14),
                                                                                height: rem(14)
                                                                            }}
                                                                        />
                                                                    }
                                                                >
                                                                    {t("Edit")}
                                                                </Menu.Item>
                                                            }

                                                            <Menu.Item
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setLoading(true);
                                                                    setStockTransferViewData(data);
                                                                    setSelectedRow(data.invoice);
                                                                }}
                                                                target="_blank"
                                                                component="a"
                                                                w={"200"}
                                                                leftSection={
                                                                    <IconEyeEdit
                                                                        style={{width: rem(14), height: rem(14)}}
                                                                    />
                                                                }
                                                            >
                                                                {t("Show")}
                                                            </Menu.Item>

                                                            {
                                                                !data.approved_by_id &&
                                                                <>
                                                                    <Menu.Item
                                                                        target="_blank"
                                                                        component="a"
                                                                        bg={"red.1"}
                                                                        c={"red.6"}
                                                                        onClick={() => {
                                                                            modals.openConfirmModal({
                                                                                title: (
                                                                                    <Text size="md">
                                                                                        {" "}
                                                                                        {t("FormConfirmationTitle")}
                                                                                    </Text>
                                                                                ),
                                                                                children: (
                                                                                    <Text size="sm">
                                                                                        {" "}
                                                                                        {t("FormConfirmationMessage")}
                                                                                    </Text>
                                                                                ),
                                                                                labels: {
                                                                                    confirm: "Confirm",
                                                                                    cancel: "Cancel",
                                                                                },
                                                                                confirmProps: {color: "red.6"},
                                                                                onCancel: () => console.log("Cancel"),
                                                                                onConfirm: () => handleStockTransferDelete(data.id),
                                                                            });
                                                                        }}
                                                                        w={"200"}
                                                                        leftSection={
                                                                            <IconTrashX
                                                                                style={{
                                                                                    width: rem(14),
                                                                                    height: rem(14)
                                                                                }}
                                                                            />
                                                                        }
                                                                    > {t("Delete")}
                                                                    </Menu.Item>
                                                                </>
                                                            }

                                                        </Menu.Dropdown>
                                                    </Menu>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    fetching={fetching}
                                    totalRecords={indexData.total}
                                    recordsPerPage={perPage}
                                    page={page}
                                    onPageChange={(p) => {
                                        setPage(p);
                                        dispatch(setFetching(true));
                                    }}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={tableHeight}
                                    scrollAreaProps={{type: "never"}}
                                    rowBackgroundColor={(item) => {
                                        if (item.id === selectedRow) return "var(--theme-primary-color-1)";
                                    }}
                                    rowColor={(item) => {
                                        if (item.id === selectedRow) return "var(--mantine-color-black-9)";
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} ref={printRef} pos="relative">
                            {loading && (
                                <LoadingOverlay
                                    visible={loading}
                                    zIndex={1000}
                                    overlayProps={{radius: "sm", blur: 2}}
                                    loaderProps={{color: "red"}}
                                />
                            )}
                            <Box h={'36'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'6'} mb={'4'}
                                 className={'boxBackground textColor borderRadiusAll'}>
                                {t("Invoice")}:{" "}
                                {stockTransferViewData &&
                                    stockTransferViewData.invoice &&
                                    stockTransferViewData.invoice}
                            </Box>
                            <Box className={"borderRadiusAll"} fz={"sm"}>
                                <ScrollArea h={122} type="never">
                                    <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'}
                                         className={'boxBackground textColor'}>
                                        <Grid gutter={{base: 4}}>
                                            <Grid.Col span={"6"}>
                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("fromWarehouse")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {stockTransferViewData &&
                                                                stockTransferViewData.from_warehouse &&
                                                                stockTransferViewData.from_warehouse}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("toWarehouse")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {stockTransferViewData &&
                                                                stockTransferViewData.to_warehouse &&
                                                                stockTransferViewData.to_warehouse}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>

                                            </Grid.Col>
                                            <Grid.Col span={"6"}>
                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("Created")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {stockTransferViewData &&
                                                                stockTransferViewData.created &&
                                                                stockTransferViewData.created}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("CreatedBy")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {stockTransferViewData &&
                                                                stockTransferViewData.created_by &&
                                                                stockTransferViewData.created_by}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("ApprovedBy")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {stockTransferViewData &&
                                                                stockTransferViewData.approved_by &&
                                                                stockTransferViewData.approved_by}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>

                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("Process")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {stockTransferViewData &&
                                                                stockTransferViewData.process &&
                                                                stockTransferViewData.process}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </ScrollArea>
                                <ScrollArea h={height} scrollbarSize={2} type="never">
                                    <Box>
                                        <Table stickyHeader>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th fz="xs" w={"20"}>
                                                        {t("S/N")}
                                                    </Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={"300"}>
                                                        {t("Name")}
                                                    </Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={"300"}>
                                                        {t("UOM")}
                                                    </Table.Th>

                                                    <Table.Th fz="xs" ta="center" w={"60"}>
                                                        {t("QTY")}
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>{rows}</Table.Tbody>
                                        </Table>
                                    </Box>
                                </ScrollArea>
                            </Box>
                            <Button.Group mb={'1'}>
                                <Button
                                    fullWidth={true}
                                    variant="filled"
                                    leftSection={<IconPrinter size={14}/>}
                                    color="green.5"
                                    onClick={() => {
                                        setPrintA4(true);
                                    }}
                                >
                                    {t("Print")}
                                </Button>
                                <Button
                                    fullWidth={true}
                                    variant="filled"
                                    leftSection={<IconReceipt size={14}/>}
                                    color="red.5"
                                    onClick={() => {
                                        setPrintPos(true);
                                    }}
                                >
                                    {t("Pos")}
                                </Button>
                                {
                                    !stockTransferViewData?.approved_by_id && stockTransferViewData?.is_requisition !== 1 &&

                                    <Button
                                        onClick={() => {
                                            navigate(
                                                `/inventory/purchase/edit/${stockTransferViewData?.id}`
                                            );
                                        }}
                                        fullWidth={true}
                                        variant="filled"
                                        leftSection={<IconEdit size={14}/>}
                                        color="cyan.5"
                                    >
                                        {t("Edit")}
                                    </Button>
                                }

                            </Button.Group>
                        </Box>

                    </Grid.Col>
                    <Grid.Col span={1}>
                        <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
                            <ShortcutTable
                                form=""
                                FormSubmit={"EntityFormSubmit"}
                                Name={"CompanyName"}
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

export default _StockTransferTable;
