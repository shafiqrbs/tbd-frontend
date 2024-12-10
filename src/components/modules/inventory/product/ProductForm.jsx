import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack, Tooltip, ActionIcon,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCategoryPlus,
    IconCheck,
    IconDeviceFloppy
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import { setFetching } from "../../../../store/inventory/crudSlice.js";
import { storeEntityData } from "../../../../store/core/crudSlice.js";
import getSettingProductTypeDropdownData from "../../../global-hook/dropdown/getSettingProductTypeDropdownData.js";
import getSettingParticularDropdownData from "../../../global-hook/dropdown/getSettingParticularDropdownData.js";
import ProductCategoryDrawer from "./ProductCategoryDrawer.jsx";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";

function ProductForm(props) {
    const { categoryDropdown } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const [categoryData, setCategoryData] = useState(null);

    const [productTypeData, setProductTypeData] = useState(null);
    const [productUnitData, setProductUnitData] = useState(null);

    const [groupDrawer, setGroupDrawer] = useState(false)

    const navigate = useNavigate()


    const form = useForm({
        initialValues: {
            product_type_id: '',
            category_id: '',
            unit_id: '',
            name: '',
            alternative_name: '',
            barcode: '',
            sku: '',
            sales_price: '',
            purchase_price: '',
            min_quantity: '',
            description: '',
            status: true
        },
        validate: {
            product_type_id: isNotEmpty(),
            category_id: isNotEmpty(),
            unit_id: isNotEmpty(),
            name: isNotEmpty(),
            sales_price: (value) => {
                const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                if (!isNumberOrFractional) {
                    return true;
                }
            },
            barcode: (value) => {
                if (value) {
                    return /^\d+$/.test(value) ? null : 'Must be a numeric value';
                }
                else
                    return null;
            }
        }
    });

    useHotkeys([['alt+n', () => {
        !groupDrawer && document.getElementById('product_type_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        !groupDrawer && document.getElementById('EntityFormSubmit').click()
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
                    onConfirm: async () => {
                        const value = {
                            url: 'inventory/product',
                            data: values
                        }

                        const resultAction = await dispatch(storeEntityData(value));

                        if (storeEntityData.rejected.match(resultAction)) {
                            const fieldErrors = resultAction.payload.errors;

                            // Check if there are field validation errors and dynamically set them
                            if (fieldErrors) {
                                const errorObject = {};
                                Object.keys(fieldErrors).forEach(key => {
                                    errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
                                });
                                // Display the errors using your form's `setErrors` function dynamically
                                form.setErrors(errorObject);
                            }
                        } else if (storeEntityData.fulfilled.match(resultAction)) {
                            notifications.show({
                                color: 'teal',
                                title: t('CreateSuccessfully'),
                                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                loading: false,
                                autoClose: 700,
                                style: {backgroundColor: 'lightgray'},
                            });

                            setTimeout(() => {
                                productsDataStoreIntoLocalStorage()
                                form.reset()
                                setCategoryData(null)
                                setProductTypeData(null)
                                setProductUnitData(null)
                                dispatch(setFetching(true))
                                navigate('/inventory/product/'+resultAction.payload.data.data.id)
                            }, 700)
                        }
                    },
                });
            })}>
                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pb={'6'} pr={8} pt={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('CreateProduct')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            color={`green.8`}
                                                            type="submit"
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}
                                                        >

                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={14} fw={400}>
                                                                    {t("CreateAndSave")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </></Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box mt={'xs'}>
                                            <SelectForm
                                                tooltip={t('ChooseProductType')}
                                                label={t('NatureOfProduct')}
                                                placeholder={t('ChooseProductType')}
                                                required={true}
                                                name={'product_type_id'}
                                                form={form}
                                                dropdownValue={getSettingProductTypeDropdownData()}
                                                mt={0}
                                                id={'product_type_id'}
                                                nextField={'category_id'}
                                                searchable={true}
                                                value={productTypeData}
                                                changeValue={setProductTypeData}
                                            />
                                        </Box>
                                        <Box >
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={11}>
                                                    <Box mt={'8'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseCategory')}
                                                            label={t('Category')}
                                                            placeholder={t('ChooseCategory')}
                                                            required={true}
                                                            name={'category_id'}
                                                            form={form}
                                                            dropdownValue={categoryDropdown}
                                                            mt={8}
                                                            id={'category_id'}
                                                            nextField={'name'}
                                                            searchable={true}
                                                            value={categoryData}
                                                            changeValue={setCategoryData}
                                                        />
                                                    </Box>

                                                </Grid.Col>
                                                <Grid.Col span={1}>
                                                    <Box pt={'xl'}>
                                                        <Tooltip
                                                            multiline
                                                            ta={'center'}
                                                            bg={'orange.8'}
                                                            offset={{ crossAxis: '-90', mainAxis: '5' }}
                                                            withArrow
                                                            transitionProps={{ duration: 200 }}
                                                            label={t('QuickCategory')}
                                                        >
                                                            <ActionIcon variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings" onClick={() => {
                                                                setGroupDrawer(true)
                                                            }}>
                                                                <IconCategoryPlus style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </Box>
                                                </Grid.Col>

                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('ProductNameValidateMessage')}
                                                label={t('ProductName')}
                                                placeholder={t('ProductName')}
                                                required={true}
                                                form={form}
                                                name={'name'}
                                                mt={8}
                                                id={'name'}
                                                nextField={'alternative_name'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('AlternativeProductNameValidateMessage')}
                                                label={t('AlternativeProductName')}
                                                placeholder={t('AlternativeProductName')}
                                                required={false}
                                                form={form}
                                                name={'alternative_name'}
                                                mt={8}
                                                id={'alternative_name'}
                                                nextField={'sku'}
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
                                                        nextField={'sales_price'}
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
                                                        tooltip={t('PurchasePriceValidateMessage')}
                                                        label={t('PurchasePrice')}
                                                        placeholder={t('PurchasePrice')}
                                                        required={false}
                                                        nextField={'unit_id'}
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
                                                    <Box mt={'8'}>

                                                        <SelectForm
                                                            tooltip={t('ChooseProductUnit')}
                                                            label={t('ProductUnit')}
                                                            placeholder={t('ChooseProductUnit')}
                                                            required={true}
                                                            name={'unit_id'}
                                                            form={form}
                                                            dropdownValue={getSettingParticularDropdownData('product-unit')}
                                                            mt={8}
                                                            id={'unit_id'}
                                                            nextField={'min_quantity'}
                                                            searchable={true}
                                                            value={productUnitData}
                                                            changeValue={setProductUnitData}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'8'}>
                                                        <InputForm
                                                            tooltip={t('MinimumQuantityValidateMessage')}
                                                            label={t('MinimumQuantity')}
                                                            placeholder={t('MinimumQuantity')}
                                                            required={false}
                                                            nextField={'description'}
                                                            form={form}
                                                            name={'min_quantity'}
                                                            id={'min_quantity'}
                                                        />
                                                    </Box>
                                                </Grid.Col>

                                            </Grid>
                                        </Box>
                                        <Box mt={'md'} mb={'md'}>
                                            <Box mt={'xs'}>
                                                <Grid columns={12} gutter={{ base: 1 }}>
                                                    <Grid.Col span={12}>
                                                        <TextAreaForm
                                                            tooltip={t('Description')}
                                                            label={t('Description')}
                                                            placeholder={t('Description')}
                                                            required={false}
                                                            nextField={'EntityFormSubmit'}
                                                            name={'description'}
                                                            form={form}
                                                            mt={8}
                                                            id={'description'}
                                                        />
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
            {groupDrawer && <ProductCategoryDrawer groupDrawer={groupDrawer} setGroupDrawer={setGroupDrawer} saveId={'EntityDrawerSubmit'} />}
        </Box>
    );
}

export default ProductForm;
