import React, {useEffect, useState} from "react";
import {json, useNavigate, useOutletContext} from "react-router-dom";
import genericCss from '../../../../assets/css/Generic.module.css';
import classes from '../../../../assets/css/Tab.module.css';

import {
    Button,
    rem, Flex, Tabs, Center, Switch, ActionIcon,TextInput,NativeSelect,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Select, Table,
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
    IconX
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
import SwitchForm from "../../../form-builders/SwitchForm";
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
import CategoryGroupModal from "../category/CategoryGroupModal";
import {setDropdownLoad} from "../../../../store/inventory/crudSlice";
import ProductForm from "../product/ProductForm";
import ProductUpdateForm from "../product/ProductUpdateForm";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";
import SalesCardItems from "./SalesCardItems.jsx";
import SalesAddStockProductModel from "./model/SalesAddStockProductModel.jsx";
import SalesAddCustomerModel from "./model/SalesAddCustomerModel.jsx";
import SalesViewCustomerModel from "./model/SalesViewCustomerModel.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import SalesForm from "./SalesForm";


function GeneralSalesForm(props) {
    const { currancySymbol,allowZeroPercentage } = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 200; //TabList height 104
    const formHeight = mainAreaHeight - 220; //TabList height 104
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

    // const [salesSubTotal,setSalesSubTotal] = useState(0)
    let salesSubTotalAmount = 0


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
            product_id: '',mrp:'', sales_price: '',percent:'',barcode:'',sub_total:'',quantity:''
        },
        validate: {
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
        }
    });


    const [selectProductDetails,setSelectProductDetails] = useState('')

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
        <Text  style={{ textAlign: 'right',width:'100%',paddingRight:16 }}
            color={'gray'}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );


    return (
        <Box bg={"white"} mt={`xs`}>


                <Box mt={'xs'}>
                 <Grid columns={24}>
                    <Grid.Col span={16}>
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
                            <Box pl={`xs`} pr={8} pt={'xs'} className={genericCss.boxBackground} >
                                <Grid columns={24} gutter={{base: 2}} >
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
                                    <Grid.Col span={18}>
                                        <SelectServerSideForm
                                            tooltip={t('ChooseStockProduct')}
                                            label=''
                                            placeholder={t('ChooseStockProduct')}
                                            required = {false}
                                            nextField = {'quantity'}
                                            name = {'product_id'}
                                            form = {form}
                                            mt={8}
                                            id = {'product_id'}
                                            searchable={true}
                                            searchValue={searchValue}
                                            setSearchValue={setSearchValue}
                                            dropdownValue={productDropdown}
                                        />

                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Button
                                            w={'100%'}
                                            color={'orange.3'}
                                            variant={'filled'}
                                            onClick={setAddStockProductModel}>
                                            <IconPlus size={16} />
                                        </Button>
                                    </Grid.Col>
                                    {addStockProductModel &&
                                    <SalesAddStockProductModel
                                        addStockProductModel={addStockProductModel}
                                        setAddStockProductModel={setAddStockProductModel}
                                    />
                                    }

                                </Grid>
                                <Box mt={'xs'} pb={'xs'}>
                                <Grid columns={24} gutter={{base: 2}}>
                                    <Grid.Col span={4}>
                                        <InputForm
                                            tooltip={t('SalesPriceValidateMessage')}
                                            label=''
                                            placeholder={t('MRP')}
                                            required={true}
                                            nextField={'EntityFormSubmit'}
                                            form={form}
                                            name={'sales_price'}
                                            id={'sales_price'}
                                            disabled={selectProductDetails && form.values.mrp}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <InputButtonForm
                                            type="number"
                                            tooltip={t('PercentValidateMessage')}
                                            label=''
                                            placeholder={t('Quantity')}
                                            required={true}
                                            nextField={'EntityFormSubmit'}
                                            form={form}
                                            name={'quantity'}
                                            id={'quantity'}
                                            rightSection={inputGroupText}
                                            rightSectionWidth={80}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
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
                                    <Grid.Col span={4}>
                                        <InputForm
                                            tooltip={t('SalesPriceValidateMessage')}
                                            label=''
                                            placeholder={t('SubTotal')}
                                            required={true}
                                            nextField={'EntityFormSubmit'}
                                            form={form}
                                            name={'sub_total'}
                                            id={'sub_total'}
                                            disabled={selectProductDetails && selectProductDetails.sub_total && (selectProductDetails.sub_total).toFixed(2)}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <>
                                            {!saveCreateLoading &&
                                            <Button
                                                size="sm"
                                                color={`red`}
                                                type="submit"
                                                mt={0}
                                                mr={'xs'}
                                                w={'100%'}
                                                id="EntityFormSubmit"
                                                leftSection={<IconDeviceFloppy size={16}/>}
                                            >
                                                <Flex direction={`column`} gap={0}>
                                                    <Text fz={12} fw={400}>
                                                        {t("AddNew")}
                                                    </Text>
                                                </Flex>
                                            </Button>
                                            }
                                        </>
                                    </Grid.Col>
                                </Grid>
                                </Box>
                            </Box>
                        </Box>
                        </form>
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
                                        return(
                                            <SalesCardItems item={item} index={index} setLoadCardProducts={setLoadCardProducts} symbol={currancySymbol}/>
                                        )
                                    })
                                )}
                                {/*</ScrollArea>*/}
                            </Table.Tbody>
                            <Table.Tfoot>
                                <Table.Tr style={{ borderTop: '1px solid #d6dce3'}}>
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
                    <Grid.Col span={8} bg={'white'} >
                       <SalesForm />
                    </Grid.Col>

                </Grid>
                </Box>

        </Box>

    );
}
export default GeneralSalesForm;
