import React, {useEffect, useState} from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Text, Title, Stack, SimpleGrid, Image, Tooltip, Tabs
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconPlusMinus
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import {
    setFetching,
    setValidationData,
    storeEntityDataWithFile
} from "../../../../store/accounting/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getTransactionMethodDropdownData from "../../../global-hook/dropdown/getTransactionMethodDropdownData.js";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import getSettingAccountTypeDropdownData from "../../../global-hook/dropdown/getSettingAccountTypeDropdownData.js";
import getSettingAccountModeDropdownData from "../../../global-hook/dropdown/getSettingAccountModeDropdownData.js";
import getSettingAuthorizedTypeDropdownData from "../../../global-hook/dropdown/getSettingAuthorizedTypeDropdownData.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import getBanksDropdownData from "../../../global-hook/dropdown/getBanksDropdownData";
import _SelectForm from "../../../form-builders/_SelectForm";

function TransactionModeForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [authorisedData, setAuthorisedData] = useState(null);
    const [bankMode, setBankMode] = useState('External');
    const [methodData, setMethodData] = useState(null);
    const [accountTypeData, setAccountTypeData] = useState(null);
    const [accountModeData, setAccountModeData] = useState(null);

    const authorizedDropdown = getSettingAuthorizedTypeDropdownData()
    const accountDropdown = getSettingAccountTypeDropdownData()
    const accountModeDropdown = getSettingAccountModeDropdownData()
    const transactionMethods = getTransactionMethodDropdownData()
    const banksDropdownData = getBanksDropdownData()
    const [bankData, setBankData] = useState("");



    const [activeTab, setActiveTab] = useState("21");
    useEffect(() => {
        form.setValues({
            method_id: 21,
        })
    }, []);

    const [files, setFiles] = useState([]);

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
    });

    const form = useForm({
        initialValues: {
            method_id: '', name: '', short_name: '', mobile: '',authorised_mode_id: '',account_mode_id: '',bank_id: '',account_number: '',branch_name: '',routing_number: '', account_type_mode_id: '', service_charge: '', account_owner: '', path: '',is_selected:0
        },
        validate: {
            method_id : isNotEmpty(),
            name: hasLength({ min: 2}),
            short_name: hasLength({ min: 2}),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('method_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);


    return (
        <Box>
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
                            labels: { confirm: 'Confirm', cancel: 'Cancel' }, confirmProps: { color: 'red' },
                            onCancel: () => console.log('Cancel'),
                            onConfirm: () => {
                                const formValue = { ...form.values };
                                formValue['path'] = files[0];
                                formValue['is_selected'] = form.values.is_selected==true?1:0;

                                const data = {
                                    url: 'accounting/transaction-mode',
                                    data: formValue
                                }
                                dispatch(storeEntityDataWithFile(data))

                                notifications.show({
                                    color: 'teal',
                                    title: t('CreateSuccessfully'),
                                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                    loading: false,
                                    autoClose: 700,
                                    style: { backgroundColor: 'lightgray' },
                                });

                                setTimeout(() => {
                                    form.reset()
                                    setFiles([])
                                    setMethodData(null)
                                    setAccountTypeData(null)
                                    setAccountModeData(null)
                                    setAuthorisedData(null)
                                    dispatch(setFetching(true))
                                }, 700)
                            },
                        });
                    })}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('CreateNewTransactionMode')}</Title>
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
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <Grid columns={24}>
                                        <Grid.Col span={'auto'} >
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box>
                                                    {
                                                        transactionMethods &&

                                                        <Tabs
                                                            height={50}
                                                            p={4}
                                                            bg={"#f0f1f9"}
                                                            defaultValue="VoucherEntry"
                                                            color="var(--theme-primary-color-6)"
                                                            variant="pills"
                                                            radius="sm"
                                                            value={activeTab}
                                                            onChange={(value) => {
                                                                setActiveTab(value)
                                                                form.setValues({
                                                                    method_id: value,
                                                                })
                                                            }}
                                                        >
                                                            <Tabs.List grow>
                                                                {
                                                                    transactionMethods.map((item, index) => (
                                                                        <Tabs.Tab key={index} m={2} value={item.value}>
                                                                            {t(item.label)}
                                                                        </Tabs.Tab>
                                                                    ))
                                                                }
                                                            </Tabs.List>
                                                        </Tabs>
                                                    }

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
                                                        {activeTab === '21' &&
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
                                                                        value={bankData}
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
                                                                        value={accountModeData}
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
                                                                        value={accountTypeData}
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
                                                            </>
                                                        }
                                                        {activeTab === '22' &&
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
                                                                        value={accountModeData}
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
                                                                        value={authorisedData}
                                                                        changeValue={setAuthorisedData}
                                                                    />
                                                                </Box>
                                                                <Box mt={'xs'}>
                                                                    <InputForm
                                                                        tooltip={t('ServiceChargeValidationMessage')}
                                                                        label={t('ServiceCharge')}
                                                                        placeholder={t('ServiceCharge')}
                                                                        required={false}
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
                                                            </>
                                                        }
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
                                                                defaultChecked={form.is_selected}
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

                                                        <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0}>
                                                            {previews}
                                                        </SimpleGrid>
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
export default TransactionModeForm;
