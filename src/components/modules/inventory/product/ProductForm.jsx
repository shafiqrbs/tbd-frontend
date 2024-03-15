import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import {getBrandDropdown, getCategoryDropdown} from "../../../../store/inventory/utilitySlice";
import {getSettingDropdown, getProductUnitDropdown} from "../../../../store/utility/utilitySlice.js";

import {setFetching, storeEntityData} from "../../../../store/inventory/crudSlice.js";

function ProductForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104
    const [opened, {open, close}] = useDisclosure(false);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

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
            product_type_id: '',
            category_id: '',
            unit_id: '',
            name: '',
            alternative_name: '',
            barcode: '',
            sku: '',
            brand_id: '',
            opening_quantity: '',
            sales_price: '',
            purchase_price: '',
            min_quantity: '',
            reorder_quantity: '',
            status: true
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

                        const value = {
                            url: 'inventory/product',
                            data: values
                        }

                        dispatch(storeEntityData(value))

                        notifications.show({
                            color: 'teal',
                            title: t('CreateSuccessfully'),
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 700,
                            style: {backgroundColor: 'lightgray'},
                        });

                        setTimeout(() => {
                            form.reset()
                            setCategoryData(null)
                            setBrandData(null)
                            setProductTypeData(null)
                            setProductUnitData(null)
                            dispatch(setFetching(true))
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
                                            id="EntityFormSubmit"
                                            leftSection={<IconDeviceFloppy size={16}/>}
                                        >
                                            <Flex direction={`column`} gap={0}>
                                                <Text fz={12} fw={400}>
                                                    {t("CreateAndSave")}
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
                                        value={productTypeData}
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
                                                value={categoryData}
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
                                        value={productUnitData}
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
                                                value={brandData}
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
                                        defaultChecked={1}
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

    );
}

export default ProductForm;
