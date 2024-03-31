import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title, Alert, List, Stack, SimpleGrid, Image, Tooltip
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
import {setEntityNewData, setFetching, setValidationData, storeEntityData} from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import TransactionModeTable from "./TransactionModeTable.jsx";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getTransactionMethodDropdownData from "../../../global-hook/dropdown/getTransactionMethodDropdownData.js";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";

function TransactionModeForm(props) {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 132; //TabList height 104
    const [opened, {open, close}] = useDisclosure(false);

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [authorisedData, setAuthorisedData] = useState(null);
    const [methodData, setMethodData] = useState(null);
    const [accountTypeData, setAccountTypeData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [marketingExeData, setMarketingExeData] = useState(null);

    const locationDropdownData = useSelector((state) => state.utilitySlice.locationDropdownData)
    const executiveDropdownData = useSelector((state) => state.utilitySlice.executiveDropdownData)
    const validationMessage = useSelector((state) => state.crudSlice.validationMessage)
    const validation = useSelector((state) => state.crudSlice.validation)
    const entityNewData = useSelector((state) => state.crudSlice.entityNewData)


    const [files, setFiles] = useState([]);

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
    });

    const form = useForm({
        initialValues: {
            name: '',authorised:'',mobile:'',account_type:'',service_charge:'',account_owner:'',service_name:'',method_id:'',path:''
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
            authorised: isNotEmpty(),
            account_type: isNotEmpty(),
            method_id: isNotEmpty(),
            path: isNotEmpty(),
            mobile: (value) => {
                const isNotEmpty = !    !value.trim().length;
                const isDigitsOnly = /^\d+$/.test(value.trim());

                if (isNotEmpty && isDigitsOnly) {
                    return false;
                } else {
                    return true;
                }
            },
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


    /*useEffect(() => {
        if (validation) {
            validationMessage.name && (form.setFieldError('name', true));
            validationMessage.mobile && (form.setFieldError('mobile', true));
            validationMessage.email && (form.setFieldError('email', true));
            validationMessage.credit_limit && (form.setFieldError('credit_limit', true));
            validationMessage.alternative_mobile && (form.setFieldError('alternative_mobile', true));
            dispatch(setValidationData(false))
        }

        if (entityNewData.message ==='success'){
            notifications.show({
                color: 'teal',
                title: t('CreateSuccessfully'),
                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                loading: false,
                autoClose: 700,
                style: {backgroundColor: 'lightgray'},
            });

            setTimeout(() => {
                form.reset()
                setMarketingExeData(null)
                setAuthorisedData(null)
                setLocationData(null)
                dispatch(setEntityNewData([]))
                dispatch(setFetching(true))
            }, 700)
        }
    }, [validation,validationMessage,form]);*/

    useHotkeys([['alt+n', () => {
        document.getElementById('company_name').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);


    return (
        <Box>
            <Grid columns={24} gutter={{base: 8}}>

                <Grid.Col span={15} >
                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                        <TransactionModeTable/>
                    </Box>
                </Grid.Col>

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
                            labels: {confirm: 'Confirm', cancel: 'Cancel'},
                            onCancel: () => console.log('Cancel'),
                            onConfirm: () => {
                                const formValue = {...form.values};
                                formValue['path'] = files;

                                console.log(formValue)
                                /*const value = {
                                    url: 'domain/global',
                                    data: values
                                }
                                dispatch(storeEntityData(value))

                                notifications.show({
                                    color: 'teal',
                                    title: t('CreateSuccessfully'),
                                    icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                    loading: false,
                                    autoClose: 700,
                                    style: {backgroundColor: 'lightgray'},
                                });

                                setTimeout(() => {
                                    form.reset()
                                    dispatch(setFetching(true))
                                }, 700)*/
                            },
                        });
                    })}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                        <Box bg={"white"} >

                                <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} h={54}>
                                            <Title order={6} mt={'xs'} pl={'6'}>{t('CreateNewTransactionMode')}</Title>
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
                                                                    {t("CreateAndSave")}
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
                                            <ScrollArea h={height} scrollbarSize={2} type="never">
                                                <Box  pb={'md'}>
                                                    {/*{
                                                        Object.keys(form.errors).length > 0 && validationMessage !=0 &&
                                                        <Alert variant="light" color="red" radius="md" title={
                                                            <List withPadding size="sm">
                                                                {validationMessage.name && <List.Item>{t('NameValidateMessage')}</List.Item>}
                                                                {validationMessage.mobile && <List.Item>{t('MobileValidateMessage')}</List.Item>}
                                                                {validationMessage.alternative_mobile && <List.Item>{t('AlternativeMobile')}</List.Item>}
                                                            </List>
                                                        }></Alert>
                                                    }*/}

                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('TransactionModeNameValidateMessage')}
                                                            label={t('TransactionModeName')}
                                                            placeholder={t('TransactionModeName')}
                                                            required={true}
                                                            nextField={'authorised'}
                                                            name={'name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'name'}
                                                        />
                                                    </Box>

                                                    <Box mt={'xs'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseAuthorised')}
                                                            label={t('Authorised')}
                                                            placeholder={t('ChooseAuthorised')}
                                                            required={true}
                                                            nextField={'method_id'}
                                                            name={'authorised'}
                                                            form={form}
                                                            dropdownValue={["BRAC", "DBBL","Brac bank","Dutch Bangla","BKASH"]}
                                                            mt={8}
                                                            id={'authorised'}
                                                            searchable={false}
                                                            value={authorisedData}
                                                            changeValue={setAuthorisedData}
                                                        />
                                                    </Box>

                                                    <Box mt={'xs'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseMethod')}
                                                            label={t('Method')}
                                                            placeholder={t('ChooseMethod')}
                                                            required={true}
                                                            nextField={'mobile'}
                                                            name={'method_id'}
                                                            form={form}
                                                            dropdownValue={getTransactionMethodDropdownData()}
                                                            mt={8}
                                                            id={'method_id'}
                                                            searchable={false}
                                                            value={methodData}
                                                            changeValue={setMethodData}
                                                        />
                                                    </Box>

                                                    <Box mt={'xs'}>
                                                        <InputNumberForm
                                                            tooltip={t('MobileValidateMessage')}
                                                            label={t('Mobile')}
                                                            placeholder={t('Mobile')}
                                                            required={true}
                                                            nextField={'account_type'}
                                                            name={'mobile'}
                                                            form={form}
                                                            mt={16}
                                                            id={'mobile'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseAccountType')}
                                                            label={t('AccountType')}
                                                            placeholder={t('ChooseAccountType')}
                                                            required={true}
                                                            nextField={'service_charge'}
                                                            name={'account_type'}
                                                            form={form}
                                                            dropdownValue={["Merchant", "General","Personal"]}
                                                            mt={8}
                                                            id={'account_type'}
                                                            searchable={false}
                                                            value={accountTypeData}
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
                                                        <InputForm
                                                            tooltip={t('ServiceNameValidateMessage')}
                                                            label={t('ServiceName')}
                                                            placeholder={t('ServiceName')}
                                                            required={false}
                                                            nextField={'address'}
                                                            name={'service_name'}
                                                            form={form}
                                                            mt={8}
                                                            id={'service_name'}
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
                            Name={'company_name'}
                        />
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>

    );
}
export default TransactionModeForm;
