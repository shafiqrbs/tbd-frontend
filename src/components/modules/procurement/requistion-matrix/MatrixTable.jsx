import {
    ActionIcon,
    Box,
    Grid,
    Stack,
    Text,
    TextInput,
    Button,
    Flex, Tooltip, rem,
} from "@mantine/core";
import _ShortcutTable from "../../shortcut/_ShortcutTable";
import {DataTable} from "mantine-datatable";
import matrixTable from "./Table.module.css";
import {useDispatch, useSelector} from "react-redux";
import React, {useRef, useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import {
    IconX,
    IconDeviceFloppy,
    IconSearch,
} from "@tabler/icons-react";
import {DateInput} from "@mantine/dates";
import {getIndexEntityData} from "../../../../store/inventory/crudSlice.js";

export default function MatrixTable(props) {
    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 106;
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const leftTableRef = useRef(null);
    const centerTableRef = useRef(null);
    const rightTableRef = useRef(null);

    const dispatch = useDispatch()
    const [fetching, setFetching] = useState(false);
    const [startDateTooltip, setStartDateTooltip] = useState(false);
    const [expectedDate, setExpectedDate] = useState(null)
    const [indexData, setIndexData] = useState([])
    const [customers, setCustomers] = useState([])

    const fetchData = async () => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const value = {
            url: 'inventory/requisition/matrix/board',
            param: {
                expected_date: expectedDate && new Date(expectedDate).toLocaleDateString("en-CA", options),
            }
        }

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.rejected.match(resultAction)) {
                console.error('Error:', resultAction);
            } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                setIndexData(resultAction.payload.data);
                setCustomers(resultAction.payload.customers);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setFetching(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetching]);


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
                            <Grid>
                                <Grid.Col>

                                    <Grid columns={24} justify="flex-start" align="flex-end">
                                        <Grid.Col span={15}>
                                            <Grid columns={24}>

                                                <Grid.Col span={18}>
                                                    <Tooltip
                                                        label={t("ExpectedDate")}
                                                        opened={startDateTooltip}
                                                        px={16}
                                                        py={2}
                                                        position="top-end"
                                                        color="red"
                                                        withArrow
                                                        offset={2}
                                                        zIndex={100}
                                                        transitionProps={{
                                                            transition: "pop-bottom-left",
                                                            duration: 5000,
                                                        }}
                                                    >
                                                        <DateInput
                                                            clearable
                                                            onChange={(e) => {
                                                                setExpectedDate(e)
                                                                e !== ""
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
                                        </Grid.Col>
                                        <Grid.Col span={9}>
                                            <ActionIcon.Group mt={"1"} justify="center">
                                                <ActionIcon
                                                    variant="default"
                                                    c={"red.4"}
                                                    size="lg"
                                                    aria-label="Filter"
                                                    onClick={() => {
                                                        expectedDate
                                                            ? (setFetching(true), setSearchKeywordTooltip(false))
                                                            :
                                                            setTimeout(() => {
                                                                setSearchKeywordTooltip(false);
                                                            }, 1500);
                                                    }}
                                                >
                                                    <Tooltip
                                                        label={t("SearchButton")}
                                                        px={16}
                                                        py={2}
                                                        withArrow
                                                        position={"bottom"}
                                                        c={"red"}
                                                        bg={`red.1`}
                                                        transitionProps={{
                                                            transition: "pop-bottom-left",
                                                            duration: 500,
                                                        }}
                                                    >
                                                        <IconSearch style={{width: rem(30)}} stroke={1.5}/>
                                                    </Tooltip>
                                                </ActionIcon>

                                            </ActionIcon.Group>
                                        </Grid.Col>
                                    </Grid>

                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={23}>
                        <Box bg={"white"} p={"xs"} className="borderRadiusAll">
                            <Box className="borderRadiusAll">
                                <Grid columns={12} gutter={0}>
                                    <Grid.Col span={2}>
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
                                                    title: "Product",
                                                    cellsClassName: matrixTable.idColumnCells,
                                                    width: 100,
                                                },
                                            ]}
                                            records={indexData}
                                            totalRecords={indexData.length}
                                            loaderSize="xs"
                                            loaderColor="grape"
                                            height={tableHeight - 46}
                                            scrollAreaProps={{type: "never"}}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={8}>

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
                                            columns={customers.map((shop) => ({
                                                accessor: shop.toLowerCase().replace(/\s+/g, "_"),
                                                title: shop,
                                                width: 150,
                                                render: (item) => {
                                                    const shopKey = shop
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "_");
                                                    const [editedQuantity, setEditedQuantity] = useState(
                                                        item[shopKey] || 0
                                                    );

                                                    const handleQuantityChange = (e) => {
                                                        const newQuantity = e.currentTarget.value;
                                                        setEditedQuantity(newQuantity);

                                                        const tempCardProducts = localStorage.getItem(
                                                            "temp-sales-products"
                                                        );
                                                        const cardProducts = tempCardProducts
                                                            ? JSON.parse(tempCardProducts)
                                                            : [];

                                                        const updatedProducts = cardProducts.map(
                                                            (product) => {
                                                                if (product.product_id === item.product_id) {
                                                                    return {
                                                                        ...product,
                                                                        [shopKey]: newQuantity,
                                                                        sub_total:
                                                                            newQuantity * (item.sales_price || 0),
                                                                    };
                                                                }
                                                                return product;
                                                            }
                                                        );

                                                        localStorage.setItem(
                                                            "temp-sales-products",
                                                            JSON.stringify(updatedProducts)
                                                        );
                                                    };

                                                    return (
                                                        <TextInput
                                                            type="number"
                                                            size="xs"
                                                            value={editedQuantity}
                                                            onChange={handleQuantityChange}
                                                        />
                                                    );
                                                },
                                            }))}
                                            records={indexData}
                                            totalRecords={indexData.length}
                                            loaderSize="xs"
                                            loaderColor="grape"
                                            height={tableHeight - 46}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={2}>
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
                                                    title: "Total Requested",
                                                },
                                                {
                                                    accessor: "vendor_stock_quantity",
                                                    title: "Stock",
                                                },
                                                {
                                                    accessor: "remaining_quantity",
                                                    title: "Remaining Stock",
                                                },
                                            ]}
                                            records={indexData}
                                            totalRecords={indexData.length}
                                            loaderSize="xs"
                                            loaderColor="grape"
                                            height={tableHeight - 46}
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
                                                        size="xs"
                                                        color={`green.8`}
                                                        type="submit"
                                                        id="EntityFormSubmit"
                                                        leftSection={<IconDeviceFloppy size={16}/>}
                                                    >
                                                        <Flex direction={`column`} gap={0}>
                                                            <Text fz={14} fw={400}>
                                                                {" "}
                                                                {t("Generate")}
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
                    <Grid.Col span={1}>
                        <Box bg={"white"} pt={16} className="borderRadiusAll">
                            <_ShortcutTable heightOffset={0}/>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}
