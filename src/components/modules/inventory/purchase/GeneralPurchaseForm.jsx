import React, {useEffect, useState} from "react";
import {json, useNavigate, useOutletContext} from "react-router-dom";
import genericCss from '../../../../assets/css/Generic.module.css';

import {
    Button,
    rem, Flex, Tabs, Center, Switch, ActionIcon,TextInput,NativeSelect,Fieldset,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Select, Table,Popover
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconInfoCircle,IconPercentage,IconMathSymbols,IconPlusMinus,IconCoinMonero,IconSortAscendingNumbers,
    IconPlus, IconUserCircle, IconRefreshDot, IconEdit, IconTrash, IconSum, IconX,IconBarcode
} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications, showNotification} from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
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
import {editEntityData, setDropdownLoad, setInsertType} from "../../../../store/inventory/crudSlice";
import ProductForm from "../product/ProductForm";
import ProductUpdateForm from "../product/ProductUpdateForm";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";
import SalesCardItems from "./SalesCardItems.jsx";
import SalesAddStockProductModel from "./model/SalesAddStockProductModel.jsx";
import SalesAddCustomerModel from "./model/SalesAddCustomerModel.jsx";
import SalesViewCustomerModel from "./model/SalesViewCustomerModel.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import PurchaseForm from "./PurchaseForm";
import CategoryGroupTable from "../category-group/CategoryGroupTable";
import CategoryGroupForm from "../category-group/CategoryGroupForm";
import CategoryGroupUpdateForm from "../category-group/CategoryGroupUpdateForm";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import {DataTable} from "mantine-datatable";


function GeneralPurchaseForm(props) {
    const { currancySymbol,allowZeroPercentage } = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 180; //TabList height 104
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

    const inputGroupCurrency = (
        <Text  style={{ textAlign: 'right',width:'100%',paddingRight:16 }}
               color={'gray'}
        >
            {currancySymbol}
        </Text>
    );

    const [displayNameValue,setDisplayNameValue] = useState('');

    return (

        <Box>
            <Grid columns={24} gutter={{base: 12}}>
                <Grid.Col span={16} >
                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                        <Box>
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
                            <Box  pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                <Grid columns={24} gutter={{base: 2}} >
                                    <Grid.Col span={4}>
                                        <InputNumberForm
                                            tooltip={t('BarcodeValidateMessage')}
                                            label=''
                                            placeholder={t('barcode')}
                                            required={true}
                                            nextField={'EntityFormSubmit'}
                                            form={form}
                                            name={'barcode'}
                                            id={'barcode'}
                                            leftSection={<IconBarcode size={16} opacity={0.5}/>}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={20}>
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
                                </Grid>
                                <Box mt={'xs'} pb={'xs'}>
                                    <Grid columns={24} gutter={{base: 2}}>
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
                                                leftSection={<IconCoinMonero size={16} opacity={0.5}/>}
                                                rightSectionWidth={30}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <InputButtonForm
                                                type="number"
                                                tooltip={t('PercentValidateMessage')}
                                                label=''
                                                placeholder={t('Quantity')}
                                                required={true}
                                                nextField={'percent'}
                                                form={form}
                                                name={'quantity'}
                                                id={'quantity'}
                                                leftSection={<IconSortAscendingNumbers size={16} opacity={0.5}/>}
                                                rightSection={inputGroupText}
                                                rightSectionWidth={50}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <InputButtonForm
                                                tooltip={t('PercentValidateMessage')}
                                                label=''
                                                placeholder={t('Percent')}
                                                required={true}
                                                nextField={'EntityFormSubmit'}
                                                form={form}
                                                name={'percent'}
                                                id={'percent'}
                                                leftSection={<IconPercentage size={16} opacity={0.5}/>}
                                                rightSection={inputGroupCurrency}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <InputButtonForm
                                                tooltip={t('SalesPriceValidateMessage')}
                                                label=''
                                                placeholder={t('SalesPrice')}
                                                required={true}
                                                nextField={'EntityFormSubmit'}
                                                form={form}
                                                name={'sales_price'}
                                                id={'sales_price'}
                                                disabled={form.values.percent}
                                                leftSection={<IconPlusMinus size={16} opacity={0.5}/>}
                                                rightSection={inputGroupCurrency}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <InputButtonForm
                                                tooltip={t('SalesPriceValidateMessage')}
                                                label=''
                                                placeholder={t('SubTotal')}
                                                required={true}
                                                nextField={'EntityFormSubmit'}
                                                form={form}
                                                name={'sub_total'}
                                                id={'sub_total'}
                                                leftSection={<IconSum size={16} opacity={0.5}/>}
                                                rightSection={inputGroupCurrency}
                                                disabled={selectProductDetails && selectProductDetails.sub_total && (selectProductDetails.sub_total).toFixed(2)}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <>
                                                {!saveCreateLoading &&
                                                <Button
                                                    size="sm"
                                                    color={`red.5`}
                                                    type="submit"
                                                    mt={0}
                                                    mr={'xs'}
                                                    w={'100%'}
                                                    id="EntityFormSubmit"
                                                    leftSection={<IconDeviceFloppy size={16}/>}
                                                >
                                                    <Flex direction={`column`} gap={0}>
                                                        <Text fz={12} fw={400}>
                                                            {t("Add")}
                                                        </Text>
                                                    </Flex>
                                                </Button>
                                                }
                                            </>
                                        </Grid.Col>
                                        <Grid.Col span={1} bg={'white'}>
                                            <>
                                                <Popover width={'450'} trapFocus position="bottom" withArrow shadow="xl">
                                                    <Popover.Target>
                                                        <Tooltip
                                                            multiline
                                                            w={420}
                                                            withArrow
                                                            transitionProps={{ duration: 200 }}
                                                            label="Use this button to save this information in your profile, after that you will be able to access it any time and share it via email."
                                                        >
                                                            <ActionIcon fullWidth variant="outline" size={'lg'} color="red.5" mt={'1'} aria-label="Settings">
                                                                <IconPlus style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </Popover.Target>
                                                    <Popover.Dropdown>
                                                        <Fieldset legend="Add Product information" variant="filled">
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
                                                        </Fieldset>
                                                    </Popover.Dropdown>
                                                </Popover>


                                                {addStockProductModel &&
                                                <SalesAddStockProductModel
                                                    addStockProductModel={addStockProductModel}
                                                    setAddStockProductModel={setAddStockProductModel}
                                                />
                                                }
                                            </>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                        </form>
                        </Box>
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
                                    {accessor: 'mrp', title: "MRP"},
                                    {accessor: 'quantity', title: "Quantity"},
                                    {accessor: 'percent', title: "Percent",
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
                                                              labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                              onCancel: () => console.log('Cancel'),
                                                              onConfirm: () => {
                                                                  dispatch(deleteEntityData('inventory/category-group/' + data.id))
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
                                totalRecords={ 100}
                                recordsPerPage={10}
                                loaderSize="xs"
                                loaderColor="grape"
                                height={height}
                                scrollAreaProps={{type: 'never'}}
                            />
                        </Box>

                    </Box>
                </Grid.Col>
                <Grid.Col span={8} >
                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <PurchaseForm />
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>

    );
}
export default GeneralPurchaseForm;
