import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {Button, rem, Grid, Box, ScrollArea, Text, Title, Stack, LoadingOverlay,} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import {
    setEditEntityData,
    setFormLoading, setInsertType,
    updateEntityData, setFetching
} from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";

function WarehouseUpdateForm() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isOnline, mainAreaHeight } = useOutletContext();

    // Constants
    const entityEditData = useSelector(state => state.crudSlice.entityEditData);
    const height = mainAreaHeight - 100; //TabList height 104


    // State
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [formLoad, setFormLoad] = useState(false);

    // Labels for Translation - Improves Readability
    const labels = {
        name: t('Name'),
        location: t('Location'),
        contract_person: t('ContractPerson'),
        mobile: t('Mobile'),
        email: t('Email'),
        address: t('Address'),
        updateLocation: t('UpdateWarehouse'),
        updateAndSave: t('UpdateAndSave'),
        formConfirmationTitle: t("FormConfirmationTitle"),
        formConfirmationMessage: t("FormConfirmationMessage"),
        updateSuccess: t("UpdateSuccessfully"),
        invalidEmail: t("InvalidEmailMessage"),
    };

    // Form Initialization
    const form = useForm({
        initialValues: {
            name: '', location: '', contract_person: '', mobile: '', email: '', address: ''
        },
        validate: {
            name: isNotEmpty(),
            location: isNotEmpty(),
            contract_person: isNotEmpty(),
            mobile: isNotEmpty(),
            email: (value) => value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? labels.invalidEmail : null,
        }
    });

    // Load form data when `entityEditData` changes
    useEffect(() => {
        if (!entityEditData) return;

        form.setValues({
            name: entityEditData.name || '',
            location: entityEditData.location || '',
            email: entityEditData.email || '',
            contract_person: entityEditData.contract_person || '',
            mobile: entityEditData.mobile || '',
            address: entityEditData.address || ''
        });

        dispatch(setFormLoading(false));
        setTimeout(() => setFormLoad(false), 500);
    }, [entityEditData]); // Keep dependencies minimal

    // Shortcut Keys
    useHotkeys([
        ['alt+n', () => document.getElementById('name')?.click()],
        ['alt+r', () => form.reset()],
        ['alt+s', () => document.getElementById('EntityFormSubmit')?.click()]
    ]);

    // Form Submission Handler
    const handleSubmit = async (values) => {
        modals.openConfirmModal({
            title: <Text size="md">{labels.formConfirmationTitle}</Text>,
            children: <Text size="sm">{labels.formConfirmationMessage}</Text>,
            labels: { confirm: 'Submit', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onCancel: () => null,
            onConfirm: async () => {
                setSaveCreateLoading(true);

                const requestData = {
                    url: `core/warehouse/${entityEditData.id}`,
                    data: values
                };

                const resultAction = await dispatch(updateEntityData(requestData));

                setSaveCreateLoading(false);

                if (updateEntityData.rejected.match(resultAction)) {
                    form.setErrors(resultAction.payload.errors || {});
                } else if (updateEntityData.fulfilled.match(resultAction)) {
                    notifications.show({
                        color: 'teal',
                        title: labels.updateSuccess,
                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                        autoClose: 700,
                        style: { backgroundColor: 'lightgray' },
                    });

                    setTimeout(() => {
                        form.reset();
                        dispatch(setInsertType('create'));
                        dispatch(setEditEntityData([]));
                        dispatch(setFetching(true));
                        navigate('/core/warehouse', { replace: true });
                    }, 700);
                }
            },
        });
    };

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid columns={9} gutter={8}>
                    <Grid.Col span={8}>
                        <Box bg="white" p="xs" className="borderRadiusAll">
                            <Box pl="xs" pr="8" pt="6" pb="6" mb="4" className="boxBackground borderRadiusAll">
                                <Grid>
                                    <Grid.Col span={6}>
                                        <Title order={6} pt="6">{labels.updateLocation}</Title>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Stack align="flex-end">
                                            {isOnline && !saveCreateLoading && (
                                                <Button
                                                    size="xs"
                                                    color="green.8"
                                                    type="submit"
                                                    id="EntityFormSubmit"
                                                    leftSection={<IconDeviceFloppy size={16} />}
                                                >
                                                    {labels.updateAndSave}
                                                </Button>
                                            )}
                                        </Stack>
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            <Box pl="xs" pr="xs" className="borderRadiusAll">

                                <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                    <Box>
                                        <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={labels.name}
                                                label={labels.name}
                                                placeholder={labels.name}
                                                required={true}
                                                nextField={'location'}
                                                form={form}
                                                name={'name'}
                                                id={'name'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={labels.location}
                                                label={labels.location}
                                                placeholder={labels.location}
                                                required={true}
                                                nextField={'contract_person'}
                                                form={form}
                                                name={'location'}
                                                id={'location'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={labels.contract_person}
                                                label={labels.contract_person}
                                                placeholder={labels.contract_person}
                                                required={true}
                                                nextField={'mobile'}
                                                form={form}
                                                name={'contract_person'}
                                                id={'contract_person'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <PhoneNumber
                                                tooltip={form.errors.mobile ? form.errors.mobile : labels.mobile}
                                                label={labels.mobile}
                                                placeholder={labels.mobile}
                                                required={true}
                                                nextField={'email'}
                                                form={form}
                                                name={'mobile'}
                                                id={'mobile'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={labels.email}
                                                label={labels.email}
                                                placeholder={labels.email}
                                                required={false}
                                                nextField={'address'}
                                                form={form}
                                                name={'email'}
                                                id={'email'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={labels.address}
                                                label={labels.address}
                                                placeholder={labels.address}
                                                required={false}
                                                nextField={'WarehouseFormSubmit'}
                                                form={form}
                                                name={'address'}
                                                id={'address'}
                                            />
                                        </Box>
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={1}>
                        <Box bg="white" className="borderRadiusAll" pt="16">
                            <Shortcut form={form} FormSubmit="EntityFormSubmit" Name="name" inputType="select" />
                        </Box>
                    </Grid.Col>
                </Grid>
            </form>
        </Box>
    );
}

export default WarehouseUpdateForm;
