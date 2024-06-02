import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Group, Text, Title, Flex, Stack, Tooltip, ActionIcon, LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCategoryPlus,
    IconCheck, IconClipboardPlus, IconDeviceFloppy, IconPencilBolt, IconPlus
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/core/crudSlice.js";
import { getCustomerDropdown } from "../../../../store/core/utilitySlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import { getBrandDropdown, getCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";
import { getProductUnitDropdown, getSettingDropdown } from "../../../../store/utility/utilitySlice.js";
import getSettingProductTypeDropdownData from "../../../global-hook/dropdown/getSettingProductTypeDropdownData.js";

function ProductUpdateForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);

    const customerDropdownData = useSelector((state) => state.utilitySlice.customerDropdownData)
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

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
    }, [dropdownBrandLoad]);

    const [productTypeData, setProductTypeData] = useState(null);
    let productTypeDropdown = getSettingProductTypeDropdownData()


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
    }, []); let customerDropdown = customerDropdownData && customerDropdownData.length > 0 ?
        customerDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []

    useEffect(() => {
        dispatch(getCustomerDropdown('core/select/customer'))
    }, []);


    const form = useForm({
        initialValues: {
            product_type_id: '', category_id: '', unit_id: '', name: '', alternative_name: '', barcode: '', sku: '', brand_id: '', opening_quantity: '', sales_price: '', purchase_price: '', min_quantity: '', reorder_quantity: '', status: true
        },
        validate: {
            product_type_id: isNotEmpty(),
            category_id: isNotEmpty(),
            unit_id: isNotEmpty(),
            name: hasLength({ min: 2, max: 20 }),
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
    console.log(entityEditData);
    useEffect(() => {

        form.setValues({
            product_type_id: entityEditData.product_type_id ? entityEditData.product_type_id : '',
            category_id: entityEditData.category_id ? entityEditData.category_id : '',
            unit_id: entityEditData.unit_id ? entityEditData.unit_id : '',
            name: entityEditData.product_name ? entityEditData.product_name : '',
            alternative_name: entityEditData.alternative_name ? entityEditData.alternative_name : '',
            barcode: entityEditData.barcode ? entityEditData.barcode : '',
            sku: entityEditData.sku ? entityEditData.sku : '',
            brand_id: entityEditData.brand_id ? entityEditData.brand_id : '',
            opening_quantity: entityEditData.opening_quantity ? entityEditData.opening_quantity : '',
            sales_price: entityEditData.sales_price ? entityEditData.sales_price : '',
            purchase_price: entityEditData.purchase_price ? entityEditData.purchase_price : '',
            min_quantity: entityEditData.min_quantity ? entityEditData.min_quantity : '',
            reorder_quantity: entityEditData.reorder_quantity ? entityEditData.reorder_quantity : '',
            status: entityEditData.status ? entityEditData.status : '',
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
        document.getElementById('EntityFormSubmit').click()
    }]], []);


    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        setSaveCreateLoading(true)
                        const storedProducts = localStorage.getItem('core-products');
                        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
                        const updatedProducts = localProducts.map(product => {
                            if (product.id === entityEditData.id) {
                                return {
                                    ...product,
                                    product_name: values.name,
                                    alternative_name: values.alternative_name
                                };
                            }
                            return product
                        });
                        localStorage.setItem('core-products', JSON.stringify(updatedProducts));
                        const value = {
                            url: 'inventory/product/' + entityEditData.id,
                            data: values
                        }
                        dispatch(updateEntityData(value))
                        notifications.show({
                            color: 'teal',
                            title: t('UpdateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
                        });

                        setTimeout(() => {
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            setProductTypeData(null)
                            setCategoryData(null)
                            setBrandData(null)
                            setProductUnitData(null)
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                        }, 700)
                    },
                });
            })}>
                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} h={54}>
                                            <Title order={6} mt={'xs'} pl={'6'}>{t('CreateProduct')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            color={`red.6`}
                                                            type="submit"
                                                            mt={4}
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}
                                                        >

                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={12} fw={400}>
                                                                    {t("CreateAndSave")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </></Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} mt={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box>
                                            <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                            <Box mt={'xs'}>
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
                                                    value={productTypeDropdown ? String(productTypeDropdown) : (productTypeDropdown.product_type_id ? String(productTypeDropdown.product_type_id) : null)}
                                                    changeValue={setProductTypeData}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={11}>
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
                                                    <Grid.Col span={1}>
                                                        <Box pt={'xl'}>
                                                            <Tooltip
                                                                multiline
                                                                w={420}
                                                                withArrow
                                                                transitionProps={{ duration: 200 }}
                                                                label={t('QuickCategory')}
                                                            >
                                                                <ActionIcon fullWidth variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings" onClick={open}>
                                                                    <IconCategoryPlus style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid.Col>
                                                    {opened &&
                                                        <CustomerGroupModel openedModel={opened} open={open} close={close} />
                                                    }
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
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
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('AlternativeProductNameValidateMessage')}
                                                    label={t('AlternativeProductName')}
                                                    placeholder={t('AlternativeProductName')}
                                                    required={false}
                                                    nextField={'sku'}
                                                    form={form}
                                                    name={'alternative_name'}
                                                    mt={8}
                                                    id={'alternative_name'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6}>
                                                        <InputForm
                                                            tooltip={t('ProductSkuValidateMessage')}
                                                            label={t('ProductSku')}
                                                            placeholder={t('ProductSku')}
                                                            required={false}
                                                            nextField={'barcode'}
                                                            form={form}
                                                            name={'sku'}
                                                            mt={8}
                                                            id={'sku'}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <InputForm
                                                            tooltip={t('BarcodeValidateMessage')}
                                                            label={t('Barcode')}
                                                            placeholder={t('Barcode')}
                                                            required={false}
                                                            nextField={'unit_id'}
                                                            form={form}
                                                            name={'barcode'}
                                                            mt={8}
                                                            id={'barcode'}
                                                        />
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6}>
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
                                                            nextField={'brand_id'}
                                                            searchable={true}
                                                            changeValue={setProductUnitData}
                                                            value={productUnitData ? String(productUnitData) : (entityEditData.unit_id ? String(entityEditData.unit_id) : null)}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={5}>
                                                        <SelectForm
                                                            tooltip={t('ChooseBrand')}
                                                            label={t('Brand')}
                                                            placeholder={t('ChooseBrand')}
                                                            required={false}
                                                            nextField={'purchase_price'}
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
                                                    <Grid.Col span={1}>
                                                        <Box pt={'xl'}>
                                                            <Tooltip
                                                                multiline
                                                                w={420}
                                                                withArrow
                                                                transitionProps={{ duration: 200 }}
                                                                label={t('QuickCategory')}
                                                            >
                                                                <ActionIcon fullWidth variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings" onClick={open}>
                                                                    <IconClipboardPlus style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid.Col>
                                                    {opened &&
                                                        <CustomerGroupModel openedModel={opened} open={open} close={close} />
                                                    }
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
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
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6}>
                                                        <InputForm
                                                            tooltip={t('MinimumQuantityValidateMessage')}
                                                            label={t('MinimumQuantity')}
                                                            placeholder={t('MinimumQuantity')}
                                                            required={false}
                                                            nextField={'opening_quantity'}
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
                                            </Box>
                                            <Box mt={'md'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6}>
                                                        <InputForm
                                                            tooltip={t('OpeningQuantity')}
                                                            label={t('OpeningQuantity')}
                                                            placeholder={t('OpeningQuantity')}
                                                            required={false}
                                                            nextField={'status'}
                                                            form={form}
                                                            name={'opening_quantity'}
                                                            mt={8}
                                                            id={'opening_quantity'}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} mt={'28'}>
                                                        <Box mt={'xs'}>
                                                            <Grid columns={6} gutter={{ base: 1 }}>
                                                                <Grid.Col span={2}>
                                                                    <SwitchForm
                                                                        tooltip={t('Status')}
                                                                        label=''
                                                                        nextField={'EntityFormSubmit'}
                                                                        name={'status'}
                                                                        form={form}
                                                                        color="red"
                                                                        id={'status'}
                                                                        position={'left'}
                                                                        defaultChecked={1}
                                                                        checked={form.values.status}
                                                                    />
                                                                </Grid.Col>
                                                                <Grid.Col span={4} fz={'sm'} pt={'1'}>{t('Status')}
                                                                </Grid.Col>
                                                            </Grid>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'name'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </form>
        </Box>
    )
}

export default ProductUpdateForm;
