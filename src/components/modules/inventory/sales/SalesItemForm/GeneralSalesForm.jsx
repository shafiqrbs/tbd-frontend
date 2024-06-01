import React, { useEffect, useState } from "react";
import { json, useNavigate, useOutletContext } from "react-router-dom";
import classes from '../../../../../assets/css/Tab.module.css';
import {
    Button,
    rem, Flex, Tabs, Center, Switch, ActionIcon, TextInput, NativeSelect,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Select, Table,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconInfoCircle,
    IconPlus,
    IconUserCog,
    IconStackPush,
    IconPrinter,
    IconReceipt,
    IconPercentage,
    IconCurrencyTaka,
    IconRestore,
    IconPhoto,
    IconMessage,
    IconEyeEdit,
    IconRowRemove,
    IconTrash,
    IconX
} from "@tabler/icons-react";
import { getHotkeyHandler, useDisclosure, useHotkeys, useToggle } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications, showNotification } from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import { getBrandDropdown, getCategoryDropdown } from "../../../../store/inventory/utilitySlice";
import { getSettingDropdown, getProductUnitDropdown } from "../../../../store/utility/utilitySlice.js";

import {
    setEntityNewData,
    setFetching,
    setFormLoading,
    setValidationData,
    storeEntityData,
    getShowEntityData,
    updateEntityData,

} from "../../../../store/inventory/crudSlice.js";
import CategoryGroupModal from "../category/CategoryGroupModal";
import { setDropdownLoad } from "../../../../store/inventory/crudSlice";
import ProductForm from "../product/ProductForm";
import ProductUpdateForm from "../product/ProductUpdateForm";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";
import SalesCardItems from "./SalesCardItems.jsx";
import SalesAddStockProductModel from "./model/SalesAddStockProductModel.jsx";
import SalesAddCustomerModel from "./model/SalesAddCustomerModel.jsx";
import SalesViewCustomerModel from "./model/SalesViewCustomerModel.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";

function GeneralSalesForm(props) {
    const { currancySymbol, allowZeroPercentage } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 200; //TabList height 104
    const formHeight = mainAreaHeight - 250; //TabList height 104
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const icon = <IconInfoCircle />;
    const [customerGroupData, setCustomerGroupData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const showEntityData = useSelector((state) => state.inventoryCrudSlice.showEntityData)
    const validationMessage = useSelector((state) => state.inventoryCrudSlice.validationMessage)
    const validation = useSelector((state) => state.inventoryCrudSlice.validation)

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [addStockProductModel, setAddStockProductModel] = useState(false);
    const [addCustomerModel, setAddCustomerModel] = useState(false);
    const [viewCustomerModel, setCustomerViewModel] = useState(false);


    const [searchValue, setSearchValue] = useState('');
    const [productDropdown, setProductDropdown] = useState([]);

    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)

    // const [salesSubTotal,setSalesSubTotal] = useState(0)
    let salesSubTotalAmount = 0


    useEffect(() => {
        const tempProducts = localStorage.getItem('temp-sales-products');
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])
        setLoadCardProducts(false)
    }, [loadCardProducts])


    useEffect(() => {
        if (searchValue.length > 0) {
            const storedProducts = localStorage.getItem('user-products');
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



    function handleAddProductByProductId(values, myCardProducts, localProducts) {
        const addProducts = localProducts.reduce((acc, product) => {
            if (product.id === Number(values.product_id)) {
                acc.push({
                    product_id: product.id,
                    display_name: product.display_name,
                    sales_price: values.sales_price,
                    mrp: values.mrp,
                    percent: values.percent,
                    stock: product.quantity,
                    quantity: values.quantity,
                    unit_name: product.unit_name,
                    sub_total: selectProductDetails.sub_total,
                });
            }
            return acc;
        }, myCardProducts);

        updateLocalStorageAndResetForm(addProducts);
    }

    function handleAddProductByBarcode(values, myCardProducts, localProducts) {
        const barcodeExists = localProducts.some(product => product.barcode === values.barcode);

        if (barcodeExists) {
            const addProducts = localProducts.reduce((acc, product) => {
                if (String(product.barcode) === String(values.barcode)) {
                    acc.push(createProductFromValues(product));
                }
                return acc;
            }, myCardProducts);

            updateLocalStorageAndResetForm(addProducts);
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

    function updateLocalStorageAndResetForm(addProducts) {
        localStorage.setItem('temp-sales-products', JSON.stringify(addProducts));
        setSearchValue('');
        form.reset();
        setLoadCardProducts(true);
    }

    function createProductFromValues(product) {
        return {
            product_id: product.id,
            display_name: product.display_name,
            sales_price: product.sales_price,
            mrp: product.sales_price,
            percent: '',
            stock: product.quantity,
            quantity: 1,
            unit_name: product.unit_name,
            sub_total: product.sales_price,
        };
    }


    const [categoryData, setCategoryData] = useState(null);
    const categoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.categoryDropdownData)
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)
    let categoryDropdown = categoryDropdownData && categoryDropdownData.length > 0 ?
        categoryDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'inventory/select/category',
            param: {
                type: 'parent'
            }
        }
        dispatch(getCategoryDropdown(value))
        //  dispatch(setDropdownLoad(false))
    }, [dropdownLoad]);

    const [brandData, setBrandData] = useState(null);
    const brandDropdownData = useSelector((state) => state.inventoryUtilitySlice.brandDropdownData)
    const dropdownBrandLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)
    let brandDropdown = brandDropdownData && brandDropdownData.length > 0 ?
        brandDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'inventory/select/product-brand',
        }
        dispatch(getBrandDropdown(value))
        //  dispatch(setDropdownLoad(false))
    }, [dropdownBrandLoad]);

    const [productTypeData, setProductTypeData] = useState(null);
    const productTypeDropdownData = useSelector((state) => state.utilityUtilitySlice.settingDropdown)
    let productTypeDropdown = productTypeDropdownData && productTypeDropdownData.length > 0 ?
        productTypeDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []

    useEffect(() => {
        const value = {
            url: 'utility/select/setting',
            param: {
                'dropdown-type': 'product-type'
            }
        }
        dispatch(getSettingDropdown(value))
    }, []);

    const [productUnitData, setProductUnitData] = useState(null);
    const productUnitDropdownData = useSelector((state) => state.utilityUtilitySlice.productUnitDropdown)
    let productUnitDropdown = productUnitDropdownData && productUnitDropdownData.length > 0 ?
        productUnitDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'utility/select/product-unit'
        }
        dispatch(getProductUnitDropdown(value))
    }, []);

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


    const [selectProductDetails, setSelectProductDetails] = useState('')

    useEffect(() => {
        const storedProducts = localStorage.getItem('user-products');
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        const filteredProducts = localProducts.filter(product => product.id === Number(form.values.product_id));

        if (filteredProducts.length > 0) {
            const selectedProduct = filteredProducts[0];

            setSelectProductDetails(selectedProduct);

            form.setFieldValue('mrp', selectedProduct.sales_price);
            form.setFieldValue('sales_price', selectedProduct.sales_price);
        } else {
            setSelectProductDetails(null);
            form.setFieldValue('mrp', '');
            form.setFieldValue('sales_price', '');
        }
    }, [form.values.product_id]);


    useEffect(() => {
        const quantity = Number(form.values.quantity);
        const salesPrice = Number(form.values.sales_price);

        if (!isNaN(quantity) && !isNaN(salesPrice) && quantity > 0 && salesPrice >= 0) {
            if (!allowZeroPercentage) {
                showNotification({
                    color: 'pink',
                    title: t('WeNotifyYouThat'),
                    message: t('ZeroQuantityNotAllow'),
                    autoClose: 1500,
                    loading: true,
                    withCloseButton: true,
                    position: 'top-center',
                    style: { backgroundColor: 'mistyrose' },
                });
            } else {
                setSelectProductDetails(prevDetails => ({
                    ...prevDetails,
                    sub_total: quantity * salesPrice,
                    sales_price: salesPrice,
                }));
            }
        }

    }, [form.values.quantity, form.values.sales_price]);


    useEffect(() => {
        if (form.values.quantity && form.values.mrp) {
            const discountAmount = (form.values.mrp * form.values.percent) / 100;
            const salesPrice = form.values.mrp - discountAmount;

            form.setFieldValue('sales_price', salesPrice);
        }
    }, [form.values.percent]);


    useHotkeys([['alt+n', () => {
        document.getElementById('CompanyName').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const [value, discountType] = useToggle(['Flat', 'Percent']);


    const inputGroupButton = (
        <Button
            color={'gray'}
            variant={'outline'}
            styles={{
                button: {
                    fontWeight: 500,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: rem(1000),
                },
            }}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Button>
    );

    const inputGroupText = (
        <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
            color={'gray'}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );


    return (
        <Box bg={"white"} mt={`xs`}>
            <form onSubmit={form.onSubmit((values) => {

                if (!values.barcode && !values.product_id) {
                    form.setFieldError('barcode', true);
                    form.setFieldError('product_id', true);
                    setTimeout(() => {
                        notifications.show({
                            loading: true,
                            color: 'red',
                            title: 'Loading your data',
                            message: 'Data will be loaded in 3 seconds, you cannot close this yet',
                            autoClose: 1000,
                            withCloseButton: true,
                        });
                    }, 1000)
                } else {
                    const cardProducts = localStorage.getItem('temp-sales-products');
                    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
                    const storedProducts = localStorage.getItem('user-products');
                    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

                    if (values.product_id && !values.barcode) {
                        if (!allowZeroPercentage) {
                            showNotification({
                                color: 'pink',
                                title: t('WeNotifyYouThat'),
                                message: t('ZeroQuantityNotAllow'),
                                autoClose: 1500,
                                loading: true,
                                withCloseButton: true,
                                position: 'top-center',
                                style: { backgroundColor: 'mistyrose' },
                            });
                        } else {
                            handleAddProductByProductId(values, myCardProducts, localProducts);
                        }
                    } else if (!values.product_id && values.barcode) {
                        handleAddProductByBarcode(values, myCardProducts, localProducts);
                    }

                }

            })}>

                <Box mt={'xs'}>
                    <Grid columns={24}>
                        <Grid.Col span={16}>
                            {/*<Grid columns={'32'} gutter={{base: 6}} bg={'gray.2'} pt={4} p={'xs'}>
                            <Grid.Col span={4}>{t('ProductName')}</Grid.Col>
                            <Grid.Col span={4}>{t('MRP')}</Grid.Col>
                            <Grid.Col span={4}>{t('Stock')}</Grid.Col>
                            <Grid.Col span={4}>{t('Quantity')}</Grid.Col>
                            <Grid.Col span={4}>{t('Price')}</Grid.Col>
                            <Grid.Col span={4}>{t('Discount')}(%)</Grid.Col>
                            <Grid.Col span={4}>{t('SubTotal')}</Grid.Col>
                            <Grid.Col span={4}>{t('Action')}</Grid.Col>
                        </Grid>*/}
                            <Box>
                                <Box pl={`xs`} pr={8} style={{ background: '#fab00533' }}>
                                    <Grid columns={24} gutter={{ base: 2 }} >
                                        <Grid.Col span={4}>
                                            <InputForm
                                                tooltip={t('BarcodeValidateMessage')}
                                                label=''
                                                placeholder={t('barcode')}
                                                required={true}
                                                nextField={'EntityFormSubmit'}
                                                form={form}
                                                name={'barcode'}
                                                id={'barcode'}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={12}>

                                            <SelectServerSideForm
                                                tooltip={t('ChooseStockProduct')}
                                                label=''
                                                placeholder={t('ChooseStockProduct')}
                                                required={false}
                                                nextField={'quantity'}
                                                name={'product_id'}
                                                form={form}
                                                mt={8}
                                                id={'product_id'}
                                                searchable={true}
                                                searchValue={searchValue}
                                                setSearchValue={setSearchValue}
                                                dropdownValue={productDropdown}
                                            />

                                        </Grid.Col>
                                        <Grid.Col span={2}>
                                            <Button
                                                color={'gray'}
                                                variant={'outline'}
                                                onClick={setAddStockProductModel}>
                                                <IconPlus size={16} opacity={0.5} />
                                            </Button>
                                        </Grid.Col>
                                        {addStockProductModel &&
                                            <SalesAddStockProductModel
                                                addStockProductModel={addStockProductModel}
                                                setAddStockProductModel={setAddStockProductModel}
                                            />
                                        }
                                        <Grid.Col span={6}>

                                            <InputNumberForm
                                                tooltip={t('PercentValidateMessage')}
                                                label=''
                                                placeholder={t('Percent')}
                                                required={true}
                                                nextField={'EntityFormSubmit'}
                                                form={form}
                                                name={'percent'}
                                                id={'percent'}
                                            />
                                            <InputButtonForm
                                                type="number"
                                                placeholder={t('Percent')}
                                                required={true}
                                                nextField={'EntityFormSubmit'}
                                                form={form}
                                                name={'percent'}
                                                id={'percent'}
                                                rightSection={inputGroupText}
                                                rightSectionWidth={120}
                                            />


                                        </Grid.Col>

                                    </Grid>
                                    <Grid columns={48} >
                                        <Grid.Col span={3}>
                                            <Center mt={4}>{selectProductDetails && form.values.mrp}345678.00</Center>
                                        </Grid.Col>
                                        <Grid.Col span={16}>
                                            <Grid gutter={{ base: 6 }}>


                                                <Grid.Col span={3}>
                                                    <InputForm
                                                        tooltip={t('PercentValidateMessage')}
                                                        label=''
                                                        placeholder={t('Percent')}
                                                        required={true}
                                                        nextField={'EntityFormSubmit'}
                                                        form={form}
                                                        name={'percent'}
                                                        id={'percent'}
                                                    />
                                                </Grid.Col>

                                                <Grid.Col span={4}>
                                                    <InputForm
                                                        tooltip={t('SalesPriceValidateMessage')}
                                                        label=''
                                                        placeholder={t('SalesPrice')}
                                                        required={true}
                                                        nextField={'EntityFormSubmit'}
                                                        form={form}
                                                        name={'sales_price'}
                                                        id={'sales_price'}
                                                        disabled={form.values.percent}
                                                    />
                                                </Grid.Col>

                                                <Grid.Col span={2}>
                                                    <Center mt={2} >{selectProductDetails && selectProductDetails.sub_total && (selectProductDetails.sub_total).toFixed(2)}</Center>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Group mr={'md'} pos={`absolute`} right={0} gap={0}>
                                                <>
                                                    {!saveCreateLoading &&
                                                        <Button
                                                            size="xs"
                                                            color={`red`}
                                                            type="submit"
                                                            mt={4}
                                                            mr={'xs'}
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}
                                                        >
                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={12} fw={400}>
                                                                    {t("Add")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </>
                                            </Group>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                            <Box>
                                <Table highlightOnHover withTableBorder striped>
                                    <Table.Thead bg="rgba(230, 233, 235, 1)"  >
                                        <Table.Tr>
                                            <Table.Th style={{ width: '30%' }} >{t('ProductName')}</Table.Th>
                                            <Table.Th style={{ textAlign: 'center' }}>{t('MRP')}</Table.Th>
                                            <Table.Th>{t('Stock')}</Table.Th>
                                            <Table.Th>{t('Quantity')}</Table.Th>
                                            <Table.Th>{t('UOM')}</Table.Th>
                                            <Table.Th style={{ textAlign: 'right' }}>{t('Price')}</Table.Th>
                                            <Table.Th>{t('Discount')}</Table.Th>
                                            <Table.Th style={{ textAlign: 'right' }}>{t('SubTotal')}</Table.Th>
                                            <Table.Th>{t('Action')}</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {/*<ScrollArea  p={'xs'} h={height} scrollbarSize={2} type="never">*/}

                                        {tempCardProducts && tempCardProducts.length > 0 && (
                                            tempCardProducts.map((item, index) => {
                                                salesSubTotalAmount = salesSubTotalAmount + item.sub_total
                                                return (
                                                    <SalesCardItems item={item} index={index} setLoadCardProducts={setLoadCardProducts} symbol={currancySymbol} />
                                                )
                                            })
                                        )}
                                        {/*</ScrollArea>*/}
                                    </Table.Tbody>
                                    <Table.Tfoot>
                                        <Table.Tr style={{ borderTop: '1px solid red' }}>
                                            {/*<Table.Td>{item.product_name ?item.product_name:''}</Table.Td>*/}
                                            {/*<Table.Td style={{ textAlign: 'right' }}>{item.mrp && Number(item.mrp).toFixed(2)}</Table.Td>*/}
                                            {/*<Table.Td>{item.stock ?item.stock:''}</Table.Td>*/}
                                            {/*<Table.Td style={{ textAlign: 'center' }}>{item.quantity ?item.quantity:''}</Table.Td>*/}
                                            {/*<Table.Td style={{ textAlign: 'right' }}>{item.sales_price && (Number(item.sales_price)).toFixed(2)}</Table.Td>*/}
                                            {/*<Table.Td style={{ textAlign: 'center' }}>{item.percent ?item.percent+' %':''}</Table.Td>*/}
                                            <Table.Td style={{ textAlign: 'right' }}>&nbsp;</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>&nbsp;</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>&nbsp;</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>&nbsp;</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>&nbsp;</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>&nbsp;</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>&nbsp;</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>{currancySymbol} {salesSubTotalAmount.toFixed(2)}</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>&nbsp;</Table.Td>
                                        </Table.Tr>
                                    </Table.Tfoot>
                                </Table>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={7} bg={'gray.1'}>
                            <Box>
                                <Grid gutter={{ base: 6 }} >
                                    <Grid.Col pt={'4'} span={10} mb={'4'}>
                                        <SelectForm
                                            tooltip={t('CustomerValidateMessage')}
                                            label=''
                                            placeholder={t('Customer')}
                                            required={false}
                                            nextField={'name'}
                                            name={'category_id'}
                                            form={form}
                                            dropdownValue={categoryDropdown}
                                            id={'category_id'}
                                            mt={1}
                                            searchable={false}
                                            value={categoryData}
                                            changeValue={setCategoryData}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Button
                                            mt={1}
                                            color={'yellow'}
                                            variant={'filled'}
                                            onClick={setAddCustomerModel}
                                        >
                                            <IconUserCog size={16} />
                                        </Button>
                                    </Grid.Col>
                                    {addCustomerModel &&
                                        <SalesAddCustomerModel addCustomerModel={addCustomerModel} setAddCustomerModel={setAddCustomerModel} />
                                    }
                                </Grid>
                                <Box h={1} mt={'4'} bg={`gray.3`}></Box>
                                <Box mt={'2'} mb={'xs'}>
                                    <Grid gutter={{ base: 6 }} bg={'gray.2'}>
                                        <Grid.Col span={6}>
                                            <Box pl={'xl'}>
                                                <Text fz={'md'} order={1} fw={'800'}>1200000</Text>
                                                <Text fz={'xs'}>{t('Outstanding')}</Text>
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text mt={'8'} mr={'xl'} style={{ textAlign: 'right', float: 'right' }}>
                                                <Group>
                                                    <ActionIcon >
                                                        <IconMessage size={18} stroke={1.5} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="light"
                                                        onClick={setCustomerViewModel}
                                                    >
                                                        <IconEyeEdit
                                                            size={18}
                                                            stroke={1.5}
                                                        />
                                                    </ActionIcon>
                                                    {viewCustomerModel &&
                                                        <SalesViewCustomerModel viewCustomerModel={viewCustomerModel} setCustomerViewModel={setCustomerViewModel} />
                                                    }
                                                </Group>
                                            </Text>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                            <ScrollArea h={formHeight} scrollbarSize={2} type="never" bg={'gray.1'} >
                                <Box p={'xs'}>
                                    <Grid gutter={{ base: 6 }}>
                                        <Grid.Col span={6}>
                                            <Center fz={'md'} fw={'800'}>{currancySymbol} {salesSubTotalAmount.toFixed(2)}</Center>
                                            <Center fz={'xs'}>{t('SubTotal')}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Center fz={'md'} fw={'800'}>{currancySymbol} {salesSubTotalAmount.toFixed(2)}</Center>
                                            <Center fz={'xs'}>{t('VAT')}</Center>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{ base: 6 }}>
                                        <Grid.Col span={6}>
                                            <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{ base: 6 }}>
                                        <Grid.Col span={6}>
                                            <Center fz={'md'} fw={'800'}>{currancySymbol} {salesSubTotalAmount.toFixed(2)}</Center>
                                            <Center fz={'xs'}>{t('Discount')}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Center fz={'md'} fw={'800'}>{currancySymbol} {salesSubTotalAmount.toFixed(2)}</Center>
                                            <Center fz={'xs'}>{t('Total')}</Center>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box mt={'xs'} bg={`gray.2`}>
                                    <Tabs variant="unstyled" defaultValue="mobile" classNames={classes}>
                                        <Tabs.List grow>
                                            <Tabs.Tab
                                                value="cash"
                                                leftSection={<IconPhoto style={{ width: rem(16), height: rem(16) }} />}
                                            >
                                                {t('Cash')}
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                value="mobile"
                                                leftSection={<IconPhoto style={{ width: rem(16), height: rem(16) }} />}
                                            >
                                                {t('mobile')}
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                value="bank"
                                                leftSection={<IconPhoto style={{ width: rem(16), height: rem(16) }} />}
                                            >
                                                {t('bank')}
                                            </Tabs.Tab>
                                        </Tabs.List>
                                        <Tabs.Panel p={'xs'} pb={0} value="mobile" pt="xs">
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={'auto'}>
                                                    <SelectForm
                                                        tooltip={t('ProductUnitValidateMessage')}
                                                        label=''
                                                        placeholder={t('ChooseMobileAccount')}
                                                        required={true}
                                                        name={'mobile_account'}
                                                        form={form}
                                                        dropdownValue={productUnitDropdown}
                                                        mt={8}
                                                        id={'mobile_account'}
                                                        nextField={'payment_mobile'}
                                                        searchable={false}
                                                        value={productUnitData}
                                                        changeValue={setProductUnitData}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                            <Grid gutter={{ base: 6 }} mt={'6'}>
                                                <Grid.Col span={6}>
                                                    <InputForm
                                                        tooltip={t('ReorderQuantityValidateMessage')}
                                                        label=''
                                                        placeholder={t('PaymentMobile')}
                                                        required={false}
                                                        nextField={'transaction_id'}
                                                        form={form}
                                                        name={'payment_mobile'}
                                                        mt={16}
                                                        id={'payment_mobile'}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <InputForm
                                                        tooltip={t('TransactionIDValidateMessage')}
                                                        label=''
                                                        placeholder={t('TransactionID')}
                                                        required={false}
                                                        nextField={'status'}
                                                        form={form}
                                                        name={'transaction_id'}
                                                        mt={8}
                                                        id={'transaction_id'}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Tabs.Panel>
                                        <Tabs.Panel p={'xs'} pb={0} value="bank" pt="xs">

                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={'auto'}>
                                                    <SelectForm
                                                        tooltip={t('ProductUnitValidateMessage')}
                                                        label=''
                                                        placeholder={t('ChooseBankAccount')}
                                                        required={true}
                                                        name={'bank_account'}
                                                        form={form}
                                                        dropdownValue={productUnitDropdown}
                                                        mt={8}
                                                        id={'bank_account'}
                                                        nextField={'payment_mobile'}
                                                        searchable={false}
                                                        value={productUnitData}
                                                        changeValue={setProductUnitData}
                                                    />
                                                </Grid.Col>
                                            </Grid>

                                            <Grid gutter={{ base: 6 }} mt={'6'}>
                                                <Grid.Col span={6}>
                                                    <SelectForm
                                                        tooltip={t('ProductUnitValidateMessage')}
                                                        label=''
                                                        placeholder={t('ChooseBankAccount')}
                                                        required={true}
                                                        name={'BankAccountCard'}
                                                        form={form}
                                                        dropdownValue={productUnitDropdown}
                                                        mt={16}
                                                        id={'paymentCard_id'}
                                                        nextField={'transaction_id'}
                                                        searchable={false}
                                                        value={productUnitData}
                                                        changeValue={setProductUnitData}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <InputForm
                                                        tooltip={t('TransactionIDValidateMessage')}
                                                        label=''
                                                        placeholder={t('paymentCard_id')}
                                                        required={false}
                                                        nextField={'status'}
                                                        form={form}
                                                        name={'transaction_id'}
                                                        mt={8}
                                                        id={'transaction_id'}
                                                    />
                                                </Grid.Col>
                                            </Grid>

                                        </Tabs.Panel>
                                    </Tabs>
                                </Box>
                                <Box bg={`gray.2`} pb={'xs'}>
                                    <Box p={'xs'}>
                                        <SelectForm
                                            tooltip={t('ProductUnitValidateMessage')}
                                            label=''
                                            placeholder={t('SalesBy')}
                                            required={true}
                                            name={'mobile_account'}
                                            form={form}
                                            dropdownValue={productUnitDropdown}
                                            mt={8}
                                            id={'mobile_account'}
                                            nextField={'payment_mobile'}
                                            searchable={false}
                                            value={productUnitData}
                                            changeValue={setProductUnitData}
                                        />
                                    </Box>
                                    <Box p={'xs'} pt={0}>
                                        <Grid gutter={{ base: 6 }}  >
                                            <Grid.Col span={3}>
                                                <Switch fullWidth size="lg" w={'100%'} color={'red.3'} mt={'2'} ml={'6'} onLabel={t('Profit')} offLabel={t('Hide')} radius="xs" />
                                            </Grid.Col>
                                            <Grid.Col span={3}><Center fz={'xs'} mt={'xs'} c={'red'}>{currancySymbol} 1200</Center></Grid.Col>
                                            <Grid.Col span={3}><Center fz={'md'} mt={'4'}>Due</Center></Grid.Col>
                                            <Grid.Col span={3}><Center fz={'md'} mt={'4'} c={'red'} fw={'800'}>{currancySymbol} {salesSubTotalAmount.toFixed(2)}</Center></Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box p={'xs'} style={{ background: 'rgba(226,194,194,0.39)' }}>
                                        <Grid gutter={{ base: 6 }}>
                                            <Grid.Col span={3}>
                                                <Button fullWidth onClick={() => discountType()} variant="filled" fz={'xs'}
                                                    leftSection={
                                                        value === 'Flat' ? <IconCurrencyTaka size={14} /> : <IconPercentage size={14} />
                                                    } color="red">{value}</Button>
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <InputForm
                                                    tooltip={t('DiscountValidateMessage')}
                                                    label=''
                                                    placeholder={t('discount')}
                                                    required={false}
                                                    nextField={'status'}
                                                    form={form}
                                                    name={'transaction_id'}
                                                    mt={16}
                                                    id={'transaction_id'}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <InputForm
                                                    tooltip={t('DeliveryChargeValidateMessage')}
                                                    label=''
                                                    placeholder={t('Amount')}
                                                    required={false}
                                                    nextField={'status'}
                                                    form={form}
                                                    name={'amount'}
                                                    mt={8}
                                                    id={'amount'}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box p={'xs'} bg={`gray.2`}>
                                        <SelectForm
                                            tooltip={t('ProductUnitValidateMessage')}
                                            label=''
                                            placeholder={t('OrderProcess')}
                                            required={true}
                                            name={'mobile_account'}
                                            form={form}
                                            dropdownValue={productUnitDropdown}
                                            mt={8}
                                            id={'mobile_account'}
                                            nextField={'payment_mobile'}
                                            searchable={false}
                                            value={productUnitData}
                                            changeValue={setProductUnitData}
                                        />
                                    </Box>
                                    <Box p={'xs'} >
                                        <TextAreaForm
                                            tooltip={t('Address')}
                                            label=''
                                            placeholder={t('Narration')}
                                            required={false}
                                            nextField={'Status'}
                                            name={'address'}
                                            form={form}
                                            mt={8}
                                            id={'Address'}
                                        />
                                    </Box>
                                </Box>
                            </ScrollArea>

                            <Box mt={'xs'} style={{ borderTop: '1px solid red' }} pt={'xs'}>
                                <Button.Group fullWidth>
                                    <Button fullWidth variant="filled" leftSection={<IconPrinter size={14} />} color="green">Print</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconReceipt size={14} />} color="red">Pos</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconDeviceFloppy size={14} />} color="indigo">Save</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconStackPush size={14} />} color="yellow">Hold</Button>
                                </Button.Group>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'CompanyName'}
                            />
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>
        </Box>

    );
}
export default GeneralSalesForm;
