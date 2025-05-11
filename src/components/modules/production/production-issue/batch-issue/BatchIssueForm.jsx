import {
    Box,
    Grid,
    Text,
    Tooltip,
    ActionIcon,
    Group,
    Button,
    Flex,
    Input,
    TextInput,
    Select,
} from "@mantine/core";
import ProductionNavigation from "../../common/ProductionNavigation";
import {useForm} from "@mantine/form";
import {
    IconDotsVertical,
    IconRefresh,
    IconShoppingBag,
    IconDeviceFloppy,
    IconSearch,
    IconX,
    IconInfoCircle,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import classes from "../../../../../assets/css/FeaturesCards.module.css";
import tableCss from "../../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {useOutletContext, useParams} from "react-router-dom";
import {useEffect, useState, useMemo} from "react";
import SelectForm from "../../../../form-builders/SelectForm";
import genericClass from "../../../../../assets/css/Generic.module.css";
import BatchIssueSubmitForm from "./BatchIssueSubmitForm";
import {showEntityData} from "../../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../../core-component/showNotificationComponent.jsx";
import {useDispatch} from "react-redux";

export default function BatchIssueForm(props) {
    const { id } = useParams();
    console.log(id)
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 360;

    const {domainConfigData} = props;
    const production_config = domainConfigData?.production_config;
    const isWarehouse = domainConfigData?.production_config?.is_warehouse;
    const isMeasurement = domainConfigData?.isMeasurement;

    const [batchId, setBatchId] = useState("");
    const [warehouseDropdownData, setWarehouseDataDropdown] = useState([]);
    const [warehouseData, setWarehouseData] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [loadCardProducts, setLoadCardProducts] = useState(false);
    const [products, setProducts] = useState([]);

    const [productionsRecipeItems, setProductionsRecipeItems] = useState([]);
    const [productionsIssueData, setProductionsIssueData] = useState({});


    const form = useForm({
        initialValues: {},
    });

    // batch issue data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // setFormLoad(true);
                const result = await dispatch(showEntityData("production/issue/" + id)).unwrap();
                // console.log(result.data.data.issue_items)
                if (result.data.status === 200) {
                    setProductionsIssueData(result?.data?.data)
                    setProductionsRecipeItems(result?.data?.data?.issue_items)
                }
            } catch (error) {
                showNotificationComponent(t('FailedToFetchData'), 'red', 'lightgray', null, false, 1000)
            } finally {
                // setFormLoad(false);
            }
        };

        fetchData();
    }, [dispatch, id]);

    console.log(productionsIssueData,productionsRecipeItems)

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        const transformedWarehouses = userData?.user_warehouse.map((warehouse) => ({
            label: `${warehouse.warehouse_name} [${warehouse.warehouse_location}]`,
            value: String(warehouse.id),
        }));
        setWarehouseDataDropdown(transformedWarehouses);
        // Set data for the first warehouse (if available)
        if (transformedWarehouses?.length > 0) {
            setWarehouseData(userData.user_warehouse[0].id);
        }
    }, []);

    useEffect(() => {
        const storedProducts = localStorage.getItem("user");
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        if (!localProducts?.production_item) {
            setProducts([]);
            return;
        }

        let filteredProducts = [];

        if (warehouseData) {
            filteredProducts = localProducts.production_item.filter(
                product => product.user_warehouse_id === Number(warehouseData)
            );
        } else {
            const firstWarehouseId = localProducts?.user_warehouse?.[0]?.id;
            filteredProducts = localProducts.production_item.filter(
                product => product.user_warehouse_id === firstWarehouseId
            );
        }

        if (searchValue) {
            const searchValueLower = searchValue.toLowerCase();

            filteredProducts = filteredProducts.filter(product =>
                product.item_name?.toString().toLowerCase().includes(searchValueLower) ||
                product.uom?.toString().toLowerCase().includes(searchValueLower) ||
                product.closing_quantity?.toString().toLowerCase().includes(searchValueLower)
            );
        }

        setProducts(filteredProducts);
    }, [searchValue, warehouseData]);

    // adding product from table
    const [productQuantities, setProductQuantities] = useState({});

    // Filtered products for table display (useMemo for performance)
    const filteredTableProducts = useMemo(() => {
        if (!searchValue) return products;
        const lower = searchValue.toLowerCase();
        return products.filter((product) =>
            product.display_name?.toLowerCase().includes(lower)
        );
    }, [products, searchValue]);
    const [measurement, setMeasurement] = useState({});

    useEffect(() => {
        if (batchId) {
            const fetchData = async () => {
                try {
                    const result = await dispatch(showEntityData("production/batch/recipe/" + batchId)).unwrap();
                    if (result.data.status === 200) {
                        setProductionsRecipeItems(result.data.data);
                    }
                } catch (error) {
                    console.log(error)
                    showNotificationComponent(t('FailedToFetchData'), 'red', 'lightgray', null, false, 1000)
                }
            };

            fetchData();
        }
    }, [batchId]);
    return (
        <>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={1}>
                        <ProductionNavigation module={"production-issue"} type={""}/>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <form
                            onSubmit={form.onSubmit(() => {
                                const productsToAdd = filteredTableProducts.filter(
                                    (data) =>
                                        productQuantities[data.id] &&
                                        Number(productQuantities[data.id]) > 0
                                );

                                if (productsToAdd.length === 0) {
                                    showNotificationComponent(t("WeNotifyYouThat"), 'red')
                                    return;
                                }

                                // Update state-based product list
                                setProductionsRecipeItems((prevItems) => {
                                    const updatedItems = [...prevItems];

                                    productsToAdd.forEach((data) => {
                                        const quantity = Number(productQuantities[data.id]);

                                        const productToAdd = {
                                            id: data.id,
                                            product_id: data.id,
                                            display_name: data.item_name,
                                            quantity: Number(quantity),
                                            unit_name: data.uom,
                                            purchase_price: data.purchase_price,
                                            sales_price: data.sales_price,
                                            stock_quantity: data.stock_quantity,
                                            // type: 'general_issue',
                                        };

                                        const existingIndex = updatedItems.findIndex(
                                            (item) => String(item.product_id) === String(productToAdd.product_id)
                                        );

                                        if (existingIndex !== -1) {
                                            updatedItems[existingIndex] = {
                                                ...updatedItems[existingIndex],
                                                ...productToAdd,
                                            };
                                        } else {
                                            updatedItems.push(productToAdd);
                                        }
                                    });

                                    return updatedItems;
                                });
                                setProductQuantities({})
                                showNotificationComponent(t("ProductAddedSuccessfully"), 'green')
                            })}
                        >
                            <Box bg={"white"} p={"md"} pb="0" className={"borderRadiusAll"}>
                                <Box>
                                    <Box mb={"xs"}>
                                        <Grid columns={12} gutter={{base: 2}}>
                                            <Grid.Col span={7}>
                                                <Text fz="md" fw={500} className={classes.cardTitle}>
                                                    {t("BatchProdcutionIssue")}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={5} align="center">
                                                <Group justify="flex-end" align="center" gap={4}>
                                                    <Tooltip
                                                        multiline
                                                        bg={"#905923"}
                                                        position="top"
                                                        withArrow
                                                        ta={"center"}
                                                        transitionProps={{duration: 200}}
                                                        label={t("Settings")}
                                                    >
                                                        <ActionIcon
                                                            radius={"xl"}
                                                            variant="transparent"
                                                            size={"md"}
                                                            color="gray"
                                                            mt={"1"}
                                                            aria-label="Settings"
                                                            onClick={() => {
                                                                setSettingDrawer(true);
                                                            }}
                                                        >
                                                            <IconDotsVertical
                                                                style={{width: "100%", height: "70%"}}
                                                                stroke={1.5}
                                                            />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Group>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box
                                        pl={`8`}
                                        pr={8}
                                        mb={"xs"}
                                        className={"boxBackground borderRadiusAll"}
                                    >
                                        <Box mt={"8"}></Box>
                                        {production_config?.is_warehouse == 1 && (
                                            <Box mt={"4"}>
                                                <SelectForm
                                                    tooltip={t("Warehouse")}
                                                    label=""
                                                    placeholder={t("Warehouse")}
                                                    required={false}
                                                    nextField={"category_id"}
                                                    name={"warehouse_id"}
                                                    form={form}
                                                    dropdownValue={warehouseDropdownData}
                                                    id={"warehouse_id"}
                                                    mt={1}
                                                    searchable={true}
                                                    value={String(warehouseData)}
                                                    changeValue={setWarehouseData}
                                                />
                                            </Box>
                                        )}
                                        <Box mt={"xs"}>
                                            <DataTable
                                                classNames={{
                                                    root: tableCss.root,
                                                    table: tableCss.table,
                                                    header: tableCss.header,
                                                    footer: tableCss.footer,
                                                    pagination: tableCss.pagination,
                                                }}
                                                records={products}
                                                columns={[
                                                    {
                                                        accessor: "item_name",
                                                        title: t("Product"),
                                                        render: (data, index) => (
                                                            <Text fz={11} fw={400}>
                                                                {index + 1}. {data.item_name}
                                                            </Text>
                                                        ),
                                                    },
                                                    {
                                                        accessor: "closing_quantity",
                                                        width: 300,
                                                        title: (
                                                            <Group
                                                                justify={"flex-end"}
                                                                spacing="xs"
                                                                noWrap
                                                                pl={"sm"}
                                                                ml={"sm"}
                                                            >
                                                                <Box pl={"4"}>{t("")}</Box>
                                                                <ActionIcon
                                                                    mr={"sm"}
                                                                    radius="xl"
                                                                    variant="transparent"
                                                                    color="grey"
                                                                    size="xs"
                                                                    onClick={() => {
                                                                    }}
                                                                >
                                                                    <IconRefresh
                                                                        style={{width: "100%", height: "100%"}}
                                                                        stroke={1.5}
                                                                    />
                                                                </ActionIcon>
                                                            </Group>
                                                        ),
                                                        textAlign: "right",
                                                        render: (data) => (
                                                            <Group
                                                                wrap="nowrap"
                                                                w="100%"
                                                                gap={0}
                                                                justify="flex-end"
                                                                align="center"
                                                                mx="auto"
                                                            >
                                                                <Button
                                                                    size="compact-xs"
                                                                    color={"#f8eedf"}
                                                                    radius={0}
                                                                    w="80"
                                                                    styles={{
                                                                        root: {
                                                                            height: "26px",
                                                                            borderRadius: 0,
                                                                            borderTopColor: "#905923",
                                                                            borderBottomColor: "#905923",
                                                                            borderRightColor: "#905923",
                                                                            borderLeftColor: "#905923",
                                                                            borderTopLeftRadius:
                                                                                "var(--mantine-radius-sm)",
                                                                            borderBottomLeftRadius:
                                                                                "var(--mantine-radius-sm)",
                                                                        },
                                                                    }}
                                                                >
                                                                    <Text fz={9} fw={400} c={"black"}>
                                                                        {data.closing_quantity}
                                                                    </Text>
                                                                </Button>
                                                                {isMeasurement === 1 ? (
                                                                    <Select
                                                                        size="xs"
                                                                        w={100}
                                                                        label=""
                                                                        radius={0}
                                                                        placeholder={t("Warehouse")}
                                                                        required={false}
                                                                        styles={{
                                                                            input: {
                                                                                minHeight: 26,
                                                                                height: 26,
                                                                                paddingTop: 2,
                                                                                paddingBottom: 2,
                                                                                fontSize: 11,
                                                                            },
                                                                            rightSection: {height: 24},
                                                                        }}
                                                                        name="warehouse_id"
                                                                        data={[
                                                                            {value: "1", label: "Kg"},
                                                                            {value: "2", label: "Ltr"},
                                                                            {value: "3", label: "Pcs"},
                                                                        ]}
                                                                        id="warehouse_id"
                                                                        mt={1}
                                                                        searchable
                                                                        value={measurement}
                                                                        onChange={setMeasurement}
                                                                    />
                                                                ) : (
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
                                                                                borderRightColor: "#905923",
                                                                            },
                                                                        }}
                                                                        onClick={() => {
                                                                        }}
                                                                    >
                                                                        <Text fz={9} fw={400} c={"black"}>
                                                                            {data.uom}
                                                                        </Text>
                                                                    </Button>
                                                                )}
                                                                <Input
                                                                    styles={{
                                                                        input: {
                                                                            fontSize: "var(--mantine-font-size-xs)",
                                                                            fontWeight: 300,
                                                                            lineHeight: 2,
                                                                            textAlign: "center",
                                                                            borderRadius: 0,
                                                                            borderTopColor: "#905923",
                                                                            borderBottomColor: "#905923",
                                                                        },
                                                                        placeholder: {
                                                                            fontSize: "var(--mantine-font-size-xs)",
                                                                            fontWeight: 300,
                                                                        },
                                                                    }}
                                                                    size="xxs"
                                                                    w="80"
                                                                    type={"number"}
                                                                    tooltip={""}
                                                                    label={""}
                                                                    value={productQuantities[data.id] || ""}
                                                                    onChange={(e) => {
                                                                        const value = e.currentTarget.value;
                                                                        setProductQuantities((prev) => ({
                                                                            ...prev,
                                                                            [data.id]: value,
                                                                        }));
                                                                    }}
                                                                    required={false}
                                                                    nextField={"credit_limit"}
                                                                    name={"quantity"}
                                                                    id={"quantity"}
                                                                />
                                                                <Button
                                                                    size="compact-xs"
                                                                    className={genericClass.invoiceAdd}
                                                                    radius={0}
                                                                    w="30"
                                                                    styles={{
                                                                        root: {
                                                                            height: "26px",
                                                                            borderRadius: 0,
                                                                            borderTopRightRadius:
                                                                                "var(--mantine-radius-sm)",
                                                                            borderBottomRightRadius:
                                                                                "var(--mantine-radius-sm)",
                                                                        },
                                                                    }}

                                                                    onClick={() => {
                                                                        const quantity = productQuantities[data.id];

                                                                        if (quantity && Number(quantity) > 0) {
                                                                            const productToAdd = {
                                                                                id: data.id,
                                                                                product_id: data.id,
                                                                                display_name: data.item_name,
                                                                                quantity: Number(quantity),
                                                                                unit_name: data.uom,
                                                                                purchase_price: data.purchase_price,
                                                                                sales_price: data.sales_price,
                                                                                stock_quantity: data.stock_quantity,
                                                                                type: 'general_issue',
                                                                            };

                                                                            setProductionsRecipeItems(prevItems => {
                                                                                const existingIndex = prevItems.findIndex(
                                                                                    item => String(item.product_id) === String(productToAdd.product_id)
                                                                                );

                                                                                if (existingIndex !== -1) {
                                                                                    // Replace the entire product object with updated fields
                                                                                    const updatedItems = [...prevItems];
                                                                                    updatedItems[existingIndex] = {
                                                                                        ...updatedItems[existingIndex],
                                                                                        ...productToAdd, // update all values (including quantity)
                                                                                    };
                                                                                    return updatedItems;
                                                                                } else {
                                                                                    // Add new item
                                                                                    return [...prevItems, productToAdd];
                                                                                }
                                                                            });
                                                                            setProductQuantities({})
                                                                        } else {
                                                                            showNotificationComponent(t('InvalidQuantity'), 'red', 'lightgray', null, false, 1000)
                                                                        }
                                                                    }}


                                                                >
                                                                    <Flex direction={`column`} gap={0}>
                                                                        <IconShoppingBag size={12}/>
                                                                    </Flex>
                                                                </Button>
                                                            </Group>
                                                        ),
                                                    },
                                                ]}
                                                loaderSize="xs"
                                                loaderColor="grape"
                                                height={isWarehouse ? height + 90 : height + 135}
                                            />
                                        </Box>

                                        <Box
                                            p={"xs"}
                                            mt={"8"}
                                            className={genericClass.genericHighlightedBox}
                                            ml={"-xs"}
                                            mr={-8}
                                        >
                                            <Grid gutter={{base: 6}}>
                                                <Grid.Col span={12}>
                                                    <Box>
                                                        <Tooltip
                                                            label={t("EnterSearchAnyKeyword")}
                                                            px={16}
                                                            py={2}
                                                            position="top-end"
                                                            color="red"
                                                            withArrow
                                                            offset={2}
                                                            zIndex={100}
                                                            transitionProps={{
                                                                transition: "pop-bottom-left",
                                                                duration: 1000,
                                                            }}
                                                        >
                                                            <TextInput
                                                                leftSection={
                                                                    <IconSearch size={16} opacity={0.5}/>
                                                                }
                                                                size="sm"
                                                                placeholder={t("ChooseProduct")}
                                                                onChange={(e) => {
                                                                    setSearchValue(e.target.value);
                                                                }}
                                                                value={searchValue}
                                                                id={"SearchKeyword"}
                                                                rightSection={
                                                                    searchValue ? (
                                                                        <Tooltip
                                                                            label={t("Close")}
                                                                            withArrow
                                                                            bg={`red.5`}
                                                                        >
                                                                            <IconX
                                                                                color={`red`}
                                                                                size={16}
                                                                                opacity={0.5}
                                                                                onClick={() => {
                                                                                    setSearchValue("");
                                                                                }}
                                                                            />
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <Tooltip
                                                                            label={t("FieldIsRequired")}
                                                                            withArrow
                                                                            position={"bottom"}
                                                                            c={"red"}
                                                                            bg={`red.1`}
                                                                        >
                                                                            <IconInfoCircle size={16} opacity={0.5}/>
                                                                        </Tooltip>
                                                                    )
                                                                }
                                                            />
                                                        </Tooltip>
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box mb="xs">
                                    <Grid
                                        className={genericClass.genericBackground}
                                        columns={12}
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Grid.Col span={6}>
                                            <Box pl={"xs"}>
                                                <ActionIcon
                                                    variant="transparent"
                                                    size={"lg"}
                                                    color="grey.6"
                                                    mt={"1"}
                                                    onClick={() => {
                                                    }}
                                                >
                                                    <IconRefresh
                                                        style={{width: "100%", height: "70%"}}
                                                        stroke={1.5}
                                                    />
                                                </ActionIcon>
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Box pr={"xs"}>
                                                <Button
                                                    size="sm"
                                                    className={genericClass.invoiceAdd}
                                                    type="submit"
                                                    mt={0}
                                                    mr={"xs"}
                                                    w={"100%"}
                                                    leftSection={<IconDeviceFloppy size={16}/>}
                                                >
                                                    <Flex direction={`column`} gap={0}>
                                                        <Text fz={12} fw={400}>
                                                            {t("AddAll")}
                                                        </Text>
                                                    </Flex>
                                                </Button>
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                        </form>
                    </Grid.Col>
                    <Grid.Col span={15}>
                        <BatchIssueSubmitForm
                            loadCardProducts={loadCardProducts}
                            setLoadCardProducts={setLoadCardProducts}
                            batchId={batchId}
                            setBatchId={setBatchId}
                            productionsRecipeItems={productionsRecipeItems}
                            setProductionsRecipeItems={setProductionsRecipeItems}
                            productionsIssueData={productionsIssueData}
                        />
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}
