import React, {useEffect, useState} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {
    rem,
    Grid,
    Box,
    Button,
    Text,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useHotkeys} from "@mantine/hooks";
import {useDispatch} from "react-redux";
import SelectForm from "../../../../form-builders/SelectForm.jsx";
import {isNotEmpty, useForm} from "@mantine/form";
import InputForm from "../../../../form-builders/InputForm.jsx";
import getProRecipeMaterialProductDropdownData
    from "../../../../global-hook/dropdown/getProRecipeMaterialProductDropdownData.js";
import {storeEntityData, setFetching} from "../../../../../store/production/crudSlice.js";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";

function __RecipeAddItem(props) {
    const {setFetching} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline} = useOutletContext();
    const {id} = useParams();

    const [productData, setProductData] = useState(null);
    const productMaterialDropdown = getProRecipeMaterialProductDropdownData()

    const form = useForm({
        initialValues: {
            inv_stock_id: '',
            price: '',
            quantity: '',
            percent: '',
        },
        validate: {
            inv_stock_id: isNotEmpty(),
            price: (value) => {
                const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                if (!isNumberOrFractional) {
                    return true;
                }
            },
            quantity: (value) => {
                const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                if (!isNumberOrFractional) {
                    return true;
                }
            },
            percent: (value) => {
                const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                if (!isNumberOrFractional) {
                    return true;
                }
            },
        }
    })


    useEffect(() => {
        const storedProducts = localStorage.getItem('core-products');
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        const filteredProducts = localProducts.filter(product => product.id === Number(form.values.inv_stock_id));

        if (filteredProducts.length > 0) {
            const selectedProduct = filteredProducts[0];

            form.setFieldValue('price', selectedProduct.purchase_price);
        } else {
            form.setFieldValue('price', '');
        }
    }, [form.values.inv_stock_id]);


    useHotkeys(
        [['alt+n', () => {
            document.getElementById('inv_stock_id').focus()
        }]
        ], []
    );

    return (
        <>

            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={24}>
                        <Box bg={'white'}>
                            <form onSubmit={form.onSubmit((values) => {
                                values.item_id = id

                                if (id) {
                                    const data = {
                                        url: 'production/recipe',
                                        data: values
                                    }
                                    dispatch(storeEntityData(data))

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
                                        setProductData(null)
                                        setFetching(true)
                                    }, 500)
                                } else {
                                    notifications.show({
                                        color: 'red',
                                        title: t('ProductionItemMissing'),
                                        icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                        loading: false,
                                        autoClose: 700,
                                        style: {backgroundColor: 'lightgray'},
                                    });
                                }

                            })}>
                                <Box pl={`xs`} pr={8} pt={'xs'} pb={'xs'} className={'boxBackground borderRadiusAll'}>
                                    <Grid columns={24} gutter={{base: 6}}>
                                        <Grid.Col span={12}>
                                            <SelectForm
                                                tooltip={t('SelectMaterialName')}
                                                placeholder={t('SelectMaterialName')}
                                                required={true}
                                                name={'inv_stock_id'}
                                                form={form}
                                                dropdownValue={productMaterialDropdown}
                                                mt={0}
                                                id={'inv_stock_id'}
                                                nextField={'price'}
                                                searchable={true}
                                                value={productData}
                                                changeValue={setProductData}
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
                                                >
                                                    <Text fz={14} fw={500}>
                                                        {isOnline && t("AddItem")}
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
            </Box>
        </>
    );
}

export default __RecipeAddItem;
