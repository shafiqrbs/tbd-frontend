import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title, Alert, Select, Stack,
    ActionIcon,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import * as TablerIcons from '@tabler/icons-react';
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { setFetching, setValidationData, storeEntityData } from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";

function SitemapForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const form = useForm({
        initialValues: {
            module_name: '', name: '', url: '', icon: '', status: ''
        },
        validate: {
            module_name: hasLength({ min: 2, max: 20 }),
            name: hasLength({ min: 2, max: 20 }),
            url: isNotEmpty(),
            icon: isNotEmpty(),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('module_name').focus()
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
                            centered: true,
                            title: (
                                <Text size="md"> {t("FormConfirmationTitle")}</Text>
                            ),
                            children: (
                                <Text size="sm"> {IconComponent && <IconComponent />}</Text>
                            ),
                            labels: { confirm: 'Submit', cancel: 'Cancel' }, confirmProps: { color: 'red.5' },
                            onCancel: () => console.log('Cancel'),
                            onConfirm: () => {
                                // const value = {
                                //     url: 'domain/sitemap',
                                //     data: values
                                // }
                                // dispatch(storeEntityData(value))
                                // notifications.show({
                                //     color: 'teal',
                                //     title: t('CreateSuccessfully'),
                                //     icon: <TablerIcons.IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                //     loading: false,
                                //     autoClose: 700,
                                //     style: { backgroundColor: 'lightgray' },
                                // });

                                // setTimeout(() => {
                                //     form.reset()
                                //     dispatch(setFetching(true))
                                // }, 700)
                            },
                        });
                    })}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >

                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}  >
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('CreateSitemap')}</Title>
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
                                                            leftSection={<TablerIcons.IconDeviceFloppy size={16} />}
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
                                                <Box pb={'md'}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('ModuleNameValidateMessage')}
                                                            label={t('ModuleName')}
                                                            placeholder={t('ModuleName')}
                                                            required={true}
                                                            nextField={'name'}
                                                            name={'module_name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'module_name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('NameValidateMessage')}
                                                            label={t('Name')}
                                                            placeholder={t('Name')}
                                                            required={true}
                                                            nextField={'url'}
                                                            name={'name'}
                                                            form={form}
                                                            mt={16}
                                                            id={'name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('UrlValidateMessage')}
                                                            label={t('UrlName')}
                                                            placeholder={t('UrlName')}
                                                            required={false}
                                                            nextField={'icon'}
                                                            name={'url'}
                                                            form={form}
                                                            mt={'md'}
                                                            id={'url'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                    <InputForm
                                                            tooltip={t('IconValidateMessage')}
                                                            label={t('ChooseIcon')}
                                                            placeholder={t('ChooseIcon')}
                                                            required={false}
                                                            nextField={'status'}
                                                            name={'icon'}
                                                            form={form}
                                                            mt={'md'}
                                                            id={'icon'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{ base: 1 }}>
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
                    </form>
                </Grid.Col>
                <Grid.Col span={1} >
                    <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                        <Shortcut
                            form={form}
                            FormSubmit={'EntityFormSubmit'}
                            Name={'module_name'}
                        />
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>

    );
}
export default SitemapForm;
