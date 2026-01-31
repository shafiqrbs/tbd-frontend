import React, {useEffect, useState} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Text, Title, Stack
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import {
    setEditEntityData,
    setInsertType,
    setFetching,
    setFormLoading,
    updateEntityData
} from "../../../../store/accounting/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import useAccountHeadDropdownData from "../../../global-hook/dropdown/account/getAccountHeadAllDropdownData";

function LedgerUpdateFrom(props) {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [formLoad, setFormLoad] = useState('')

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(false);

    const accountDropdown = useAccountHeadDropdownData(reloadTrigger, 'sub-head');

    const [parentHead, setParentHead] = useState(null);

    useEffect(() => {
        setParentHead(entityEditData?.parent_id?.toString())
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading, entityEditData])

    const form = useForm({
        initialValues: {
            parent_id: '', name: '', code: '', status: true, head_group: 'ledger'
        },
        validate: {
            parent_id: isNotEmpty(),
            name: hasLength({min: 2, max: 20})
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    const handleReset = () => {
        form.setValues({
            parent_id: entityEditData.parent_id ? entityEditData.parent_id : '',
            name: entityEditData.name ? entityEditData.name : '',
            code: entityEditData.code ? entityEditData.code : '',
            status: entityEditData.status ? entityEditData.status : true,
        })
    }
    useEffect(() => {
        form.setValues({
            parent_id: entityEditData.parent_id ? entityEditData.parent_id : '',
            name: entityEditData.name ? entityEditData.name : '',
            code: entityEditData.code ? entityEditData.code : '',
            status: entityEditData.status ? entityEditData.status : true,
        })
        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [dispatch, setFormData, entityEditData])

    useHotkeys([['alt+n', () => {
        document.getElementById('parent_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        handleReset()
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
                    labels: {confirm: 'Submit', cancel: 'Cancel'}, confirmProps: {color: 'red'},
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        setSaveCreateLoading(true)
                        const value = {
                            url: 'accounting/account-head/' + entityEditData.id,
                            data: values
                        }
                        dispatch(updateEntityData(value))
                        notifications.show({
                            color: 'teal',
                            title: t('UpdateSuccessfully'),
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 700,
                            style: {backgroundColor: 'lightgray'},
                        });

                        setTimeout(() => {
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                            navigate('/accounting/ledger', {replace: true})
                        }, 700)
                    },
                });
            })}>

                <Grid columns={9} gutter={{base: 8}}>
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={'white'}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'}
                                     className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt={'6'}>{t('UpdateLedger')}</Title>
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
                                                            leftSection={<IconDeviceFloppy size={16}/>}>
                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={14} fw={400}>
                                                                    {t("CreateAndSave")}
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
                                        <Grid.Col span={'auto'}>
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box>
                                                    <Box mt={'8'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseHeadGroup')}
                                                            label={t('HeadGroup')}
                                                            placeholder={t('ChooseHeadGroup')}
                                                            required={true}
                                                            nextField={'name'}
                                                            name={'parent_id'}
                                                            form={form}
                                                            dropdownValue={accountDropdown}
                                                            mt={8}
                                                            id={'parent_id'}
                                                            searchable={false}
                                                            value={parentHead}
                                                            changeValue={setParentHead}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('SubGroupNameValidateMessage')}
                                                            label={t('Name')}
                                                            placeholder={t('Name')}
                                                            required={true}
                                                            nextField={'code'}
                                                            name={'name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('AccountCodeValidateMessage')}
                                                            label={t('AccountCode')}
                                                            placeholder={t('AccountCode')}
                                                            required={true}
                                                            name={'code'}
                                                            form={form}
                                                            id={'code'}
                                                            nextField={'status'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('Status')}
                                                                    label=''
                                                                    nextField={'EntityFormSubmit'}
                                                                    name={'status'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'status'}
                                                                    position={'left'}
                                                                    defaultChecked={1}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('Status')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                </Box>
                                            </ScrollArea>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>

                        </Box>


                    </Grid.Col>
                    <Grid.Col span={1}>
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
            </form>
        </Box>

    );
}

export default LedgerUpdateFrom;
