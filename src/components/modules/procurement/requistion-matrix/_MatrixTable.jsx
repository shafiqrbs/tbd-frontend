import {
    ActionIcon,
    Box,
    Grid,
    Stack,
    Text,
    TextInput,
    Button,
    Flex, Tooltip, rem, Table, Badge, Menu, LoadingOverlay, ScrollArea,
} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import matrixTable from "./Table.module.css";
import {useDispatch, useSelector} from "react-redux";
import React, {useRef, useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {
    IconX,
    IconDeviceFloppy,
    IconSearch, IconDotsVertical, IconChevronsRight, IconTrashX, IconPrinter, IconReceipt, IconEdit,
} from "@tabler/icons-react";
import {deleteEntityData, getIndexEntityData} from "../../../../store/inventory/crudSlice.js";
import {storeEntityData} from "../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {modals} from "@mantine/modals";
import RequisitionNavigation from "../common/RequisitionNavigation";
import {useHotkeys} from "@mantine/hooks";
import tableCss from "../../../../assets/css/Table.module.css";
import _ShortcutTable from "../../shortcut/_ShortcutTable.jsx";
import {PrintNormal} from "../requisition-print/PrintNormal.jsx";
import {InvoiceBatchPrintPos} from "../../inventory/invoice-batch/invoice-batch-print/InvoiceBatchPrintPos.jsx";
import __RequisitionMatrixSearch from "./__RequisitionMatrixSearch.jsx";

export default function _MatrixTable(props) {
    const printRef = useRef();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 106;
    const height = mainAreaHeight - 320;

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [printA4, setPrintA4] = useState(false);
    const [printPos, setPrintPos] = useState(false);
    const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState("");
    const [indexData, setIndexData] = useState([])
    const [fetching, setFetching] = useState(true)
    const [requisitionMatrixViewData, setRequisitionMatrixViewData] = useState({});
    const requisitionFilterData = useSelector((state) => state.coreCrudSlice.requisitionFilterData);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const fetchData = async () => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const value = {
            url: 'inventory/requisition/matrix/board',
            param: {
                term: requisitionFilterData.searchKeyword,
                vendor_id: requisitionFilterData.vendor_id,
                start_date: requisitionFilterData.start_date && new Date(requisitionFilterData.start_date).toLocaleDateString("en-CA", options),
                end_date: requisitionFilterData.end_date && new Date(requisitionFilterData.end_date).toLocaleDateString("en-CA", options),
                page: page,
                offset: perPage
            }
        }

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

    useEffect(() => {
        fetchData();
    }, [page, fetching]);

    useEffect(() => {
        setSelectedRow(indexData.data && indexData.data[0] && indexData.data[0].invoice)
        setRequisitionMatrixViewData(
            indexData.data && indexData.data[0] && indexData.data[0]
        );
    }, [indexData.data])
    const rows =
        requisitionMatrixViewData &&
        requisitionMatrixViewData?.requisition_matrix &&
        requisitionMatrixViewData?.requisition_matrix.map((element, index) => (
            <Table.Tr key={element.id}>
                <Table.Td fz="xs" width={"20"}>
                    {index + 1}
                </Table.Td>
                <Table.Td ta="left" fz="xs" width={"300"}>
                    {element.customer_name}
                </Table.Td>
                <Table.Td ta="left" fz="xs" width={"300"}>
                    {element.display_name}
                </Table.Td>
                <Table.Td ta="center" fz="xs" width={"60"}>
                    {element.unit_name}
                </Table.Td>
                <Table.Td ta="center" fz="xs" width={"60"}>
                    {element.requested_quantity}
                </Table.Td>
                <Table.Td ta="center" fz="xs" width={"60"}>
                    {element.approved_quantity}
                </Table.Td>
                <Table.Td ta="center" fz="xs" width={"60"}>
                    {element.received_quantity}
                </Table.Td>
                <Table.Td ta="center" fz="xs" width={"60"}>
                    {element.vendor_stock_quantity}
                </Table.Td>
                <Table.Td ta="right" fz="xs" width={"80"}>
                    {element.sub_total}
                </Table.Td>
            </Table.Tr>
        ));

    useHotkeys(
        [
            [
                "alt+n",
                () => {
                    navigate("/procurement/new-requisition");
                },
            ],
        ],
        []
    );

    const handleRequisitionMatrixApprove = (id) => {
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
                handleConfirmRequisitionMatrixApprove(id)
            }, // Separate function for "onConfirm"
        });
    };

    const handleConfirmRequisitionMatrixApprove = async (id) => {
        try {
            const values = {
                expected_date: null,
                config_id: null
            }

            const value = {
                url: 'inventory/requisition/matrix/board/batch-generate/'+id,
                data: values
            }

            const resultAction = await dispatch(storeEntityData(value));

            if (storeEntityData.rejected.match(resultAction)) {
                showNotificationComponent(resultAction.payload.message, 'red', true, 1000, true)
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    setFetching(true)
                    showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
                } else {
                    showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
                }
            }
        } catch (error) {
            showNotificationComponent(t("UpdateFailed"),"red",'',true,1000,true,"lightgray")
        } finally {
            fetchData();
        }
    };


    return (
        <>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={24}>
                        <Box
                            pl={`xs`}
                            pb={"4"}
                            pr={"xs"}
                            pt={"4"}
                            mb={"4"}
                            className={"boxBackground borderRadiusAll"}
                        >
                            <Grid>
                                <Grid.Col>
                                    <Stack>
                                        <__RequisitionMatrixSearch checkList={1} customerId={1} setFetching={setFetching}/>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={1}>
                        <RequisitionNavigation module={'requisition'} />
                    </Grid.Col>
                    <Grid.Col span={14}>
                        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                            <Box className="borderRadiusAll">
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
                                            accessor: "id",
                                            title: t("S/N"),
                                            textAlign: "left",
                                            render: (item) => indexData.data.indexOf(item) + 1,
                                        },
                                        {
                                            accessor: "created_date",
                                            title: t("Created"),
                                        },
                                        {
                                            accessor: "generate_date",
                                            title: t("Generated"),
                                        },
                                        {
                                            accessor: "total",
                                            title: t("Total"),
                                        },
                                        {
                                            accessor: "created_name",
                                            title: t("Name"),
                                        },
                                        {
                                            accessor: "batch",
                                            title: t("Invoice"),
                                            textAlign: "center",
                                            render: (item) => (
                                                <Text
                                                    key={item.id}
                                                    component="a"
                                                    size="sm"
                                                    variant="subtle"
                                                    c="red.4"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setLoading(true);
                                                        setSelectedRow(item.invoice);
                                                        setRequisitionMatrixViewData(item)
                                                    }}
                                                    style={{cursor: "pointer"}}
                                                >
                                                    {item.invoice}
                                                </Text>
                                            ),
                                        },
                                        {
                                            accessor: "process",
                                            title: t("Status"),
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
                                            title: t("Action"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <Box>
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
                                                                variant="outline"
                                                                color='var(--theme-primary-color-6)'
                                                                radius="xl"
                                                                aria-label="Settings"
                                                            >
                                                                <IconDotsVertical
                                                                    style={{width: 12, height: 12}}
                                                                    stroke={1.5}
                                                                />
                                                            </ActionIcon>
                                                        </Menu.Target>

                                                        <Menu.Dropdown>
                                                            {
                                                                data.process === 'Created' &&
                                                                <Menu.Item
                                                                    onClick={() => {
                                                                        navigate(`/procurement/requisition-board/${data.id}`)
                                                                    }}
                                                                    component="a"
                                                                    w={'200'}
                                                                >
                                                                    {t('Edit')}
                                                                </Menu.Item>
                                                            }
                                                            {
                                                                data.process === 'Created' &&
                                                                <>
                                                                    <Menu.Item
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleRequisitionMatrixApprove(data.id)
                                                                        }}
                                                                        color="green"
                                                                        component="a"
                                                                        w={"200"}
                                                                        leftSection={
                                                                            <IconChevronsRight
                                                                                style={{
                                                                                    width: rem(14),
                                                                                    height: rem(14)
                                                                                }}/>
                                                                        }
                                                                    >
                                                                        {t("Approve")}
                                                                    </Menu.Item>
                                                                </>
                                                            }
                                                            {
                                                                data.process === 'New' &&
                                                                <Menu.Item
                                                                    onClick={() => {
                                                                        modals.openConfirmModal({
                                                                            title: (
                                                                                <Text
                                                                                    size="md"> {t("FormConfirmationTitle")}</Text>
                                                                            ),
                                                                            children: (
                                                                                <Text
                                                                                    size="sm"> {t("FormConfirmationMessage")}</Text>
                                                                            ),
                                                                            labels: {
                                                                                confirm: 'Confirm',
                                                                                cancel: 'Cancel'
                                                                            },
                                                                            confirmProps: {color: 'red.6'},
                                                                            onCancel: () => console.log('Cancel'),
                                                                            onConfirm: async () => {
                                                                                {
                                                                                    const result = await dispatch(deleteEntityData('inventory/requisition/' + data.id)).unwrap();
                                                                                    if (result.data.status === 200) {
                                                                                        showNotificationComponent(t('DeleteSuccessfully'), 'teal', null, false, 1000)
                                                                                        setFetching(true)
                                                                                    } else {
                                                                                        showNotificationComponent(t('FailedToUpdateData'), 'red', null, false, 1000)
                                                                                    }
                                                                                }
                                                                            },
                                                                        });
                                                                    }}
                                                                    component="a"
                                                                    w={'200'}
                                                                    mt={'2'}
                                                                    bg={'red.1'}
                                                                    c={'red.6'}
                                                                    rightSection={<IconTrashX
                                                                        style={{width: rem(14), height: rem(14)}}/>}
                                                                >
                                                                    {t('Delete')}
                                                                </Menu.Item>
                                                            }
                                                        </Menu.Dropdown>
                                                    </Menu>
                                                </Box>
                                            ),
                                        },
                                    ]}
                                    fetching={fetching}
                                    totalRecords={indexData.total}
                                    recordsPerPage={perPage}
                                    page={page}
                                    onPageChange={(p) => {
                                        setPage(p);
                                    }}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={tableHeight}
                                    scrollAreaProps={{type: "never"}}
                                    rowBackgroundColor={(item) => {
                                        if (item.invoice === selectedRow) return "#e2c2c263";
                                    }}
                                    rowColor={(item) => {
                                        if (item.invoice === selectedRow) return "red.6";
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box
                            bg={"white"}
                            p={"xs"}
                            className={"borderRadiusAll"}
                            ref={printRef}
                            pos="relative"
                        >
                            {loading && (
                                <LoadingOverlay
                                    visible={loading}
                                    zIndex={1000}
                                    overlayProps={{radius: "sm", blur: 2}}
                                    loaderProps={{color: "red"}}
                                />
                            )}
                            <Box
                                h={"42"}
                                pl={`xs`}
                                mb={4}
                                fz={"sm"}
                                fw={"600"}
                                pr={8}
                                pt={"xs"}
                                className={"boxBackground textColor borderRadiusAll"}
                            >
                                {t("Invoice")}: {requisitionMatrixViewData && requisitionMatrixViewData.invoice}
                            </Box>
                            <Box className={"borderRadiusAll border-top-none"} fz={"sm"}>
                                {/*<ScrollArea h={100} type="never">
                                    <Box
                                        pl={`xs`}
                                        fz={"sm"}
                                        fw={"600"}
                                        pr={"xs"}
                                        pt={"6"}
                                        pb={"xs"}
                                        className={"boxBackground textColor"}
                                    >
                                        <Grid gutter={{base: 4}}>
                                            <Grid.Col span={"6"}>
                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("Customer")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {requisitionMatrixViewData &&
                                                                requisitionMatrixViewData.vendor_name &&
                                                                requisitionMatrixViewData.vendor_name}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("Mobile")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {requisitionMatrixViewData &&
                                                                requisitionMatrixViewData.vendor_mobile &&
                                                                requisitionMatrixViewData.vendor_mobile}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("Address")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {requisitionMatrixViewData &&
                                                                requisitionMatrixViewData.vendor_address &&
                                                                requisitionMatrixViewData.vendor_address}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{base: 4}}>
                                                    <Grid.Col span={6}>
                                                        <Text fz="sm" lh="xs">
                                                            {t("Balance")}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={9}>
                                                        <Text fz="sm" lh="xs">
                                                            {requisitionMatrixViewData && requisitionMatrixViewData.balance
                                                                ? Number(requisitionMatrixViewData.balance).toFixed(2)
                                                                : 0.0}
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
                                                            {requisitionMatrixViewData &&
                                                                requisitionMatrixViewData.created &&
                                                                requisitionMatrixViewData.created}
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
                                                            {requisitionMatrixViewData &&
                                                                requisitionMatrixViewData.createdByUser &&
                                                                requisitionMatrixViewData.createdByUser}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </ScrollArea>
                                <ScrollArea h={height + 31} scrollbarSize={2} type="never">
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
                                                    <Table.Th fz="xs" ta="center" w={"60"}>
                                                        {t("Customer")}
                                                    </Table.Th>
                                                    <Table.Th ta="center" fz="xs" w={"100"}>
                                                        {t("UOM")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"80"}>
                                                        {t("RequestQty")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"100"}>
                                                        {t("ApproveQty")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"100"}>
                                                        {t("ReceiveQty")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"100"}>
                                                        {t("StockQty")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"100"}>
                                                        {t("SubTotal")}
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>{rows}</Table.Tbody>
                                            <Table.Tfoot>
                                                <Table.Tr>
                                                    <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                                                        {t("SubTotal")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"100"}>
                                                        {requisitionMatrixViewData &&
                                                            requisitionMatrixViewData.sub_total &&
                                                            Number(requisitionMatrixViewData.sub_total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                                                        {t("Discount")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"100"}>
                                                        {requisitionMatrixViewData &&
                                                            requisitionMatrixViewData.discount &&
                                                            Number(requisitionMatrixViewData.discount).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                                                        {t("Total")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"100"}>
                                                        {requisitionMatrixViewData &&
                                                            requisitionMatrixViewData.total &&
                                                            Number(requisitionMatrixViewData.total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                                                        {t("Receive")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"100"}>
                                                        {requisitionMatrixViewData &&
                                                            requisitionMatrixViewData.payment &&
                                                            Number(requisitionMatrixViewData.payment).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                                                        {t("Due")}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"100"}>
                                                        {requisitionMatrixViewData &&
                                                            requisitionMatrixViewData.total &&
                                                            (
                                                                Number(requisitionMatrixViewData.total) -
                                                                Number(requisitionMatrixViewData.payment)
                                                            ).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Tfoot>
                                        </Table>
                                    </Box>
                                </ScrollArea>*/}
                            </Box>
                            <Button.Group mb={2}>
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

                                <Button
                                    href={`/procurement/requisition/edit/${requisitionMatrixViewData?.id}`}
                                    component="a"
                                    fullWidth={true}
                                    variant="filled"
                                    leftSection={<IconEdit size={14}/>}
                                    color="cyan.5"
                                    onClick={() => {
                                        setMmSwapEnabled(true);
                                    }}
                                >
                                    {t("Edit")}
                                </Button>
                            </Button.Group>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
                            <_ShortcutTable
                                heightOffset={0}
                                form=""
                                FormSubmit={"EntityFormSubmit"}
                                Name={"CompanyName"}
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            {printA4 && (
                <div style={{display: "none"}}>
                    <PrintNormal
                        requisitionMatrixViewData={requisitionMatrixViewData}
                        setPrintA4={setPrintA4}
                    />
                </div>
            )}
            {printPos && (
                <div style={{display: "none"}}>
                    <InvoiceBatchPrintPos
                        invoiceBatchData={requisitionMatrixViewData}
                        setPrintPos={setPrintPos}
                    />
                </div>
            )}
        </>
    );
}
