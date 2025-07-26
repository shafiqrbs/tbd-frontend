import React, { useEffect, useState } from "react";
import {useNavigate, useOutletContext} from "react-router-dom";

import {
    Button, Flex, Grid, Box, ScrollArea, Text, Title, Stack, Tooltip, rem
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconDeviceFloppy,
    IconCalendar, IconCheck
} from "@tabler/icons-react";
import {getHotkeyHandler, useHotkeys} from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";

import { DateInput } from "@mantine/dates";
import {modals} from "@mantine/modals";
import {updateEntityData} from "../../../../store/core/crudSlice.js";
import {notifications} from "@mantine/notifications";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import TextAreaGenericForm from "../../../form-builders/TextAreaGenericForm";
import inputCss from "../../../../assets/css/InputField.module.css";

function _InhouseForm(Props) {
    const {batchData} = Props
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const [issueDate, setIssueDate] = useState(null);
    const [receiveDate, setReceiveDate] = useState(null);
    const [process, setProcess] = useState(batchData?.process);

    useEffect(() => {
        setIssueDate(
            batchData.issue_date ? new Date(batchData.issue_date) : null
        );
        setReceiveDate(
            batchData.receive_date ? new Date(batchData.receive_date) : null
        );
    }, []);

    const form = useForm({
        initialValues: {
            invoice: batchData?.invoice,
            remark: batchData?.remark,
            issue_date: batchData?.issue_date,
            receive_date: batchData?.receive_date,
            process : batchData?.process
        },
        validate: {
            invoice: isNotEmpty(),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('invoice').focus()
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
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: async () => {
                        const formData = {
                            remark: values.remark,
                            issue_date: issueDate ? new Date(issueDate).toISOString().split('T')[0]  : null,
                            receive_date: receiveDate ? new Date(receiveDate).toISOString().split('T')[0]  : null,
                            process: process
                        }
                        const value = {
                            url: 'production/batch/' + batchData.id,
                            data: formData
                        }
                        const resultAction = await dispatch(updateEntityData(value));

                        if (updateEntityData.rejected.match(resultAction)) {
                            console.log('error');
                            const fieldErrors = resultAction.payload.errors;

                            // Handle field validation errors dynamically
                            if (fieldErrors) {
                                const errorObject = {};
                                Object.keys(fieldErrors).forEach((key) => {
                                    errorObject[key] = fieldErrors[key][0]; // First error message for each field
                                });
                                form.setErrors(errorObject); // Set dynamic form errors
                            }
                        } else if (updateEntityData.fulfilled.match(resultAction)) {
                            // Extract the updated data from the action payload
                            notifications.show({
                                color: 'teal',
                                title: t('UpdateSuccessfully'),
                                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                loading: false,
                                autoClose: 700,
                                style: {backgroundColor: 'lightgray'},
                            });

                            setTimeout(() => {
                                navigate('/production/batch', {replace: true});
                            }, 700);
                        }

                    },
                });
            })}>
                <Box px={'md'} className={'borderRadiusAll'} h={'100'}>
                    <Grid columns={24} gutter={'xl'}>
                        <Grid.Col span={8} className={'boxBackground'}>
                            <Box>
                                <Grid columns={24} gutter={1}>
                                    <Grid.Col span={10}>
                                        <Box mt={'xs'}>
                                            <Flex
                                                justify="flex-start"
                                                align="center"
                                                direction="row"
                                            >
                                                <Text
                                                    ta="center" fz="sm"
                                                    fw={300}>
                                                    {t('InvoiceNo')}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={2}>

                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Box >
                                            <InputForm
                                                tooltip={t('InvoiceNo')}
                                                placeholder={t('InvoiceNo')}
                                                required={false}
                                                nextField={'issue_date'}
                                                name={'invoice'}
                                                form={form}
                                                id={'invoice'}
                                            />
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box>
                                <Grid columns={24} gutter={1}>
                                    <Grid.Col span={10}>
                                        <Box mt={'md'}>
                                            <Flex
                                                justify="flex-start"
                                                align="center"
                                                direction="row"
                                            >
                                                <Text
                                                    ta="center" fz="sm" fw={300}>
                                                    {t('IssueDate')}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={2}>

                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Box mt={'xs'}>
                                            <DateInput
                                                value={issueDate}
                                                valueFormat="DD-MM-YYYY"
                                                onChange={setIssueDate}
                                                id={'issue_date'}
                                                name={'issue_date'}
                                                placeholder={t('IssueDate')}
                                                onKeyDown={getHotkeyHandler([
                                                    ['Enter', (e) => {
                                                        document.getElementById('receive_date').focus()
                                                    }],
                                                ])}
                                                rightSection={
                                                    <Tooltip
                                                        withArrow
                                                        ta="center"
                                                        color="rgba(233, 236, 239, 0.98)"
                                                        multiline
                                                        w={200}
                                                        offset={{ crossAxis: '-75', mainAxis: '10' }}
                                                        transitionProps={{
                                                            transition: 'POP-BOTTOM-LEFT', duration: 200
                                                        }}
                                                        label={t('IssueDate')}
                                                        style={{ color: 'black' }}
                                                    >
                                                        <IconCalendar
                                                            style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={8} className={'bodyBackgroundLight'}>

                            <Box >
                                <Grid columns={24} gutter={1}>
                                    <Grid.Col span={10}>
                                        <Box mt={'xs'}>
                                            <Flex
                                                justify="flex-start"
                                                align="center"
                                                direction="row"
                                            >
                                                <Text
                                                    ta="center" fz="sm" fw={300}>
                                                    {t('ReceiveDate')}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={2}>

                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Box >
                                            <DateInput
                                                value={receiveDate}
                                                valueFormat="DD-MM-YYYY "
                                                onChange={setReceiveDate}
                                                onKeyDown={getHotkeyHandler([
                                                    ['Enter', (e) => {
                                                        document.getElementById('remark').focus()
                                                    }],
                                                ])}
                                                placeholder={t('ReceiveDate')}
                                                id={'receive_date'}
                                                name={'receive_date'}
                                                rightSection={
                                                    <Tooltip
                                                        withArrow
                                                        ta="center"
                                                        color="rgba(233, 236, 239, 0.98)"
                                                        multiline
                                                        w={200}
                                                        offset={{ crossAxis: '-75', mainAxis: '10' }}
                                                        transitionProps={{
                                                            transition: 'POP-BOTTOM-LEFT', duration: 200
                                                        }}
                                                        label={t('ReceiveDate')}
                                                        style={{ color: 'black' }}
                                                    >
                                                        <IconCalendar
                                                            style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            <Box mt={'xs'}>
                                <Grid columns={24} gutter={1}>
                                    <Grid.Col span={10}>
                                        <Box mt={6}>
                                            <Flex
                                                justify="flex-start"
                                                align="center"
                                                direction="row"
                                            >
                                                <Text
                                                    ta="center" fz="sm"
                                                    fw={300}>
                                                    {t('Process')}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={2}>

                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Box >
                                            <SelectForm
                                                tooltip={t('Process')}
                                                placeholder={t('Process')}
                                                dropdownValue={[
                                                    { value: 'Created', label: 'Created' },
                                                    { value: 'Approved', label: 'Approved' },
                                                ]}
                                                data={[{ value: 'react', label: 'React library' }]}

                                                searchable={true}
                                                changeValue={setProcess}
                                                value={process}
                                                required={false}
                                                nextField={'EntityFormSubmit'}
                                                name={'process'}
                                                form={form}
                                                id={'process'}
                                            />
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={8} className={'boxBackground'}>
                            <Box>
                                <TextAreaForm
                                    tooltip={t('Narration')}
                                    label=""
                                    placeholder={t('Narration')}
                                    required={false}
                                    nextField={'EntityFormSubmit'}
                                    name={'remark'}
                                    form={form}
                                    id={'remark'}
                                    classNames={inputCss}
                                    autosize
                                    minRows={3}
                                    maxRows={24}
                                />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box className={'boxBackground'} mt={2}>
                    <Stack right align="flex-end">
                        <>
                            {
                                !saveCreateLoading && isOnline &&
                                <Button
                                    size="xs"
                                    color={`green.8`}
                                    type="submit"
                                    id="EntityFormSubmit"
                                    leftSection={<IconDeviceFloppy size={16} />}
                                >

                                    <Flex direction={`column`} gap={0}>
                                        <Text fz={14} fw={400}>
                                            {t("Process")}
                                        </Text>
                                    </Flex>
                                </Button>
                            }
                        </>
                    </Stack>
                </Box>
            </form >
        </Box >

    );
}

export default _InhouseForm;
