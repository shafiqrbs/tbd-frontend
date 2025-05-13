import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Button, ActionIcon, TextInput, Grid, Box, Group, Text,
    Tooltip,Menu, rem
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconDeviceFloppy, IconX, IconBarcode, IconChevronsRight, IconArrowRight, IconLoader,
    IconPlus, IconDotsVertical, IconCheck,
    IconSortAscendingNumbers,
    IconPlusMinus,
    IconSum
} from "@tabler/icons-react";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";

import { DataTable } from "mantine-datatable";
import ShortcutInvoice from "../../shortcut/ShortcutInvoice";
import tableCss from "../../../../assets/css/Table.module.css";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import {
    deleteEntityData,
    getIndexEntityData,
    inlineUpdateEntityData, setPurchaseItemsFilterData,
    storeEntityData, setDeleteMessage
} from "../../../../store/inventory/crudSlice.js";
import AddProductDrawer from "../sales/drawer-form/AddProductDrawer.jsx";
import {modals} from "@mantine/modals";
import FileUploadModel from "../../../core-component/FileUploadModel.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import Navigation from "../common/Navigation.jsx";

function _CreateOpeningForm(props) {
    const { currencySymbol } = props
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [fetching, setFetching] = useState(true);

    const perPage = 15;
    const [page, setPage] = useState(1);

    const [searchValue, setSearchValue] = useState('');
    const [productDropdown, setProductDropdown] = useState([])
    const [productDrawer, setProductDrawer] = useState(false);
    const [indexData,setIndexData] = useState([])
    const purchaseItemsFilterData = useSelector((state) => state.inventoryCrudSlice.purchaseItemsFilterData)
    const [uploadOpeningStockModel, setUploadOpeningStockModel] = useState(false)
    const entityDataDelete = useSelector((state) => state.crudSlice.entityDataDelete)

    useEffect(() => {
            dispatch(setDeleteMessage(''))
            if (entityDataDelete?.message === 'delete') {
                notifications.show({
                    color: 'red',
                    title: t('DeleteSuccessfully'),
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 700,
                    style: { backgroundColor: 'lightgray' },
                });
    
                setTimeout(() => {
                    setFetching(true)
                }, 700)
            }
        }, [entityDataDelete]);

    useEffect(() => {
        let isMounted = true; // To handle cleanup properly in `useEffect`

        const fetchData = async () => {
            const value = {
                url: 'inventory/opening-stock',
                param: {
                    page: page,
                    offset: perPage,
                    mode: "opening",
                    is_approved: 0,
                },
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    if (isMounted) {
                        setIndexData(resultAction.payload);
                    }
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                if (isMounted) setFetching(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup the effect to prevent state updates on unmounted component
        };
    }, [dispatch, fetching, page, perPage]);

    const [stockProductRestore, setStockProductRestore] = useState(false)
    useEffect(() => {
        if (stockProductRestore) {
            const local = productsDataStoreIntoLocalStorage()
        }
    }, [stockProductRestore])

    useEffect(() => {
        if (searchValue.length > 0) {
            const storedProducts = localStorage.getItem('core-products');
            const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
            const lowerCaseSearchTerm = searchValue.toLowerCase();
            const fieldsToSearch = ['product_name'];
            const productFilterData = localProducts.filter(product =>
                fieldsToSearch.some(field =>
                    product[field] && String(product[field]).toLowerCase().includes(lowerCaseSearchTerm)
                )
            );
            const formattedProductData = productFilterData.map(type => ({
                label: type.product_name, value: String(type.id)
            }));

            setProductDropdown(formattedProductData);
        } else {
            setProductDropdown([]);
        }
    }, [searchValue]);


    /**
     * Adds a product to a collection based on ID, updates the local storage and resets the form
     */
    function handleAddProductByProductId(values, localProducts) {
        const product = localProducts.find(product => product.id === Number(values.product_id));

        if (product) {
            createOpeningStockAndResetForm({
                product_id: product.id,
                display_name: product.display_name,
                opening_quantity: Number(values.opening_quantity),
                unit_name: product.unit_name,
                purchase_price: Number(values.purchase_price),
                sub_total: Number(values.sub_total),
                sales_price: Number(values.sales_price),
                mode: "opening"
            }, 'productId');
        }
    }

    /**
     * Adds a product to a collection based on BARCODE, updates the local storage and resets the form
     */
    function handleAddProductByBarcode(values, localProducts) {
        const barcodeExists = localProducts.some(product => product.barcode === values.barcode);
        if (barcodeExists) {
            const product = localProducts.find(product => String(product.barcode) === String(values.barcode));
            if (product) {
                const addProduct = bindProductValueForBarcode(product);
                createOpeningStockAndResetForm(addProduct, 'barcode');
            }
        } else {
            notifications.show({
                loading: true,
                color: 'red',
                title: 'Product not found with this barcode',
                message: 'Data will be loaded in 3 seconds, you cannot close this yet',
                autoClose: 1000,
                withCloseButton: true,
            });
        }
    }

    function bindProductValueForBarcode(product) {
        return {
            product_id: product.id,
            display_name: product.display_name,
            opening_quantity: 1,
            unit_name: product.unit_name,
            purchase_price: product.purchase_price,
            sub_total: Number(product.purchase_price),
            sales_price: Number(product.sales_price),
            mode: "opening"
        };
    }

    /**
     * Updates local storage with new products, resets form, and sets focus on the product search.
     */
    function createOpeningStockAndResetForm(addProducts, type) {
        if (addProducts) {
            const data = {
                url: 'inventory/opening-stock',
                data: addProducts
            }
            dispatch(storeEntityData(data))
            setSearchValue('');
            form.reset();
            setFetching(true)
            if (type == 'productId') {
                document.getElementById('product_id').focus();
            } else {
                document.getElementById('barcode').focus();
            }
        }
    }

    const form = useForm({
        initialValues: {
            product_id: '', sales_price: '', purchase_price: '', barcode: '', sub_total: '', opening_quantity: ''
        },
        validate: {
            product_id: (value, values) => {
                const isDigitsOnly = /^\d+$/.test(value);
                if (!isDigitsOnly && values.product_id) {
                    return true;
                }
                return null;
            },
            opening_quantity: (value, values) => {
                if (values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            purchase_price: (value, values) => {
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


    /*START PRODUCT SELECTED BY PRODUCT ID*/
    const [selectProductDetails, setSelectProductDetails] = useState('')
    useEffect(() => {
        const storedProducts = localStorage.getItem('core-products');
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        const filteredProducts = localProducts.filter(product => product.id === Number(form.values.product_id));
        if (filteredProducts.length > 0) {
            const selectedProduct = filteredProducts[0];
            setSelectProductDetails(selectedProduct);

            form.setFieldValue('price', selectedProduct.sales_price);
            form.setFieldValue('sales_price', selectedProduct.sales_price);
            form.setFieldValue('purchase_price', selectedProduct.purchase_price);
            document.getElementById('opening_quantity').focus();
        } else {
            setSelectProductDetails(null);
            form.setFieldValue('price', '');
            form.setFieldValue('sales_price', '');
            form.setFieldValue('purchase_price', '');
        }
    }, [form.values.product_id]);
    /*END PRODUCT SELECTED BY PRODUCT ID*/

    /*START QUANTITY AND PURCHASE PRICE WISE SUB TOTAL*/
    useEffect(() => {
        const opening_quantity = Number(form.values.opening_quantity);
        const purchase_price = Number(form.values.purchase_price);

        if (!isNaN(opening_quantity) && !isNaN(purchase_price) && opening_quantity > 0 && purchase_price >= 0) {
            setSelectProductDetails(prevDetails => ({
                ...prevDetails,
                sub_total: opening_quantity * purchase_price,
            }));
            form.setFieldValue('sub_total', opening_quantity * purchase_price);
        }
    }, [form.values.opening_quantity, form.values.purchase_price]);
    /*END QUANTITY AND PURCHASE PRICE WISE SUB TOTAL*/


    const [editedSubtotal, setEditedSubtotal] = useState(0)

    useHotkeys([['alt+n', () => {
        document.getElementById('product_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const inputGroupText = (
        <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
            color={'gray'}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );

    const inputGroupCurrency = (
        <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
            color={'gray'}
        >
            {currencySymbol}
        </Text>
    );
    return (
        <Box>
            <Grid columns={24} gutter={{ base: 8 }}>
                <Grid.Col span={1} >
                    <Navigation module = {"opening-stock"} />
                </Grid.Col>
                <Grid.Col span={22} >
                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                        <Box>
                            <form onSubmit={form.onSubmit((values) => {
                                if (!values.barcode && !values.product_id) {
                                    form.setFieldError('barcode', true);
                                    form.setFieldError('product_id', true);
                                    setTimeout(() => { }, 1000)
                                } else {
                                    const storedProducts = localStorage.getItem('core-products');
                                    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

                                    if (values.product_id && !values.barcode) {
                                        handleAddProductByProductId(values, localProducts);
                                    } else if (!values.product_id && values.barcode) {
                                        handleAddProductByBarcode(values, localProducts);
                                    }
                                }
                            })}>
                                <Box pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'}>
                                    <Box pb={'xs'}>
                                        <Grid columns={27} gutter={{ base: 6 }}>
                                            <Grid.Col span={4}>
                                                <InputNumberForm
                                                    tooltip={t('BarcodeValidateMessage')}
                                                    label=''
                                                    placeholder={t('Barcode')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'barcode'}
                                                    id={'barcode'}
                                                    leftSection={<IconBarcode size={16} opacity={0.5} />}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={8}>
                                                <SelectServerSideForm
                                                    tooltip={t('ChooseStockProduct')}
                                                    label=''
                                                    placeholder={t('ChooseStockProduct')}
                                                    required={false}
                                                    nextField={'opening_quantity'}
                                                    name={'product_id'}
                                                    form={form}
                                                    id={'product_id'}
                                                    searchable={true}
                                                    searchValue={searchValue}
                                                    setSearchValue={setSearchValue}
                                                    dropdownValue={productDropdown}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={2}>
                                                <InputForm
                                                    tooltip={t('QuantityValidateMessage')}
                                                    label=''
                                                    placeholder={t('Quantity')}
                                                    required={true}
                                                    nextField={'purchase_price'}
                                                    form={form}
                                                    name={'opening_quantity'}
                                                    id={'opening_quantity'}
                                                    type={'number'}
                                                    leftSection={
                                                        <IconSortAscendingNumbers 
                                                        size={16} opacity={0.5} />
                                                    }
                                                    rightSection={inputGroupText}
                                                    rightSectionWidth={50}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={2}>
                                                <InputForm
                                                    tooltip={t('PurchasePriceValidateMessage')}
                                                    label=''
                                                    placeholder={t('PurchasePrice')}
                                                    required={true}
                                                    nextField={'sales_price'}
                                                    form={form}
                                                    name={'purchase_price'}
                                                    id={'purchase_price'}
                                                    type={'number'}
                                                    leftSection={
                                                        <IconPlusMinus 
                                                        size={16} opacity={0.5} />
                                                    }
                                                    rightSection={inputGroupCurrency}
                                                    closeIcon={true}

                                                />
                                            </Grid.Col>
                                            <Grid.Col span={2}>
                                                <InputForm
                                                    tooltip={t('PurchasePriceValidateMessage')}
                                                    label=''
                                                    placeholder={t('SalesPrice')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'sales_price'}
                                                    id={'sales_price'}
                                                    type={'number'}
                                                    leftSection={
                                                        <IconPlusMinus 
                                                        size={16} opacity={0.5} />
                                                    }
                                                    rightSection={inputGroupCurrency}
                                                    closeIcon={true}

                                                />
                                            </Grid.Col>
                                            <Grid.Col span={2}>
                                                <InputForm
                                                    tooltip={t('SubTotalValidateMessage')}
                                                    label=''
                                                    placeholder={t('SubTotal')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'sub_total'}
                                                    type={'number'}
                                                    leftSection={
                                                        <IconSum 
                                                        size={16} opacity={0.5} />
                                                    }
                                                    id={'sub_total'}
                                                    rightSection={inputGroupCurrency}
                                                    closeIcon={false}
                                                    disabled={true}

                                                />
                                            </Grid.Col>
                                            <Grid.Col span={7}>
                                                <Box>
                                                    <Group justify="right" gap={0}>
                                                        <Button
                                                            size="sm"
                                                            color={`red.5`}
                                                            type="submit"
                                                            mt={0}
                                                            mr={'sm'}
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}
                                                        >
                                                            {t("Add")}
                                                        </Button>

                                                        <Tooltip
                                                            multiline
                                                            bg={'orange.8'}
                                                            position="top"
                                                            withArrow
                                                            ta={'center'}
                                                            offset={{ crossAxis: '-50', mainAxis: '5' }}
                                                            transitionProps={{ duration: 200 }}
                                                            label={t('InstantProductCreate')}
                                                        >
                                                            <ActionIcon
                                                                mr={'sm'}
                                                                variant="outline"
                                                                size={'lg'}
                                                                color="red.5"
                                                                aria-label="Settings"
                                                                onClick={() => setProductDrawer(true)}
                                                            >
                                                                <IconPlus style={{ width: '100%', height: '70%' }}
                                                                    stroke={1.5} />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                        <Button onClick={(e) => {
                                                            dispatch(setPurchaseItemsFilterData({...purchaseItemsFilterData, ['searchKeyword']: ''}))
                                                            navigate('/inventory/opening-approve-stock')
                                                        }}
                                                            size="sm"
                                                            c={"red.8"}
                                                            variant="link"
                                                            bg={"#f7f4f4"}
                                                            rightSection={<IconArrowRight size={16} />}
                                                        >
                                                            {t("ApproveStock")}
                                                        </Button>
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
                                                                size="md"
                                                                variant="transparent"
                                                                color="red"
                                                                aria-label="Settings"
                                                                >
                                                                <IconDotsVertical height={"20"} width={"20"} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Menu.Target>
                                                            <Menu.Dropdown>
                                                                <Menu.Item
                                                                onClick={(e) => {
                                                                    setUploadOpeningStockModel(true);
                                                                }}
                                                                component="a"
                                                                bg={"#d7e8cd"}
                                                                w={"200"}
                                                                rightSection={
                                                                    <IconLoader style={{ width: rem(14), height: rem(14) }} />
                                                                }
                                                                >
                                                                {t("Upload")}
                                                                </Menu.Item>
                                                            </Menu.Dropdown>
                                                        </Menu>
                                                    </Group>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </Box>
                            </form>
                        </Box>
                        <Box className={'borderRadiusAll'}>
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
                                        accessor: 'index',
                                        title: t('S/N'),
                                        textAlignment: 'right',
                                        render: (item) => (indexData.data.indexOf(item) + 1)
                                    },
                                    {
                                        accessor: 'created',
                                        title: t("CreatedDate"),
                                        width: '10%',
                                    },
                                    {
                                        accessor: 'product_name',
                                        title: t("Name"),
                                        width: '25%',
                                    },
                                    {
                                        accessor: 'unit_name',
                                        title: t('UOM'),
                                        width: '10%',
                                        textAlign: "center"
                                    },
                                    {
                                        accessor: 'opening_quantity',
                                        title: t('Quantity'),
                                        width: '10%',
                                        textAlign: "right",
                                        render: (item) => {
                                            const [editedQuantity, setEditedQuantity] = useState(item.opening_quantity);

                                            const handlQuantityChange = (e) => {
                                                const editedQuantity = e.currentTarget.value;
                                                setEditedQuantity(editedQuantity);

                                                let purchasePriceElement = document.getElementById('inline-update-purchase-price-' + item.id);
                                                let purchasePrice = parseFloat(purchasePriceElement.value);
                                                let subTotal = Number(editedQuantity) * purchasePrice;

                                                setEditedSubtotal(prevSubTotal => ({
                                                    ...prevSubTotal,
                                                    [item.id]: subTotal
                                                }));

                                                const editedQuantityData = {
                                                    url: 'inventory/opening-stock/inline-update',
                                                    data: {
                                                        field_name: "opening_quantity",
                                                        opening_quantity: editedQuantity,
                                                        subTotal: subTotal,
                                                        id: item.id
                                                    }
                                                }

                                                setTimeout(() => {
                                                    dispatch(inlineUpdateEntityData(editedQuantityData));
                                                    setFetching(true);
                                                }, 1000);

                                            };

                                            return (
                                                <>
                                                    <TextInput
                                                        type="number"
                                                        label=""
                                                        size="xs"
                                                        id={"inline-update-quantity-" + item.id}
                                                        value={Number(editedQuantity)}
                                                        onChange={handlQuantityChange}
                                                        onKeyDown={getHotkeyHandler([
                                                            ['Enter', (e) => {
                                                                document.getElementById('inline-update-purchase-price-' + item.id).focus();
                                                            }],
                                                        ])}
                                                    />
                                                </>
                                            );
                                        }
                                    },

                                    {
                                        accessor: 'purchase_price',
                                        title: t('PurchasePrice'),
                                        width: '10%',
                                        textAlign: "right",
                                        render: (item) => {
                                            const [editedPurchaseQuantity, setEditedPurchaseQuantity] = useState(item.purchase_price);

                                            const handlePurchasePriceChange = (e) => {
                                                const editedPurchaseQuantity = e.currentTarget.value;
                                                setEditedPurchaseQuantity(editedPurchaseQuantity);

                                                let quantityElement = document.getElementById('inline-update-quantity-' + item.id);
                                                let quantity = parseFloat(quantityElement.value);
                                                let subTotal = quantity * editedPurchaseQuantity;

                                                setEditedSubtotal(prevSubTotal => ({
                                                    ...prevSubTotal,
                                                    [item.id]: subTotal
                                                }));

                                                const editedQuantityData = {
                                                    url: 'inventory/opening-stock/inline-update',
                                                    data: {
                                                        field_name: "purchase_price",
                                                        purchase_price: editedPurchaseQuantity,
                                                        subTotal: subTotal,
                                                        id: item.id
                                                    }
                                                }

                                                setTimeout(() => {
                                                    dispatch(inlineUpdateEntityData(editedQuantityData));
                                                    setFetching(true);
                                                }, 1000);
                                            }

                                            return (
                                                <>
                                                    <TextInput
                                                        type="number"
                                                        label=""
                                                        size="xs"
                                                        id={'inline-update-purchase-price-' + item.id}
                                                        value={editedPurchaseQuantity}
                                                        onChange={handlePurchasePriceChange}
                                                    />
                                                </>
                                            );
                                        }
                                    },
                                    {
                                        accessor: 'sales_price',
                                        title: t('SalesPrice'),
                                        width: '10%',
                                        textAlign: "right",
                                        render: (item) => {
                                            return (
                                                item.sales_price && Number(item.sales_price).toFixed(2)
                                            );
                                        },
                                    },

                                    {
                                        accessor: 'sub_total',
                                        title: t('SubTotal'),
                                        width: '15%',
                                        textAlign: "right",
                                        render: (item) => {
                                            return (
                                                editedSubtotal[item.id] !== undefined ? editedSubtotal[item.id].toFixed(2) : item.sub_total && Number(item.sub_total).toFixed(2)
                                            );
                                        },

                                    },
                                    {
                                        accessor: "action",
                                        title: t('Action'),
                                        width: '15%',
                                        textAlign: "right",
                                        render: (item) => (
                                            <Group gap={'xs'} justify="right" wrap="nowrap">
                                                <Button
                                                    rightSection={<IconChevronsRight size={14} />}
                                                    variant="light"
                                                    color="green"
                                                    size="xs"
                                                    radius="xs"
                                                    onClick={() => {
                                                        modals.openConfirmModal({
                                                            title: (
                                                                <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                            ),
                                                            children: (
                                                                <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                            ),
                                                            labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                            confirmProps: { color: 'red.6' },
                                                            onCancel: () => console.log('Cancel'),
                                                            onConfirm: () => {
                                                                const approveData = {
                                                                    url: 'inventory/opening-stock/inline-update',
                                                                    data: {
                                                                        field_name: "approve",
                                                                        value: 1,
                                                                        id: item.id
                                                                    }
                                                                }

                                                                if (!item.opening_quantity){
                                                                    showNotificationComponent(t("EnterOpeningQuantity"),'red',null,null,false,1000,true)
                                                                }
                                                                if (!item.purchase_price){
                                                                    showNotificationComponent(t("EnterPurchasePrice"),'red',null,null,false,1000,true);
                                                                }
                                                                if (item.opening_quantity && item.purchase_price){
                                                                    dispatch(inlineUpdateEntityData(approveData))
                                                                    setFetching(true)
                                                                }
                                                            },
                                                        });
                                                    }}
                                                >
                                                    {t('Approve')}
                                                </Button>
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
                                                            confirmProps: { color: 'red.6' },
                                                            onCancel: () => console.log('Cancel'),
                                                            onConfirm: () => {
                                                                dispatch(deleteEntityData('inventory/opening-stock/' + item.id))
                                                                setFetching(true)
                                                            },
                                                        });
                                                    }}
                                                >
                                                    <IconX size={16} style={{ width: '70%', height: '70%' }}
                                                        stroke={1.5} />
                                                </ActionIcon>
                                            </Group>

                                        ),
                                    },
                                ]
                                }
                                fetching={fetching}
                                totalRecords={indexData.total}
                                recordsPerPage={perPage}
                                page={page}
                                onPageChange={(p) => {
                                    setPage(p)
                                    setFetching(true)
                                }}
                                loaderSize="xs"
                                loaderColor="grape"
                                height={height}
                                scrollAreaProps={{ type: 'never' }}
                            />
                        </Box>
                    </Box>
                </Grid.Col>

                <Grid.Col span={1} >
                    <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                        <ShortcutInvoice
                            form={form}
                            FormSubmit={'EntityFormSubmit'}
                            Name={'CompanyName'}
                        />
                    </Box>
                </Grid.Col>
            </Grid>
            {productDrawer &&
                <AddProductDrawer
                    productDrawer={productDrawer}
                    setProductDrawer={setProductDrawer}
                    setStockProductRestore={setStockProductRestore}
                    focusField={'product_id'}
                    fieldPrefix="purchase_"
                />
            }
            {uploadOpeningStockModel &&
                <FileUploadModel
                    modelStatus={uploadOpeningStockModel}
                    setFileUploadStateFunction={setUploadOpeningStockModel}
                    filyType={'Opening-Stock'}
                    tableDataLoading={props.tableDataLoading}
                />
            }
        </Box>

    );
}

export default _CreateOpeningForm;
