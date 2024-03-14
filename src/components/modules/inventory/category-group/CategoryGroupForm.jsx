import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import {setFetching, storeEntityData} from "../../../../store/inventory/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SwitchForm from "../../../form-builders/SwitchForm";


function CategoryGroupForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false)

    const form = useForm({
        initialValues: {
            name: '', status: true
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('name').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('CategoryFormSubmit').click()
    }]], []);


    return (
        <Box bg={"white"} mt={`xs`}>
            <form onSubmit={form.onSubmit((values) => {
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
                        setSaveCreateLoading(true)
                        const value = {
                            url: 'inventory/category-group',
                            data: form.values
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
                            setSaveCreateLoading(false)
                            dispatch(setFetching(true))
                        }, 700)
                    },
                });
            })}>
                <Box pb={`xs`} pl={`xs`} pr={8}>
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('CategoryGroupInformation')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0} gap={0}>
                                <>
                                    {!saveCreateLoading && isOnline &&
                                        <Button
                                            size="xs"
                                            color={`indigo.6`}
                                            type="submit"
                                            mt={4}
                                            mr={'xs'}
                                            id="CategoryFormSubmit"
                                            leftSection={<IconDeviceFloppy size={16}/>}
                                        >
                                            <Flex direction={`column`} gap={0}>
                                                <Text fz={12} fw={400}>
                                                    {t("CreateAndSave")}
                                                </Text>
                                            </Flex>
                                        </Button>
                                    }
                                </>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box h={1} bg={`gray.3`}></Box>
                <Box m={'md'}>
                    <Grid columns={24}>
                        <Grid.Col span={'auto'}>
                            <ScrollArea h={height} scrollbarSize={2} type="never">
                                <Box pb={'md'}>

                                    <InputForm
                                        tooltip={t('CategoryGroupNameValidateMessage')}
                                        label={t('CategoryGroupName')}
                                        placeholder={t('CategoryGroupName')}
                                        required={true}
                                        nextField={'status'}
                                        form={form}
                                        name={'name'}
                                        mt={8}
                                        id={'name'}
                                    />

                                    <SwitchForm
                                        tooltip={t('Status')}
                                        label={t('Status')}
                                        nextField={'CategoryFormSubmit'}
                                        name={'status'}
                                        form={form}
                                        mt={12}
                                        id={'status'}
                                        position={'left'}
                                        defaultChecked={1}
                                    />
                                </Box>
                            </ScrollArea>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Shortcut
                                form={form}
                                FormSubmit={'CategoryFormSubmit'}
                                Name={'name'}
                            />
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

export default CategoryGroupForm;
