import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Button, Flex,
    Grid, Box, ScrollArea, Text, Title, Stack, Tooltip, SimpleGrid, Image,
    rem, Tabs, LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconPlusMinus
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";

import {
    setFetching,
    setFormLoading,
    setValidationData,
} from "../../../../store/accounting/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import { storeEntityDataWithFile } from "../../../../store/accounting/crudSlice.js";
import getTransactionMethodDropdownData from "../../../global-hook/dropdown/getTransactionMethodDropdownData.js";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import getSettingAuthorizedTypeDropdownData from "../../../global-hook/dropdown/getSettingAuthorizedTypeDropdownData.js";
import getSettingAccountTypeDropdownData from "../../../global-hook/dropdown/getSettingAccountTypeDropdownData.js";
import getSettingAccountModeDropdownData from "../../../global-hook/dropdown/getSettingAccountModeDropdownData.js";
import { setInsertType } from "../../../../store/inventory/crudSlice.js";
import { setEditEntityData } from "../../../../store/core/crudSlice.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import { notifications } from "@mantine/notifications";
import getBanksDropdownData from "../../../global-hook/dropdown/getBanksDropdownData";

function TransactionModeUpdateFrom(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [authorisedData, setAuthorisedData] = useState(null);
    const [methodData, setMethodData] = useState(null);
    const [accountTypeData, setAccountTypeData] = useState(null);
    const [accountModeData, setAccountModeData] = useState(null);
    const [bankData, setBankData] = useState("");
    const [activeTab, setActiveTab] = useState("21");
    const [isLoading, setIsLoading] = useState(true);

    const authorizedDropdown = getSettingAuthorizedTypeDropdownData()
    const accountDropdown = getSettingAccountTypeDropdownData()
    const accountModeDropdown = getSettingAccountModeDropdownData()
    const transactionMethods = getTransactionMethodDropdownData()
    const banksDropdownData = getBanksDropdownData()

    const [files, setFiles] = useState([]);

    const form = useForm({
        initialValues: {
            method_id: '',
            name: '',
            short_name: '',
            authorised_mode_id: '',
            account_mode_id: '',
            bank_id: '',
            account_number: '',
            branch_name: '',
            routing_number: '',
            account_type_mode_id: '',
            service_charge: '',
            account_owner: '',
            path: '',
            is_selected: entityEditData?.is_selected == 1 ? true : false
        },
        validate: {
            method_id: isNotEmpty(),
            name: hasLength({ min: 2}),
            short_name: hasLength({ min: 2 }),
            service_charge: (value, values) => {
                if (value) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
        setIsLoading(true);
    }, [dispatch, formLoading])

    useEffect(() => {
        if (entityEditData) {
            form.setValues({
                method_id: entityEditData?.method_id ? entityEditData.method_id : '',
                name: entityEditData?.name ? entityEditData.name : '',
                short_name: entityEditData?.short_name ? entityEditData.short_name : '',
                authorised_mode_id: entityEditData?.authorised_mode_id ? entityEditData.authorised_mode_id : '',
                account_mode_id: entityEditData?.account_mode_id ? entityEditData.account_mode_id : '',
                bank_id: entityEditData?.bank_id ? entityEditData.bank_id : '',
                account_number: entityEditData?.account_number ? entityEditData.account_number : '',
                routing_number: entityEditData?.routing_number ? entityEditData.routing_number : '',
                branch_name: entityEditData?.branch_name ? entityEditData.branch_name : '',
                account_type_mode_id: entityEditData?.account_type_mode_id ? entityEditData.account_type_mode_id : '',
                service_charge: entityEditData?.service_charge ? entityEditData.service_charge : '',
                account_owner: entityEditData?.account_owner ? entityEditData.account_owner : '',
                path: entityEditData?.path ? entityEditData.path : '',
                is_selected: entityEditData?.is_selected == 1 ? true : false,
            });

            // Set active tab based on method_id
            if (entityEditData.method_id) {
                setActiveTab(String(entityEditData.method_id));
            }
        }

        dispatch(setFormLoading(false))

        // Simulate loading delay for better UX
        const loadingTimer = setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
            setIsLoading(false);
        }, 500)

        return () => clearTimeout(loadingTimer);

    }, [dispatch, setFormData, entityEditData]);

    useHotkeys([['alt+n', () => {
        document.getElementById('method_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    if (isLoading) {
        return (
            <Box style={{ position: 'relative', height: '400px' }}>
                <LoadingOverlay
                    visible={true}
                    loaderProps={{
                        size: 'xs',
                        color: 'blue',
                    }}
                    overlayProps={{
                        blur: 2,
                        radius: "sm",
                    }}
                    zIndex={1000}
                />
            </Box>
        );
    }

    return (
        <Box style={{ position: 'relative' }}>
            <LoadingOverlay
                visible={formLoad}
                loaderProps={{
                    size: 'xs',
                    color: 'blue',
                }}
                overlayProps={{
                    blur: 2,
                    radius: "sm",
                }}
                zIndex={1000}
            />

            <Grid columns={9} gutter={{ base: 8 }}>
                <Grid.Col span={8} >
                    <form onSubmit={form.onSubmit((values) => {
                        dispatch(setValidationData(false))
                        modals.openConfirmModal({
                            title: (
                                <Text size="md"> {t("FormConfirmationTitle")}</Text>
                            ),
                            children: (
                                <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                            ),
                            labels: { confirm: 'Submit', cancel: 'Cancel' }, confirmProps: { color: 'red.5' },
                            onCancel: () => console.log('Cancel'),
                            onConfirm: () => {
                                setSaveCreateLoading(true);
                                const formValue = { ...form.values };
                                formValue['path'] = files[0];
                                formValue['is_selected'] = form.values.is_selected == true ? 1 : 0;
                                const data = {
                                    url: 'accounting/transaction-mode-update/' + entityEditData.id,
                                    data: formValue
                                }
                                dispatch(storeEntityDataWithFile(data))

                                notifications.show({
                                    color: 'teal',
                                    title: t('UpdateSuccessfully'),
                                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                    loading: false,
                                    autoClose: 700,
                                    style: { backgroundColor: 'lightgray' },
                                });

                                setTimeout(() => {
                                    dispatch(setInsertType('create'));
                                    dispatch(setFetching(true))
                                    dispatch(setEditEntityData([]))
                                    setSaveCreateLoading(false)
                                    navigate('/accounting/transaction-mode');
                                }, 700)
                            },
                        });
                    })}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('UpdateTransactionMode')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            className={'btnPrimaryBg'}
                                                            type="submit"
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}
                                                            loading={saveCreateLoading}
                                                        >
                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={14} fw={400}>
                                                                    {saveCreateLoading ? t('Saving') : t("UpdateAndSave")}
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
                                    <Grid columns={24}>
                                        <Grid.Col span={'auto'} >
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box>
                                                    {/* Tab System */}
                                                    {transactionMethods && (
                                                        <Tabs
                                                            height={50}
                                                            p={4}
                                                            bg={"#f0f1f9"}
                                                            value={activeTab}
                                                            color="var(--theme-primary-color-6)"
                                                            variant="pills"
                                                            radius="sm"
                                                            onChange={(value) => {
                                                                setActiveTab(value);
                                                                form.setFieldValue("method_id", value);
                                                            }}
                                                        >
                                                            <Tabs.List grow>
                                                                {transactionMethods.map((item, index) => (
                                                                    <Tabs.Tab key={index} m={2} value={item.value}>
                                                                        {t(item.label)}
                                                                    </Tabs.Tab>
                                                                ))}
                                                            </Tabs.List>
                                                        </Tabs>
                                                    )}

                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('TransactionModeNameValidateMessage')}
                                                            label={t('Name')}
                                                            placeholder={t('Name')}
                                                            required={true}
                                                            nextField={'short_name'}
                                                            name={'name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('ShortNameValidateMessage')}
                                                            label={t('ShortName')}
                                                            placeholder={t('ShortName')}
                                                            required={true}
                                                            nextField={'account_owner'}
                                                            name={'short_name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'short_name'}
                                                        />
                                                    </Box>

                                                    {/* Bank Transfer Fields (Method ID 21) */}
                                                    {activeTab === '21' && (
                                                        <>
                                                            <Box mt={'xs'}>
                                                                <InputForm
                                                                    tooltip={t('AccountOwnerValidateMessage')}
                                                                    label={t('AccountOwner')}
                                                                    placeholder={t('AccountOwner')}
                                                                    required={false}
                                                                    nextField={'bank_id'}
                                                                    name={'account_owner'}
                                                                    form={form}
                                                                    mt={8}
                                                                    id={'account_owner'}
                                                                />
                                                            </Box>
                                                            <Box mt={'xs'}>
                                                                <SelectForm
                                                                    tooltip={t("ChooseBank")}
                                                                    label={t("ChooseBank")}
                                                                    placeholder={t("ChooseBank")}
                                                                    required={false}
                                                                    nextField="account_mode_id"
                                                                    name="bank_id"
                                                                    form={form}
                                                                    dropdownValue={banksDropdownData}
                                                                    id="bank_id"
                                                                    searchable={true}
                                                                    value={bankData || (entityEditData?.bank_id ? String(entityEditData.bank_id) : '')}
                                                                    changeValue={(value) => {
                                                                        setBankData(value);
                                                                        form.setFieldValue("bank_id", value);
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Box mt={'xs'}>
                                                                <SelectForm
                                                                    tooltip={t('ChooseBankMode')}
                                                                    label={t('BankMode')}
                                                                    placeholder={t('BankMode')}
                                                                    required={false}
                                                                    nextField={'account_type_mode_id'}
                                                                    name={'account_mode_id'}
                                                                    form={form}
                                                                    dropdownValue={accountModeDropdown}
                                                                    mt={8}
                                                                    id={'account_mode_id'}
                                                                    searchable={false}
                                                                    value={accountModeData || (entityEditData?.account_mode_id ? String(entityEditData.account_mode_id) : '')}
                                                                    changeValue={setAccountModeData}
                                                                />
                                                            </Box>
                                                            <Box mt={'xs'}>
                                                                <SelectForm
                                                                    tooltip={t('ChooseAccountType')}
                                                                    label={t('AccountType')}
                                                                    placeholder={t('ChooseAccountType')}
                                                                    required={false}
                                                                    nextField={'account_number'}
                                                                    name={'account_type_mode_id'}
                                                                    form={form}
                                                                    dropdownValue={accountDropdown}
                                                                    mt={8}
                                                                    id={'account_type_mode_id'}
                                                                    searchable={false}
                                                                    value={accountTypeData || (entityEditData?.account_type_mode_id ? String(entityEditData.account_type_mode_id) : '')}
                                                                    changeValue={setAccountTypeData}
                                                                />
                                                            </Box>
                                                            <Box mt={'xs'}>
                                                                <InputForm
                                                                    tooltip={t('AccountNumberValidationMessage')}
                                                                    label={t('AccountNumber')}
                                                                    placeholder={t('AccountNumber')}
                                                                    required={false}
                                                                    nextField={'branch_name'}
                                                                    name={'account_number'}
                                                                    form={form}
                                                                    mt={'md'}
                                                                    id={'account_number'}
                                                                />
                                                            </Box>
                                                            <Box mt={'xs'}>
                                                                <InputForm
                                                                    tooltip={t('BranchNameValidationMessage')}
                                                                    label={t('BranchName')}
                                                                    placeholder={t('BranchName')}
                                                                    required={false}
                                                                    nextField={'routing_number'}
                                                                    name={'branch_name'}
                                                                    form={form}
                                                                    mt={'md'}
                                                                    id={'branch_name'}
                                                                />
                                                            </Box>
                                                            <Box mt={'xs'}>
                                                                <InputForm
                                                                    tooltip={t('RoutingNumberValidationMessage')}
                                                                    label={t('RoutingNumber')}
                                                                    placeholder={t('RoutingNumber')}
                                                                    required={false}
                                                                    nextField={'service_charge'}
                                                                    name={'routing_number'}
                                                                    form={form}
                                                                    mt={'md'}
                                                                    id={'routing_number'}
                                                                />
                                                            </Box>
                                                        </>
                                                    )}

                                                    {/* Mobile Banking Fields (Method ID 22) */}
                                                    {activeTab === '22' && (
                                                        <>
                                                            <Box mt={'xs'}>
                                                                <SelectForm
                                                                    tooltip={t('ChooseBankMode')}
                                                                    label={t('BankMode')}
                                                                    placeholder={t('BankMode')}
                                                                    required={false}
                                                                    nextField={'account_type_mode_id'}
                                                                    name={'account_mode_id'}
                                                                    form={form}
                                                                    dropdownValue={accountModeDropdown}
                                                                    mt={8}
                                                                    id={'account_mode_id'}
                                                                    searchable={false}
                                                                    value={accountModeData || (entityEditData?.account_mode_id ? String(entityEditData.account_mode_id) : '')}
                                                                    changeValue={setAccountModeData}
                                                                />
                                                            </Box>
                                                            <Box mt={'xs'}>
                                                                <InputForm
                                                                    tooltip={t('AccountOwnerValidateMessage')}
                                                                    label={t('AccountOwner')}
                                                                    placeholder={t('AccountOwner')}
                                                                    required={false}
                                                                    nextField={'is_selected'}
                                                                    name={'account_owner'}
                                                                    form={form}
                                                                    mt={8}
                                                                    id={'account_owner'}
                                                                />
                                                            </Box>
                                                            <Box mt={'xs'}>
                                                                <InputForm
                                                                    tooltip={t('MobileAccountValidateMessage')}
                                                                    label={t('MobileAccount')}
                                                                    placeholder={t('MobileAccount')}
                                                                    required={false}
                                                                    nextField={'account_mode_id'}
                                                                    name={'mobile'}
                                                                    form={form}
                                                                    mt={0}
                                                                    id={'mobile'}
                                                                />
                                                            </Box>
                                                            <Box mt={'xs'}>
                                                                <SelectForm
                                                                    tooltip={t('ChooseAuthorised')}
                                                                    label={t('Authorised')}
                                                                    placeholder={t('ChooseAuthorised')}
                                                                    required={false}
                                                                    nextField={'service_charge'}
                                                                    name={'authorised_mode_id'}
                                                                    form={form}
                                                                    dropdownValue={authorizedDropdown}
                                                                    mt={8}
                                                                    id={'authorised_mode_id'}
                                                                    searchable={false}
                                                                    value={authorisedData || (entityEditData?.authorised_mode_id ? String(entityEditData.authorised_mode_id) : '')}
                                                                    changeValue={setAuthorisedData}
                                                                />
                                                            </Box>
                                                        </>
                                                    )}

                                                    {/* Common Fields */}
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('ServiceChargeValidationMessage')}
                                                            label={t('ServiceCharge')}
                                                            placeholder={t('ServiceCharge')}
                                                            required={false}
                                                            nextField={''}
                                                            name={'service_charge'}
                                                            form={form}
                                                            mt={'md'}
                                                            id={'service_charge'}
                                                            type={'number'}
                                                            leftSection={
                                                                <IconPlusMinus size={16} opacity={0.5} />
                                                            }
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <SwitchForm
                                                            tooltip={t('IsSelected')}
                                                            label={t('IsSelected')}
                                                            nextField={'is_selected'}
                                                            name={'is_selected'}
                                                            form={form}
                                                            color='var(--theme-primary-color-6)'
                                                            id={'is_selected'}
                                                            position={'left'}
                                                            checked={form.values?.is_selected}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Tooltip
                                                            label={t('ChooseImage')}
                                                            opened={('path' in form.errors) && !!form.errors['path']}
                                                            px={16}
                                                            py={2}
                                                            position="top-end"
                                                            color='var(--theme-primary-color-6)'
                                                            withArrow
                                                            offset={2}
                                                            zIndex={999}
                                                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                                        >
                                                            <Dropzone
                                                                label={t('ChooseImage')}
                                                                accept={IMAGE_MIME_TYPE}
                                                                onDrop={(e) => {
                                                                    setFiles(e)
                                                                    form.setFieldError('path', false);
                                                                    form.setFieldValue('path', true)
                                                                }}
                                                            >
                                                                <Text ta="center">
                                                                    {
                                                                        files && files.length > 0 && files[0].path ?
                                                                            files[0].path
                                                                            :
                                                                            <span>{t("DropImagesHere")} <span style={{ color: 'red' }}>*</span></span>
                                                                    }
                                                                </Text>
                                                            </Dropzone>
                                                        </Tooltip>

                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                            mt={'xs'}
                                                            mb={'xs'}
                                                        >
                                                            <Image
                                                                height={100}
                                                                fit="cover"
                                                                alt="Logo"
                                                                src={entityEditData?.path}
                                                            />
                                                        </Flex>
                                                    </Box>
                                                </Box>
                                            </ScrollArea>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </Grid.Col>
                <Grid.Col span={1} >
                    <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                        <Shortcut
                            form={form}
                            FormSubmit={'EntityFormSubmit'}
                            Name={'method_id'}
                            inputType="select"
                        />
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>
    );
}

export default TransactionModeUpdateFrom;