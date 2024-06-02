import React, { useEffect, useState } from "react";
import { json, useNavigate, useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex, Tabs, Center, Switch, ActionIcon, TextInput, NativeSelect, Fieldset,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Select, Table, Popover, Stack
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconInfoCircle, IconPercentage, IconMathSymbols, IconPlusMinus, IconCoinMonero, IconSortAscendingNumbers,
    IconPlus, IconUserCircle, IconRefreshDot, IconEdit, IconTrash, IconSum, IconX, IconBarcode
} from "@tabler/icons-react";
import { getHotkeyHandler, useDisclosure, useHotkeys, useToggle } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications, showNotification } from "@mantine/notifications";


import { DataTable } from "mantine-datatable";
import KeywordSearch from "../filter/KeywordSearch";
import ShortcutTable from "../shortcut/ShortcutTable";


function SampleModalTable(props) {
    const { currancySymbol, allowZeroPercentage } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 176; //TabList height 104
    const tableHeight = mainAreaHeight - 128; //TabList height 104
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const icon = <IconInfoCircle />;
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);


    const [searchValue, setSearchValue] = useState('');
    const [productDropdown, setProductDropdown] = useState([]);

    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)

    let salesSubTotalAmount = 0




    // useEffect(() => {
    //     if (searchValue.length > 0) {
    //         const storedProducts = localStorage.getItem('user-products');
    //         const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

    //         const lowerCaseSearchTerm = searchValue.toLowerCase();
    //         const fieldsToSearch = ['product_name'];

    //         const productFilterData = localProducts.filter(product =>
    //             fieldsToSearch.some(field =>
    //                 product[field] && String(product[field]).toLowerCase().includes(lowerCaseSearchTerm)
    //             )
    //         );

    //         const formattedProductData = productFilterData.map(type => ({
    //             label: type.product_name, value: String(type.id)
    //         }));

    //         setProductDropdown(formattedProductData);
    //     } else {
    //         setProductDropdown([]);
    //     }
    // }, [searchValue]);



    // function handleAddProductByProductId(values, myCardProducts, localProducts) {
    //     const addProducts = localProducts.reduce((acc, product) => {
    //         if (product.id === Number(values.product_id)) {
    //             acc.push({
    //                 product_id: product.id,
    //                 display_name: product.display_name,
    //                 sales_price: values.sales_price,
    //                 mrp: values.mrp,
    //                 percent: values.percent,
    //                 stock: product.quantity,
    //                 quantity: values.quantity,
    //                 unit_name: product.unit_name,
    //                 sub_total: selectProductDetails.sub_total,
    //             });
    //         }
    //         return acc;
    //     }, myCardProducts);
    //
    //     updateLocalStorageAndResetForm(addProducts);
    // }

    // function handleAddProductByBarcode(values, myCardProducts, localProducts) {
    //     const barcodeExists = localProducts.some(product => product.barcode === values.barcode);
    //
    //     if (barcodeExists) {
    //         const addProducts = localProducts.reduce((acc, product) => {
    //             if (String(product.barcode) === String(values.barcode)) {
    //                 acc.push(createProductFromValues(product));
    //             }
    //             return acc;
    //         }, myCardProducts);
    //
    //         updateLocalStorageAndResetForm(addProducts);
    //     } else {
    //         notifications.show({
    //             loading: true,
    //             color: 'red',
    //             title: 'Product not found with this barcode',
    //             message: 'Data will be loaded in 3 seconds, you cannot close this yet',
    //             autoClose: 1000,
    //             withCloseButton: true,
    //         });
    //     }
    // }

    // function updateLocalStorageAndResetForm(addProducts) {
    //     localStorage.setItem('temp-sales-products', JSON.stringify(addProducts));
    //     setSearchValue('');
    //     form.reset();
    //     setLoadCardProducts(true);
    // }

    // function createProductFromValues(product) {
    //     return {
    //         product_id: product.id,
    //         display_name: product.display_name,
    //         sales_price: product.sales_price,
    //         mrp: product.sales_price,
    //         percent: '',
    //         stock: product.quantity,
    //         quantity: 1,
    //         unit_name: product.unit_name,
    //         sub_total: product.sales_price,
    //     };
    // }



    const form = useForm({
        initialValues: {
            product_id: '', mrp: '', sales_price: '', percent: '', barcode: '', sub_total: '', quantity: ''
        },
        validate: {
            product_id: (value, values) => {
                const isDigitsOnly = /^\d+$/.test(value);
                if (!isDigitsOnly && values.product_id) {
                    return true;
                }
                return null;
            },
            quantity: (value, values) => {
                if (values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            percent: (value, values) => {
                if (value && values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            sales_price: (value, values) => {
                if (values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            }
        }
    });


    // const [selectProductDetails, setSelectProductDetails] = useState('')
    //
    // useEffect(() => {
    //     const storedProducts = localStorage.getItem('user-products');
    //     const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
    //
    //     const filteredProducts = localProducts.filter(product => product.id === Number(form.values.product_id));
    //
    //     if (filteredProducts.length > 0) {
    //         const selectedProduct = filteredProducts[0];
    //
    //         setSelectProductDetails(selectedProduct);
    //
    //         form.setFieldValue('mrp', selectedProduct.sales_price);
    //         form.setFieldValue('sales_price', selectedProduct.sales_price);
    //     } else {
    //         setSelectProductDetails(null);
    //         form.setFieldValue('mrp', '');
    //         form.setFieldValue('sales_price', '');
    //     }
    // }, [form.values.product_id]);
    //
    //
    // useEffect(() => {
    //     const quantity = Number(form.values.quantity);
    //     const salesPrice = Number(form.values.sales_price);
    //
    //     if (!isNaN(quantity) && !isNaN(salesPrice) && quantity > 0 && salesPrice >= 0) {
    //         if (!allowZeroPercentage) {
    //             showNotification({
    //                 color: 'pink',
    //                 title: t('WeNotifyYouThat'),
    //                 message: t('ZeroQuantityNotAllow'),
    //                 autoClose: 1500,
    //                 loading: true,
    //                 withCloseButton: true,
    //                 position: 'top-center',
    //                 style: { backgroundColor: 'mistyrose' },
    //             });
    //         } else {
    //             setSelectProductDetails(prevDetails => ({
    //                 ...prevDetails,
    //                 sub_total: quantity * salesPrice,
    //                 sales_price: salesPrice,
    //             }));
    //         }
    //     }
    //
    // }, [form.values.quantity, form.values.sales_price]);
    //
    //
    // useEffect(() => {
    //     if (form.values.quantity && form.values.mrp) {
    //         const discountAmount = (form.values.mrp * form.values.percent) / 100;
    //         const salesPrice = form.values.mrp - discountAmount;
    //
    //         form.setFieldValue('sales_price', salesPrice);
    //     }
    // }, [form.values.percent]);


    useHotkeys([['alt+n', () => {
        document.getElementById('CompanyName').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    // const [value, discountType] = useToggle(['Flat', 'Percent']);
    //
    //
    // const inputGroupButton = (
    //     <Button
    //         color={'gray'}
    //         variant={'outline'}
    //         styles={{
    //             button: {
    //                 fontWeight: 500,
    //                 borderTopLeftRadius: 0,
    //                 borderBottomLeftRadius: 0,
    //                 width: rem(1000),
    //             },
    //         }}
    //     >
    //         {selectProductDetails && selectProductDetails.unit_name}
    //     </Button>
    // );

    // const inputGroupText = (
    //     <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
    //         color={'gray'}
    //     >
    //         {selectProductDetails && selectProductDetails.unit_name}
    //     </Text>
    // );
    //
    // const inputGroupCurrency = (
    //     <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
    //         color={'gray'}
    //     >
    //         {currancySymbol}
    //     </Text>
    // );
    //
    // const [displayNameValue, setDisplayNameValue] = useState('');

    return (
        <>
            <Box>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={24} >
                        <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                            <Grid>
                                <Grid.Col>
                                    <Stack >
                                        <KeywordSearch />
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={9} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >

                            <Box className={'borderRadiusAll'}>
                                {tempCardProducts && tempCardProducts.length > 0 && (
                                    tempCardProducts.map((item, index) => {
                                        salesSubTotalAmount = salesSubTotalAmount + item.sub_total
                                    })
                                )}
                                <DataTable

                                    records={tempCardProducts}
                                    columns={[
                                        {
                                            accessor: 'index',
                                            title: 'S/N',
                                            textAlignment: 'right',


                                        },
                                        {
                                            accessor: 'display_name',
                                            title: "Name",
                                            footer: (
                                                <Group spacing="xs">
                                                    <IconSum size="1.25em" />
                                                    <Text mb={-2}>{tempCardProducts.length} employees</Text>
                                                </Group>
                                            ),
                                            render: (item) => {
                                                // Define the state variable outside of the render function
                                                const [editedName, setEditedName] = useState(item.display_name);

                                                const handleNameChange = (e) => {
                                                    const newName = e.currentTarget.value;
                                                    setEditedName(newName);

                                                    // Here, you can also update the ⁠ display_name ⁠ in your data source or perform any other necessary actions
                                                    // For now, let's assume you want to log the changes
                                                    console.log("Old Name:", item.display_name);
                                                    console.log("New Name:", newName);
                                                };

                                                return (
                                                    <>
                                                        <TextInput
                                                            label=""
                                                            size="xs"
                                                            value={editedName}
                                                            onChange={handleNameChange}
                                                        />
                                                    </>
                                                );
                                            }
                                        },
                                        { accessor: 'mrp', title: "MRP" },
                                        { accessor: 'quantity', title: "Quantity" },
                                        {
                                            accessor: 'percent', title: "Percent",
                                            footer: (
                                                <Group spacing="xs">
                                                    <Text mb={-2}>SubTotal</Text>
                                                    <IconSum size="1.25em" />
                                                </Group>
                                            ),
                                        },
                                        {
                                            accessor: 'sub_total',
                                            title: "Sub total",
                                            footer: (
                                                <Group spacing="xs">
                                                    <Text fw={'800'}>{salesSubTotalAmount.toFixed(2)}</Text>
                                                </Group>
                                            ),
                                        },


                                        {
                                            accessor: "action",
                                            title: "Action",
                                            textAlign: "right",
                                            render: (data) => (
                                                <Group gap={4} justify="right" wrap="nowrap">

                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="red"
                                                        onClick={() => {
                                                            modals.openConfirmModal({
                                                                title: (
                                                                    <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                                ),
                                                                children: (
                                                                    <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                                ),
                                                                labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                                onCancel: () => console.log('Cancel'),
                                                                onConfirm: () => {
                                                                    // dispatch(deleteEntityData('inventory/category-group/' + data.id))
                                                                },
                                                            });
                                                        }}
                                                    >
                                                        <IconX size={16} style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                                    </ActionIcon>
                                                </Group>
                                            ),
                                        },
                                    ]
                                    }
                                    fetching={false}
                                    totalRecords={100}
                                    recordsPerPage={10}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={tableHeight}
                                    scrollAreaProps={{ type: 'never' }}
                                />
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={6} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box h={'40'} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                In voice Title
                            </Box>
                            <Box className={'borderRadiusAll'} h={height}>
                                Body
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box h={'40'} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                In voice Details
                            </Box>
                            <Box className={'borderRadiusAll'} h={height}>
                                Body
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <ShortcutTable
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'CompanyName'}
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>

    );
}
export default SampleModalTable;
