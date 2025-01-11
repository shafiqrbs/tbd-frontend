import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Text, Title, Stack, Center,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { isNotEmpty, useForm} from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import {setFetching, updateEntityDataWithFile} from "../../../../store/core/crudSlice.js";

import SelectForm from "../../../form-builders/SelectForm";
import Shortcut from "../../shortcut/Shortcut.jsx";
import {Dropzone, MIME_TYPES} from "@mantine/dropzone";

function FileUploadForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [excelFileType, setExcelFileType] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const form = useForm({
        initialValues: {
            file_type: ''
        },
        validate: {
            file_type: isNotEmpty(),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('excel_type').focus()
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
                if (!excelFile){
                    notifications.show({
                        loading: true,
                        color: 'red',
                        title: t("SelectCsvFile"),
                        message: 'Data will be loaded in 3 seconds, you cannot close this yet',
                        autoClose: 1000,
                        withCloseButton: true,
                    });
                }else {


                    values['file'] = excelFile
                    modals.openConfirmModal({
                        title: (
                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                        ),
                        children: (
                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                        ),
                        labels: {confirm: t('Submit'), cancel: t('Cancel')}, confirmProps: {color: 'red'},
                        onCancel: () => console.log('Cancel'),
                        onConfirm: () => {

                            const value = {
                                url: 'core/file-upload/store',
                                data: values
                            }

                            // dispatch(updateEntityDataWithFile(value))
                            const dispatchUpdateEntityDataWithFile = async (value) => {
                                const dispatchResult = await dispatch(updateEntityDataWithFile(value));
                                return dispatchResult;
                            };

                            dispatchUpdateEntityDataWithFile(value).then(response => {
                                if (response.payload.data.status==200){
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
                                        setExcelFileType(null)
                                        setExcelFile(null)
                                        dispatch(setFetching(true))
                                    }, 700)
                                }
                            }).catch(error => {
                                console.error('Dispatch error:', error);
                            });
                        },
                    });
                }
            })}>


                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('CreateFile')}</Title>
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
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box>

                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('ChooseExcelType')}
                                                    label={t('ChooseExcelType')}
                                                    placeholder={t('ChooseExcelType')}
                                                    required={false}
                                                    nextField={''}
                                                    name={'file_type'}
                                                    form={form}
                                                    dropdownValue={['Production','Product','User']}
                                                    mt={8}
                                                    id={'file_type'}
                                                    searchable={true}
                                                    value={excelFileType}
                                                    changeValue={setExcelFileType}
                                                />
                                            </Box>

                                            <Box mt={'xs'}>
                                                <Dropzone
                                                    onDrop={(e) => {
                                                        setExcelFile(e[0])
                                                    }}
                                                    accept={[MIME_TYPES.csv,MIME_TYPES.xlsx]}
                                                    h={100}
                                                    p={0}
                                                >
                                                    <Center h={100}>
                                                        <Text>{excelFile? excelFile.path :t("SelectCsvFile")}</Text>
                                                    </Center>
                                                </Dropzone>
                                            </Box>

                                        </Box>
                                    </ScrollArea>

                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
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
                </Grid>
            </form >
        </Box >

    );
}
export default FileUploadForm;
