import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid,
    Box,
    ScrollArea,
    Text,
    Flex,
    Stack,
    ActionIcon,
    LoadingOverlay,
    Table,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconCheck,
    IconDeviceFloppy,
    IconX,
    IconSortAscendingNumbers,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {isNotEmpty, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";

import {
    setFetching,
    setFormLoading,
} from "../../../../store/core/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getSettingProductUnitDropdownData from "../../../global-hook/dropdown/getSettingProductUnitDropdownData.js";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import {
    deleteEntityData,
    getIndexEntityData as getIndexEntityDataForInventory,
    storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import {modals} from "@mantine/modals";

function _ProductMeasurement(props) {
    const {id} = props;
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight / 2 + 30; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
    const formLoading = useSelector((state) => state.crudSlice.formLoading);
    const [measurementUnitData, setMeasurementUnitData] = useState(null);

    const form = useForm({
        initialValues: {
            product_id: id,
            unit_id: "",
            quantity: "",
        },
        validate: {
            product_id: isNotEmpty(),
            unit_id: isNotEmpty(),
            quantity: isNotEmpty(),
        },
    });

    /*product measurement data handle*/
    const measurementData = useSelector((state) => state.inventoryCrudSlice.indexEntityData);
    const [reloadMeasurementData, setReloadMeasurementData] = useState(false);

    /*get product measurement*/
    useEffect(() => {
        const value = {
            url: "inventory/product/measurement/" + id,
            param: {
                test: 1,
            },
        };
        dispatch(getIndexEntityDataForInventory(value));
        setReloadMeasurementData(false);
    }, [reloadMeasurementData]);

    useEffect(() => {
        setFormLoad(true);
        setFormDataForUpdate(true);
    }, [dispatch, formLoading]);

    useEffect(() => {
        form.setValues({});
        dispatch(setFormLoading(false));
        setTimeout(() => {
            setFormLoad(false);
            setFormDataForUpdate(false);
        }, 500);
    }, [entityEditData, dispatch, setFormData]);

    useHotkeys(
        [
            [
                "alt+n",
                () => {
                    !groupDrawer && document.getElementById("product_type_id").focus();
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
                    !groupDrawer && document.getElementById("EntityFormSubmit").click();
                },
            ],
        ],
        []
    );

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                    children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
                    labels: {confirm: t("Submit"), cancel: t("Cancel")},
                    confirmProps: {color: "red"},
                    onCancel: () => console.log("Cancel"),
                    onConfirm: () => {
                        const isUnitIdExists = measurementData.data.some(
                            (unit) => unit.unit_id == values.unit_id
                        );

                        if (isUnitIdExists) {
                            notifications.show({
                                loading: true,
                                color: "red",
                                title: "Unit already exists",
                                message:
                                    "Data will be loaded in 3 seconds, you cannot close this yet",
                                autoClose: 1000,
                                withCloseButton: true,
                            });
                            return;
                        }

                        form.values.product_id = id;
                        const value = {
                            url: "inventory/product/measurement",
                            data: values,
                        };
                        dispatch(storeEntityData(value));

                        setReloadMeasurementData(true);
                        setMeasurementUnitData(null);
                        form.reset();
                        setSaveCreateLoading(true);

                        notifications.show({
                            color: "teal",
                            title: t("UpdateSuccessfully"),
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 700,
                            style: {backgroundColor: "lightgray"},
                        });

                        setTimeout(() => {
                            setReloadMeasurementData(true);
                            setMeasurementUnitData(null);
                            form.reset();
                            dispatch(setFetching(true));
                            setSaveCreateLoading(false);
                        }, 500);
                    },
                });
            })}
        >
            <Box>
                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                    <Box
                        pl={`4`}
                        pb={"3"}
                        pr={8}
                        pt={"3"}
                        mb={"4"}
                        className={"boxBackground borderRadiusAll"}
                    >
                        <Grid gutter={"4"}>
                            <Grid.Col span={5}>
                                <SelectForm
                                    tooltip={t("ChooseProductUnit")}
                                    label=""
                                    placeholder={t("ChooseProductUnit")}
                                    required={true}
                                    name={"unit_id"}
                                    form={form}
                                    dropdownValue={getSettingProductUnitDropdownData()}
                                    id={"unit_id"}
                                    nextField={"quantity"}
                                    searchable={true}
                                    value={measurementUnitData}
                                    changeValue={setMeasurementUnitData}
                                />
                            </Grid.Col>
                            <Grid.Col span={3}>
                                <InputButtonForm
                                    tooltip={t("EnterQuantity")}
                                    label=""
                                    placeholder={t("QTY")}
                                    required={true}
                                    nextField={"EntityFormSubmit"}
                                    form={form}
                                    name={"quantity"}
                                    id={"quantity"}
                                    leftSection={
                                        <IconSortAscendingNumbers size={16} opacity={0.5}/>
                                    }
                                    rightSection={
                                        entityEditData.unit_name
                                            ? String(entityEditData.unit_name)
                                            : ""
                                    }
                                    closeIcon={false}
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Stack right align="flex-end" pt={"3"}>
                                    <>
                                        {!saveCreateLoading && isOnline && (
                                            <Button
                                                size="xs"
                                                color={`red.3`}
                                                type="submit"
                                                id="EntityFormSubmit"
                                                leftSection={<IconDeviceFloppy size={18}/>}
                                            >
                                                <Flex direction={`column`} gap={0}>
                                                    <Text fz={14} fw={400}>
                                                        {t("AddMeasurement")}
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
                            h={height - 105}
                            scrollbarSize={2}
                            scrollbars="y"
                            type="never"
                        >
                            <Box>
                                <LoadingOverlay
                                    visible={formLoad}
                                    zIndex={1000}
                                    overlayProps={{radius: "sm", blur: 2}}
                                />
                            </Box>
                            <Box>
                                <Table stickyHeader>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th fz="xs" w={"20"}>
                                                {t("S/N")}
                                            </Table.Th>
                                            <Table.Th fz="xs" ta="left" w={"300"}>
                                                {t("Name")}
                                            </Table.Th>
                                            <Table.Th fz="xs" ta="center" w={"60"}>
                                                {t("QTY")}
                                            </Table.Th>
                                            <Table.Th ta="right" fz="xs" w={"80"}></Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {measurementData?.data?.length > 0 ? (
                                            measurementData.data.map((unit, index) => (
                                                <Table.Tr key={unit.id}>
                                                    <Table.Th fz="xs" w={"20"}>
                                                        {index + 1}
                                                    </Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={"300"}>
                                                        {unit.unit_name}
                                                    </Table.Th>
                                                    <Table.Th fz="xs" ta="center" w={"60"}>
                                                        {unit.quantity}
                                                    </Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={"80"}>
                                                        <ActionIcon
                                                            size="sm"
                                                            variant="transparent"
                                                            color="red"
                                                            onClick={() => {
                                                                dispatch(deleteEntityData(
                                                                        "inventory/product/measurement/" + unit.id
                                                                    )
                                                                );
                                                                setReloadMeasurementData(true);
                                                            }}
                                                        >
                                                            <IconX height={"18"} width={"18"} stroke={1.5}/>
                                                        </ActionIcon>
                                                    </Table.Th>
                                                </Table.Tr>
                                            ))
                                        ) : (
                                            <Table.Tr>
                                                <Table.Th colSpan="4" fz="xs" ta="center">
                                                    No data available
                                                </Table.Th>
                                            </Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Box>
                        </ScrollArea>
                    </Box>
                </Box>
            </Box>
        </form>
    );
}

export default _ProductMeasurement;
