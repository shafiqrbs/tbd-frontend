import React, { useState } from "react";
import { Form, useOutletContext } from "react-router-dom";
import {
    rem,
    Grid,
    Tooltip,
    TextInput,
    ActionIcon,
    Box,
    NumberInput,
    Button,
    Flex,
    Text,
    Popover,
    Fieldset
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconFilter,
    IconInfoCircle,
    IconRestore,
    IconSearch,
    IconX,
    IconDeviceFloppy,
    IconBarcode,
    IconCoinMonero,
    IconSortAscendingNumbers,
    IconPercentage,
    IconCurrency,
    IconPlusMinus,
    IconSum,
    IconPlus,
    IconRefreshDot
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import SelectForm from "../../../form-builders/SelectForm";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
// import {
//     setCustomerFilterData,
//     setFetching,
//     setSearchKeyword, setUserFilterData,
//     setVendorFilterData
// } from "../../../store/core/crudSlice.js";
// import FilterModel from "./FilterModel.jsx";
// import { setProductFilterData } from "../../../store/inventory/crudSlice.js";

function ReceipeAddItem(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline } = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [filterModel, setFilterModel] = useState(false)

    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const customerFilterData = useSelector((state) => state.crudSlice.customerFilterData)
    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)
    const userFilterData = useSelector((state) => state.crudSlice.userFilterData)
    const productFilterData = useSelector((state) => state.inventoryCrudSlice.productFilterData)

    const [productTypeData, setProductTypeData] = useState(null);


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
    })

    useHotkeys(
        [['alt+F', () => {
            document.getElementById('SearchKeyword').focus();
        }]
        ], []
    );

    return (
        <>

            <Box >
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={24} >
                        <Box bg={'white'}  >
                            <form onSubmit={form.onSubmit((values) => {

                                if (!values.barcode && !values.product_id) {
                                    form.setFieldError('barcode', true);
                                    form.setFieldError('product_id', true);
                                    setTimeout(() => { }, 1000)
                                } else {

                                    const cardProducts = localStorage.getItem('temp-sales-products');
                                    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
                                    const storedProducts = localStorage.getItem('user-products');
                                    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

                                    if (values.product_id && !values.barcode) {
                                        if (!allowZeroPercentage) {
                                            showNotification({
                                                color: 'pink',
                                                title: t('WeNotifyYouThat'),
                                                message: t('ZeroQuantityNotAllow'),
                                                autoClose: 1500,
                                                loading: true,
                                                withCloseButton: true,
                                                position: 'top-center',
                                                style: { backgroundColor: 'mistyrose' },
                                            });
                                        } else {
                                            // setFocusIntoProductSearch(true)
                                            handleAddProductByProductId(values, myCardProducts, localProducts);
                                        }
                                    } else if (!values.product_id && values.barcode) {
                                        // setFocusIntoProductSearch(true)
                                        handleAddProductByBarcode(values, myCardProducts, localProducts);
                                    }
                                }

                            })}>
                                <Box pl={`xs`} pr={8} pt={'xs'} pb={'xs'} className={'boxBackground borderRadiusAll'}>
                                    <Grid columns={24} gutter={{ base: 6 }}>
                                        <Grid.Col span={12}>
                                            <SelectForm
                                                tooltip={t('SelectMaterialName')}
                                                placeholder={t('SelectMaterialName')}
                                                required={true}
                                                name={'product_type_id'}
                                                form={form}
                                                dropdownValue={''}
                                                mt={0}
                                                id={'product_type_id'}
                                                nextField={'price'}
                                                searchable={true}
                                                value={productTypeData}
                                                changeValue={setProductTypeData}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box>
                                                <InputForm
                                                    tooltip={t('Price')}
                                                    placeholder={t('Price')}
                                                    required={false}
                                                    nextField={'quantity'}
                                                    name={'price'}
                                                    form={form}
                                                    id={'price'}
                                                />
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box>
                                                <InputForm
                                                    tooltip={t('Quantity')}
                                                    placeholder={t('Quantity')}
                                                    required={false}
                                                    nextField={'percent'}
                                                    name={'quantity'}
                                                    form={form}
                                                    id={'quantity'}
                                                />

                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box>
                                                <InputForm
                                                    tooltip={t('Percent')}
                                                    placeholder={t('Percent')}
                                                    required={false}
                                                    nextField={'EntityFormSubmit'}
                                                    name={'percent'}
                                                    form={form}
                                                    id={'percent'}
                                                />
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box>
                                                <Button
                                                    size="sm"
                                                    color={`red.6`}
                                                    type="submit"
                                                    mt={0}
                                                    mr={'xs'}
                                                    w={'100%'}
                                                    id="EntityFormSubmit"
                                                // leftSection={<IconDeviceFloppy size={16} />}
                                                >
                                                    <Text fz={12} fw={400}>
                                                        {t("AddItem")}
                                                    </Text>
                                                </Button>
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </form>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box >

            {
                filterModel && <FilterModel filterModel={filterModel} setFilterModel={setFilterModel} module={props.module} />
            }
        </>
    );
}

export default ReceipeAddItem;
