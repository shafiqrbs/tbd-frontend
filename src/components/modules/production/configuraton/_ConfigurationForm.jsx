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
import SelectForm from "../../../form-builders/SelectForm";
import {getShowEntityData, setValidationData, updateEntityData,setValidationMessage} from "../../../../store/production/crudSlice.js";
import getProConfigDropdownData from "../../../global-hook/dropdown/getProConfigDropdownData.js";

function _ConfigurationForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const validationMessage = useSelector((state) => state.productionCrudSlice.validationMessage)
    const validation = useSelector((state) => state.productionCrudSlice.validation)
    const showEntityData = useSelector((state) => state.productionCrudSlice.showEntityData)

    const { productionProcedureDropdown, consumptionMethodDropdown } = getProConfigDropdownData();

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);

    const [productionProcedureId, setProductionProcedureId] = useState(showEntityData.production_procedure_id ? showEntityData.production_procedure_id.toString() : null)
    const [consumptionMethodId, setConsumptionMethodId] = useState(showEntityData.consumption_method_id ? showEntityData.consumption_method_id.toString() : null)

    useEffect(() => {
        dispatch(getShowEntityData('production/config'))
    }, []);

    const form = useForm({
        initialValues: {
            production_procedure_id: showEntityData.production_procedure_id ? showEntityData.production_procedure_id : '',
            consumption_method_id: showEntityData.consumption_method_id ? showEntityData.consumption_method_id : '',
        },
        validate: {
            production_procedure_id: isNotEmpty(),
            consumption_method_id: isNotEmpty(),
        }
    });


    useEffect(() => {
        if (validationMessage?.message === 'success') {
            notifications.show({
                color: 'teal',
                title: t('UpdateSuccessfully'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: 'lightgray' },
            });

            setTimeout(() => {
                dispatch(setValidationMessage(null))
                setSaveCreateLoading(false)
            }, 700)
        }
    }, [validation, validationMessage]);

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch])


    useHotkeys([['alt+n', () => {
        document.getElementById('production_procedure_id').click()
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
                            url: 'production/config-update',
                            data: values
                        }
                        dispatch(updateEntityData(value))
                    },
                });
            })}>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={7}>

                    </Grid.Col>
                    <Grid.Col span={8}>

                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt={'6'}>{t('Configuration')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            calssName={'BtnPrimaryBg'}
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
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box pt={'xs'} pl={'xs'}>

                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('ChooseProductionProcedure')}
                                                    label={t('ProductionProcedure')}
                                                    placeholder={t('ChooseProductionProcedure')}
                                                    required={true}
                                                    nextField={'consumption_method_id'}
                                                    name={'production_procedure_id'}
                                                    form={form}
                                                    dropdownValue={productionProcedureDropdown}
                                                    mt={8}
                                                    id={'production_procedure_id'}
                                                    searchable={false}
                                                    value={productionProcedureId}
                                                    changeValue={setProductionProcedureId}
                                                    clearable={false}
                                                    allowDeselect={true}
                                                />
                                            </Box>

                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('ChooseConsumptionMethod')}
                                                    label={t('ConsumptionMethod')}
                                                    placeholder={t('ChooseConsumptionMethod')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    name={'consumption_method_id'}
                                                    form={form}
                                                    dropdownValue={consumptionMethodDropdown}
                                                    mt={8}
                                                    id={'consumption_method_id'}
                                                    searchable={false}
                                                    value={consumptionMethodId}
                                                    changeValue={setConsumptionMethodId}
                                                    clearable={false}
                                                    allowDeselect={true}
                                                />
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
            </form>
        </Box>
    );
}

export default _ConfigurationForm;
