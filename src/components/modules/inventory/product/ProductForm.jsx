import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack, Tooltip, ActionIcon,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCategoryPlus,
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus, IconClipboardPlus
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import { getBrandDropdown, getCategoryDropdown } from "../../../../store/inventory/utilitySlice";
import { setFetching, storeEntityData } from "../../../../store/inventory/crudSlice.js";
import getSettingProductTypeDropdownData from "../../../global-hook/dropdown/getSettingProductTypeDropdownData.js";
import getSettingProductUnitDropdownData from "../../../global-hook/dropdown/getSettingProductUnitDropdownData.js";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";

function ProductForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const [categoryData, setCategoryData] = useState(null);
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
    const [productUnitData, setProductUnitData] = useState(null);


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
            name: hasLength({ min: 2, max: 20 }),
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
                        const value = {
                            url: 'inventory/product',
                            data: values
                        }
                        dispatch(storeEntityData(value))
                        notifications.show({
                            color: 'teal',
                            title: t('CreateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
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
                                        <Box mt={'xs'}>
                                            <SelectForm
                                                tooltip={t('ChooseProductType')}
                                                label={t('ProductType')}
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
                                                            dropdownValue={getSettingCategoryDropdownData()}
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
                                                        tooltip={t('PurchasePrice')}
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
                                                            dropdownValue={getSettingProductUnitDropdownData()}
                                                            mt={8}
                                                            id={'unit_id'}
                                                            nextField={'brand_id'}
                                                            searchable={true}
                                                            value={productUnitData}
                                                            changeValue={setProductUnitData}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={5}>
                                                    <Box mt={'8'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseBrand')}
                                                            label={t('Brand')}
                                                            placeholder={t('ChooseBrand')}
                                                            required={false}
                                                            nextField={'min_quantity'}
                                                            name={'brand_id'}
                                                            form={form}
                                                            dropdownValue={brandDropdown}
                                                            mt={8}
                                                            id={'brand_id'}
                                                            searchable={true}
                                                            value={brandData}
                                                            changeValue={setBrandData}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={1}>
                                                    <Box pt={'xl'} >
                                                        <Tooltip
                                                            multiline
                                                            ta={'center'}
                                                            bg={'orange.8'}
                                                            offset={{ crossAxis: '-80', mainAxis: '5' }}
                                                            withArrow
                                                            transitionProps={{ duration: 200 }}
                                                            label={t('QuickBrand')}
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
                                                        nextField={'opening_quantity'}
                                                        form={form}
                                                        name={'reorder_quantity'}
                                                        mt={8}
                                                        id={'reorder_quantity'}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'md'} mb={'md'}>
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
                                                                    tooltip={t('PrintLogo')}
                                                                    label=''
                                                                    nextField={'printWithOutstanding'}
                                                                    name={'print_logo'}
                                                                    form={form}
                                                                    color="red"
                                                                    id={'printLogo'}
                                                                    position={'left'}
                                                                    defaultChecked={1}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={4} fz={'sm'} pt={'1'}>{t('Status')}
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                </Grid.Col>

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
        </Box>

    );
}

export default ProductForm;
