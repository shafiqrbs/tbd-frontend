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
import { setFetching,storeEntityData } from "../../../../store/inventory/crudSlice.js";
import getSettingProductTypeDropdownData from "../../../global-hook/dropdown/getSettingProductTypeDropdownData.js";
import getSettingParticularDropdownData from "../../../global-hook/dropdown/getSettingParticularDropdownData.js";
import ProductCategoryDrawer from "./ProductCategoryDrawer.jsx";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";

function ProductForm(props) {
    const { categoryDropdown } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    // Sync `configData` with localStorage
    const [configData, setConfigData] = useState(() => {
        const storedConfigData = localStorage.getItem("config-data");
        return storedConfigData ? JSON.parse(storedConfigData) : [];
    });

    const [categoryData, setCategoryData] = useState(null);
    const [productTypeData, setProductTypeData] = useState(null);
    const [productUnitData, setProductUnitData] = useState(null);

    const [groupDrawer, setGroupDrawer] = useState(false)

    const navigate = useNavigate()

    const [isBrand, setBrand] = useState((configData?.is_brand === 1));
    const [isColor, setColor] = useState((configData?.is_color === 1));
    const [isGrade, setGrade] = useState((configData?.is_grade === 1));
    const [isSize, setSize] = useState((configData?.is_size === 1));
    const [isModel, setModel] = useState((configData?.is_model === 1));

    const colorDropDown = getSettingParticularDropdownData('color')
    const sizeDropDown = getSettingParticularDropdownData('size')
    const brandDropDown = getSettingParticularDropdownData('brand')
    const gradeDropDown = getSettingParticularDropdownData('product-grade')
    const modelDropDown = getSettingParticularDropdownData('model')

    const [brandData, setBrandData] = useState(null);
    const [colorData, setColorData] = useState(null);
    const [sizeData, setSizeData] = useState(null);
    const [gradeData, setGradeData] = useState(null);
    const [modelData, setModelData] = useState(null);

    const form = useForm({
        initialValues: {
            product_type_id: '',
            category_id: '',
            unit_id: '',
            name: '',
            alternative_name: '',
            bangla_name: '',
            barcode: '',
            sku: '',
            sales_price: '',
            purchase_price: '',
            min_quantity: '',
            description: '',
            color_id: '',
            brand_id: '',
            size_id: '',
            grade_id: '',
            model_id: '',
            status: true
        },
        validate: {
            product_type_id: isNotEmpty(),
            category_id: isNotEmpty(),
            unit_id: isNotEmpty(),
            name: isNotEmpty(),
            /*sales_price: (value) => {
                const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                if (!isNumberOrFractional) {
                    return true;
                }
            },*/
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
                            if (resultAction.payload.data.data.id){

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
                                    navigate('/inventory/product/' + resultAction.payload.data.data.id)
                                }, 700)
                            }else {
                                const fieldErrors = resultAction.payload.data.data;
                                // Check if there are field validation errors and dynamically set them
                                if (fieldErrors) {
                                    const errorObject = {};
                                    Object.keys(fieldErrors).forEach(key => {
                                        errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
                                    });
                                    // Display the errors using your form's `setErrors` function dynamically
                                    form.setErrors(errorObject);
                                }
                            }
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
                                                tooltip={t('EnterDisplayName')}
                                                label={t('DisplayName')}
                                                placeholder={t('DisplayName')}
                                                required={false}
                                                form={form}
                                                name={'alternative_name'}
                                                mt={8}
                                                id={'alternative_name'}
                                                nextField={'bangla_name'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('EnterLanguageName')}
                                                label={t('LanguageName')}
                                                placeholder={t('LanguageName')}
                                                required={false}
                                                form={form}
                                                name={'bangla_name'}
                                                mt={8}
                                                id={'bangla_name'}
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
                                                        required={false}
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
                                                            tooltip={t('EnterDescription')}
                                                            label={t('Description')}
                                                            placeholder={t('Description')}
                                                            required={false}
                                                            nextField={isColor ? 'color_id' :'EntityFormSubmit'}
                                                            name={'description'}
                                                            form={form}
                                                            mt={8}
                                                            id={'description'}
                                                        />
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                        </Box>

                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                {isColor && (
                                                    <Grid.Col span={6}>
                                                        <SelectForm
                                                            tooltip={t("ChooseColor")}
                                                            label={t('ChooseColor')}
                                                            placeholder={t("ChooseColor")}
                                                            name={"color_id"}
                                                            form={form}
                                                            dropdownValue={colorDropDown}
                                                            mt={0}
                                                            id={"color_id"}
                                                            nextField={isSize && "size_id"}
                                                            searchable={true}
                                                            value={colorData}
                                                            changeValue={setColorData}
                                                        />
                                                    </Grid.Col>
                                                )}
                                                {isSize && (
                                                    <Grid.Col span={6}>
                                                        <SelectForm
                                                            tooltip={t("ChooseSize")}
                                                            label={t("ChooseSize")}
                                                            placeholder={t("ChooseSize")}
                                                            name={"size_id"}
                                                            form={form}
                                                            dropdownValue={sizeDropDown}
                                                            mt={0}
                                                            id={"size_id"}
                                                            nextField={isBrand && "brand_id"}
                                                            searchable={true}
                                                            value={sizeData}
                                                            changeValue={setSizeData}
                                                        />
                                                    </Grid.Col>
                                                )}
                                                {isBrand && (
                                                    <Grid.Col span={6}>
                                                        <SelectForm
                                                            tooltip={t("ChooseBrand")}
                                                            label={t("ChooseBrand")}
                                                            placeholder={t("ChooseBrand")}
                                                            name={"brand_id"}
                                                            form={form}
                                                            dropdownValue={brandDropDown}
                                                            mt={0}
                                                            id={"brand_id"}
                                                            nextField={ isGrade && "grade_id"}
                                                            searchable={true}
                                                            value={brandData}
                                                            changeValue={setBrandData}
                                                        />
                                                    </Grid.Col>
                                                )}
                                                {isGrade && (
                                                    <Grid.Col span={6}>
                                                        <SelectForm
                                                            tooltip={t("ChooseProductGrade")}
                                                            label={t("ChooseProductGrade")}
                                                            placeholder={t("ChooseProductGrade")}
                                                            name={"grade_id"}
                                                            form={form}
                                                            dropdownValue={gradeDropDown}
                                                            mt={0}
                                                            id={"grade_id"}
                                                            nextField={ isModel && "model_id"}
                                                            searchable={true}
                                                            value={gradeData}
                                                            changeValue={setGradeData}
                                                        />
                                                    </Grid.Col>
                                                )}
                                                {isModel && (
                                                    <Grid.Col span={6}>
                                                        <SelectForm
                                                            tooltip={t("ChooseModel")}
                                                            label={t("ChooseModel")}
                                                            placeholder={t("ChooseModel")}
                                                            name={"model_id"}
                                                            form={form}
                                                            dropdownValue={modelDropDown}
                                                            mt={0}
                                                            id={"model_id"}
                                                            nextField={"EntityFormSubmit"}
                                                            searchable={true}
                                                            value={modelData}
                                                            changeValue={setModelData}
                                                        />
                                                    </Grid.Col>
                                                )}
                                            </Grid>
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
