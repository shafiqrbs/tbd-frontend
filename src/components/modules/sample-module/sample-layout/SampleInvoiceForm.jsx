import React, {useEffect, useState} from "react";
import {json, useNavigate, useOutletContext} from "react-router-dom";
import classes from '../../../../assets/css/Tab.module.css';


import {
    Button,
    rem, Flex, Tabs, Center, Switch, ActionIcon,Radio,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Select, Table, Progress, Popover,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
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
    IconDiscountOff,
    IconCurrency,
    IconCurrencyTaka,
    IconRestore,
    IconPhoto,
    IconMessage,
    IconEyeEdit,
    IconRowRemove,
    IconTrash,
    IconX,
    IconWallet,
    IconDeviceMobileDollar,
    IconBuildingBank, IconUserCircle, IconRefreshDot, IconCoinMonero,

} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {notifications, showNotification} from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import {getBrandDropdown, getCategoryDropdown} from "../../../../store/inventory/utilitySlice";
import {getSettingDropdown,getProductUnitDropdown} from "../../../../store/utility/utilitySlice.js";

import {
    setEntityNewData,
    setFetching,
    setFormLoading,
    setValidationData,
    storeEntityData,
    getShowEntityData,
    updateEntityData,

} from "../../../../store/inventory/crudSlice.js";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import InputButtonForm from "../../../form-builders/InputButtonForm";


function SampleInvoiceForm(props) {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const insertType = useSelector((state) => state.crudSlice.insertType)
    useEffect(() => {
        const updateProgress = () => setProgress((oldProgress) => {
            if (oldProgress === 100) return 100;
            const diff = Math.random() * 20;
            return Math.min(oldProgress + diff, 100);
        });
        const timer = setInterval(updateProgress, 100);
        return () => clearInterval(timer);
    }, []);

    const configData = useSelector((state) => state.inventoryCrudSlice.showEntityData)

    useEffect(() => {
        dispatch(getShowEntityData('inventory/config'))
    }, []);
    const [salesSubTotalAmount, setSalesSubTotalAmount] = useState(0);
    const {isOnline, mainAreaHeight} = useOutletContext();
    const formHeight = mainAreaHeight - 200; //TabList height 104
    const navigate = useNavigate();
    const [opened, {open, close}] = useDisclosure(false);
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

    const [tempCardProducts,setTempCardProducts] = useState([])
    const [loadCardProducts,setLoadCardProducts] = useState(false)




    useEffect(() => {
        const tempProducts = localStorage.getItem('temp-sales-products');
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])
        setLoadCardProducts(false)
    },[loadCardProducts])


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
            return ({'label': type.name, 'value': String(type.id)})
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
            return ({'label': type.name, 'value': String(type.id)})
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
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {
        const value = {
            url : 'utility/select/setting',
            param : {
                'dropdown-type' : 'product-type'
            }
        }
        dispatch(getSettingDropdown(value))
    }, []);

    const [productUnitData, setProductUnitData] = useState(null);
    const productUnitDropdownData = useSelector((state) => state.utilityUtilitySlice.productUnitDropdown)
    let productUnitDropdown = productUnitDropdownData && productUnitDropdownData.length > 0 ?
        productUnitDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []
    useEffect(() => {
        const value = {
            url: 'utility/select/product-unit'
        }
        dispatch(getProductUnitDropdown(value))
    }, []);

    const form = useForm({
        initialValues: {
            product_id: ''
        },
    });
    const [selectProductDetails,setSelectProductDetails] = useState('')
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

    const inputGroupText = (
        <Text  style={{ textAlign: 'right',width:'100%',paddingRight:16 }}
               color={'gray'}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );

    const inputGroupCurrency = (
        <Text  style={{ textAlign: 'right',width:'100%',paddingRight:16 }}
               color={'gray'}
        >
            {configData.currency.symbol}
        </Text>
    );
    const [currencySymbol, setcurrencySymbol] = useState(null);
     useEffect(() => {
         setcurrencySymbol(configData.currency.symbol)
     }, [configData.currency.symbol]);


    return (
        <>
            <form onSubmit={form.onSubmit((values) => {

                if (!values.barcode && !values.product_id){
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
                    },1000)
                }else {
                    const cardProducts = localStorage.getItem('temp-sales-products');
                    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
                    const storedProducts = localStorage.getItem('user-products');
                    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

                    if (values.product_id && !values.barcode) {
                        if (!allowZeroPercentage){
                            showNotification({
                                color: 'pink',
                                title: t('WeNotifyYouThat'),
                                message: t('ZeroQuantityNotAllow'),
                                autoClose: 1500,
                                loading : true,
                                withCloseButton: true,
                                position: 'top-center',
                                style: { backgroundColor: 'mistyrose' },
                            });
                        }else {
                            handleAddProductByProductId(values, myCardProducts, localProducts);
                        }
                    } else if (!values.product_id && values.barcode) {
                        handleAddProductByBarcode(values, myCardProducts, localProducts);
                    }

                }

            })}>


                <Box>
                    <Grid columns={48}>
                        <Box className={'borderRadiusAll'} >
                            <Box>
                                <Box pl={'xs'} pr={'xs'} pb={'xs'} className={'boxBackground'}>
                                    <Grid gutter={{base:1}}>
                                        <Grid.Col span={11} pt={'4'} >
                                            <Box  pt={'6'}>
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
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <Box  pt={'xs'}>
                                                <Popover width={'450'} trapFocus position="bottom" withArrow shadow="xl">
                                                    <Popover.Target>
                                                        <Tooltip
                                                            multiline
                                                            w={420}
                                                            withArrow
                                                            transitionProps={{ duration: 200 }}
                                                            label="Use this button to save this information in your profile, after that you will be able to access it any time and share it via email."
                                                        >
                                                            <ActionIcon fullWidth variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings">
                                                                <IconUserCog style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </Popover.Target>
                                                    <Popover.Dropdown>
                                                        <InputNumberForm
                                                            tooltip={t('SalesPriceValidateMessage')}
                                                            label={t('Name')}
                                                            placeholder={t('SalesPrice')}
                                                            required={true}
                                                            nextField={'EntityFormSubmit'}
                                                            form={form}
                                                            name={'sales_price'}
                                                            id={'sales_price'}
                                                            disabled={form.values.percent}
                                                            leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                                            rightIcon={<IconUserCircle size={16} opacity={0.5}/>}
                                                        />
                                                        <InputNumberForm
                                                            tooltip={t('SalesPriceValidateMessage')}
                                                            label={t('Name')}
                                                            placeholder={t('SalesPrice')}
                                                            required={true}
                                                            nextField={'EntityFormSubmit'}
                                                            form={form}
                                                            mt={'md'}
                                                            name={'sales_price'}
                                                            id={'sales_price'}
                                                            disabled={form.values.percent}
                                                            leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                                            rightIcon={<IconUserCircle size={16} opacity={0.5}/>}
                                                        />
                                                        <Box mt={'xs'}>
                                                            <Grid columns={12} gutter={{base: 1}} >
                                                                <Grid.Col span={6}>&nbsp;</Grid.Col>
                                                                <Grid.Col span={2}>
                                                                    <Button
                                                                        variant="transparent"
                                                                        size="sm"
                                                                        color={`red.5`}
                                                                        type="submit"
                                                                        mt={0}
                                                                        mr={'xs'}
                                                                        fullWidth
                                                                        id="EntityFormSubmit"
                                                                    >
                                                                        <IconRefreshDot style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                    </Button>
                                                                </Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <Button
                                                                        size="sm"
                                                                        color={`red.5`}
                                                                        type="submit"
                                                                        mt={0}
                                                                        mr={'xs'}
                                                                        fullWidth
                                                                        id="EntityFormSubmit"
                                                                        leftSection={<IconDeviceFloppy size={16}/>}
                                                                    >
                                                                        <Flex direction={`column`} gap={0}>
                                                                            <Text fz={12} fw={400}>
                                                                                {t("Add")}
                                                                            </Text>
                                                                        </Flex>
                                                                    </Button>
                                                                </Grid.Col>
                                                            </Grid>
                                                        </Box>
                                                    </Popover.Dropdown>
                                                </Popover>
                                            </Box>
                                        </Grid.Col>

                                    </Grid>
                                </Box>
                                <Box>
                                    <Grid gutter={{base: 6}} bg={'red.1'}>
                                        <Grid.Col span={6}>
                                            <Box pl={'xl'} pb={'6'}>
                                                <Text fz={'md'} order={1} fw={'800'}>1200000</Text>
                                                <Text fz={'xs'} c="dimmed" >{t('Outstanding')}</Text>
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={6} >
                                            <Text mt={'8'} mr={'xl'} style={{textAlign: 'right', float: 'right'}}>
                                                <Group>
                                                    <ActionIcon bg={'white'}  variant="outline"
                                                                color={'red'} >
                                                        <IconMessage size={18} stroke={1.5}/>
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="filled"
                                                        color={'red'}
                                                        onClick={setCustomerViewModel}
                                                    >
                                                        <IconEyeEdit
                                                            size={18}
                                                            stroke={1.5}
                                                        />
                                                    </ActionIcon>

                                                </Group>
                                            </Text>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                            <ScrollArea h={formHeight} scrollbarSize={2} type="never" bg={'gray.1'}>
                                <Box p={'xs'} pb={'0'}>
                                    <Grid gutter={{base: 4}}>
                                        <Grid.Col span={3}>
                                            <Center fz={'md'}
                                                    fw={'800'}>{currencySymbol} {salesSubTotalAmount.toFixed(2)}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Center fz={'md'}
                                                    fw={'800'}>{currencySymbol} {salesSubTotalAmount.toFixed(2)}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Center fz={'md'}
                                                    fw={'800'}>{currencySymbol} {salesSubTotalAmount.toFixed(2)}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Center fz={'md'}
                                                    fw={'800'}>{currencySymbol} {salesSubTotalAmount.toFixed(2)}</Center>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{base: 4}}>
                                        <Grid.Col span={3}>
                                            <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{base: 4}}>
                                        <Grid.Col span={3}>
                                            <Center fz={'xs'} c="dimmed" >{t('SubTotal')}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Center fz={'xs'} c="dimmed" >{t('Discount')}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Center fz={'xs'} c="dimmed">{t('VAT')}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Center fz={'xs'} c="dimmed">{t('Total')}</Center>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box mt={'xs'} pl={'8'} pt={'xs'} pr={'xs'} bg={`white`}>
                                    <Grid columns={'16'}  gutter="6">
                                        <Grid.Col span={4}>
                                            <input
                                                type="radio" name="emotion"
                                                id="sad" className="input-hidden"/>
                                            <label htmlFor="sad">
                                                <img
                                                    src="https://via.placeholder.com/80x80/DDFFDD/FFFFFF?Text=Header"
                                                    alt="I'm sad"/>
                                            </label>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <input
                                                type="radio" name="emotion"
                                                id="good" className="input-hidden"/>
                                            <label htmlFor="good">
                                                <img
                                                    src="https://via.placeholder.com/80x80/DDDDDD/FFFFFF?Text=Header"
                                                    alt="I'm sad"/>
                                            </label>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <input
                                                type="radio" name="emotion"
                                                id="new" className="input-hidden"/>
                                            <label htmlFor="new">
                                                <img
                                                    src="https://via.placeholder.com/80x80/FF0000/FFFFFF?Text=Header"
                                                    alt="I'm sad"/>
                                            </label>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <input
                                                type="radio" name="emotion"
                                                id="good" className="input-hidden"/>
                                            <label htmlFor="good">
                                                <img
                                                    src="https://via.placeholder.com/80x80/EEEEEE/FFFFFF?Text=Header"
                                                    alt="I'm sad"/>
                                            </label>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <input
                                                type="radio" name="emotion"
                                                id="sad" className="input-hidden"/>
                                            <label htmlFor="sad">
                                                <img
                                                    src="https://via.placeholder.com/80x80/EEEEEE/FFFFFF?Text=Header"
                                                    alt="I'm sad"/>
                                            </label>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box  pb={'xs'}>
                                    <Box p={'xs'} className={'boxBackground'} mt={'xs'} pt={'xs'} mb={'xs'} pb={'xs'} >
                                        <Grid gutter={{base: 6}}>
                                            <Grid.Col span={3}>
                                                <Switch fullWidth  size="lg" w={'100%'} color={'red.3'}
                                                        ml={'6'} pb={'8'} onLabel={t('Profit')} offLabel={t('Hide')}
                                                        radius="xs"/>
                                            </Grid.Col>
                                            <Grid.Col span={3}><Center fz={'xs'} mt={'8'}
                                                                       c={'red'}>{currencySymbol} 1200</Center></Grid.Col>
                                            <Grid.Col span={3}><Center fz={'md'} mt={'4'}>Due</Center></Grid.Col>
                                            <Grid.Col span={3}><Center fz={'md'} mt={'4'} c={'red'}
                                                                       fw={'800'}>{currencySymbol} {salesSubTotalAmount.toFixed(2)}</Center></Grid.Col>
                                        </Grid>
                                        <Grid gutter={{base: 6}}>
                                            <Grid.Col span={4}>
                                                <Button fullWidth onClick={() => discountType()} variant="filled"
                                                        fz={'xs'}
                                                        leftSection={
                                                            value === 'Flat' ? <IconCurrencyTaka size={14}/> :
                                                                <IconPercentage size={14}/>
                                                        } color="red.4">{value}</Button>
                                            </Grid.Col>
                                            <Grid.Col span={4}>

                                                <InputButtonForm
                                                    tooltip={t('PercentValidateMessage')}
                                                    label=''
                                                    type="number"
                                                    placeholder={t('Discount')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'percent'}
                                                    id={'percent'}
                                                    leftSection={<IconDiscountOff size={16} opacity={0.5}/>}
                                                    rightSection={inputGroupCurrency}
                                                    rightSectionWidth={30}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputButtonForm
                                                    type="number"
                                                    tooltip={t('PercentValidateMessage')}
                                                    label=''
                                                    placeholder={t('MRP price')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'salesPrice'}
                                                    id={'salesPrice'}
                                                    rightSection={inputGroupCurrency}
                                                    leftSection={<IconCurrency size={16} opacity={0.5}/>}
                                                    rightSectionWidth={30}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box p={'xs'} pt={0} >
                                        <SelectForm
                                            tooltip={t('ProductUnitValidateMessage')}
                                            label=''
                                            placeholder={t('SalesBy')}
                                            required={true}
                                            name={'mobile_account'}
                                            form={form}
                                            dropdownValue={productUnitDropdown}
                                            mt={0}
                                            id={'mobile_account'}
                                            nextField={'payment_mobile'}
                                            searchable={false}
                                            value={productUnitData}
                                            changeValue={setProductUnitData}
                                        />
                                    </Box>
                                    <Box p={'xs'} pt={0} >
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
                                    <Box p={'xs'} pt={'0'} pb={0}>
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
                            <Box>
                                <Button.Group fullWidth>
                                    <Button fullWidth variant="filled" leftSection={<IconPrinter size={14}/>}
                                            color="green.5">Print</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconReceipt size={14}/>}
                                            color="red.5">Pos</Button>
                                    <Button type={'submit'} fullWidth variant="filled" leftSection={<IconDeviceFloppy size={14}/>}
                                            color="cyan.5">Save</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconStackPush size={14}/>}
                                            color="orange.5">Hold</Button>
                                </Button.Group>
                            </Box>
                        </Box>
                    </Grid>
                </Box>
            </form>

        </>

    );
}
export default SampleInvoiceForm;
