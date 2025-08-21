import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Tooltip,
    ActionIcon,
    Group,
    Text,
    Overlay,
} from "@mantine/core";
import {
    IconMessage,
    IconEyeEdit,
    IconUserCircle,
    IconUserPlus,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import genericClass from "../../../../assets/css/Generic.module.css";
import InputForm from "../../../form-builders/InputForm";
import PhoneNumber from "../../../form-builders/PhoneNumberInput";
import SelectForm from "../../../form-builders/SelectForm";

import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import _SmsPurchaseModel from "../sales/modal/_SmsPurchaseModel.jsx";
import VendorViewDrawer from "../../core/vendor/VendorViewDrawer.jsx";
import SelectFormForSalesPurchaseProduct from "../../../form-builders/SelectFormForSalesPurchaseProduct.jsx";

// Utility function for vendor list retrieval
const getLocalVendors = () =>
    JSON.parse(localStorage.getItem("core-vendors") || "[]");

export default function __PosVendorSection(props) {
    const {
        form,
        isSMSActive,
        currencySymbol,
        setVendorObject,
        vendorObject,
        vendorData,
        setVendorData,
        vendorsDropdownData,
        setVendorsDropdownData,
        defaultVendorId,
        setDefaultVendorId,
    } = props;

    const { t } = useTranslation();

    const [openAddVendorGroup, setOpenAddVendorGroup] = useState(false);
    const [isShowSMSPackageModel, setIsShowSMSPackageModel] = useState(false);
    const [viewDrawer, setViewDrawer] = useState(false);

    // Fetch and set vendors dropdown + default vendor
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                await vendorDataStoreIntoLocalStorage();
                const coreVendors = getLocalVendors();

                let determinedDefaultId = defaultVendorId;

                if (coreVendors.length > 0) {
                    const transformedData = coreVendors.map((vendor) => {
                        if (vendor.name === "Default") {
                            determinedDefaultId = vendor.id;
                        }

                        return {
                            label: `${vendor.mobile} -- ${vendor.name}`,
                            value: String(vendor.id),
                        };
                    });

                    setVendorsDropdownData(transformedData);
                    setDefaultVendorId(determinedDefaultId);
                }
            } catch (error) {
                console.error("Failed to fetch vendors from storage", error);
            }
        };

        fetchVendors();
    }, [defaultVendorId]);

    // Sync vendorObject state with selected vendorData
    useEffect(() => {
        if (vendorData) {
            const coreVendors = getLocalVendors();
            const foundVendor = coreVendors.find(
                (vendor) => String(vendor.id) === String(vendorData.value)
            );

            if (foundVendor) {
                setVendorObject(foundVendor);
                setOpenAddVendorGroup(false);
            }
        }
    }, [vendorData]);

    const handleSendSMS = () => {
        if (isSMSActive) {
            showNotificationComponent(
                t("smsSendSuccessfully"),
                "teal",
                t("smsSendSuccessfully"),
                true,
                1000,
                true,
                "green"
            );
        } else {
            setIsShowSMSPackageModel(true);
        }
    };

    const shouldDisableVendorActions =
        !vendorData || vendorData?.value === defaultVendorId;

    return (
        <>
            <Box pl={4} pr={4} mb="xs" className={genericClass.bodyBackground}>
                <Grid columns={24} gutter={{ base: 6 }}>
                    {/* Vendor Dropdown & Action Buttons */}
                    <Grid.Col span={16} className={genericClass.genericSecondaryBg}>
                        <Box pl={4} pr={4}>
                            <Box
                                style={{ borderRadius: 4 }}
                                className={genericClass.genericHighlightedBox}
                            >
                                <Grid gutter={{ base: 6 }} mt={8}>
                                    <Grid.Col span={9} pl={8}>
                                        <SelectFormForSalesPurchaseProduct
                                            tooltip={t("VendorValidateMessage")}
                                            placeholder={t("SearchVendorSupplier")}
                                            required={false}
                                            name="vendor_id"
                                            form={form}
                                            dropdownValue={vendorsDropdownData}
                                            id="vendor_id"
                                            searchable
                                            value={vendorData}
                                            changeValue={setVendorData}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={3}>
                                        <Box
                                            mr={12}
                                            mt={4}
                                            style={{ textAlign: "right", float: "right" }}
                                        >
                                            <Group gap={8}>
                                                {/* SMS Button */}
                                                <Tooltip
                                                    multiline
                                                    bg="orange.8"
                                                    position="top"
                                                    withArrow
                                                    transitionProps={{ duration: 200 }}
                                                    label={
                                                        shouldDisableVendorActions
                                                            ? t("ChooseVendor")
                                                            : isSMSActive
                                                                ? t("SendSms")
                                                                : t("PleasePurchaseAsmsPackage")
                                                    }
                                                >
                                                    <ActionIcon
                                                        bg="white"
                                                        variant="outline"
                                                        color="red"
                                                        disabled={shouldDisableVendorActions}
                                                        onClick={handleSendSMS}
                                                    >
                                                        <IconMessage size={18} stroke={1.5} />
                                                    </ActionIcon>
                                                </Tooltip>

                                                {/* View Vendor Details Button */}
                                                <Tooltip
                                                    multiline
                                                    bg="orange.8"
                                                    position="top"
                                                    withArrow
                                                    offset={{ crossAxis: -45, mainAxis: 5 }}
                                                    ta="center"
                                                    transitionProps={{ duration: 200 }}
                                                    label={
                                                        shouldDisableVendorActions
                                                            ? t("ChooseVendor")
                                                            : t("VendorDetails")
                                                    }
                                                >
                                                    <ActionIcon
                                                        variant="filled"
                                                        color="red"
                                                        disabled={shouldDisableVendorActions}
                                                        onClick={() => setViewDrawer(true)}
                                                    >
                                                        <IconEyeEdit size={18} stroke={1.5} />
                                                    </ActionIcon>
                                                </Tooltip>

                                                {/* Add Vendor Group Button */}
                                                <Tooltip
                                                    multiline
                                                    bg="orange.8"
                                                    position="top"
                                                    withArrow
                                                    offset={{ crossAxis: -45, mainAxis: 5 }}
                                                    ta="center"
                                                    transitionProps={{ duration: 200 }}
                                                    label={t("Select Vendor Group")}
                                                >
                                                    <ActionIcon
                                                        variant="filled"
                                                        style={{ backgroundColor: "white" }}
                                                        onClick={() => setOpenAddVendorGroup(true)}
                                                        disabled={!!vendorData?.value}
                                                    >
                                                        <IconUserPlus size={18} stroke={1.5} color="gray" />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            {/* Vendor Info */}
                            <Box pl={4} pr={4} mt={4} pt={8} style={{ borderRadius: 4 }}>
                                <Grid columns={18} gutter={{ base: 2 }}>
                                    <Grid.Col span={3}>
                                        <Text pl="md" className={genericClass.genericPrimaryFontColor} fz="xs">
                                            {t("Outstanding")}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Text fz="sm" order={1} fw={800}>
                                            {currencySymbol}
                                            {vendorData && vendorObject &&
                                            vendorData?.value !== defaultVendorId
                                                ? Number(vendorObject?.closing_balance).toFixed(2)
                                                : "0.00"}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Text ta="left" size="xs" pl="md">
                                            {t("Purchase")}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Text ta="left" size="sm">
                                            {currencySymbol} {vendorObject?.purchase}
                                        </Text>
                                    </Grid.Col>
                                </Grid>

                                <Grid columns={18} gutter={{ base: 2 }}>
                                    <Grid.Col span={3}>
                                        <Text ta="left" size="xs" pl="md">
                                            {t("Discount")}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Text ta="left" size="sm">
                                            {currencySymbol} {vendorObject?.discount}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Text ta="left" size="xs" pl="md">
                                            {t("Payment")}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Text ta="left" size="sm">
                                            {currencySymbol} {vendorObject?.receive}
                                        </Text>
                                    </Grid.Col>
                                </Grid>

                                <Grid columns={18} gutter={{ base: 2 }}>
                                    <Grid.Col span={3}>
                                        <Text ta="left" size="xs" pl="md">
                                            {t("CreditLimit")}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Text ta="left" size="sm">
                                            {currencySymbol} {vendorObject?.credit_limit}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Text ta="left" size="xs" pl="md">
                                            {t("EarnPoint")}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Text ta="left" size="sm">
                                            {currencySymbol} {vendorObject?.earn_point}
                                        </Text>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid.Col>

                    {/* Add New Vendor Form */}
                    <Grid.Col span={8} className={genericClass.genericSecondaryBg}>
                        <Box pl={4} pr={4} pos="relative">
                            <Overlay
                                hidden={openAddVendorGroup}
                                opacity={0.8}
                                zIndex={30}
                                pos="absolute"
                                top={0}
                                backgroundOpacity={0.1}
                                blur={1.2}
                                radius="sm"
                            />

                            <Box mt={4}>
                                <InputForm
                                    tooltip={t("NameValidateMessage")}
                                    placeholder={t("VendorName")}
                                    required
                                    nextField="mobile"
                                    form={form}
                                    name="name"
                                    id="name"
                                    leftSection={<IconUserCircle size={16} opacity={0.5} />}
                                />
                            </Box>
                            <Box mt={4}>
                                <PhoneNumber
                                    tooltip={
                                        form.errors.mobile
                                            ? form.errors.mobile
                                            : t("MobileValidateMessage")
                                    }
                                    placeholder={t("Mobile")}
                                    required
                                    nextField="email"
                                    form={form}
                                    name="mobile"
                                    id="mobile"
                                />
                            </Box>
                            <Box mt={4} mb={4}>
                                <InputForm
                                    tooltip={t("InvalidEmail")}
                                    placeholder={t("Email")}
                                    required={false}
                                    form={form}
                                    name="email"
                                    id="email"
                                />
                            </Box>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>

            {/* Modals */}
            {isShowSMSPackageModel && (
                <_SmsPurchaseModel
                    isShowSMSPackageModel={isShowSMSPackageModel}
                    setIsShowSMSPackageModel={setIsShowSMSPackageModel}
                />
            )}

            {viewDrawer && (
                <VendorViewDrawer
                    viewDrawer={viewDrawer}
                    setViewDrawer={setViewDrawer}
                    vendorObject={vendorObject}
                />
            )}
        </>
    );
}
