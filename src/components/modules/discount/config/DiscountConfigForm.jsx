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

function DiscountConfig(props) {

    const {  domainConfig} = props;
    const  {id} = domainConfig.id;
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
                url: `domain/config/inventory-product/${id}`,
                data: values,
            };
            console.log("value", values);
            await dispatch(updateEntityData(value));

            const resultAction = await dispatch(
                showInstantEntityData("inventory/config")
            );
            if (showInstantEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    localStorage.setItem(
                        "config-data",
                        JSON.stringify(resultAction.payload.data.data)
                    );
                }
            }

            notifications.show({
                color: "teal",
                title: t("UpdateSuccessfully"),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: "lightgray" },
            });

            setTimeout(() => {
                setSaveCreateLoading(false);
            }, 700);
        } catch (error) {
            console.error("Error updating purchase config:", error);

            notifications.show({
                color: "red",
                title: t("UpdateFailed"),
                icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: "lightgray" },
            });

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
            <Box p={8} bg={"white"}>
                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                    <Grid>
                        <Grid.Col span={8} >
                            <Title order={6} pt={'6'}>{t('DsicountConfiguration')}</Title>
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Stack right align="flex-end">
                                <>
                                    {
                                        !saveCreateLoading &&
                                        <Button
                                            size="xs"
                                            className={'btnPrimaryBg'}
                                            type="submit"
                                            id="DiscountConfigFormSubmit"
                                            leftSection={<IconDeviceFloppy size={16} />}
                                        >

                                            <Flex direction={`column`} gap={0}>
                                                <Text fz={14} fw={400}>
                                                    {t("CreateAndSave")}
                                                </Text>
                                            </Flex>
                                        </Button>
                                    }
                                </></Stack>
                        </Grid.Col>
                    </Grid>
                </Box>
            <Box
                pl={`xs`}
                pr={8}
                pt={"6"}
                pb={"4"}
                bg={"white"}
                h={height}
                className={" borderRadiusAll"}
            >
                <Grid>
                    <Grid.Col span={8} >
                        <form onSubmit={form.onSubmit(handlePurchaseFormSubmit)}>
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
                            <Button
                                id="DiscountConfigFormSubmit"
                                type="submit"
                                style={{ display: "none" }}
                            >
                                {t("Submit")}
                            </Button>
                        </form>
                    </Grid.Col>
                    <Grid.Col span={8} ></Grid.Col>
                </Grid>

            </Box>
            </Box>
        </Container>

    );
}
export default DiscountConfig;
