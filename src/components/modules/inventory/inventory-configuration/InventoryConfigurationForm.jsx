import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Flex,
    Grid,
    Box,
    ScrollArea,
    Text,
    Title,
    Stack,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconCheck, IconDeviceFloppy, IconX} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut";
import {
    setValidationData, showInstantEntityData,
    updateEntityData,
} from "../../../../store/inventory/crudSlice.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import getSettingProductTypeDropdownData from "../../../global-hook/dropdown/getSettingProductTypeDropdownData.js";

function InventoryConfigurationForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const [formLoad, setFormLoad] = useState(true);
    const [setFormData, setFormDataForUpdate] = useState(false);

    const inventoryConfigData = localStorage.getItem("config-data")
        ? JSON.parse(localStorage.getItem("config-data"))
        : [];


    const form = useForm({
        initialValues: {
            is_brand: inventoryConfigData.is_brand || "",
            is_grade: inventoryConfigData.is_grade || "",
            is_color: inventoryConfigData.is_color || "",
            is_size: inventoryConfigData.is_size || "",
            is_model: inventoryConfigData.is_model || "",
            is_measurement: inventoryConfigData.is_measurement || "",
            is_product_gallery: inventoryConfigData.is_product_gallery || "",
            is_multi_price: inventoryConfigData.is_multi_price || "",
            zero_stock: inventoryConfigData.zero_stock || "",
            stock_item: inventoryConfigData.stock_item || "",
            is_stock_history: inventoryConfigData.is_stock_history || "",
            mrp_price: inventoryConfigData.mrp_price || "",
            total_price: inventoryConfigData.total_price || "",
            purchase_price: inventoryConfigData.purchase_price || "",
            is_batch_invoice: inventoryConfigData.is_batch_invoice || "",
            is_provision: inventoryConfigData.is_provision || "",
            is_sku: inventoryConfigData.is_sku || "",
            raw_materials: inventoryConfigData.raw_materials || "",
            stockable: inventoryConfigData.stockable || "",
            post_production: inventoryConfigData.post_production || "",
            mid_production: inventoryConfigData.mid_production || "",
            pre_production: inventoryConfigData.pre_production || ""
        },
    });


    useEffect(() => {
        setFormLoad(true);
        setFormDataForUpdate(true);
    }, [dispatch]);

    useHotkeys(
        [
            [
                "alt+n",
                () => {
                    document.getElementById("is_brand").click();
                },
            ],
        ],
        []
    );

    useHotkeys(
        [
            [
                "alt+r",
                () => {
                    form.reset();
                },
            ],
        ],
        []
    );

    useHotkeys(
        [
            [
                "alt+s",
                () => {
                    document.getElementById("EntityFormSubmit").click();
                },
            ],
        ],
        []
    );

    const handleFormSubmit = (values) => {
        // Dispatch to set validation state (if needed)
        dispatch(setValidationData(false));

        // Open confirmation modal
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red"},
            onCancel: () => {
                console.log("Cancel");
            },
            onConfirm: () => handleConfirmSubmit(values), // Separate function for "onConfirm"
        });
    };

    const handleConfirmSubmit = async (values) => {
        const properties = [
            "is_brand",
            "is_grade",
            "is_color",
            "is_size",
            "is_model",
            "is_measurement",
            "is_product_gallery",
            "is_multi_price",
            "zero_stock",
            "stock_item",
            "is_stock_history",
            "mrp_price",
            "total_price",
            "purchase_price",
            "is_batch_invoice",
            "is_provision",
            "raw_materials",
            "stockable",
            "post_production",
            "mid_production",
            "pre_production",
            "is_sku"
        ];

        properties.forEach((property) => {
            form.values[property] = values[property] === true || values[property] == 1 ? 1 : 0;
        });

        try {
            const value = {
                url: `inventory/config-update/${inventoryConfigData.domain_id}`,
                data: values,
            };
            // Dispatch action
            await dispatch(updateEntityData(value));

            const resultAction = await dispatch(showInstantEntityData('inventory/config'));
            if (showInstantEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    localStorage.setItem('config-data', JSON.stringify(resultAction.payload.data.data));
                }
            }

            // Show success notification
            notifications.show({
                color: "teal",
                title: t("UpdateSuccessfully"),
                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                loading: false,
                autoClose: 700,
                style: {backgroundColor: "lightgray"},
            });

            // Reset loading state
            setTimeout(() => {
                setSaveCreateLoading(false);
            }, 700);
        } catch (error) {
            console.error("Error updating entity:", error);

            // Error notification
            notifications.show({
                color: "red",
                title: t("UpdateFailed"),
                icon: <IconX style={{width: rem(18), height: rem(18)}}/>,
                loading: false,
                autoClose: 700,
                style: {backgroundColor: "lightgray"},
            });
        }
    };

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleFormSubmit)}>

                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={7}>
                        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                            <Box bg={"white"}>
                                <Box
                                    pl={`xs`}
                                    pr={8}
                                    pt={"8"}
                                    pb={"10"}
                                    mb={"4"}
                                    className={"boxBackground borderRadiusAll"}
                                >
                                    <Grid>
                                        <Grid.Col>
                                            <Title order={6} pt={"4"}>
                                                {t("SkuManagement")}
                                            </Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                                    <ScrollArea
                                        h={height}
                                        scrollbarSize={2}
                                        scrollbars="y"
                                        type="never"
                                    >
                                        <Box pl={"xs"}>
                                            <Text fw={500} fz={"md"} mt={"xs"}>
                                                {t("Stock Management")}
                                            </Text>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("raw_materials")}
                                                            label=""
                                                            nextField={"is_color"}
                                                            name={"raw_materials"}
                                                            form={form}
                                                            color="red"
                                                            id={"raw_materials"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.raw_materials}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("RawMaterials")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("stockable")}
                                                            label=""
                                                            nextField={"is_color"}
                                                            name={"stockable"}
                                                            form={form}
                                                            color="red"
                                                            id={"stockable"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.stockable}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("Stockable")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("post_production")}
                                                            label=""
                                                            nextField={"is_color"}
                                                            name={"post_production"}
                                                            form={form}
                                                            color="red"
                                                            id={"post_production"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.post_production}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("PostProduction")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("mid_production")}
                                                            label=""
                                                            nextField={"is_color"}
                                                            name={"mid_production"}
                                                            form={form}
                                                            color="red"
                                                            id={"mid_production"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.mid_production}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("MidProduction")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("pre_production")}
                                                            label=""
                                                            nextField={"is_color"}
                                                            name={"pre_production"}
                                                            form={form}
                                                            color="red"
                                                            id={"pre_production"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.pre_production}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("PreProduction")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>


                                            <Text fw={500} fz={"md"} mt={"lg"}>
                                                {t("Item Management")}
                                            </Text>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("is_brand")}
                                                            label=""
                                                            nextField={"is_color"}
                                                            name={"is_brand"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_brand"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.is_brand}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("Brand")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("isGrade")}
                                                            label=""
                                                            nextField={"is_color"}
                                                            name={"is_grade"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_grade"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.is_grade}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("Grade")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("Color")}
                                                            label=""
                                                            nextField={"size"}
                                                            name={"is_color"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_color"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.is_color}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("Color")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("Size")}
                                                            label=""
                                                            nextField={"is_model"}
                                                            name={"is_size"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_size"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.is_size}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("Size")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("Model")}
                                                            label=""
                                                            nextField={"zero_stock"}
                                                            name={"is_model"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_model"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.is_model}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("Model")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"} mb={"8"}>
                            <Box bg={"white"}>
                                <Box
                                    pl={`xs`}
                                    pr={8}
                                    pt={"8"}
                                    pb={"10"}
                                    mb={"4"}
                                    className={"boxBackground borderRadiusAll"}
                                >
                                    <Grid>
                                        <Grid.Col>
                                            <Title order={6} pt={"4"}>
                                                {t("Sales")}
                                            </Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                                    <ScrollArea
                                        h={height / 2 - 41}
                                        scrollbarSize={2}
                                        scrollbars="y"
                                        type="never"
                                    >
                                        <Box pt={"xs"} pl={"xs"}>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("ZeroStockAllowed")}
                                                            label=""
                                                            nextField={"stock_item"}
                                                            name={"zero_stock"}
                                                            form={form}
                                                            color="red"
                                                            id={"zero_stock"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.zero_stock}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("ZeroStockAllowed")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("StockItem")}
                                                            label=""
                                                            nextField={"is_stock_history"}
                                                            name={"stock_item"}
                                                            form={form}
                                                            color="red"
                                                            id={"stock_item"}
                                                            position={"left"}
                                                            defaultChecked={inventoryConfigData.stock_item}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("StockItem")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("StockHistory")}
                                                            label=""
                                                            nextField={"mrp_price"}
                                                            name={"is_stock_history"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_stock_history"}
                                                            position={"left"}
                                                            defaultChecked={
                                                                inventoryConfigData.is_stock_history
                                                            }
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("StockHistory")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                            <Box bg={"white"}>
                                <Box
                                    pl={`xs`}
                                    pr={8}
                                    pt={"8"}
                                    pb={"10"}
                                    mb={"4"}
                                    className={"boxBackground borderRadiusAll"}
                                >
                                    <Grid>
                                        <Grid.Col>
                                            <Title order={6} pt={"4"}>
                                                {t("Purchase")}
                                            </Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                                    <ScrollArea
                                        h={height / 2 - 40}
                                        scrollbarSize={2}
                                        scrollbars="y"
                                        type="never"
                                    >
                                        <Box pl={"xs"} pt={"xs"}>
                                            <Box mt={"xs"}>
                                                <Box mt={"xs"}>
                                                    <Grid gutter={{base: 1}}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t("MrpPrice")}
                                                                label=""
                                                                nextField={"total_price"}
                                                                name={"mrp_price"}
                                                                form={form}
                                                                color="red"
                                                                id={"mrp_price"}
                                                                position={"left"}
                                                                defaultChecked={inventoryConfigData.mrp_price}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                            {t("MrpPrice")}
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={"xs"}>
                                                    <Grid gutter={{base: 1}}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t("TotalPrice")}
                                                                label=""
                                                                nextField={"purchase_price"}
                                                                name={"total_price"}
                                                                form={form}
                                                                color="red"
                                                                id={"total_price"}
                                                                position={"left"}
                                                                defaultChecked={inventoryConfigData.total_price}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                            {t("TotalPrice")}
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={"xs"}>
                                                    <Grid gutter={{base: 1}}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t("PurchasePrice")}
                                                                label=""
                                                                nextField={"is_measurement"}
                                                                name={"purchase_price"}
                                                                form={form}
                                                                color="red"
                                                                id={"purchase_price"}
                                                                position={"left"}
                                                                defaultChecked={
                                                                    inventoryConfigData.purchase_price
                                                                }
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                            {t("PurchasePrice")}
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"} mb={"8"}>
                            <Box bg={"white"}>
                                <Box
                                    pl={`xs`}
                                    pr={8}
                                    pt={"6"}
                                    pb={"6"}
                                    mb={"4"}
                                    className={"boxBackground borderRadiusAll"}
                                >
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt={"6"}>
                                                {t("Product")}
                                            </Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {!saveCreateLoading && isOnline && (
                                                        <Button
                                                            size="xs"
                                                            color={`green.8`}
                                                            type="submit"
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16}/>}
                                                        >
                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={14} fw={400}>
                                                                    {t("UpdateAndSave")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    )}
                                                </>
                                            </Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>

                                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                                    <ScrollArea
                                        h={height / 2 - 40}
                                        scrollbarSize={2}
                                        scrollbars="y"
                                        type="never"
                                    >
                                        <Box pl={"xs"} pt={"xs"}>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("Measurement")}
                                                            label=""
                                                            nextField={"is_product_gallery"}
                                                            name={"is_measurement"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_measurement"}
                                                            position={"left"}
                                                            defaultChecked={
                                                                inventoryConfigData.is_measurement
                                                            }
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("Measurement")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>

                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("ProductGallery")}
                                                            label=""
                                                            nextField={"is_multi_price"}
                                                            name={"is_product_gallery"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_product_gallery"}
                                                            position={"left"}
                                                            defaultChecked={
                                                                inventoryConfigData.is_product_gallery
                                                            }
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("ProductGallery")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("ProductMultiPrice")}
                                                            label=""
                                                            nextField={"is_sku"}
                                                            name={"is_multi_price"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_multi_price"}
                                                            position={"left"}
                                                            defaultChecked={
                                                                inventoryConfigData.is_multi_price
                                                            }
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("ProductMultiPrice")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={"xs"}>
                                                <Grid gutter={{base: 1}}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t("SkuItem")}
                                                            label=""
                                                            nextField={"is_batch_invoice"}
                                                            name={"is_sku"}
                                                            form={form}
                                                            color="red"
                                                            id={"is_sku"}
                                                            position={"left"}
                                                            defaultChecked={
                                                                inventoryConfigData.is_sku
                                                            }
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                        {t("SkuItem")}
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                            <Box bg={"white"}>
                                <Box
                                    pl={`xs`}
                                    pr={8}
                                    pt={"8"}
                                    pb={"10"}
                                    mb={"4"}
                                    className={"boxBackground borderRadiusAll"}
                                >
                                    <Grid>
                                        <Grid.Col>
                                            <Title order={6} pt={"4"}>
                                                {t("InventoryConfiguration")}
                                            </Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                                    <ScrollArea
                                        h={height / 2 - 40}
                                        scrollbarSize={2}
                                        scrollbars="y"
                                        type="never"
                                    >
                                        <Box pl={"xs"} pt={"xs"}>
                                            <Box mt={"xs"}>
                                                <Box mt={"xs"}>
                                                    <Grid gutter={{base: 1}}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t("BatchInvoice")}
                                                                label=""
                                                                nextField={"is_provision"}
                                                                name={"is_batch_invoice"}
                                                                form={form}
                                                                color="red"
                                                                id={"is_batch_invoice"}
                                                                position={"left"}
                                                                defaultChecked={
                                                                    inventoryConfigData?.is_batch_invoice
                                                                }
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                            {t("BatchInvoice")}
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={"xs"}>
                                                    <Grid gutter={{base: 1}}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t("Provision")}
                                                                label=""
                                                                nextField={"EntityFormSubmit"}
                                                                name={"is_provision"}
                                                                form={form}
                                                                color="red"
                                                                id={"is_provision"}
                                                                position={"left"}
                                                                defaultChecked={
                                                                    inventoryConfigData?.is_provision
                                                                }
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                                            {t("Provision")}
                                                        </Grid.Col>
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
                        <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
                            <Shortcut
                                form={form}
                                FormSubmit={"EntityFormSubmit"}
                                Name={"name"}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </form>
        </Box>
    );
}

export default InventoryConfigurationForm;
