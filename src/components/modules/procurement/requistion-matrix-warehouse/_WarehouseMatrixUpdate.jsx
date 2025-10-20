import {
    Box,
    Grid,
    Stack,
    Text,
    TextInput,
    Button,
    Flex, Tooltip, Select, Badge
} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import matrixTable from "./Table.module.css";
import {useDispatch} from "react-redux";
import React, {useRef, useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useOutletContext, useParams} from "react-router-dom";
import {
    IconDeviceFloppy, IconInfoCircle,
} from "@tabler/icons-react";
import {DateInput} from "@mantine/dates";
import {getIndexEntityData} from "../../../../store/inventory/crudSlice.js";
import {storeEntityData} from "../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {modals} from "@mantine/modals";
import RequisitionNavigation from "../common/RequisitionNavigation";
import inputCss from "../../../../assets/css/InlineInputField.module.css";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";

export default function _WarehouseMatrixUpdate(props) {
    const {id} = useParams()
    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 140;

    // Load and parse config safely
    let domainConfigData = null;
    try {
        const configRaw = localStorage.getItem('domain-config-data');
        domainConfigData = configRaw ? JSON.parse(configRaw) : null;
    } catch (e) {
        console.error('Failed to parse domain-config-data from localStorage', e);
    }
    const isWarehouse = domainConfigData?.inventory_config.sku_warehouse

    const warehouseDropdown = getCoreWarehouseDropdownData();


    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [generateButton, setGenerateButton] = useState(false);
    const leftTableRef = useRef(null);
    const centerTableRef = useRef(null);
    const rightTableRef = useRef(null);

    const dispatch = useDispatch()
    const [fetching, setFetching] = useState(true);
    const [startDateTooltip, setStartDateTooltip] = useState(false);
    const [expectedDate, setExpectedDate] = useState(null)
    const [indexData, setIndexData] = useState([])
    const [customers, setCustomers] = useState([])
    const [boardId, setBoardId] = useState(null)
    const [boardData, setBoardData] = useState(null)
    const fetchData = async () => {
        setGenerateButton(false)

        const value = {
            url: 'inventory/requisition/matrix/board/warehouse/' + id,
            param: {}
        }

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.rejected.match(resultAction)) {
                console.error('Error:', resultAction);
            } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                setExpectedDate(new Date(resultAction?.payload?.board?.generate_date))
                setBoardId(resultAction?.payload?.board?.id)
                setIndexData(resultAction.payload.data);
                setBoardData(resultAction.payload.board);
                setCustomers(resultAction.payload.customers);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setTimeout(() => {
                setFetching(false)
            }, 700)
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetching, id]);


    useEffect(() => {
        const syncScroll = (sourceRef, targetRefs) => {
            const handleScroll = () => {
                targetRefs.forEach((ref) => {
                    if (ref.current) {
                        ref.current.scrollTop = sourceRef.current.scrollTop;
                    }
                });
            };

            if (sourceRef.current) {
                sourceRef.current.addEventListener("scroll", handleScroll);
            }

            return () => {
                if (sourceRef.current) {
                    sourceRef.current.removeEventListener("scroll", handleScroll);
                }
            };
        };

        const cleanupLeft = syncScroll(leftTableRef, [centerTableRef, rightTableRef]);
        const cleanupCenter = syncScroll(centerTableRef, [leftTableRef, rightTableRef]);
        const cleanupRight = syncScroll(rightTableRef, [leftTableRef, centerTableRef]);

        return () => {
            cleanupLeft();
            cleanupCenter();
            cleanupRight();
        };
    }, []);

    const QuantityInput = ({item, shopKey}) => {
        const [editedQuantity, setEditedQuantity] = useState(item[shopKey] || 0);
        const [branchRequestQuantity, setBranchRequestQuantity] = useState(item[shopKey + "_requested_quantity"] || null);

        (!generateButton && item.process === 'Confirmed') && setGenerateButton(true)

        const handleQuantityChange = (e) => {
            const newQuantity = e.currentTarget.value;
            setEditedQuantity(newQuantity);
        };

        const handleQuantityUpdateDB = async () => {
            const indexKey = shopKey + "_id";
            const values = {
                quantity: editedQuantity,
                id: item[indexKey],
                type: 'quantity'
            };
            if (editedQuantity === item[shopKey]) {
                return
            }

            const value = {
                url: 'inventory/requisition/matrix/board/warehouse/quantity-update',
                data: values
            }

            const resultAction = await dispatch(storeEntityData(value));

            if (storeEntityData.rejected.match(resultAction)) {
                showNotificationComponent(resultAction.payload.message, 'red', true, 1000, true)
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    setFetching(true)
                } else {
                    showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
                }
            }
        };

        return (
            <>
                {(item[shopKey] >= 0 && branchRequestQuantity > 1) ? (
                    <TextInput
                        disabled={generateButton}
                        type="number"
                        classNames={inputCss}
                        size="xs"
                        value={editedQuantity}
                        onChange={handleQuantityChange}
                        onBlur={handleQuantityUpdateDB}
                        rightSection={<>{branchRequestQuantity}</>}
                    />
                ) : (
                    <Text/>
                )}

            </>
        );
    };

    const handleGenerateMatrixBatch = async () => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };

        const values = {
            expected_date: new Date(expectedDate).toLocaleDateString("en-CA", options),
            config_id: props.configId
        }

        const value = {
            url: 'inventory/requisition/matrix/board/warehouse/batch-generate/' + boardId,
            data: values
        }

        const resultAction = await dispatch(storeEntityData(value));

        if (storeEntityData.rejected.match(resultAction)) {
            showNotificationComponent(resultAction.payload.message, 'red', true, 1000, true)
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            if (resultAction.payload.data.status === 200) {
                setFetching(true)
                const processToProductionItems = resultAction?.payload?.data?.pro_item_process || 0;
                const message = resultAction.payload.data.message;

                showNotificationComponent(message, 'teal', true, 1000, true);
                showNotificationComponent(
                    `Total ${processToProductionItems} production items processed`,
                    processToProductionItems !== 0 ? 'teal' : 'red',
                    true,
                    1000,
                    true
                );
            } else {
                showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
            }
        }
    }
    const icon = <IconInfoCircle/>;

    return (
        <>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={24}>
                        <Box
                            pl={"xs"}
                            pb={4}
                            pr={"xs"}
                            pt={4}
                            mb={4}
                            className={"boxBackground borderRadiusAll"}
                        >
                            <Grid columns={24} gutter={{base: 8}}>
                                <Grid.Col span={1}></Grid.Col>
                                <Grid.Col span={23}>
                                    <Tooltip
                                        label={t("ExpectedDate")}
                                        opened={startDateTooltip}
                                        px={16}
                                        py={2}
                                        position="top-end"
                                        color='var(--theme-primary-color-6)'
                                        withArrow
                                        offset={2}
                                        zIndex={100}
                                        transitionProps={{
                                            transition: "pop-bottom-left",
                                            duration: 5000,
                                        }}
                                    >
                                        <DateInput
                                            disabled={fetching || expectedDate}
                                            clearable
                                            maxDate={new Date()}
                                            onChange={(e) => {
                                                setExpectedDate(e)
                                                e != ""
                                                    ? setStartDateTooltip(false)
                                                    : (setStartDateTooltip(true),
                                                        setTimeout(() => {
                                                            setStartDateTooltip(false);
                                                        }, 1000));
                                            }}
                                            value={expectedDate}
                                            placeholder={t("ExpectedDate")}
                                        />
                                    </Tooltip>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={1}>
                        <RequisitionNavigation module={'requisition'}/>
                    </Grid.Col>
                    <Grid.Col span={23}>
                        <Box bg={"white"} p={"xs"} className="borderRadiusAll">
                            <Box className="borderRadiusAll">
                                {boardData?.child_domain_name &&
                                    <Badge color="red" size="lg" radius="lg">{boardData?.child_domain_name}</Badge>
                                }

                                <Grid columns={24} gutter={0}>
                                    <Grid.Col span={4}>
                                        <DataTable
                                            scrollViewportRef={leftTableRef}
                                            classNames={{
                                                root: matrixTable.root,
                                                table: matrixTable.table,
                                                header: matrixTable.header,
                                                footer: matrixTable.footer,
                                                pagination: matrixTable.pagination,
                                            }}
                                            columns={[
                                                {
                                                    accessor: "product",
                                                    title: t("Product"),
                                                    cellsClassName: matrixTable.idColumnCells,
                                                    width: 100,
                                                },
                                            ]}
                                            records={indexData}
                                            totalRecords={indexData.length}
                                            loaderSize="xs"
                                            fetching={fetching}
                                            loaderColor="grape"
                                            height={tableHeight}
                                            scrollAreaProps={{type: "never"}}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={14}>
                                        <DataTable
                                            scrollAreaProps={{type: "hover", scrollHideDelay: 1}}
                                            scrollViewportRef={centerTableRef}
                                            classNames={{
                                                root: matrixTable.root,
                                                table: matrixTable.table,
                                                header: matrixTable.header,
                                                footer: matrixTable.footer,
                                                pagination: matrixTable.pagination,
                                            }}
                                            columns={
                                                customers.length > 0 ? customers.map((shop) => ({
                                                        accessor: shop.toLowerCase().replace(/\s+/g, "_"),
                                                        title: shop ? shop : t("BranchName"),
                                                        width: 150,
                                                        render: (item) => {
                                                            const shopKey = shop.toLowerCase().replace(/\s+/g, "_");
                                                            return <QuantityInput item={item} shopKey={shopKey}/>;
                                                        },
                                                    })) :
                                                    [

                                                        {
                                                            accessor: "",
                                                            title: t("BranchName"),
                                                        }
                                                    ]
                                            }

                                            records={indexData}
                                            totalRecords={indexData.length}
                                            fetching={fetching}
                                            loaderSize="xs"
                                            loaderColor="grape"
                                            height={tableHeight}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <DataTable
                                            scrollAreaProps={{type: "never"}}
                                            scrollViewportRef={rightTableRef}
                                            classNames={{
                                                root: matrixTable.root,
                                                table: matrixTable.table,
                                                header: matrixTable.header,
                                                footer: matrixTable.footer,
                                                pagination: matrixTable.pagination,
                                            }}
                                            columns={[

                                                {
                                                    accessor: "total_request_quantity",
                                                    title: t("Requested"),
                                                },
                                                {
                                                    accessor: "total_approved_quantity",
                                                    title: t("Approved"),
                                                },
                                                isWarehouse && {
                                                    accessor: "warehouse_id",
                                                    title: t("Warehouse"),
                                                    render: (item) => {
                                                        const [currentWarehouse, setCurrentWarehouse] = useState(String(item.warehouse_id || ""))
                                                        return (
                                                            <Select
                                                                disabled={item.is_production_item == 1}
                                                                size="xs"
                                                                placeholder="Select"
                                                                value={currentWarehouse}
                                                                data={warehouseDropdown}
                                                                onChange={async (newValue) => {
                                                                    setCurrentWarehouse(String(newValue))

                                                                    const values = {
                                                                        warehouse_id: newValue,
                                                                        stock_item_id: item.vendor_stock_item_id,
                                                                        id: item.id,
                                                                        type: 'warehouse'
                                                                    };

                                                                    const value = {
                                                                        url: 'inventory/requisition/matrix/board/warehouse/quantity-update',
                                                                        data: values
                                                                    }

                                                                    const resultAction = await dispatch(storeEntityData(value));

                                                                    if (storeEntityData.rejected.match(resultAction)) {
                                                                        showNotificationComponent(resultAction.payload.message, 'red', true, 1000, true)
                                                                    } else if (storeEntityData.fulfilled.match(resultAction)) {
                                                                        if (resultAction.payload.data.status === 200) {
                                                                            setFetching(true)
                                                                        } else {
                                                                            showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        );
                                                    },
                                                },
                                                {
                                                    accessor: "vendor_stock_quantity",
                                                    title: t("Stock"),
                                                },
                                                {
                                                    accessor: "remaining_quantity",
                                                    title: t("Remaining"),
                                                },
                                            ].filter(Boolean)
                                            }
                                            records={indexData}
                                            totalRecords={indexData.length}
                                            loaderSize="xs"
                                            loaderColor="grape"
                                            fetching={fetching}
                                            height={tableHeight}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box
                                mt={4}
                                pl={`xs`}
                                pr={8}
                                pt={"6"}
                                pb={"6"}
                                mb={"4"}
                                className={"boxBackground borderRadiusAll"}
                            >
                                <Grid>
                                    <Grid.Col span={6}></Grid.Col>
                                    <Grid.Col span={6}>
                                        <Stack right align="flex-end">
                                            <>
                                                {!saveCreateLoading && isOnline && (
                                                    <Button
                                                        disabled={generateButton}
                                                        onClick={async () => {
                                                            modals.openConfirmModal({
                                                                title: (<Text
                                                                    size="md"> {t("SuretoProcessMatrixData")}</Text>),
                                                                children: (
                                                                    <Text
                                                                        size="sm"> {t("FormConfirmationMessage")}</Text>),
                                                                labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                                onCancel: () => console.log('Cancel'),
                                                                onConfirm: () => {
                                                                    handleGenerateMatrixBatch()
                                                                },
                                                            });
                                                        }}
                                                        size="xs"
                                                        color={`green.8`}
                                                        type="submit"
                                                        id="EntityFormSubmit"
                                                        leftSection={<IconDeviceFloppy size={16}/>}
                                                    >
                                                        <Flex direction={`column`} gap={0}>
                                                            <Text fz={14} fw={400}>
                                                                {" "}
                                                                {t("Approved")}
                                                            </Text>
                                                        </Flex>
                                                    </Button>
                                                )}
                                            </>
                                        </Stack>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}
