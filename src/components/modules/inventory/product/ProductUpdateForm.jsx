import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Group, Text, Title, Flex, Stack, Tooltip, ActionIcon, LoadingOverlay, Table,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCategoryPlus,
    IconCheck,
    IconClipboardPlus,
    IconDeviceFloppy,
    IconDotsVertical,
    IconPencilBolt,
    IconPlus,
    IconX,
    IconSortAscendingNumbers,
    IconTrashX,
    IconSum
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/core/crudSlice.js";
import Shortcut from "../../shortcut/Shortcut.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import getSettingProductTypeDropdownData from "../../../global-hook/dropdown/getSettingProductTypeDropdownData.js";
import getSettingProductUnitDropdownData from "../../../global-hook/dropdown/getSettingProductUnitDropdownData.js";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import InputButtonForm from "../../../form-builders/InputButtonForm";

function ProductUpdateForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const [categoryData, setCategoryData] = useState(null);
    const [productTypeData, setProductTypeData] = useState(null);
    const [productUnitData, setProductUnitData] = useState(null);
    const [measurmentUnitData, setMeasurmentUnitData] = useState(null);


    const form = useForm({
        initialValues: {
            product_type_id: '', category_id: '', unit_id: '', name: '', alternative_name: '', barcode: '', sku: '', sales_price: '', purchase_price: '', min_quantity: '', status: true
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

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])
    //console.log(entityEditData);
    useEffect(() => {

        form.setValues({
            product_type_id: entityEditData.product_type_id ? entityEditData.product_type_id : '',
            category_id: entityEditData.category_id ? entityEditData.category_id : '',
            unit_id: entityEditData.unit_id ? entityEditData.unit_id : '',
            name: entityEditData.product_name ? entityEditData.product_name : '',
            alternative_name: entityEditData.alternative_name ? entityEditData.alternative_name : '',
            barcode: entityEditData.barcode ? entityEditData.barcode : '',
            sku: entityEditData.sku ? entityEditData.sku : '',
            sales_price: entityEditData.sales_price ? entityEditData.sales_price : '',
            purchase_price: entityEditData.purchase_price ? entityEditData.purchase_price : '',
            min_quantity: entityEditData.min_quantity ? entityEditData.min_quantity : '',
            status: entityEditData.status ? entityEditData.status : '',
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch, setFormData])


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
                dispatch(updateEntityData(values))
                    .then(() => {
                        navigate('/inventory/product', { replace: true });
                        dispatch(setInsertType('create'));
                    })
                    .catch((error) => {

                    })
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
                        const storedProducts = localStorage.getItem('core-products');
                        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
                        const updatedProducts = localProducts.map(product => {
                            if (product.id === entityEditData.id) {
                                return {
                                    ...product,
                                    product_name: values.name,
                                    alternative_name: values.alternative_name
                                };
                            }
                            return product
                        });
                        localStorage.setItem('core-products', JSON.stringify(updatedProducts));
                        const value = {
                            url: 'inventory/product/' + entityEditData.id,
                            data: values
                        }
                        dispatch(updateEntityData(value))
                        notifications.show({
                            color: 'teal',
                            title: t('UpdateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
                        });

                        setTimeout(() => {
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            setProductTypeData(null)
                            setCategoryData(null)
                            setProductUnitData(null)
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                        }, 700)
                    },
                });
            })}>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box pl={`xs`} pb={'6'} pr={8} pt={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                <Grid>
                                    <Grid.Col span={6} >
                                        <Title order={6} pt={'6'}>{t('UpdateProduct')}</Title>
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
                                            </></Stack>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                    <Box>
                                        <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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
                                                value={productTypeData ? String(productTypeData) : (entityEditData.product_type_id ? String(entityEditData.product_type_id) : null)}
                                                changeValue={setProductTypeData}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={12}>
                                                    <SelectForm
                                                        tooltip={t('ChooseCategory')}
                                                        label={t('Category')}
                                                        placeholder={t('ChooseCategory')}
                                                        required={true}
                                                        nextField={'name'}
                                                        name={'category_id'}
                                                        form={form}
                                                        dropdownValue={getSettingCategoryDropdownData()}
                                                        id={'category_id'}
                                                        searchable={true}
                                                        value={categoryData ? String(categoryData) : (entityEditData.category_id ? String(entityEditData.category_id) : null)}
                                                        changeValue={setCategoryData}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
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
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('AlternativeProductNameValidateMessage')}
                                                label={t('AlternativeProductName')}
                                                placeholder={t('AlternativeProductName')}
                                                required={false}
                                                nextField={'sku'}
                                                form={form}
                                                name={'alternative_name'}
                                                mt={8}
                                                id={'alternative_name'}
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
                                                        nextField={'unit_id'}
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
                                                        nextField={'min_quantity'}
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
                                                        nextField={'min_quantity'}
                                                        searchable={true}
                                                        changeValue={setProductUnitData}
                                                        value={productUnitData ? String(productUnitData) : (entityEditData.unit_id ? String(entityEditData.unit_id) : null)}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <InputForm
                                                        tooltip={t('MinimumQuantityValidateMessage')}
                                                        label={t('MinimumQuantity')}
                                                        placeholder={t('MinimumQuantity')}
                                                        required={false}
                                                        form={form}
                                                        name={'min_quantity'}
                                                        mt={8}
                                                        id={'min_quantity'}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'md'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <Grid columns={6} gutter={{ base: 1 }}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('Status')}
                                                                    label=''
                                                                    nextField={'EntityFormSubmit'}
                                                                    name={'status'}
                                                                    form={form}
                                                                    color="red"
                                                                    id={'status'}
                                                                    position={'left'}
                                                                    defaultChecked={1}
                                                                    checked={form.values.status}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={4} fz={'sm'} pt={'1'}>{t('Status')}
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8} >
                        <Box bg={'white'}  p={'xs'} className={'borderRadiusAll'} >
                            <Box pl={`4`} pb={'3'} pr={8} pt={'3'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                <Grid gutter={'4'}>
                                    <Grid.Col span={5}>
                                        <SelectForm
                                            tooltip={t('ChooseProductUnit')}
                                            label=''
                                            placeholder={t('ChooseProductUnit')}
                                            required={true}
                                            name={'unit_id'}
                                            form={form}
                                            dropdownValue={getSettingProductUnitDropdownData()}
                                            id={'unit_id'}
                                            nextField={'quantity'}
                                            searchable={true}
                                            value={measurmentUnitData}
                                            changeValue={setMeasurmentUnitData}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <InputButtonForm
                                            tooltip=''
                                            label=''
                                            placeholder={t('QTY')}
                                            required={true}
                                            nextField={'EntityFormSubmit'}
                                            form={form}
                                            name={'quantity'}
                                            id={'quantity'}
                                            leftSection={<IconSortAscendingNumbers size={16} opacity={0.5} />}
                                            rightSection={(entityEditData.unit_name ? String(entityEditData.unit_name) : '')}
                                            closeIcon={false}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Stack right align="flex-end" pt={'3'}>
                                            <>
                                                {
                                                    !saveCreateLoading && isOnline &&
                                                    <Button
                                                        size="xs"
                                                        color={`red.3`}
                                                        type="submit"
                                                        id="EntityFormSubmit"
                                                        leftSection={<IconDeviceFloppy size={18} />}
                                                    >
                                                        <Flex direction={`column`} gap={0}>
                                                            <Text fz={14} fw={400}>
                                                                {t("AddMeasurment")}
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
                                    <Box>
                                        <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                    </Box>
                                    <Box>
                                        <Table stickyHeader >
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th fz="xs" w={'20'}>{t('S/N')}</Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={'300'}>{t('Name')}</Table.Th>
                                                    <Table.Th fz="xs" ta="center" w={'60'}>{t('QTY')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}>{t('Unit')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}></Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                <Table.Tr>
                                                    <Table.Th fz="xs" w={'20'}>1</Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={'300'}>Pcs</Table.Th>
                                                    <Table.Th fz="xs" ta="center" w={'60'}>20</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}>Box</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}><ActionIcon size="sm" variant="transparent" color="red">
                                                        <IconX height={'18'} width={'18'} stroke={1.5} />
                                                    </ActionIcon></Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th fz="xs" w={'20'}>1</Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={'300'}>Pcs</Table.Th>
                                                    <Table.Th fz="xs" ta="center" w={'60'}>20</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}>Box</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}><ActionIcon size="sm" variant="transparent" color="red">
                                                        <IconX height={'18'} width={'18'} stroke={1.5} />
                                                    </ActionIcon></Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th fz="xs" w={'20'}>1</Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={'300'}>Pcs</Table.Th>
                                                    <Table.Th fz="xs" ta="center" w={'60'}>20</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}>Box</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}><ActionIcon size="sm" variant="transparent" color="red">
                                                        <IconX height={'18'} width={'18'} stroke={1.5} />
                                                    </ActionIcon></Table.Th>
                                                </Table.Tr>
                                            </Table.Tbody>
                                        </Table>
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8} >
                        <Box bg={'white'}  p={'xs'} className={'borderRadiusAll'} >
                            <Box pl={`xs`} pb={'6'} pr={8} pt={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                <Grid>
                                    <Grid.Col span={6} >
                                        <Title order={6} pt={'6'}>{t('UnitMeasurment')}</Title>
                                    </Grid.Col>
                                    <Grid.Col span={6}>

                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                    <Box>
                                        <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Box>
                    </Grid.Col>
                </Grid>
            </form>
        </Box>
    )
}

export default ProductUpdateForm;
