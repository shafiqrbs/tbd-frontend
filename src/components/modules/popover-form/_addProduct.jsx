import {ActionIcon, Box, Button, Fieldset, Flex, Grid, Popover, Text, Tooltip} from "@mantine/core";
import {IconCoinMonero, IconCurrency, IconDeviceFloppy, IconPlus, IconRefreshDot} from "@tabler/icons-react";
import SelectForm from "../../form-builders/SelectForm.jsx";
import getSettingProductTypeDropdownData from "../../global-hook/dropdown/getSettingProductTypeDropdownData.js";
import getSettingCategoryDropdownData from "../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import InputForm from "../../form-builders/InputForm.jsx";
import getSettingProductUnitDropdownData from "../../global-hook/dropdown/getSettingProductUnitDropdownData.js";
import InputNumberForm from "../../form-builders/InputNumberForm.jsx";
import {storeEntityData} from "../../../store/inventory/crudSlice.js";
import React, {useState} from "react";
import {isNotEmpty, useForm} from "@mantine/form";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";

function _addProduct(props) {
    const {setStockProductRestore,focusField,fieldPrefix} = props

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const [productAddFormOpened, setProductAddFormOpened] = useState(false);
    const [categoryData, setCategoryData] = useState(null);
    const [productTypeData, setProductTypeData] = useState(null);
    const [productUnitData, setProductUnitData] = useState(null);

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
            name: isNotEmpty()
        }
    });

    return (
        <>
            <Popover
                width={'450'}
                trapFocus
                position="bottom"
                withArrow
                shadow="xl"
                opened={productAddFormOpened}
                onChange={setProductAddFormOpened}
            >
                <Popover.Target>
                    <Tooltip
                        multiline
                        bg={'orange.8'}
                        position="top"
                        withArrow
                        ta={'center'}
                        offset={{ crossAxis: '-50', mainAxis: '5' }}
                        transitionProps={{ duration: 200 }}
                        label={t('InstantProductCreate')}
                    >
                        <ActionIcon
                            variant="outline"
                            size={'lg'}
                            color="red.5"
                            mt={'1'}
                            aria-label="Settings"
                            onClick={() => setProductAddFormOpened(true)}
                        >
                            <IconPlus style={{ width: '100%', height: '70%' }}
                                      stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </Popover.Target>
                <Popover.Dropdown bg={'gray.1'}>
                    <Fieldset legend={t('InstantProductCreate')} className={'bodyBackground'} fz={'xs'} variant="filled">
                        <Box mt={'xs'}>
                            <SelectForm
                                tooltip={t('ChooseProductType')}
                                label={t('ProductType')}
                                placeholder={t('ChooseProductType')}
                                required={true}
                                name={'product_type_id'}
                                form={productAddedForm}
                                dropdownValue={getSettingProductTypeDropdownData()}
                                mt={'xs'}
                                id={fieldPrefix+'product_type_id'}
                                nextField={fieldPrefix+'category_id'}
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
                                nextField={fieldPrefix+'name'}
                                name={'category_id'}
                                form={productAddedForm}
                                dropdownValue={getSettingCategoryDropdownData()}
                                mt={'md'}
                                id={fieldPrefix+'category_id'}
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
                                nextField={fieldPrefix+'unit_id'}
                                form={productAddedForm}
                                name={'name'}
                                mt={8}
                                id={fieldPrefix+'name'}
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
                                mt={8}
                                id={fieldPrefix+'unit_id'}
                                nextField={fieldPrefix+'purchase_price'}
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
                                nextField={fieldPrefix+'sales_price_product'}
                                form={productAddedForm}
                                name={'purchase_price'}
                                id={fieldPrefix+'purchase_price'}
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
                                nextField={fieldPrefix+'EntityProductFormSubmit'}
                                form={productAddedForm}
                                name={'sales_price'}
                                mt={8}
                                id={fieldPrefix+'sales_price_product'}
                                leftSection={<IconCoinMonero size={16} opacity={0.5} />}
                                rightIcon={<IconCurrency size={16} opacity={0.5} />}
                                closeIcon={true}
                            />
                        </Box>
                        <Box mt={'xs'}>
                            <Grid columns={12} gutter={{ base: 1 }}>
                                <Grid.Col span={6}>&nbsp;</Grid.Col>
                                <Grid.Col span={2}>
                                    <Button
                                        variant="transparent"
                                        size="sm"
                                        color={`red.4`}
                                        type="reset"
                                        mt={0}
                                        mr={'xs'}
                                        fullWidth
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
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Button
                                        size="sm"
                                        color={`red.5`}
                                        type="submit"
                                        mt={0}
                                        mr={'xs'}
                                        fullWidth
                                        comboboxProps={{ withinPortal: false }}
                                        id={fieldPrefix+"EntityProductFormSubmit"}
                                        leftSection={<IconDeviceFloppy size={16} />}
                                        onClick={() => {
                                            let validation = true
                                            if (!productAddedForm.values.name) {
                                                validation = false
                                                productAddedForm.setFieldError('name', true);
                                            }
                                            if (!productAddedForm.values.product_type_id) {
                                                validation = false
                                                productAddedForm.setFieldError('product_type_id', true);
                                            }
                                            if (!productAddedForm.values.purchase_price) {
                                                validation = false
                                                productAddedForm.setFieldError('purchase_price', true);
                                            }
                                            if (!productAddedForm.values.sales_price) {
                                                validation = false
                                                productAddedForm.setFieldError('sales_price', true);
                                            }
                                            if (!productAddedForm.values.unit_id) {
                                                validation = false
                                                productAddedForm.setFieldError('unit_id', true);
                                            }
                                            if (!productAddedForm.values.category_id) {
                                                validation = false
                                                productAddedForm.setFieldError('category_id', true);
                                            }

                                            if (validation) {
                                                const value = {
                                                    url: 'inventory/product',
                                                    data: productAddedForm.values
                                                }
                                                dispatch(storeEntityData(value))

                                                productAddedForm.reset()
                                                setCategoryData(null)
                                                setProductTypeData(null)
                                                setProductUnitData(null)
                                                setProductAddFormOpened(false)
                                                setStockProductRestore(true)
                                                document.getElementById(focusField).focus()
                                            }

                                        }}
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
        </>

    );
}

export default _addProduct;