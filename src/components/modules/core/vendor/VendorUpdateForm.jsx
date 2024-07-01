import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Flex, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconRestore, IconPencilBolt
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/core/crudSlice.js";
import { getCustomerDropdown } from "../../../../store/core/utilitySlice.js";

import _ShortcutVendor from "../../shortcut/_ShortcutVendor.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import getCustomerDropdownData from "../../../global-hook/dropdown/getCustomerDropdownData";
import InputNumberForm from "../../../form-builders/InputNumberForm";

function VendorUpdateForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [customerData, setCustomerData] = useState(null);

    const customerDropdownData = useSelector((state) => state.utilitySlice.customerDropdownData)
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const { vendorId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (vendorId) {
            dispatch(setEditEntityData(`core/vendor/${vendorId}`));
            dispatch(setFormLoading);
        }
    }, [vendorId, dispatch])


    let customerDropdown = customerDropdownData && customerDropdownData.length > 0 ?
        customerDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []

    useEffect(() => {
        dispatch(getCustomerDropdown('core/select/customer'))
    }, []);


    const form = useForm({
        initialValues: {
            company_name: '', name: '', mobile: '', tp_percent: '', email: ''
        },
        validate: {
            company_name: hasLength({ min: 2, max: 20 }),
            name: hasLength({ min: 2, max: 20 }),
            mobile: (value) => (!/^\d+$/.test(value)),
            // tp_percent: (value) => (value && !/^\d*\.?\d*$/.test(value)),
            // email: (value) => (value && !/^\S+@\S+$/.test(value)),
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        if (entityEditData) {
            form.setValues({
                company_name: entityEditData.company_name ? entityEditData.company_name : '',
                name: entityEditData.name ? entityEditData.name : '',
                mobile: entityEditData.mobile ? entityEditData.mobile : '',
                customer_id: entityEditData.customer_id ? entityEditData.customer_id : '',
                address: entityEditData.address ? entityEditData.address : '',
                email: entityEditData.email ? entityEditData.email : ''
            })
        }
        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [dispatch, entityEditData, vendorId])

    const handelFormReset = () => {
        if (entityEditData) {
            const originalValues = {
                company_name: entityEditData.company_name ? entityEditData.company_name : '',
                name: entityEditData.name ? entityEditData.name : '',
                mobile: entityEditData.mobile ? entityEditData.mobile : '',
                customer_id: entityEditData.customer_id ? entityEditData.customer_id : '',
                address: entityEditData.address ? entityEditData.address : '',
                email: entityEditData.email ? entityEditData.email : ''
            }
            form.setValues(originalValues)
        }
    }


    useHotkeys([['alt+n', () => {
        document.getElementById('company_name').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        handelFormReset();
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('UserFormSubmit').click()
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
                    onConfirm: () => {
                        setSaveCreateLoading(true)
                        const value = {
                            url: 'core/vendor/' + entityEditData.id,
                            data: values
                        }

                        dispatch(updateEntityData(value))

                        notifications.show({
                            color: 'teal',
                            title: t('UpdateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
                        });

                        setTimeout(() => {
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                        }, 700)
                    },
                });
            })}>

                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pb={'6'} pr={8} pt={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('UpdateVendor')}</Title>
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
                                                                    {t("UpdateAndSave")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </></Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} mt={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box>
                                            <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('CompanyNameValidateMessage')}
                                                    label={t('CompanyName')}
                                                    placeholder={t('CompanyName')}
                                                    required={true}
                                                    nextField={'name'}
                                                    form={form}
                                                    name={'company_name'}
                                                    mt={0}
                                                    id={'company_name'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    form={form}
                                                    tooltip={t('VendorNameValidateMessage')}
                                                    label={t('VendorName')}
                                                    placeholder={t('VendorName')}
                                                    required={true}
                                                    name={'name'}
                                                    id={'name'}
                                                    nextField={'mobile'}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    form={form}
                                                    tooltip={t('MobileValidateMessage')}
                                                    label={t('VendorMobile')}
                                                    placeholder={t('VendorMobile')}
                                                    required={true}
                                                    name={'mobile'}
                                                    id={'mobile'}
                                                    nextField={'tp_percent'}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputNumberForm
                                                    tooltip={t('TPPercentValidateMessage')}
                                                    label={t('TPPercent')}
                                                    placeholder={t('TPPercent')}
                                                    required={false}
                                                    nextField={'email'}
                                                    name={'tp_percent'}
                                                    form={form}
                                                    mt={8}
                                                    id={'tp_percent'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    form={form}
                                                    tooltip={t('RequiredAndInvalidEmail')}
                                                    label={t('Email')}
                                                    placeholder={t('Email')}
                                                    required={false}
                                                    name={'email'}
                                                    id={'email'}
                                                    nextField={'customer_id'}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('ChooseCustomer')}
                                                    label={t('ChooseCustomer')}
                                                    placeholder={t('ChooseCustomer')}
                                                    required={false}
                                                    nextField={'address'}
                                                    name={'customer_id'}
                                                    form={form}
                                                    dropdownValue={getCustomerDropdownData()}
                                                    mt={8}
                                                    id={'customer_id'}
                                                    searchable={true}
                                                    value={customerData}
                                                    changeValue={setCustomerData}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <TextAreaForm
                                                    tooltip={t('Address')}
                                                    label={t('Address')}
                                                    placeholder={t('Address')}
                                                    required={false}
                                                    nextField={'EntityFormSubmit'}
                                                    name={'address'}
                                                    form={form}
                                                    mt={8}
                                                    id={'address'}
                                                />
                                            </Box>
                                        </Box>
                                    </ScrollArea>

                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <_ShortcutVendor
                                entityEditData={entityEditData}
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
    )
}

export default VendorUpdateForm;
