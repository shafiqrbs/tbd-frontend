import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, rem, Flex, Grid, Box, ScrollArea, Text, Title, Stack } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut";
import { setValidationData, updateEntityData } from "../../../../store/inventory/crudSlice.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

function ProductManagementForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const validationMessage = useSelector((state) => state.inventoryCrudSlice.validationMessage)
    const validation = useSelector((state) => state.inventoryCrudSlice.validation)

    const [formLoad, setFormLoad] = useState(true);
    const [setFormData, setFormDataForUpdate] = useState(false);



    // localStorage.setItem('config-data', JSON.stringify(getConfigData()));

    // const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []

    const form = useForm({
        initialValues: {
            color: '',
            size: '',
            brand: '',
            vat_enable: '',
            product_image: '',
            product_gallery: '',
            zero_stock: '',
            stock_item: '',
            is_stock_history: '',

        },
        validate: {
            // business_model_id: isNotEmpty(),
            // country_id: isNotEmpty(),
            // currency_id: isNotEmpty(),
        }
    });


    useEffect(() => {
        if (validationMessage.message === 'success') {
            notifications.show({
                color: 'teal',
                title: t('UpdateSuccessfully'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: 'lightgray' },
            });

            setTimeout(() => {
                setSaveCreateLoading(false)
            }, 700)
        }
    }, [validation, validationMessage]);

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch])


    useHotkeys([['alt+n', () => {
        document.getElementById('color').click()
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
                // if (files) {
                //     form.values['logo'] = files[0]
                // }
                // form.values['sku_wearhouse'] = (values.sku_wearhouse === true || values.sku_wearhouse == 1) ? 1 : 0
                // form.values['sku_category'] = (values.sku_category === true || values.sku_category == 1) ? 1 : 0
                // form.values['vat_enable'] = (values.vat_enable === true || values.vat_enable == 1) ? 1 : 0
                // form.values['ait_enable'] = (values.ait_enable === true || values.ait_enable == 1) ? 1 : 0

                dispatch(setValidationData(false))
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
                            url: 'inventory/config-update',
                            data: values
                        }
                        dispatch(updateEntityData(value))
                    },
                });
            })}>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={7}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'8'} pb={'10'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col >
                                            <Title order={6} pt={'4'}>{t('SkuManagement')}</Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box pl={'xs'} pt={'xs'} >

                                            {/* <Box mt={'xs'}>
                                                    <Text fz="sm">{t("StockFormat")}</Text>
                                                </Box> */}
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Color')}
                                                            label=''
                                                            nextField={'size'}
                                                            name={'color'}
                                                            form={form}
                                                            color="red"
                                                            id={'color'}
                                                            position={'left'}
                                                        // defaultChecked={configData.sku_wearhouse}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Color')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Size')}
                                                            label=''
                                                            nextField={'brand'}
                                                            name={'size'}
                                                            form={form}
                                                            color="red"
                                                            id={'size'}
                                                            position={'left'}
                                                        // defaultChecked={configData.sku_category}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Brand')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Size')}
                                                            label=''
                                                            nextField={'measurment'}
                                                            name={'brand'}
                                                            form={form}
                                                            color="red"
                                                            id={'brand'}
                                                            position={'left'}
                                                        // defaultChecked={configData.sku_category}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Brand')}</Grid.Col>
                                                </Grid>
                                            </Box>

                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'8'} pb={'10'} mb={'4'}
                                    className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col >
                                            <Title order={6} pt={'4'} >{t('Title')}</Title>
                                        </Grid.Col>

                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box pl={'xs'} pt={'xs'}>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Measurment')}
                                                            label=''
                                                            nextField={'product_image'}
                                                            name={'measurment'}
                                                            form={form}
                                                            color="red"
                                                            id={'vat_enable'}
                                                            position={'left'}
                                                        // defaultChecked={configData.invoice_print_logo}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Measurment')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ProductImage')}
                                                            label=''
                                                            nextField={'product_gallery'}
                                                            name={'product_image'}
                                                            form={form}
                                                            color="red"
                                                            id={'product_image'}
                                                            position={'left'}
                                                        // defaultChecked={configData.print_outstanding}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('ProductImage')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ProductGallery')}
                                                            label=''
                                                            nextField={'is_multi_price'}
                                                            name={'product_gallery'}
                                                            form={form}
                                                            color="red"
                                                            id={'product_gallery'}
                                                            position={'left'}
                                                        // defaultChecked={configData.pos_print}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('ProductGallery')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ProductMultiPrice')}
                                                            label=''
                                                            nextField={'zero_stock'}
                                                            name={'is_multi_price'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_multi_price'}
                                                            position={'left'}
                                                        // defaultChecked={configData.pos_print}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('ProductMultiPrice')}</Grid.Col>
                                                </Grid>
                                            </Box>

                                        </Box>

                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} mb={'xs'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt={'6'}>{t('Sales')}</Title>
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
                                                                    {t("UpdateAndSave")}
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
                                    <ScrollArea h={height / 2 - 42} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box pt={'xs'} pl={'xs'}>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ZeroStockAllowed')}
                                                            label=''
                                                            nextField={'stock_item'}
                                                            name={'zero_stock'}
                                                            form={form}
                                                            color="red"
                                                            id={'zero_stock'}
                                                            position={'left'}
                                                        // defaultChecked={configData.custom_invoice}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('ZeroStockAllowed')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('StockItem')}
                                                            label=''
                                                            nextField={'is_stock_history'}
                                                            name={'stock_item'}
                                                            form={form}
                                                            color="red"
                                                            id={'stock_item'}
                                                            position={'left'}
                                                        // defaultChecked={configData.bonus_from_stock}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('StockItem')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('StockHistory')}
                                                            label=''
                                                            nextField={'is_description'}
                                                            name={'is_stock_history'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_stock_history'}
                                                            position={'left'}
                                                        // defaultChecked={configData.is_unit_price}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('StockHistory')}</Grid.Col>
                                                </Grid>
                                            </Box>




                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'8'} pb={'10'} mb={'4'}
                                    className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col >
                                            <Title order={6} pt={'4'} >{t('Pruchase')}</Title>
                                        </Grid.Col>

                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height / 2 - 40} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box pl={'xs'} pt={'xs'}>
                                            <Box pt={'xs'} pl={'xs'}>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('ZeroStockAllowed')}
                                                                label=''
                                                                nextField={'stock_item'}
                                                                name={'zero_stock'}
                                                                form={form}
                                                                color="red"
                                                                id={'zero_stock'}
                                                                position={'left'}
                                                            // defaultChecked={configData.custom_invoice}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'}
                                                            pt={'1'}>{t('ZeroStockAllowed')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('StockItem')}
                                                                label=''
                                                                nextField={'is_stock_history'}
                                                                name={'stock_item'}
                                                                form={form}
                                                                color="red"
                                                                id={'stock_item'}
                                                                position={'left'}
                                                            // defaultChecked={configData.bonus_from_stock}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'}
                                                            pt={'1'}>{t('StockItem')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('StockHistory')}
                                                                label=''
                                                                nextField={'is_description'}
                                                                name={'is_stock_history'}
                                                                form={form}
                                                                color="red"
                                                                id={'is_stock_history'}
                                                                position={'left'}
                                                            // defaultChecked={configData.is_unit_price}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('StockHistory')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Box>

                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1}>
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
            </form >
        </Box >
    );
}

export default ProductManagementForm;
