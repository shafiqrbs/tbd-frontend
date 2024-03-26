import React, {useEffect, useState} from "react";
import {json, useNavigate, useOutletContext} from "react-router-dom";
import classes from '../../../../assets/css/Tab.module.css';
import genericCss from '../../../../assets/css/Generic.module.css';

import {
    Button,
    rem, Flex, Tabs, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Select, Table, Progress,
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
    IconBuildingBank,

} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
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
import SalesAddCustomerModel from "./model/SalesAddCustomerModel.jsx";
import SalesViewCustomerModel from "./model/SalesViewCustomerModel.jsx";
import {getCustomerDropdown} from "../../../../store/core/utilitySlice";

function SalesForm(props) {
    // console.log(props.totalPurchaseAmount)
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

    const [currencySymbol, setcurrencySymbol] = useState(null);
   /* useEffect(() => {
        setcurrencySymbol(configData.currency.symbol)
    }, [configData.currency.symbol]);
*/
    const [salesSubTotalAmount, setSalesSubTotalAmount] = useState(0);
    const [salesProfitAmount, setSalesProfitAmount] = useState(0);
    const [salesVatAmount, setSalesVatAmount] = useState(0);
    const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);
    // const [salesDueAmount, setSalesDueAmount] = useState(props.salesSubTotalAmount);
    const [salesTotalAmount, setSalesTotalAmount] = useState(0);
    const [salesDueAmount, setSalesDueAmount] = useState(props.salesSubTotalAmount);




    // console.log(salesSubTotalAmount);
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 200; //TabList height 104
    const formHeight = mainAreaHeight - 195; //TabList height 104
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

    const [discountType, setDiscountType] = useToggle(['Flat', 'Percent']);



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

    const customerDropdownData = useSelector((state) => state.utilitySlice.customerDropdownData)

    let customerDropdown = customerDropdownData && customerDropdownData.length > 0 ?
        customerDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {
        dispatch(getCustomerDropdown('core/select/customer'))
    }, []);


    const form = useForm({
        initialValues: {
            discount: '',receive_amount:'',sales_by:'',order_process:'',narration:''
        },
      /*  validate: {
            product_id: (value,values) => {
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
        }*/
    });

    const [returnOrDueText, setReturnOrDueText] = useState('Due');

    useEffect(() => {
        setSalesSubTotalAmount(props.salesSubTotalAmount);
        setSalesDueAmount(props.salesSubTotalAmount);
    }, [props.salesSubTotalAmount]);

    useEffect(() => {
        const totalAmount = salesSubTotalAmount - salesDiscountAmount;
        setSalesTotalAmount(totalAmount);
        setSalesDueAmount(totalAmount);
        setSalesProfitAmount(totalAmount-props.totalPurchaseAmount)
    }, [salesSubTotalAmount, salesDiscountAmount]);

    useEffect(() => {
        let discountAmount = 0;
        if (form.values.discount && Number(form.values.discount) > 0) {
            if (discountType === 'Flat') {
                discountAmount = form.values.discount;
            } else if (discountType === 'Percent') {
                discountAmount = (salesSubTotalAmount * form.values.discount) / 100;
            }
        }
        setSalesDiscountAmount(discountAmount);

        let returnOrDueAmount = 0;
        if (form.values.receive_amount) {
            const text = salesTotalAmount < form.values.receive_amount ? 'Return' : 'Due';
            setReturnOrDueText(text);
            returnOrDueAmount = salesTotalAmount - form.values.receive_amount;
            setSalesDueAmount(returnOrDueAmount);
        }
    }, [form.values.discount, discountType, form.values.receive_amount, salesSubTotalAmount, salesTotalAmount]);


    const [profitShow, setProfitShow] = useState(false);


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


    return (
        <>
            <form onSubmit={form.onSubmit((values) => {
                const tempProducts = localStorage.getItem('temp-sales-products');
                // setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])

                const formValue = {...form.values};
                formValue['sub_total'] = salesSubTotalAmount;
                formValue['vat'] = salesVatAmount;
                formValue['discount_amount'] = salesDiscountAmount;
                formValue['discount_type'] = discountType;
                formValue['return_due_text'] = returnOrDueText;
                formValue['return_due_amount'] = salesDueAmount;
                formValue['total_amount'] = salesTotalAmount;
                formValue['items'] = tempProducts ? JSON.parse(tempProducts) : [];

                console.log(formValue)

                /*if (!values.barcode && !values.product_id){
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

                }*/

            })}>
                <Box>
                    <Grid columns={48}>
                        <Grid.Col span={42}>
                            <Box style={{ border: '1px solid rgba(226, 194, 194, 0.39)', borderRadius:'4px'}} >
                            <Box>
                                <Grid gutter={{base:1}}>
                                    <Grid.Col pt={'4'} span={10} mb={'4'}>
                                        <Box pl={'xs'} pt={'6'}>
                                        <SelectForm
                                            tooltip={t('CustomerValidateMessage')}
                                            label=''
                                            placeholder={t('Customer')}
                                            required={false}
                                            nextField={'name'}
                                            name={'category_id'}
                                            form={form}
                                            dropdownValue={customerDropdown}
                                            id={'category_id'}
                                            mt={1}
                                            searchable={false}
                                            value={categoryData}
                                            changeValue={setCategoryData}
                                        />
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Box pr={'xs'} pt={'xs'}>
                                        <Button
                                            w={'100%'}
                                            color={'red.2'}
                                            variant={'filled'}
                                            onClick={setAddCustomerModel}
                                        >
                                            <IconUserCog size={16}/>
                                        </Button>
                                        </Box>
                                    </Grid.Col>
                                    {addCustomerModel &&
                                    <SalesAddCustomerModel addCustomerModel={addCustomerModel}
                                                           setAddCustomerModel={setAddCustomerModel}/>
                                    }
                                </Grid>
                                <Box h={1} mt={'4'} bg={`gray.3`}></Box>
                                <Box mt={'2'} mb={'xs'}>
                                    <Grid gutter={{base: 6}} bg={'gray.2'}>
                                        <Grid.Col span={6}>
                                            <Box pl={'xl'}>
                                                <Text fz={'md'} order={1} fw={'800'}>1200000</Text>
                                                <Text fz={'xs'} c="dimmed" >{t('Outstanding')}</Text>
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text mt={'8'} mr={'xl'} style={{textAlign: 'right', float: 'right'}}>
                                                <Group>
                                                    <ActionIcon
                                                        variant="outline"
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
                                                    {viewCustomerModel &&
                                                    <SalesViewCustomerModel viewCustomerModel={viewCustomerModel}
                                                                            setCustomerViewModel={setCustomerViewModel}/>
                                                    }
                                                </Group>
                                            </Text>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>

                            <ScrollArea h={formHeight} scrollbarSize={2} type="never" bg={'gray.1'}>
                                <Box p={'xs'}>

                                    <Grid gutter={{base: 6}}>
                                        <Grid.Col span={6}>
                                            <Center fz={'md'} fw={'800'}>
                                                {currencySymbol} {salesSubTotalAmount.toFixed(2)}
                                            </Center>
                                            <Center fz={'xs'} c="dimmed" >{t('SubTotal')}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Center fz={'md'} fw={'800'}>
                                                {currencySymbol} {salesVatAmount.toFixed(2)}
                                            </Center>
                                            <Center fz={'xs'} c="dimmed">{t('VAT')}</Center>
                                        </Grid.Col>
                                    </Grid>

                                    <Grid gutter={{base: 6}}>
                                        <Grid.Col span={6}>
                                            <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{base: 6}}>
                                        <Grid.Col span={6}>
                                            <Center fz={'md'} fw={'800'}>
                                                {currencySymbol} {salesDiscountAmount && Number(salesDiscountAmount).toFixed(2)}
                                            </Center>
                                            <Center fz={'xs'} c="dimmed" >{t('Discount')}</Center>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Center fz={'md'} fw={'800'}>
                                                {currencySymbol} {salesTotalAmount.toFixed(2)}
                                            </Center>
                                            <Center fz={'xs'} c="dimmed">{t('Total')}</Center>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box mt={'xs'} bg={`gray.2`}>
                                    <Tabs variant="unstyled" defaultValue="mobile" classNames={classes}>
                                        <Tabs.List grow>
                                            <Tabs.Tab
                                                value="cash"
                                                fz={'xs'}
                                                leftSection={<IconWallet style={{width: rem(16), height: rem(16)}}/>}
                                            >
                                                {t('HandCash')}
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                value="mobile"
                                                fz={'xs'}
                                                leftSection={<IconDeviceMobileDollar style={{width: rem(16), height: rem(16)}}/>}
                                            >
                                                {t('MobileBanking')}
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                value="bank"
                                                fz={'xs'}
                                                leftSection={<IconBuildingBank style={{width: rem(16), height: rem(16)}}/>}
                                            >
                                                {t('PaymentCard')}
                                            </Tabs.Tab>
                                        </Tabs.List>
                                        <Tabs.Panel p={'xs'} pb={0} value="mobile" pt="xs">
                                            <Grid gutter={{base: 6}}>
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
                                            <Grid gutter={{base: 6}} mt={'6'}>
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

                                            <Grid gutter={{base: 6}}>
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

                                            <Grid gutter={{base: 6}} mt={'6'}>
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
                                            name={'sales_by'}
                                            form={form}
                                            dropdownValue={productUnitDropdown}
                                            mt={8}
                                            id={'sales_by'}
                                            nextField={'payment_mobile'}
                                            searchable={false}
                                            value={productUnitData}
                                            changeValue={setProductUnitData}
                                        />
                                    </Box>
                                    <Box p={'xs'} pt={0}>
                                        <Grid gutter={{base: 6}}>
                                            <Grid.Col span={3}>
                                                <Switch
                                                    fullWidth
                                                    size="lg"
                                                    w={'100%'}
                                                    color={'red.3'}
                                                    mt={'2'}
                                                    ml={'6'}
                                                    onLabel={t('Profit')}
                                                    offLabel={t('Hide')}
                                                    radius="xs"
                                                    onChange={(event) => setProfitShow(event.currentTarget.checked)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <Center fz={'xs'} mt={'xs'} c={'red'}>
                                                    {currencySymbol} {profitShow && salesProfitAmount}
                                                </Center>
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <Center fz={'md'} mt={'4'}>{returnOrDueText}</Center>
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <Center fz={'md'} mt={'4'} c={'red'} fw={'800'}>
                                                    {currencySymbol} {salesDueAmount.toFixed(2)}
                                                </Center>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box p={'xs'} className={genericCss.boxBackground}>
                                        <Grid gutter={{base: 6}}>
                                            <Grid.Col span={4}>
                                                <Button
                                                    fullWidth
                                                    onClick={() => setDiscountType()}
                                                    variant="filled"
                                                    fz={'xs'}
                                                    leftSection={
                                                        discountType === 'Flat' ? <IconCurrencyTaka size={14}/> :
                                                                <IconPercentage size={14}/>
                                                        } color="red.4">
                                                    {discountType}
                                                </Button>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputForm
                                                    tooltip={t('DiscountValidateMessage')}
                                                    label=''
                                                    placeholder={t('Discount')}
                                                    required={false}
                                                    nextField={'receive_amount'}
                                                    form={form}
                                                    name={'discount'}
                                                    mt={16}
                                                    id={'discount'}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputForm
                                                    tooltip={t('DeliveryChargeValidateMessage')}
                                                    label=''
                                                    placeholder={t('Amount')}
                                                    required={false}
                                                    nextField={'status'}
                                                    form={form}
                                                    name={'receive_amount'}
                                                    mt={8}
                                                    id={'receive_amount'}
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
                                            name={'order_process'}
                                            form={form}
                                            // dropdownValue={productUnitDropdown}
                                            dropdownValue={['Order','Process']}
                                            mt={8}
                                            id={'order_process'}
                                            nextField={'narration'}
                                            searchable={false}
                                            value={productUnitData}
                                            changeValue={setProductUnitData}
                                        />
                                    </Box>
                                    <Box p={'xs'} pt={'0'}>
                                        <TextAreaForm
                                            tooltip={t('Narration')}
                                            label=''
                                            placeholder={t('Narration')}
                                            required={false}
                                            nextField={'Status'}
                                            name={'narration'}
                                            form={form}
                                            mt={8}
                                            id={'narration'}
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
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'CompanyName'}
                            />
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>

        </>

    );
}
export default SalesForm;
