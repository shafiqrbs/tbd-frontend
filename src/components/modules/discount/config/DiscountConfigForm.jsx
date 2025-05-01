import React, {useEffect, useState} from "react";
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
import InputNumberForm from "../../../form-builders/InputNumberForm";

function DiscountConfig(props) {

    const { domainConfig} = props;
    const  config_discount = domainConfig.inventory_config.config_discount;
    const {mainAreaHeight} = useOutletContext()
    let height = mainAreaHeight-94;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    console.log(config_discount);
    const form = useForm({
        initialValues: {
            discount_with_customer: config_discount?.discount_with_customer || "",
            online_customer: config_discount?.online_customer || "",
            max_discount: config_discount?.max_discount || "",
        },
    });

    useEffect(() => {
        if (config_discount) {
            form.setValues({
                max_discount: config_discount?.max_discount || 0,
                discount_with_customer: config_discount?.discount_with_customer || 0,
                online_customer: config_discount?.online_customer || 0,
            });
        }
    }, [dispatch, config_discount]);

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
                            <Title order={6} pt={'6'}>{t('DiscountConfiguration')}</Title>
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
                                                "max_discount"
                                            )
                                        }
                                        >
                                        <Grid.Col span={4} fz={"sm"} pt={"1"}>
                                            {t("MaxDiscount")}
                                        </Grid.Col>
                                        <Grid.Col span={6} align={"left"} justify={"left"}>
                                            <InputNumberForm
                                                tooltip={t('MaxDiscountValue')}
                                                label={""}
                                                placeholder={t('EnterMaxDiscount')}
                                                required={true}
                                                nextField={'discount_with_customer'}
                                                name={'max_discount'}
                                                form={form}
                                                id={'max_discount'}
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
                                                        event.currentTarget.checked ? 1 : 0
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
                                                        event.currentTarget.checked ? 1 : 0
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
