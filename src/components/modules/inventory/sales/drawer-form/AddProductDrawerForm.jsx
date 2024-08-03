import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Text, Title, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconRefreshDot,
    IconCoinMonero,
    IconCurrency,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { setFetching, storeEntityData } from "../../../../../store/inventory/crudSlice.js";
import InputForm from "../../../../form-builders/InputForm.jsx";
import SelectForm from "../../../../form-builders/SelectForm.jsx";
import InputNumberForm from "../../../../form-builders/InputNumberForm.jsx";
import getSettingProductTypeDropdownData from "../../../../global-hook/dropdown/getSettingProductTypeDropdownData.js";
import getSettingCategoryDropdownData from "../../../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import getSettingProductUnitDropdownData from "../../../../global-hook/dropdown/getSettingProductUnitDropdownData.js";

function AddProductDrawerForm(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [categoryData, setCategoryData] = useState(null);
    const [productTypeData, setProductTypeData] = useState(null);
    const [productUnitData, setProductUnitData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const effectRan = useRef(false);

    const { setProductDrawer, setStockProductRestore, focusField, fieldPrefix } = props;

    useEffect(() => {
        !effectRan.current && (
            document.getElementById(fieldPrefix + 'product_type_id').click(),
            effectRan.current = true
        )
    }, []);

    const productAddedForm = useForm({
        initialValues: {
            name: '',
            purchase_price: '',
            sales_price: '',
            unit_id: '',
            category_id: '',
            product_type_id: '',
            product_name: '',
            quantity: '',
            status: 1
        },
        validate: {
            name: isNotEmpty(),
            product_type_id: isNotEmpty(),
            category_id: isNotEmpty(),
            unit_id: isNotEmpty(),
            purchase_price: isNotEmpty(),
            sales_price: isNotEmpty(),
        }
    });


    return (
        <>
            <Box>
                <form onSubmit={productAddedForm.onSubmit((values) => {
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
                            const value = {
                                url: 'inventory/product',
                                data: productAddedForm.values
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
                                productAddedForm.reset()
                                setCategoryData(null)
                                setProductTypeData(null)
                                setProductUnitData(null)
                                setSaveCreateLoading(false)
                                setProductDrawer(false)
                                setStockProductRestore(true)
                                document.getElementById(focusField).focus()
                                dispatch(setFetching(true))
                            }, 700)
                        },
                    });
                })}>
                    <Box mb={0}>
                        <Grid columns={9} gutter={{ base: 6 }} >
                            <Grid.Col span={9} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box bg={"white"} >
                                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                            <Grid columns={12}>
                                                <Grid.Col span={8} >
                                                    <Title order={6} pt={'6'}>{t('InstantProductCreate')}</Title>
                                                </Grid.Col>
                                                <Grid.Col span={2} >
                                                    <Flex justify="flex-end"
                                                        direction="row">
                                                        <Button
                                                            variant="transparent"
                                                            size="xs"
                                                            color={`red.4`}
                                                            type="reset"
                                                            mt={0}
                                                            fullWidth
                                                            mb={'0'}
                                                            id=""
                                                            comboboxProps={{ withinPortal: false }}
                                                            onClick={() => {
                                                                productAddedForm.reset()
                                                                setCategoryData(null)
                                                                setProductTypeData(null)
                                                                setProductUnitData(null)
                                                                setProductAddFormOpened(false)
                                                            }}

                                                        >
                                                            <IconRefreshDot style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                        </Button>
                                                    </Flex>
                                                </Grid.Col>
                                                <Grid.Col span={2}>
                                                    <Stack right align="flex-end">
                                                        <>
                                                            {
                                                                !saveCreateLoading && isOnline &&
                                                                <Button
                                                                    size="xs"
                                                                    color={`green.8`}
                                                                    type="submit"
                                                                    id={fieldPrefix + "EntityProductFormSubmit"}
                                                                    leftSection={<IconDeviceFloppy size={16} />}
                                                                >
                                                                    <Flex direction={`column`} gap={0}>
                                                                        <Text fz={14} fw={400}>
                                                                            {t("Add")}
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            }
                                                        </>
                                                    </Stack>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box mt={'8'}>
                                                    <SelectForm
                                                        tooltip={t('ChooseProductType')}
                                                        label={t('ProductType')}
                                                        placeholder={t('ChooseProductType')}
                                                        required={true}
                                                        name={'product_type_id'}
                                                        form={productAddedForm}
                                                        dropdownValue={getSettingProductTypeDropdownData()}
                                                        id={fieldPrefix + 'product_type_id'}
                                                        nextField={fieldPrefix + 'category_id'}
                                                        searchable={true}
                                                        value={productTypeData}
                                                        changeValue={setProductTypeData}
                                                        comboboxProps={{ withinPortal: false }}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <SelectForm
                                                        tooltip={t('ChooseCategory')}
                                                        label={t('Category')}
                                                        placeholder={t('ChooseCategory')}
                                                        required={true}
                                                        nextField={fieldPrefix + 'name'}
                                                        name={'category_id'}
                                                        form={productAddedForm}
                                                        dropdownValue={getSettingCategoryDropdownData()}
                                                        id={fieldPrefix + 'category_id'}
                                                        searchable={true}
                                                        value={categoryData}
                                                        changeValue={setCategoryData}
                                                        comboboxProps={{ withinPortal: false }}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('ProductNameValidateMessage')}
                                                        label={t('ProductName')}
                                                        placeholder={t('ProductName')}
                                                        required={true}
                                                        nextField={fieldPrefix + 'unit_id'}
                                                        form={productAddedForm}
                                                        name={'name'}
                                                        id={fieldPrefix + 'name'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <SelectForm
                                                        tooltip={t('ChooseProductUnit')}
                                                        label={t('ProductUnit')}
                                                        placeholder={t('ChooseProductUnit')}
                                                        required={true}
                                                        name={'unit_id'}
                                                        form={productAddedForm}
                                                        dropdownValue={getSettingProductUnitDropdownData()}
                                                        id={fieldPrefix + 'unit_id'}
                                                        nextField={fieldPrefix + 'purchase_price'}
                                                        searchable={true}
                                                        value={productUnitData}
                                                        changeValue={setProductUnitData}
                                                        comboboxProps={{ withinPortal: false }}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputNumberForm
                                                        tooltip={t('PurchasePriceValidateMessage')}
                                                        label={t('PurchasePrice')}
                                                        placeholder={t('PurchasePrice')}
                                                        required={true}
                                                        nextField={fieldPrefix + 'sales_price_product'}
                                                        form={productAddedForm}
                                                        name={'purchase_price'}
                                                        id={fieldPrefix + 'purchase_price'}
                                                        leftSection={<IconCoinMonero size={16} opacity={0.5} />}
                                                        rightIcon={<IconCurrency size={16} opacity={0.5} />}
                                                        closeIcon={true}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputNumberForm
                                                        tooltip={t('SalesPriceValidateMessage')}
                                                        label={t('SalesPrice')}
                                                        placeholder={t('SalesPrice')}
                                                        required={true}
                                                        nextField={fieldPrefix + 'EntityProductFormSubmit'}
                                                        form={productAddedForm}
                                                        name={'sales_price'}
                                                        id={fieldPrefix + 'sales_price_product'}
                                                        leftSection={<IconCoinMonero size={16} opacity={0.5} />}
                                                        rightIcon={<IconCurrency size={16} opacity={0.5} />}
                                                        closeIcon={true}
                                                    />
                                                </Box>
                                            </ScrollArea>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={1} >
                                {/* <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                    <_ShortcutMasterData
                                        form={productAddedForm}
                                        FormSubmit={fieldPrefix + "EntityProductFormSubmit"}
                                        Name={fieldPrefix + 'product_type_id'}
                                        inputType="select"
                                    />
                                </Box> */}
                            </Grid.Col>
                        </Grid>
                    </Box>
                </form >
            </Box >
        </>
    );
}

export default AddProductDrawerForm;