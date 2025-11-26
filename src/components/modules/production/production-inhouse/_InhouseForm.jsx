import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button, Flex, Grid, Box, Text, Tooltip, LoadingOverlay
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconDeviceFloppy,
    IconCalendar
} from "@tabler/icons-react";
import {getHotkeyHandler, useHotkeys} from "@mantine/hooks";
import {useDispatch} from "react-redux";
import {isNotEmpty, isDate, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";

// Local imports
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import {DateInput} from "@mantine/dates";
import {storeEntityData, updateEntityData} from "../../../../store/core/crudSlice.js";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import inputCss from "../../../../assets/css/InputField.module.css";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

// Utility functions
const formatDateForAPI = (date) => {
    if (!date) return new Date().toLocaleDateString("en-CA");
    const options = {year: "numeric", month: "2-digit", day: "2-digit"};
    return new Date(date).toLocaleDateString("en-CA", options);
};

const useConfirmModal = (title, message, onConfirm, confirmText = 'Submit') => {
    const {t} = useTranslation();
    return () => {
        modals.openConfirmModal({
            title: <Text size="md">{title}</Text>,
            children: <Text size="sm">{message}</Text>,
            labels: {confirm: t(confirmText), cancel: t('Cancel')},
            confirmProps: {color: 'red'},
            onCancel: () => console.log('Cancel'),
            onConfirm,
        });
    };
};

const useApiCall = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);

    const execute = async (action, payload, successMessage, errorMessage) => {
        setLoading(true);
        try {
            const resultAction = await dispatch(action(payload));

            if (action.rejected.match(resultAction)) {
                const fieldErrors = resultAction.payload?.errors;
                if (fieldErrors) {
                    const errorObject = {};
                    Object.keys(fieldErrors).forEach((key) => {
                        errorObject[key] = fieldErrors[key][0];
                    });
                    return {success: false, errors: errorObject};
                }
                showNotificationComponent(
                    resultAction.payload?.message || t(errorMessage),
                    'red'
                );
                return {success: false};
            } else if (action.fulfilled.match(resultAction)) {
                showNotificationComponent(t(successMessage), 'teal', '', true, 1000, true);
                return {success: true, data: resultAction.payload};
            }
        } catch (error) {
            showNotificationComponent(t(errorMessage), 'red');
            return {success: false};
        } finally {
            setLoading(false);
        }
    };

    return {execute, loading};
};

function InhouseForm({batchData}) {
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const [issueDate, setIssueDate] = useState(null);
    const [receiveDate, setReceiveDate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {execute: executeApiCall, loading: apiLoading} = useApiCall();

    const approveAllowed = batchData?.batch_items.every(batchItem =>
        batchItem?.production_expenses.every(exp =>
            Number(exp?.less_quantity) == 0
        )
    );

    const form = useForm({
        initialValues: {
            invoice: batchData?.invoice || '',
            remark: batchData?.remark || '',
            issue_date: batchData?.issue_date || null,
            receive_date: batchData?.receive_date || null,
            process: batchData?.process || 'Created'
        },
        validate: {
            invoice: isNotEmpty(),
            issue_date: isDate(t('InvalidDate')),
            receive_date: isDate(t('InvalidDate')),
            process: isNotEmpty()
        }
    });

    useEffect(() => {
        setIssueDate(
            batchData.issue_date ? new Date(batchData.issue_date) : null
        );
        setReceiveDate(
            batchData.receive_date ? new Date(batchData.receive_date) : null
        );
    }, [batchData]);

    const handleSubmit = async (values) => {
        const confirmSave = useConfirmModal(
            t("FormConfirmationTitle"),
            t("FormConfirmationMessage"),
            async () => {
                setIsSubmitting(true);
                const formData = {
                    invoice: values.invoice,
                    remark: values.remark,
                    issue_date: formatDateForAPI(issueDate),
                    receive_date: formatDateForAPI(receiveDate),
                    process: values.process
                };

                const result = await executeApiCall(
                    updateEntityData,
                    {
                        url: 'production/batch/' + batchData.id,
                        data: formData
                    },
                    'UpdateSuccessfully',
                    'ErrorOccurred'
                );

                if (result.success) {
                    setTimeout(() => {
                        navigate('/production/batch', {replace: true});
                    }, 1000);
                } else if (result.errors) {
                    form.setErrors(result.errors);
                }
                setIsSubmitting(false);
            },
            'Save'
        );

        confirmSave();
    };

    const handleApprove = () => {
        const confirmApprove = useConfirmModal(
            t("FormConfirmationTitle"),
            t("FormConfirmationMessage"),
            async () => {
                const result = await executeApiCall(
                    storeEntityData,
                    {
                        url: 'production/batch/approve/' + batchData.id,
                        data: {}
                    },
                    'ApprovedSuccessfully',
                    'ErrorOccurred'
                );

                if (result.success) {
                    setTimeout(() => {
                        navigate('/production/batch', {replace: true});
                    }, 1000);
                }
            },
            'Approve'
        );

        confirmApprove();
    };

    useHotkeys([
        ['alt+n', () => document.getElementById('invoice').focus()],
        ['alt+r', () => form.reset()],
        ['alt+s', () => document.getElementById('EntityFormSubmit').click()]
    ], []);

    return (
        <Box pos="relative">
            <LoadingOverlay visible={apiLoading || isSubmitting} overlayBlur={2}/>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box px={'md'} className={'borderRadiusAll'} h={'100'}>
                    <Grid columns={24} gutter={'xl'}>
                        <Grid.Col span={8} className={'boxBackground'}>
                            <Box>
                                <Grid columns={24} gutter={1}>
                                    <Grid.Col span={10}>
                                        <Box mt={'xs'}>
                                            <Flex justify="flex-start" align="center" direction="row">
                                                <Text ta="center" fz="sm" fw={300}>
                                                    {t('InvoiceNo')}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={2}></Grid.Col>
                                    <Grid.Col span={12}>
                                        <Box>
                                            <InputForm
                                                tooltip={t('InvoiceNo')}
                                                placeholder={t('InvoiceNo')}
                                                required={true}
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
                                            <Flex justify="flex-start" align="center" direction="row">
                                                <Text ta="center" fz="sm" fw={300}>
                                                    {t('IssueDate')}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={2}></Grid.Col>
                                    <Grid.Col span={12}>
                                        <Box mt={'xs'}>
                                            <DateInput
                                                value={issueDate}
                                                valueFormat="DD-MM-YYYY"
                                                onChange={(date) => {
                                                    setIssueDate(date);
                                                    form.setFieldValue('issue_date', date);
                                                }}
                                                id={'issue_date'}
                                                name={'issue_date'}
                                                placeholder={t('IssueDate')}
                                                error={form.errors.issue_date}
                                                onKeyDown={getHotkeyHandler([
                                                    ['Enter', () => document.getElementById('receive_date').focus()],
                                                ])}
                                                rightSection={
                                                    <Tooltip
                                                        withArrow
                                                        ta="center"
                                                        color="rgba(233, 236, 239, 0.98)"
                                                        multiline
                                                        w={200}
                                                        offset={{crossAxis: '-75', mainAxis: '10'}}
                                                        transitionProps={{
                                                            transition: 'POP-BOTTOM-LEFT', duration: 200
                                                        }}
                                                        label={t('IssueDate')}
                                                        style={{color: 'black'}}
                                                    >
                                                        <IconCalendar style={{width: '100%', height: '70%'}}
                                                                      stroke={1.5}/>
                                                    </Tooltip>
                                                }
                                            />
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={8} className={'bodyBackgroundLight'}>
                            <Box>
                                <Grid columns={24} gutter={1}>
                                    <Grid.Col span={10}>
                                        <Box mt={'xs'}>
                                            <Flex justify="flex-start" align="center" direction="row">
                                                <Text ta="center" fz="sm" fw={300}>
                                                    {t('ReceiveDate')}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={2}></Grid.Col>
                                    <Grid.Col span={12}>
                                        <Box>
                                            <DateInput
                                                value={receiveDate}
                                                valueFormat="DD-MM-YYYY"
                                                onChange={(date) => {
                                                    setReceiveDate(date);
                                                    form.setFieldValue('receive_date', date);
                                                }}
                                                onKeyDown={getHotkeyHandler([
                                                    ['Enter', () => document.getElementById('remark').focus()],
                                                ])}
                                                placeholder={t('ReceiveDate')}
                                                id={'receive_date'}
                                                name={'receive_date'}
                                                error={form.errors.receive_date}
                                                rightSection={
                                                    <Tooltip
                                                        withArrow
                                                        ta="center"
                                                        color="rgba(233, 236, 239, 0.98)"
                                                        multiline
                                                        w={200}
                                                        offset={{crossAxis: '-75', mainAxis: '10'}}
                                                        transitionProps={{
                                                            transition: 'POP-BOTTOM-LEFT', duration: 200
                                                        }}
                                                        label={t('ReceiveDate')}
                                                        style={{color: 'black'}}
                                                    >
                                                        <IconCalendar style={{width: '100%', height: '70%'}}
                                                                      stroke={1.5}/>
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
                                            <Flex justify="flex-start" align="center" direction="row">
                                                <Text ta="center" fz="sm" fw={300}>
                                                    {t('Process')}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={2}></Grid.Col>
                                    <Grid.Col span={12}>
                                        <Box>
                                            <SelectForm
                                                tooltip={t('Process')}
                                                placeholder={t('Process')}
                                                dropdownValue={[
                                                    {value: 'Created', label: 'Created'},
                                                    {value: 'Approved', label: 'Approved'},
                                                ]}
                                                searchable={true}
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
                <Box className="boxBackground" mt={2}>
                    <Flex justify="flex-end" align="center" gap="sm">
                        {isOnline && batchData.process === 'Created' && (
                            <Button
                                disabled={!approveAllowed}
                                size="xs"
                                color="red.8"
                                leftSection={<IconDeviceFloppy size={16}/>}
                                onClick={handleApprove}
                            >
                                <Text fz={14} fw={400}>{t('Approve')}</Text>
                            </Button>
                        )}
                        {!isSubmitting && isOnline && (
                            <Button
                                size="xs"
                                color="green.8"
                                type="submit"
                                id="EntityFormSubmit"
                                leftSection={<IconDeviceFloppy size={16}/>}
                            >
                                <Text fz={14} fw={400}>{t("Save")}</Text>
                            </Button>
                        )}
                    </Flex>
                </Box>
            </form>
        </Box>
    );
}

export default InhouseForm;