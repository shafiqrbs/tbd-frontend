import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title, Alert, List, Stack, Tooltip, SimpleGrid, Image,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import {
    getExecutiveDropdown, getLocationDropdown,
} from "../../../../store/core/utilitySlice";
import {
    setEntityNewData,
    setFetching,
    setFormLoading,
    setValidationData,
    storeEntityData
} from "../../../../store/accounting/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import {storeEntityDataWithFile} from "../../../../store/accounting/crudSlice.js";
import getTransactionMethodDropdownData from "../../../global-hook/dropdown/getTransactionMethodDropdownData.js";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import getSettingAuthorizedTypeDropdownData
    from "../../../global-hook/dropdown/getSettingAuthorizedTypeDropdownData.js";
import getSettingAccountTypeDropdownData from "../../../global-hook/dropdown/getSettingAccountTypeDropdownData.js";

function VoucherUpdateFrom(props) {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [opened, {open, close}] = useDisclosure(false);

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerGroupData, setCustomerGroupData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [marketingExeData, setMarketingExeData] = useState(null);

    const locationDropdownData = useSelector((state) => state.utilitySlice.locationDropdownData)
    const executiveDropdownData = useSelector((state) => state.utilitySlice.executiveDropdownData)
    const validationMessage = useSelector((state) => state.crudSlice.validationMessage)
    const validation = useSelector((state) => state.crudSlice.validation)
    const entityNewData = useSelector((state) => state.crudSlice.entityNewData)

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [authorisedData, setAuthorisedData] = useState(null);
    const [methodData, setMethodData] = useState(null);
    const [accountTypeData, setAccountTypeData] = useState(null);

    const authorizedDropdown = getSettingAuthorizedTypeDropdownData()
    const accountDropdown = getSettingAccountTypeDropdownData()

    const [files, setFiles] = useState([]);

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
    });


    const form = useForm({
        initialValues: {
            method_id: '',
            name: '',
            short_name: '',
            authorised_mode_id: '',
            account_mode_id: '',
            service_charge: '',
            account_owner: '',
            path: ''
        },
        validate: {
            method_id: isNotEmpty(),
            name: hasLength({min: 2, max: 20}),
            short_name: hasLength({min: 2, max: 20}),
            authorised_mode_id: isNotEmpty(),
            account_mode_id: isNotEmpty(),
            path: isNotEmpty(),
            service_charge: (value, values) => {
                if (value ) {
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
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            method_id: entityEditData.method_id?entityEditData.method_id:'',
            name: entityEditData.name?entityEditData.name:'',
            short_name: entityEditData.short_name?entityEditData.short_name:'',
            authorised_mode_id: entityEditData.authorised_mode_id?entityEditData.authorised_mode_id:'',
            account_mode_id: entityEditData.account_mode_id?entityEditData.account_mode_id:'',
            service_charge: entityEditData.service_charge?entityEditData.service_charge:'',
            account_owner: entityEditData.account_owner?entityEditData.account_owner:'',
            path: entityEditData.path?entityEditData.path:'',
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [dispatch, setFormData])



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
            <Grid columns={9} gutter={{base: 8}}>
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
                            labels: {confirm: 'Submit', cancel: 'Cancel'},confirmProps: { color: 'red.5' },
                            onCancel: () => console.log('Cancel'),
                            onConfirm: () => {
                                const formValue = {...form.values};
                                formValue['path'] = files[0];
                                //console.log(formValue)
                            },
                        });
                    })}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >

                                <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} h={54}>
                                            <Title order={6} mt={'xs'} pl={'6'}>{t('UpdateTransactionMode')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right  align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            color={`red.6`}
                                                            type="submit"
                                                            mt={4}
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16}/>}
                                                        >

                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={12} fw={400}>
                                                                    {t("UpdateAndSave")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </></Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} mt={'xs'}  className={'borderRadiusAll'}>
                                    <Grid columns={24}>
                                        <Grid.Col span={'auto'} >
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box>
                                                    <Box mt={'xs'}>
                                                    <SelectForm
                                                        tooltip={t('ChooseMethod')}
                                                        label={t('Method')}
                                                        placeholder={t('ChooseMethod')}
                                                        required={true}
                                                        nextField={'name'}
                                                        name={'method_id'}
                                                        form={form}
                                                        dropdownValue={getTransactionMethodDropdownData()}
                                                        mt={8}
                                                        id={'method_id'}
                                                        searchable={false}
                                                        value={methodData ? String(methodData) : (entityEditData.method_id ? String(entityEditData.method_id) : null)}
                                                        changeValue={setMethodData}
                                                    />
                                                </Box>
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
                                                            nextField={'authorised_mode_id'}
                                                            name={'short_name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'short_name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseAuthorised')}
                                                            label={t('Authorised')}
                                                            placeholder={t('ChooseAuthorised')}
                                                            required={true}
                                                            nextField={'account_mode_id'}
                                                            name={'authorised_mode_id'}
                                                            form={form}
                                                            dropdownValue={authorizedDropdown}
                                                            mt={8}
                                                            id={'authorised_mode_id'}
                                                            searchable={false}
                                                            value={authorisedData ? String(authorisedData) : (entityEditData.authorised_mode_id ? String(entityEditData.authorised_mode_id) : null)}
                                                            changeValue={setAuthorisedData}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseAccountType')}
                                                            label={t('AccountType')}
                                                            placeholder={t('ChooseAccountType')}
                                                            required={true}
                                                            nextField={'service_charge'}
                                                            name={'account_mode_id'}
                                                            form={form}
                                                            dropdownValue={accountDropdown}
                                                            mt={8}
                                                            id={'account_mode_id'}
                                                            searchable={false}
                                                            value={accountTypeData ? String(accountTypeData) : (entityEditData.account_mode_id ? String(entityEditData.account_mode_id) : null)}
                                                            changeValue={setAccountTypeData}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputNumberForm
                                                            tooltip={t('ServiceChargeValidationMessage')}
                                                            label={t('ServiceCharge')}
                                                            placeholder={t('ServiceCharge')}
                                                            required={false}
                                                            nextField={'account_owner'}
                                                            name={'service_charge'}
                                                            form={form}
                                                            mt={'md'}
                                                            id={'service_charge'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('AccountOwnerValidateMessage')}
                                                            label={t('AccountOwner')}
                                                            placeholder={t('AccountOwner')}
                                                            required={false}
                                                            nextField={'service_name'}
                                                            name={'account_owner'}
                                                            form={form}
                                                            mt={8}
                                                            id={'account_owner'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Tooltip
                                                            label={t('ChooseImage')}
                                                            opened={('path' in form.errors) && !!form.errors['path']}
                                                            px={16}
                                                            py={2}
                                                            position="top-end"
                                                            color="red"
                                                            withArrow
                                                            offset={2}
                                                            zIndex={999}
                                                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
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
                                                                        files && files.length >0 && files[0].path ?
                                                                            files[0].path
                                                                            :
                                                                            <span>Drop images here <span style={{color: 'red'}}>*</span></span>
                                                                    }
                                                                </Text>
                                                            </Dropzone>
                                                        </Tooltip>

                                                        <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0}>
                                                            {previews}
                                                            <Image src={'http://www.tbd.local/image/accounting/transaction-mode/'+entityEditData.path}/>
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
export default VoucherUpdateFrom;
