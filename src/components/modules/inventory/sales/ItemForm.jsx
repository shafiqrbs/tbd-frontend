import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
    IconRestore,
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

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

function ItemForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104
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
            company_name: '', name: '', mobile: '', tp_percent: '', email: ''
        },
        validate: {
            company_name: hasLength({min: 2, max: 20}),
            name: hasLength({min: 2, max: 20}),
            mobile: (value) => (!/^\d+$/.test(value)),
            // tp_percent: (value) => (value && !/^\d*\.?\d*$/.test(value)),
            // email: (value) => (value && !/^\S+@\S+$/.test(value)),
        }
    });

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
                            url: 'item',
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
                            setCustomerData(null)
                            dispatch(setFetching(true))
                        }, 700)
                    },
                });
            })}>
                <Box pb={`xs`} pl={`xs`} pr={8}>
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('CategoryGroupInformation')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0}  gap={0}>
                                <>
                                    {!saveCreateLoading &&
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
                <Box  h={1} bg={`gray.3`}></Box>
                <Box m={'md'}>
                 <Grid columns={24}>
                    <Grid.Col span={'auto'}>
                        <ScrollArea h={height} scrollbarSize={2} type="never">
                            <Box pb={'md'}>
                                <SelectForm
                                    tooltip={t('ProductType')}
                                    label={t('ProductType')}
                                    placeholder={t('ChooseProductType')}
                                    required={true}
                                    name={'product_type'}
                                    form={form}
                                    dropdownValue={productTypeDropdown}
                                    mt={0}
                                    id={'product_type'}
                                    nextField={'category_id'}
                                    searchable={false}
                                    value={productTypeData}
                                    changeValue={setProductTypeData}
                                />
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={10}>
                                        <SelectForm
                                            tooltip={t('Category')}
                                            label={t('Category')}
                                            placeholder={t('Category')}
                                            required={true}
                                            nextField={'name'}
                                            name={'category_id'}
                                            form={form}
                                            dropdownValue={categoryDropdown}
                                            mt={8}
                                            id={'category_id'}
                                            searchable={false}
                                            value={categoryData}
                                            changeValue={setCategoryData}
                                        />

                                    </Grid.Col>
                                    <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'}
                                                               onClick={open}><IconPlus size={16}
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
                                    nextField={'product_unit'}
                                    form={form}
                                    name={'name'}
                                    mt={8}
                                    id={'name'}
                                />
                                <InputForm
                                    tooltip={t('ProductNameValidateMessage')}
                                    label={t('AlternativeProductName')}
                                    placeholder={t('AlternativeProductName')}
                                    required={false}
                                    nextField={'product_unit'}
                                    form={form}
                                    name={'name'}
                                    mt={8}
                                    id={'name'}
                                />
                                <SelectForm
                                    tooltip={t('ProductUnitValidateMessage')}
                                    label={t('ProductUnit')}
                                    placeholder={t('ChooseProductUnit')}
                                    required={true}
                                    name={'product_unit'}
                                    form={form}
                                    dropdownValue={productUnitDropdown}
                                    mt={8}
                                    id={'product_unit'}
                                    nextField={'barcode'}
                                    searchable={false}
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
                                    tooltip={t('SkuValidateMessage')}
                                    label={t('ProductSku')}
                                    placeholder={t('ProductSku')}
                                    required={false}
                                    nextField={'product_unit'}
                                    form={form}
                                    name={'sku'}
                                    mt={8}
                                    id={'sku'}
                                />

                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={10}>
                                        <SelectForm
                                            tooltip={t('BrandNameValidateMessage')}
                                            label={t('Brand')}
                                            placeholder={t('ChoseBrand')}
                                            required={false}
                                            nextField={'name'}
                                            name={'brand_id'}
                                            form={form}
                                            dropdownValue={brandDropdown}
                                            mt={8}
                                            id={'brand_id'}
                                            searchable={false}
                                            value={brandData}
                                            changeValue={setBrandData}
                                        />

                                    </Grid.Col>
                                    <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'}
                                                               onClick={open}><IconPlus size={16}
                                                                                        opacity={0.5}/></Button></Grid.Col>
                                    {opened &&
                                    <CustomerGroupModel openedModel={opened} open={open} close={close}/>
                                    }
                                </Grid>
                                <InputForm
                                    tooltip={t('OpeningQuantityValidateMessage')}
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
                                            nextField={'status'}
                                            form={form}
                                            name={'sales_price'}
                                            mt={8}
                                            id={'sales_price'}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('PurchasePriceValidateMessage')}
                                            label={t('PurchasePrice')}
                                            placeholder={t('PurchasePrice')}
                                            required={true}
                                            nextField={'brand'}
                                            form={form}
                                            name={'sales_price'}
                                            mt={8}
                                            id={'sales_price'}
                                        />
                                    </Grid.Col>
                                </Grid>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('MinimumQuantityValidateMessage')}
                                            label={t('MinimumQuantity')}
                                            placeholder={t('MinimumQuantity')}
                                            required={true}
                                            nextField={'status'}
                                            form={form}
                                            name={'min_quantity'}
                                            mt={8}
                                            id={'min_quantity'}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('ReorderQuantityValidateMessage')}
                                            label={t('ReorderQuantity')}
                                            placeholder={t('ReorderQuantity')}
                                            required={true}
                                            nextField={'status'}
                                            form={form}
                                            name={'name'}
                                            mt={8}
                                            id={'name'}
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
                                        // defaultChecked={!!(formLoading && entityEditData.status === 1)}
                                        defaultChecked={1}
                                    />


                            </Box>
                        </ScrollArea>
                    </Grid.Col>
                    <Grid.Col span={3}>
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
export default ItemForm;
