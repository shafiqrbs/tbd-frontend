import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {
    Box,
    Grid,
    ScrollArea,
    Button,
    Text,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useDispatch} from "react-redux";
import {modals} from "@mantine/modals";
import {useHotkeys} from "@mantine/hooks";
import {
    setValidationData,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm";
import InputCheckboxForm from "../../../form-builders/InputCheckboxForm";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig";
import getSettingProductTypeDropdownData from "../../../global-hook/dropdown/getSettingProductTypeDropdownData.js";

const PurchaseForm = ({vendorGroupDropdownData, height, closeDrawer}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {fetchDomainConfig, domainConfig} = getDomainConfig(true);
    const config_purchase = domainConfig?.inventory_config?.config_purchase;
    const domainId = domainConfig?.id;
    const productNature = getSettingProductTypeDropdownData();

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [vendorGroupData, setVendorGroupData] = useState(null);
    const [purchaseModeData, setPurchaseModeData] = useState(null);

    const form = useForm({
        initialValues: {
            search_by_vendor: 0,
            search_by_product_nature: 0,
            search_by_category: 0,
            is_barcode: 0,
            is_measurement_enable: 0,
            is_purchase_auto_approved: 0,
            default_vendor_group_id: null,
            is_warehouse: 0,
            is_bonus_quantity: 0,
            is_purchase_by_purchase_price: 0,
            item_percent: 0,
        },
    });

    const productNatureSelectedIds = useMemo(() => {
        try {
            const rawValue = config_purchase?.purchase_product_nature;
            if (!rawValue) return [];
            const parsed = JSON.parse(rawValue);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Invalid JSON in purchase_product_nature:", e);
            return [];
        }
    }, [config_purchase]);

    useEffect(() => {
        if (!config_purchase) return;

        const parsedNature = Array.isArray(config_purchase.purchase_product_nature)
            ? config_purchase.purchase_product_nature
            : JSON.parse(config_purchase.purchase_product_nature || "[]");

        const natureValues = {};
        parsedNature.forEach((nature) => {
            const natureId = Number(nature);
            natureValues[`${natureId}_purchaseProductNature`] = productNatureSelectedIds.includes(natureId) ? 1 : 0;
        });

        setVendorGroupData(config_purchase?.default_vendor_group_id?.toString());
        setPurchaseModeData(config_purchase?.purchase_mode?.toString());

        form.setValues({
            ...{
                search_by_vendor: config_purchase.search_by_vendor || 0,
                search_by_product_nature: config_purchase.search_by_product_nature || 0,
                search_by_category: config_purchase.search_by_category || 0,
                is_barcode: config_purchase.is_barcode || 0,
                is_measurement_enable: config_purchase.is_measurement_enable || 0,
                is_purchase_auto_approved: config_purchase.is_purchase_auto_approved || 0,
                default_vendor_group_id: config_purchase.default_vendor_group_id || null,
                purchase_mode: config_purchase.purchase_mode || null,
                is_warehouse: config_purchase.is_warehouse || 0,
                is_bonus_quantity: config_purchase.is_bonus_quantity || 0,
                is_purchase_by_purchase_price: config_purchase.is_purchase_by_purchase_price || 0,
                item_percent: config_purchase.item_percent || 0,
            },
            ...natureValues,
        });
    }, [config_purchase, productNatureSelectedIds]);

    const forceBooleanToInt = (value) => value === true || value === 1 ? 1 : 0;

    const handlePurchaseFormSubmit = (values) => {
        dispatch(setValidationData(false));

        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red"},
            onCancel: () => {
            },
            onConfirm: () => handlePurchaseConfirmSubmit(values),
        });
    };

    const handlePurchaseConfirmSubmit = async (values) => {
        const booleanFields = [
            "search_by_vendor",
            "search_by_product_nature",
            "search_by_category",
            "is_barcode",
            "is_measurement_enable",
            "is_purchase_auto_approved",
            "is_bonus_quantity",
            "is_purchase_by_purchase_price",
            "item_percent",
            "is_warehouse",
        ];

        booleanFields.forEach((key) => {
            values[key] = forceBooleanToInt(values[key]);
        });

        const selectedProductNature = Object.entries(values)
            .filter(([key, value]) => value === 1 && key.endsWith("_purchaseProductNature"))
            .map(([key]) => Number(key.split("_")[0]));

        values.purchase_product_nature = selectedProductNature;

        const payload = {
            url: `domain/config/inventory-purchase/${domainId}`,
            data: values,
            type: "POST",
        };

        try {
            setSaveCreateLoading(true);
            const result = await dispatch(storeEntityData(payload));

            if (
                storeEntityData.fulfilled.match(result) &&
                result.payload?.data?.status === 200
            ) {
                fetchDomainConfig();
                localStorage.removeItem("temp-purchase-products");
                showNotificationComponent(t("UpdateSuccessfully"), "teal");
                setTimeout(closeDrawer, 1000);
            } else {
                showNotificationComponent(t("UpdateFailed"), "red");
            }
        } catch (error) {
            console.error(error);
            showNotificationComponent(t("UpdateFailed"), "red");
        } finally {
            setSaveCreateLoading(false);
        }
    };

    useHotkeys(
        [["alt+p", () => document.getElementById("PurchaseFormSubmit")?.click()]],
        []
    );

    const renderHeadCheckboxes = (type) => (
        <>
            {productNature?.map((head) => (
                <Box key={`${head.value}_${type}`}>
                    <InputCheckboxForm
                        form={form}
                        label={head.label}
                        field={`${head.value}_${type}`}
                        name={`${head.value}_${type}`}
                        value={head.value}
                    />
                </Box>
            ))}
        </>
    );

    return (
        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
            <form onSubmit={form.onSubmit(handlePurchaseFormSubmit)}>
                <Box pt="xs">

                    {/* Purchase mode Selection */}
                    <Grid columns={24} gutter={{base: 1}}>
                        <Grid.Col span={12} fz="sm" mt={8} pl="xs">
                            <Text fw={500}>{t("PurchaseMode")}</Text>
                        </Grid.Col>
                        <Grid.Col span={11}>
                            <SelectForm
                                tooltip={t("ChoosePurchaseMode")}
                                label=""
                                placeholder={t("ChoosePurchaseMode")}
                                required={true}
                                name="purchase_mode"
                                form={form}
                                dropdownValue={[
                                    {value: "purchase-price", label: t("PurchasePrice")},
                                    {value: "mrp-price", label: t("MrpPrice")},
                                    {value: "split-amount", label: t("SplitAmount")},
                                ]}
                                id="purchase_mode"
                                searchable={false}
                                value={purchaseModeData}
                                changeValue={setPurchaseModeData}
                            />
                        </Grid.Col>
                    </Grid>

                    {/* Vendor Group Selection */}
                    <Grid columns={24} gutter={{base: 1}} mt={8}>
                        <Grid.Col span={12} fz="sm" mt={8} pl="xs">
                            <Text fw={500}>{t("VendorGroup")}</Text>
                        </Grid.Col>
                        <Grid.Col span={11}>
                            <SelectForm
                                tooltip={t("ChooseVendorGroup")}
                                label=""
                                placeholder={t("ChooseVendorGroup")}
                                required={true}
                                name="default_vendor_group_id"
                                form={form}
                                dropdownValue={vendorGroupDropdownData}
                                id="default_vendor_group_id"
                                searchable={false}
                                value={vendorGroupData}
                                changeValue={setVendorGroupData}
                            />
                        </Grid.Col>
                    </Grid>

                    {/* Product Nature */}
                    <Box bg="gray.1" px="sm" py="xs" mt="xs">
                        <Text component="h2" aria-label="Product Purchase Nature" fz={14} fw={600}>
                            {t("ProductPurchaseNature")}
                        </Text>
                    </Box>
                    <Box pl="sm">{productNature && renderHeadCheckboxes("purchaseProductNature")}</Box>

                    {/* Purchase Settings */}
                    <Box bg="gray.1" px="sm" py="xs" mt="xs">
                        <Text component="h2" aria-label="Purchase Settings" fz={14} fw={600}>
                            {t("PurchaseSettings")}
                        </Text>
                    </Box>
                    <Box pl="sm">
                        <InputCheckboxForm form={form} label={t("PurchaseByPurchasePrice")}
                                           field="is_purchase_by_purchase_price" name="is_purchase_by_purchase_price"/>
                        <InputCheckboxForm form={form} label={t("PurchaseAutoApproved")}
                                           field="is_purchase_auto_approved" name="is_purchase_auto_approved"/>
                        <InputCheckboxForm form={form} label={t("BonusQuantity")} field="is_bonus_quantity"
                                           name="is_bonus_quantity"/>
                        <InputCheckboxForm form={form} label={t("ItemPercent")} field="item_percent"
                                           name="item_percent"/>
                    </Box>

                    {/* Product & Configuration */}
                    <Box bg="gray.1" px="sm" py="xs" mt="xs">
                        <Text component="h2" aria-label="Product & Configuration" fz={14} fw={600}>
                            {t("ProductConfiguration")}
                        </Text>
                    </Box>
                    <Box pl="sm">
                        <InputCheckboxForm form={form} label={t("IsBarcode")} field="is_barcode" name="is_barcode"/>
                        <InputCheckboxForm form={form} label={t("MeasurementEnabled")} field="is_measurement_enable"
                                           name="is_measurement_enable"/>
                    </Box>

                    {/* Search & Filtering */}
                    <Box bg="gray.1" px="sm" py="xs" mt="xs">
                        <Text component="h2" aria-label="Search & Filtering Settings" fz={14} fw={600}>
                            {t("SearchAndFiltering")}
                        </Text>
                    </Box>
                    <Box pl="sm">
                        <InputCheckboxForm form={form} label={t("SearchByVendor")} field="search_by_vendor"
                                           name="search_by_vendor"/>
                        <InputCheckboxForm form={form} label={t("SearchByProductNature")}
                                           field="search_by_product_nature" name="search_by_product_nature"/>
                        <InputCheckboxForm form={form} label={t("SearchByCategory")} field="search_by_category"
                                           name="search_by_category"/>
                    </Box>

                    {/* Inventory & Storage */}
                    <Box bg="gray.1" px="sm" py="xs" mt="xs">
                        <Text component="h2" aria-label="Inventory & Storage Settings" fz={14} fw={600}>
                            {t("InventoryAndStorage")}
                        </Text>
                    </Box>
                    <Box pl="sm">
                        <InputCheckboxForm form={form} label={t("Warehouse")} field="is_warehouse" name="is_warehouse"/>
                    </Box>
                </Box>

                {/* Hidden Button for hotkey triggering */}
                <Button id="PurchaseFormSubmit" type="submit" style={{display: "none"}}>
                    {t("Submit")}
                </Button>
            </form>
        </ScrollArea>
    );
};

export default PurchaseForm;
