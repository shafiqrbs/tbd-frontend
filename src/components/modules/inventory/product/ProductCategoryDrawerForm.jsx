import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { setFetching, storeEntityData } from "../../../../store/core/crudSlice.js";

import _ShortcutMasterData from "../../shortcut/_ShortcutMasterData.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";


function ProductCategoryDrawerForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [categoryGroupData, setCategoryGroupData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const effectRan = useRef(true);



    const { adjustment, saveId, groupCategoryDropdown } = props

    const categoryForm = useForm({
        initialValues: {
            parent: '', name: '', status: true
        },
        validate: {
            parent: isNotEmpty(),
            name: hasLength({ min: 2, max: 20 }),
        }
    });

    useEffect(() => {
        effectRan.current && (
            setTimeout(() => {
                document.getElementById('category_group').click()
            }, 100),
            effectRan.current = false
        )
    })

    // useHotkeys([['alt+n', () => {
    //     document.getElementById('category_group').click()
    // }]], []);

    // useHotkeys([['alt+r', () => {
    //     categoryForm.reset()
    // }]], []);

    // useHotkeys([['alt+s', () => {
    //     document.getElementById(saveId).click()
    // }]], []);


    return (
        <>
            <Box>
                <form onSubmit={categoryForm.onSubmit((values) => {
                    // console.log(values)
                    modals.openConfirmModal({
                        title: (
                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                        ),
                        children: (
                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                        ),
                        labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                        onCancel: () => console.log('Cancel'),
                        onConfirm: () => {
                            setSaveCreateLoading(true)
                            const value = {
                                url: 'inventory/category-group',
                                data: categoryForm.values
                            }
                            dispatch(storeEntityData(value))

                            notifications.show({
                                color: 'teal',
                                title: t('CreateSuccessfully'),
                                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: 700,
                                style: { backgroundColor: 'lightgray' },
                            });

                            setTimeout(() => {
                                categoryForm.reset()
                                setCategoryGroupData(null)
                                setSaveCreateLoading(false)
                                dispatch(setFetching(true))
                            }, 700)
                        },
                    });
                })}>
                    <Box mb={0}>

                        <Grid columns={9} gutter={{ base: 6 }} >
                            <Grid.Col span={9} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box bg={"white"} >
                                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                            <Grid>
                                                <Grid.Col span={8} >
                                                    <Title order={6} pt={'6'}>{t('CreateProductCategory')}</Title>
                                                </Grid.Col>
                                                <Grid.Col span={4}>
                                                    <Stack right align="flex-end">
                                                        <>
                                                            {
                                                                !saveCreateLoading && isOnline &&
                                                                <Button
                                                                    size="xs"
                                                                    color={`green.8`}
                                                                    type="submit"
                                                                    id={saveId}
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
                                            <ScrollArea h={height - (adjustment ? adjustment : 0)} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box mt={'8'}>
                                                    <SelectForm
                                                        tooltip={t('ChooseCategoryGroup')}
                                                        label={t('CategoryGroup')}
                                                        placeholder={t('ChooseCategoryGroup')}
                                                        required={true}
                                                        nextField={'category_name'}
                                                        name={'parent'}
                                                        form={categoryForm}
                                                        dropdownValue={groupCategoryDropdown}
                                                        id={'category_group'}
                                                        searchable={false}
                                                        value={categoryGroupData}
                                                        changeValue={setCategoryGroupData}
                                                    />
                                                </Box>

                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('CategoryNameValidateMessage')}
                                                        label={t('CategoryName')}
                                                        placeholder={t('CategoryName')}
                                                        required={true}
                                                        nextField={'category_status'}
                                                        form={categoryForm}
                                                        name={'name'}
                                                        id={'category_name'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('Status')}
                                                                label=''
                                                                nextField={saveId}
                                                                name={'status'}
                                                                form={categoryForm}
                                                                color="red"
                                                                id={'category_status'}
                                                                position={'left'}
                                                                defaultChecked={1}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'2'} >{t('Status')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                            </ScrollArea>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid.Col>
                            {/* <Grid.Col span={1} >
                                <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                    <_ShortcutMasterData
                                        adjustment={adjustment}
                                        form={categoryForm}
                                        FormSubmit={saveId}
                                        Name={'setting_type'}
                                        inputType="select"
                                    />
                                </Box>
                            </Grid.Col> */}
                        </Grid>
                    </Box>
                </form>
            </Box>
        </>

    );
}

export default ProductCategoryDrawerForm;
