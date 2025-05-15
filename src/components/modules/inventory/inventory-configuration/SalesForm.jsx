import React, {useEffect, useState, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {Box, Grid, Checkbox, ScrollArea, Button, Text} from "@mantine/core";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {useDispatch} from "react-redux";
import {modals} from "@mantine/modals";
import {useHotkeys} from "@mantine/hooks";
import {setValidationData, storeEntityData} from "../../../../store/core/crudSlice";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig";
import SelectForm from "../../../form-builders/SelectForm";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
import InputCheckboxForm from "../../../form-builders/InputCheckboxForm";

function SalesForm({customerGroupDropdownData, height, id, config_sales, closeDrawer}) {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const {fetchDomainConfig} = getDomainConfig(false)
    const [customerGroupData, setCustomerGroupData] = useState(null);

    useEffect(() => {
        setCustomerGroupData(config_sales?.default_customer_group_id?.toString())
    }, [id]);


    const form = useForm({
        initialValues: {
            default_customer_group_id: config_sales?.default_customer_group_id || "",
            discount_with_customer: config_sales?.discount_with_customer || "",
            due_sales_without_customer: config_sales?.due_sales_without_customer || "",
            is_multi_price: config_sales?.is_multi_price || "",
            is_sales_auto_approved: config_sales?.is_sales_auto_approved || "",
            is_measurement_enable: config_sales?.is_measurement_enable || "",
            is_zero_receive_allow: config_sales?.is_zero_receive_allow || "",
            item_sales_percent: config_sales?.item_sales_percent || "",
            search_by_category: config_sales?.search_by_category || "",
            search_by_product_nature: config_sales?.search_by_product_nature || "",
            search_by_vendor: config_sales?.search_by_vendor || "",
            search_by_warehouse: config_sales?.search_by_warehouse || "",
            show_product: config_sales?.show_product || "",
            is_bonus_quantity: config_sales?.is_bonus_quantity || "",
            is_barcode: config_sales?.is_barcode || "",
            zero_stock: config_sales?.zero_stock || "",
        },
        validate: {
            default_customer_group_id: isNotEmpty(),
        }
    });

    useEffect(() => {
        if (config_sales) {
            form.setValues({
                default_customer_group_id: config_sales?.default_customer_group_id || null,
                discount_with_customer: config_sales?.discount_with_customer || 0,
                due_sales_without_customer: config_sales?.due_sales_without_customer || 0,
                is_multi_price: config_sales?.is_multi_price || 0,
                is_sales_auto_approved: config_sales?.is_sales_auto_approved || 0,
                is_measurement_enable: config_sales?.is_measurement_enable || 0,
                is_zero_receive_allow: config_sales?.is_zero_receive_allow || 0,
                item_sales_percent: config_sales?.item_sales_percent || 0,
                search_by_category: config_sales?.search_by_category || 0,
                search_by_product_nature: config_sales?.search_by_product_nature || 0,
                search_by_vendor: config_sales?.search_by_vendor || 0,
                search_by_warehouse: config_sales?.search_by_warehouse || 0,
                show_product: config_sales?.show_product || 0,
                is_bonus_quantity: config_sales?.is_bonus_quantity || 0,
                is_barcode: config_sales?.is_barcode || 0,
                zero_stock: config_sales?.zero_stock || 0,
            });
        }
    }, [dispatch, config_sales]);


    const handleSalesFormSubmit = (values) => {
        dispatch(setValidationData(false));
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red"},
            onCancel: () => {
            },
            onConfirm: () => handleSalesConfirmSubmit(values),
        });
    };

    const handleSalesConfirmSubmit = async (values) => {

        const properties = [
            "discount_with_customer",
            "due_sales_without_customer",
            "is_multi_price",
            "is_sales_auto_approved",
            "is_zero_receive_allow",
            "item_sales_percent",
            "search_by_category",
            "search_by_product_nature",
            "search_by_vendor",
            "search_by_warehouse",
            "show_product",
            "is_bonus_quantity",
            "is_barcode",
            "zero_stock",
        ];

        properties.forEach((property) => {
            values[property] =
                values[property] === true || values[property] == 1 ? 1 : 0;
        });

        const payload = {
            url: `domain/config/inventory-sales/${id}`,
            data: values,
        };

        try {
            setSaveCreateLoading(true);
            const result = await dispatch(storeEntityData(payload));
            if (storeEntityData.fulfilled.match(result) && result.payload?.data?.status === 200) {
                fetchDomainConfig()
                showNotificationComponent(t("UpdateSuccessfully"), "teal");
                setTimeout(() => {
                    closeDrawer()
                }, 1000)
            } else {
                showNotificationComponent(t("UpdateFailed"), "red");
            }

        } catch (err) {
            console.error(err);
            showNotificationComponent(t("UpdateFailed"), "red");
        } finally {
            setSaveCreateLoading(false);
        }
    };

    useHotkeys([
        ["alt+s", () => document.getElementById("SalesFormSubmit")?.click()]
    ], []);


    return (
        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
            <form onSubmit={form.onSubmit(handleSalesFormSubmit)}>
                <Box pt="xs">

                    {/* CustomerGroup Field */}
                    <Box pl="sm">
                        <Grid columns={24} gutter={{base: 1}}>
                            <Grid.Col span={12} fz="sm" mt={8}>
                                {t("CustomerGroup")}
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <SelectForm
                                    tooltip={t("ChooseCustomerGroup")}
                                    label=""
                                    placeholder={t("ChooseCustomerGroup")}
                                    required
                                    name="default_customer_group_id"
                                    form={form}
                                    dropdownValue={customerGroupDropdownData}
                                    id="default_customer_group_id"
                                    searchable={false}
                                    value={customerGroupData}
                                    changeValue={setCustomerGroupData}
                                />
                            </Grid.Col>
                        </Grid>
                    </Box>

                    <Box bg="gray.1" px="sm" py="xs" mt="xs">
                        <Text fz={14} fw={600}>Customer Settings</Text>
                    </Box>
                    <Box pl="sm">
                        <Box>
                            <InputCheckboxForm form={form} label={t('DiscountWithCustomer')}
                                               field={'discount_with_customer'} name={'discount_with_customer'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('DueSalesWithoutCustomer')}
                                               field={'due_sales_without_customer'}
                                               name={'due_sales_without_customer'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('BonusQuantity')} field={'is_bonus_quantity'}
                                               name={'is_bonus_quantity'}/>
                        </Box>
                    </Box>

                    <Box bg="gray.1" px="sm" py="xs" mt="xs">
                        <Text fz={14} fw={600}>Sales & Pricing Settings</Text>
                    </Box>
                    <Box pl="sm">
                        <Box>
                            <InputCheckboxForm form={form} label={t('MultiPrice')} field={'is_multi_price'}
                                               name={'is_multi_price'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('SalesAutoApproved')}
                                               field={'is_sales_auto_approved'} name={'is_sales_auto_approved'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('ItemSalesPercent')} field={'item_sales_percent'}
                                               name={'item_sales_percent'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('ZeroReceiveAllow')} field={'is_zero_receive_allow'}
                                               name={'is_zero_receive_allow'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('ZeroStock')} field={'zero_stock'}
                                               name={'zero_stock'}/>
                        </Box>
                    </Box>

                    <Box bg="gray.1" px="sm" py="xs" mt="xs">
                        <Text fz={14} fw={600}>Product Display & Search Options</Text>
                    </Box>
                    <Box pl="sm">
                        <Box>
                            <InputCheckboxForm form={form} label={t('ShowProduct')} field={'show_product'}
                                               name={'show_product'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('ShowBarcode')} field={'is_barcode'}
                                               name={'is_barcode'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('SearchByCategory')} field={'search_by_category'}
                                               name={'search_by_category'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('SearchByProductNature')}
                                               field={'search_by_product_nature'} name={'search_by_product_nature'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('SearchByVendor')} field={'search_by_vendor'}
                                               name={'search_by_vendor'}/>
                        </Box>
                        <Box>
                            <InputCheckboxForm form={form} label={t('SearchByWarehouse')} field={'search_by_warehouse'}
                                               name={'search_by_warehouse'}/>
                        </Box>
                    </Box>

                    <Box bg="gray.1" px="sm" py="xs" mt="xs">
                        <Text fz={14} fw={600}>Product Configuration</Text>
                    </Box>
                    <Box pl="sm">
                        <Box>
                            <InputCheckboxForm form={form} label={t('MeasurementEnable')}
                                               field={'is_measurement_enable'} name={'is_measurement_enable'}/>
                        </Box>
                    </Box>

                </Box>

                {/* Hidden submit button */}
                <Button
                    id="SalesFormSubmit"
                    type="submit"
                    style={{display: "none"}}
                    loading={saveCreateLoading}
                >
                    {t("Submit")}
                </Button>
            </form>
        </ScrollArea>
    );
}

export default SalesForm;
