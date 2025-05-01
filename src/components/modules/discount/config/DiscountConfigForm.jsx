import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import {
    Box,
    Grid,
    Checkbox,
    ScrollArea,
    Button,
    Text,
    Flex,
    rem,
    Center, Container, Title, Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
    setValidationData,
    showInstantEntityData,
    updateEntityData,
} from "../../../../store/inventory/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import KeywordSearch from "../../filter/KeywordSearch";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig.js";
import {setFetching, storeEntityData} from "../../../../store/core/crudSlice";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";

function DiscountConfig(props) {

    const { domainConfig} = props;
    const  {config_sales} = domainConfig.inventory_config.config_discount;
    const {mainAreaHeight} = useOutletContext()
    let height = mainAreaHeight-94;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const form = useForm({
        initialValues: {
            discount_with_customer: config_sales?.discount_with_customer || "",
            online_customer: config_sales?.online_customer || "",
            max_discount: config_sales?.max_discount || "",
        },
    });

    const handlePurchaseFormSubmit = (values) => {
        dispatch(setValidationData(false));

        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: t("Submit"), cancel: t("Cancel") },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Cancel"),
            onConfirm: () => handlePurchaseConfirmSubmit(values),
        });
    };

    const handlePurchaseConfirmSubmit = async (values) => {
        const properties = [
            "discount_with_customer",
            "online_customer",
        ];

        properties.forEach((property) => {
            values[property] =
                values[property] === true || values[property] == 1 ? 1 : 0;
        });

        try {
            setSaveCreateLoading(true);
            const value = {
                url: 'domain/config/inventory-discount/'+domainConfig?.id,
                data: values,
            };
            const resultAction = await dispatch(storeEntityData(value));
            if (storeEntityData.rejected.match(resultAction)) {
                const fieldErrors = resultAction.payload.errors;
                // Check if there are field validation errors and dynamically set them
                if (fieldErrors) {
                    const errorObject = {};
                    Object.keys(fieldErrors).forEach(key => {
                        errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
                    });
                    // Display the errors using your form's `setErrors` function dynamically
                    form.setErrors(errorObject);
                }
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                showNotificationComponent(t('CreateSuccessfully'),'teal','lightgray');
            }

        } catch (error) {
            showNotificationComponent(t('UpdateFailed'),'red','lightgray');
            setSaveCreateLoading(false);
        }
    };

    useHotkeys(
        [
            [
                "alt+p",
                () => {
                    document.getElementById("PurchaseFormSubmit").click();
                },
            ],
        ],
        []
    );

    const [value, setValue] = useState(null);

    return (
        <Container fluid p={0}>
            <form onSubmit={form.onSubmit(handlePurchaseFormSubmit)}>
            <Box p={8} bg={"white"}>
                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                    <Grid>
                        <Grid.Col span={8} >
                            <Title order={6} pt={'6'}>{t('DsicountConfiguration')}</Title>
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Stack right align="flex-end">
                                <>
                                    <Button
                                        size="xs"
                                        className={'btnPrimaryBg'}
                                        type="submit"
                                        id="DiscountConfigFormSubmit"
                                        leftSection={<IconDeviceFloppy size={16} />}>
                                        <Flex direction={`column`} gap={0}>
                                            <Text fz={14} fw={400}>
                                                {t("CreateAndSave")}
                                            </Text>
                                        </Flex>
                                    </Button>
                                </>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Box>
            <Box
                h={height}
                className={" borderRadiusAll"}
            >
                <Grid>
                    <Grid.Col span={8} >

                            <Box pt={"xs"} pl={"xs"}>
                                <Box mt={"xs"}>
                                    <Grid
                                        gutter={{ base: 1 }}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            form.setFieldValue(
                                                "discount_with_customer",
                                                form.values.discount_with_customer === 1 ? 0 : 1
                                            )
                                        }
                                    >
                                        <Grid.Col span={4} fz={"sm"} pt={"1"}>
                                            {t("DiscountWithCustomer")}
                                        </Grid.Col>
                                        <Grid.Col span={6} align={"left"} justify={"left"}>
                                            <Checkbox
                                                pr="xs"
                                                checked={form.values.discount_with_customer === 1}
                                                color="red"
                                                {...form.getInputProps("discount_with_customer", {
                                                    type: "checkbox",
                                                })}
                                                onChange={(event) =>
                                                    form.setFieldValue(
                                                        "discount_with_customer",
                                                        event.discount_with_customer.checked ? 1 : 0
                                                    )
                                                }
                                                styles={(theme) => ({
                                                    input: {
                                                        borderColor: "red",
                                                    },
                                                })}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box mt={"xs"}>
                                    <Grid
                                        gutter={{ base: 1 }}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            form.setFieldValue(
                                                "online_customer",
                                                form.values.online_customer === 1 ? 0 : 1
                                            )
                                        }
                                    >
                                        <Grid.Col span={4} fz={"sm"} pt={"1"}>
                                            {t("OnlineB2BCustomer")}
                                        </Grid.Col>
                                        <Grid.Col span={6} align={"left"} justify={"left"}>
                                            <Checkbox
                                                pr="xs"
                                                checked={form.values.online_customer === 1}
                                                color="red"
                                                {...form.getInputProps("online_customer", {
                                                    type: "checkbox",
                                                })}
                                                onChange={(event) =>
                                                    form.setFieldValue(
                                                        "online_customer",
                                                        event.online_customer.checked ? 1 : 0
                                                    )
                                                }
                                                styles={(theme) => ({
                                                    input: {
                                                        borderColor: "red",
                                                    },
                                                })}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>


                    </Grid.Col>
                    <Grid.Col span={8}>&nbsp;</Grid.Col>
                </Grid>

            </Box>
            </Box>
            </form>
        </Container>

    );
}
export default DiscountConfig;
