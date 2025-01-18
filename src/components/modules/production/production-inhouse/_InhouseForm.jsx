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
import {setFetching, storeEntityData, updateEntityData} from "../../../../store/core/crudSlice.js";
import {notifications} from "@mantine/notifications";

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
        setIssueDate(new Date(batchData.issue_date))
        setReceiveDate(new Date(batchData.receive_date))
    },[])

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
                            issue_date: values.issue_date,
                            receive_date: values.receive_date,
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
                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('ManageProductionInhouseBatch')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
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
                                                                    {t("Update")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </></Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box mt={'xs'}>
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
                                        <Box >
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
                                        <Box >
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
                                                                {t('ReceiveDate')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={2}>

                                                </Grid.Col>
                                                <Grid.Col span={12}>
                                                    <Box mt={'xs'}>
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
                                        <Box >
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
                                                                {t('Remarks')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={2}>

                                                </Grid.Col>
                                                <Grid.Col span={12}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('Remarks')}
                                                            placeholder={t('Remarks')}
                                                            required={true}
                                                            nextField={'process'}
                                                            form={form}
                                                            mt={0}
                                                            id={'remark'}
                                                            name={'remark'}
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
                                                                { value: 'created', label: 'Created' },
                                                                { value: 'approved', label: 'Approved' },
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
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col >
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'name'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid >
            </form >
        </Box >

    );
}

export default _InhouseForm;
