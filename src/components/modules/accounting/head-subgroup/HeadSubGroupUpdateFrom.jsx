import React, { useEffect, useState } from "react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title, Alert, List, Stack, Tooltip, SimpleGrid, Image,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import {
    getExecutiveDropdown, getLocationDropdown,
} from "../../../../store/core/utilitySlice";
import {
    setEditEntityData,
    setEntityNewData,
    setFetching,
    setFormLoading,
    setValidationData,
    storeEntityData,
    setInsertType,
    updateEntityData
} from "../../../../store/accounting/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import getSettingMotherAccountDropdownData from "../../../global-hook/dropdown/getSettingMotherAccountDropdownData";

function HeadSubGroupUpdateFrom(props) {
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
<<<<<<< HEAD
    const [motherData, setMotherData] = useState(null);
    const accountDropdown = getSettingMotherAccountDropdownData()
=======
    const [methodData, setMethodData] = useState(null);
    const navigate = useNavigate()
>>>>>>> 174c4057cd5379e739f259cefc7743e9bccd0be9

    const form = useForm({
        initialValues: {
            mother_account_id:'', name:'', code: '', status: ''
        },
        validate: {
            mother_account_id: isNotEmpty(),
            name: isNotEmpty()
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            mother_account_id: entityEditData.mother_account_id ? entityEditData.mother_account_id : '',
            name: entityEditData.name ? entityEditData.name : '',
            code: entityEditData.code ? entityEditData.code : '',
            status: entityEditData.status ? entityEditData.status : ''
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch, setFormData])

    useHotkeys([['alt+n', () => {
        document.getElementById('parent_name').click()
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
                    labels: { confirm: 'Submit', cancel: 'Cancel' }, confirmProps: { color: 'red' },
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
<<<<<<< HEAD
                            navigate('/accounting/head-group');
=======
                            navigate('/accounting/head-subgroup', { replace: true })
>>>>>>> 174c4057cd5379e739f259cefc7743e9bccd0be9
                        }, 700)
                    },
                });
            })}>

                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={'white'}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('UpdateAccountHeadGroup')}</Title>
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
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <Grid columns={24}>
                                        <Grid.Col span={'auto'} >
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box >
                                                    <Box mt={'8'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseHeadGroup')}
                                                            label={t('HeadGroup')}
                                                            placeholder={t('ChooseHeadGroup')}
                                                            required={true}
                                                            nextField={'name'}
                                                            name={'mother_account_id'}
                                                            form={form}
                                                            dropdownValue={accountDropdown}
                                                            id={'mother_account_id'}
                                                            searchable={false}
                                                            value={motherData ? String(motherData) : (entityEditData.mother_account_id ? String(entityEditData.mother_account_id) : null)}
                                                            changeValue={setMotherData}
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
                                                    <Box mt={'xs'} >
                                                        <Grid gutter={{ base: 1 }}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('Status')}
                                                                    label=''
                                                                    nextField={'EntityFormSubmit'}
                                                                    name={'status'}
                                                                    form={form}
                                                                    color="red"
                                                                    id={'status'}
                                                                    position={'left'}
                                                                    checked={form.values.status}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Status')}</Grid.Col>
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
            </form>
        </Box>

    );
}
export default HeadSubGroupUpdateFrom;
