import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Group, Text, Title, Flex,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck, IconPencilBolt, IconPlus
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/core/crudSlice.js";
import {getCustomerDropdown} from "../../../../store/core/utilitySlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import {getBrandDropdown, getCategoryDropdown} from "../../../../store/inventory/utilitySlice.js";
import {getProductUnitDropdown, getSettingDropdown} from "../../../../store/utility/utilitySlice.js";

function ProductUpdateForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [opened, {open, close}] = useDisclosure(false);

    const customerDropdownData = useSelector((state) => state.utilitySlice.customerDropdownData)
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

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
    }, []);let customerDropdown = customerDropdownData && customerDropdownData.length > 0 ?
        customerDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {
        dispatch(getCustomerDropdown('core/select/customer'))
    }, []);


    const form = useForm({
        initialValues: {
            product_type_id: '', category_id: '', unit_id: '', name: '', alternative_name: '',barcode:'',sku:'',brand_id:'',opening_quantity:'',sales_price:'',purchase_price:'',min_quantity:'',reorder_quantity:'',status:true
        },
        validate: {
            product_type_id: isNotEmpty(),
            category_id: isNotEmpty(),
            unit_id: isNotEmpty(),
            name: hasLength({min: 2, max: 20}),
            sales_price: (value) => {
                const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                if (!isNumberOrFractional) {
                    return true;
                }
            },
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            product_type_id: entityEditData.product_type_id?entityEditData.product_type_id:'',
            category_id: entityEditData.category_id?entityEditData.category_id:'',
            unit_id: entityEditData.unit_id?entityEditData.unit_id:'',
            name: entityEditData.product_name?entityEditData.product_name:'',
            alternative_name: entityEditData.alternative_name?entityEditData.alternative_name:'',
            barcode: entityEditData.barcode?entityEditData.barcode:'',
            sku: entityEditData.sku?entityEditData.sku:'',
            brand_id: entityEditData.brand_id?entityEditData.brand_id:'',
            opening_quantity: entityEditData.opening_quantity?entityEditData.opening_quantity:'',
            sales_price: entityEditData.sales_price?entityEditData.sales_price:'',
            purchase_price: entityEditData.purchase_price?entityEditData.purchase_price:'',
            min_quantity: entityEditData.min_quantity?entityEditData.min_quantity:'',
            reorder_quantity: entityEditData.reorder_quantity?entityEditData.reorder_quantity:'',
            status: entityEditData.status?entityEditData.status:'',
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [dispatch, setFormData])


    useHotkeys([['alt+n', () => {
        document.getElementById('product_type_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('UserFormSubmit').click()
    }]], []);


    return (
        <Box bg={"white"} mt={`xs`}>
            <form onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: 'Please confirm your action',
                    children: (
                        <Text size="sm">
                            This action is so important that you are required to confirm it with a
                            modal. Please click
                            one of these buttons to proceed.
                        </Text>
                    ),
                    labels: {confirm: 'Confirm', cancel: 'Cancel'},
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        setSaveCreateLoading(true)

                        const storedProducts = localStorage.getItem('user-products');
                        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

                        const updatedProducts = localProducts.map(product => {
                            if (product.id === entityEditData.id) {
                                return {
                                    ...product,
                                    product_name: values.name,
                                    alternative_name : values.alternative_name
                                };
                            }
                            return product
                        });
                        localStorage.setItem('user-products', JSON.stringify(updatedProducts));

                        const value = {
                            url: 'inventory/product/' + entityEditData.id,
                            data: values
                        }

                        dispatch(updateEntityData(value))

                        notifications.show({
                            color: 'teal',
                            title: t('UpdateSuccessfully'),
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 700,
                            style: {backgroundColor: 'lightgray'},
                        });

                        setTimeout(() => {
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            setCategoryData(null)
                            setBrandData(null)
                            setProductTypeData(null)
                            setProductUnitData(null)
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                        }, 700)
                    },
                });
            })}>
                <Box pb={`xs`} pl={`xs`} pr={8}>
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('ProductInformation')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0} gap={0}>
                                <>
                                    {!saveCreateLoading && isOnline &&
                                        <Button
                                        size="xs"
                                        color={`indigo.6`}
                                        type="submit"
                                        mt={4}
                                        mr={'xs'}
                                        id="VendorFormSubmit"
                                        leftSection={<IconPencilBolt size={16}/>}
                                    >

                                        <Flex direction={`column`} gap={0}>
                                            <Text fz={12} fw={400}>
                                                {t("EditAndSave")}
                                            </Text>
                                        </Flex>
                                    </Button>
                                    }
                                </>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box h={1} bg={`gray.3`}></Box>
                <Box m={'md'}>
                    <Grid columns={24}>
                        <Grid.Col span={'auto'}>
                            <ScrollArea h={height} scrollbarSize={2} type="never">
                                <Box pb={'md'}>
                                    <SelectForm
                                        tooltip={t('ChooseProductType')}
                                        label={t('ProductType')}
                                        placeholder={t('ChooseProductType')}
                                        required={true}
                                        name={'product_type_id'}
                                        form={form}
                                        dropdownValue={productTypeDropdown}
                                        mt={0}
                                        id={'product_type_id'}
                                        nextField={'category_id'}
                                        searchable={true}
                                        value={productTypeData ? String(productTypeData) : (entityEditData.product_type_id ? String(entityEditData.product_type_id) : null)}
                                        changeValue={setProductTypeData}
                                    />
                                    <Grid gutter={{base: 6}}>
                                        <Grid.Col span={10}>
                                            <SelectForm
                                                tooltip={t('ChooseCategory')}
                                                label={t('Category')}
                                                placeholder={t('ChooseCategory')}
                                                required={true}
                                                nextField={'name'}
                                                name={'category_id'}
                                                form={form}
                                                dropdownValue={categoryDropdown}
                                                mt={8}
                                                id={'category_id'}
                                                searchable={true}
                                                value={categoryData ? String(categoryData) : (entityEditData.category_id ? String(entityEditData.category_id) : null)}
                                                changeValue={setCategoryData}
                                            />

                                        </Grid.Col>
                                        <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'}
                                                                   onClick={open}><IconPlus size={12}
                                                                                            opacity={0.5}/></Button></Grid.Col>
                                        {opened &&
                                            <CustomerGroupModel openedModel={opened} open={open} close={close}/>
                                        }
                                    </Grid>
                                    <InputForm
                                        tooltip={t('ProductNameValidateMessage')}
                                        label={t('ProductName')}
                                        placeholder={t('ProductName')}
                                        required={true}
                                        nextField={'alternative_name'}
                                        form={form}
                                        name={'name'}
                                        mt={8}
                                        id={'name'}
                                    />
                                    <InputForm
                                        tooltip={t('AlternativeProductNameValidateMessage')}
                                        label={t('AlternativeProductName')}
                                        placeholder={t('AlternativeProductName')}
                                        required={false}
                                        nextField={'unit_id'}
                                        form={form}
                                        name={'alternative_name'}
                                        mt={8}
                                        id={'alternative_name'}
                                    />
                                    <SelectForm
                                        tooltip={t('ChooseProductUnit')}
                                        label={t('ProductUnit')}
                                        placeholder={t('ChooseProductUnit')}
                                        required={true}
                                        name={'unit_id'}
                                        form={form}
                                        dropdownValue={productUnitDropdown}
                                        mt={8}
                                        id={'unit_id'}
                                        nextField={'barcode'}
                                        searchable={true}
                                        value={productUnitData ? String(productUnitData) : (entityEditData.unit_id ? String(entityEditData.unit_id) : null)}
                                        changeValue={setProductUnitData}
                                    />
                                    <InputForm
                                        tooltip={t('BarcodeValidateMessage')}
                                        label={t('Barcode')}
                                        placeholder={t('Barcode')}
                                        required={false}
                                        nextField={'sku'}
                                        form={form}
                                        name={'barcode'}
                                        mt={8}
                                        id={'barcode'}
                                    />
                                    <InputForm
                                        tooltip={t('ProductSkuValidateMessage')}
                                        label={t('ProductSku')}
                                        placeholder={t('ProductSku')}
                                        required={false}
                                        nextField={'brand_id'}
                                        form={form}
                                        name={'sku'}
                                        mt={8}
                                        id={'sku'}
                                    />

                                    <Grid gutter={{base: 6}}>
                                        <Grid.Col span={10}>
                                            <SelectForm
                                                tooltip={t('ChooseBrand')}
                                                label={t('Brand')}
                                                placeholder={t('ChooseBrand')}
                                                required={false}
                                                nextField={'opening_quantity'}
                                                name={'brand_id'}
                                                form={form}
                                                dropdownValue={brandDropdown}
                                                mt={8}
                                                id={'brand_id'}
                                                searchable={true}
                                                value={brandData ? String(brandData) : (entityEditData.brand_id ? String(entityEditData.brand_id) : null)}
                                                changeValue={setBrandData}
                                            />

                                        </Grid.Col>
                                        <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'}
                                                                   onClick={open}><IconPlus size={12}
                                                                                            opacity={0.5}/></Button></Grid.Col>
                                        {opened &&
                                            <CustomerGroupModel openedModel={opened} open={open} close={close}/>
                                        }
                                    </Grid>
                                    <InputForm
                                        tooltip={t('OpeningQuantity')}
                                        label={t('OpeningQuantity')}
                                        placeholder={t('OpeningQuantity')}
                                        required={false}
                                        nextField={'sales_price'}
                                        form={form}
                                        name={'opening_quantity'}
                                        mt={8}
                                        id={'opening_quantity'}
                                    />
                                    <Grid gutter={{base: 6}}>
                                        <Grid.Col span={6}>
                                            <InputForm
                                                tooltip={t('SalesPriceValidateMessage')}
                                                label={t('SalesPrice')}
                                                placeholder={t('SalesPrice')}
                                                required={true}
                                                nextField={'purchase_price'}
                                                form={form}
                                                name={'sales_price'}
                                                mt={8}
                                                id={'sales_price'}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <InputForm
                                                tooltip={t('PurchasePrice')}
                                                label={t('PurchasePrice')}
                                                placeholder={t('PurchasePrice')}
                                                required={false}
                                                nextField={'min_quantity'}
                                                form={form}
                                                name={'purchase_price'}
                                                mt={8}
                                                id={'purchase_price'}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{base: 6}}>
                                        <Grid.Col span={6}>
                                            <InputForm
                                                tooltip={t('MinimumQuantityValidateMessage')}
                                                label={t('MinimumQuantity')}
                                                placeholder={t('MinimumQuantity')}
                                                required={false}
                                                nextField={'reorder_quantity'}
                                                form={form}
                                                name={'min_quantity'}
                                                mt={8}
                                                id={'min_quantity'}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <InputForm
                                                tooltip={t('ReorderQuantity')}
                                                label={t('ReorderQuantity')}
                                                placeholder={t('ReorderQuantity')}
                                                required={false}
                                                nextField={'status'}
                                                form={form}
                                                name={'reorder_quantity'}
                                                mt={8}
                                                id={'reorder_quantity'}
                                            />
                                        </Grid.Col>
                                    </Grid>


                                    <SwitchForm
                                        tooltip={t('Status')}
                                        label={t('Status')}
                                        nextField={'EntityFormSubmit'}
                                        name={'status'}
                                        form={form}
                                        mt={12}
                                        id={'status'}
                                        position={'left'}
                                        checked={form.values.status}
                                    />

                                </Box>
                            </ScrollArea>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'product_type_id'}
                            />
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>
        </Box>
    )
}

export default ProductUpdateForm;
