import { Stack, Box, CloseButton, Button, Container, TextInput, ScrollArea, Grid, Title, Text, Flex, Tooltip, SimpleGrid } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import SelectForm from "../../../form-builders/SelectForm";
import { useForm, hasLength, isNotEmpty } from "@mantine/form";
import InputForm from "../../../form-builders/InputForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import ImageUploadDropzone from "../../../form-builders/ImageUploadDropzone";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

export default function VoucherFormSection(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 215;
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [methodData, setMethodData] = useState(null);
    const [authorisedData, setAuthorisedData] = useState(null);
    const [accountTypeData, setAccountTypeData] = useState(null);
    const [files, setFiles] = useState([]);


    const form = useForm({
        intitialValues: {
            method_id: '', name: '', short_name: '', authorised_mode_id: '', account_mode_id: '', service_charge: '', account_owner: '', path: ''
        },
        validate: {

        }
    })
    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
    });

    return (
        <Box >
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
                            setAuthorisedData(null)
                            dispatch(setFetching(true))
                        }, 700)
                    },
                });
            })}>
                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                    <Box bg={"white"} >
                        <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                            <Grid>
                                <Grid.Col span={6} h={54}>
                                    <Title order={6} mt={'xs'} pl={'6'}>{t('CreateNewVoucher')}</Title>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Stack right align="flex-end">
                                        <>
                                            {
                                                !saveCreateLoading && isOnline &&
                                                <Button
                                                    size="xs"
                                                    color={`red.6`}
                                                    type="submit"
                                                    mt={4}
                                                    id="EntityFormSubmit"
                                                    leftSection={<IconDeviceFloppy size={16} />}
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
                        <Box pl={`xs`} pr={'xs'} mt={'xs'} className={'borderRadiusAll'}>
                            <Grid columns={24}>
                                <Grid.Col span={'auto'} >
                                    <ScrollArea h={height + 33} scrollbarSize={2} scrollbars="y" type="never">
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
                                                    dropdownValue={''}
                                                    mt={8}
                                                    id={'method_id'}
                                                    searchable={false}
                                                    value={methodData}
                                                    changeValue={setMethodData}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('VoucherNameValidateMessage')}
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
                                                    dropdownValue={''}
                                                    mt={8}
                                                    id={'authorised_mode_id'}
                                                    searchable={false}
                                                    value={authorisedData}
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
                                                    dropdownValue={''}
                                                    mt={8}
                                                    id={'account_mode_id'}
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
                                                                    <span>Drop images here <span style={{ color: 'red' }}>*</span></span>
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
        </Box>
    )
}