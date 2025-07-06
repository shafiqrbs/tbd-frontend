import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack,
    ActionIcon, Drawer
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import {
    IconCheck,
    IconDeviceFloppy,
    IconX,
} from "@tabler/icons-react";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { setFetching, storeEntityData } from "../../../../store/core/crudSlice.js";
import { getGroupCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";
import { useSelector, useDispatch } from "react-redux";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import { setDropdownLoad } from "../../../../store/inventory/crudSlice.js";

function ProductCategoryDrawer(props) {
    const dispatch = useDispatch()

    const { groupDrawer, setGroupDrawer, saveId } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const [categoryGroupData, setCategoryGroupData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const effectRan = useRef(true);

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
    const closeModel = () => {
        setGroupDrawer(false)
    }
    const groupCategoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.groupCategoryDropdown)
    let groupCategoryDropdown = groupCategoryDropdownData && groupCategoryDropdownData.length > 0 ?
        groupCategoryDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'inventory/select/group-category',
        }
        dispatch(getGroupCategoryDropdown(value))
    }, []);


    return (
        <>
            <Drawer.Root opened={groupDrawer} position="right" onClose={closeModel} size={'30%'}  >
                <Drawer.Overlay />
                <Drawer.Content>
                    <ScrollArea h={height + 100} scrollbarSize={2} type="never" bg={'gray.1'}>
                        <Flex
                            mih={40}
                            gap="md"
                            justify="flex-end"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <ActionIcon
                                mr={'sm'}
                                radius="xl"
                                color="red.6" size="md"
                                onClick={closeModel}
                            >
                                <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                            </ActionIcon>
                        </Flex>
                        <Box ml={2} mr={2} mb={0}>
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
                                            dispatch(setDropdownLoad(true))
                                            setGroupDrawer(false)
                                        }, 700)
                                    },
                                });
                            })}>
                                <Box mb={0}>

                                    <Grid columns={9} gutter={{ base: 6 }} >
                                        <Grid.Col span={9} >
                                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                                <Box bg={"white"} >
                                                    <Box pl={`xs`} pr={8} pt={'4'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                                        <Grid>
                                                            <Grid.Col span={8} >
                                                                <Title order={6} pt={'6'}>{t('CreateProductCategory')}</Title>
                                                            </Grid.Col>
                                                            <Grid.Col span={4}>

                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                                        <ScrollArea h={height - 82} scrollbarSize={2} scrollbars="y" type="never">
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
                                                                            color='var(--theme-primary-color-6)'
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
                                                    <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'2'} mt={4} className={'boxBackground borderRadiusAll'}>
                                                        <Group justify="space-between">
                                                            <Flex
                                                                gap="md"
                                                                justify="center"
                                                                align="center"
                                                                direction="row"
                                                                wrap="wrap"
                                                            >
                                                                <ActionIcon
                                                                    variant="transparent"
                                                                    size="sm"
                                                                    color="red.6"
                                                                    onClick={closeModel}
                                                                    ml={'4'}
                                                                >
                                                                    <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Flex>

                                                            <Group gap={8}>
                                                                <Stack align="flex-start">
                                                                    <>
                                                                        {
                                                                            !saveCreateLoading && isOnline &&
                                                                            <Button
                                                                                size="xs"
                                                                                className={'btnPrimaryBg'}
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
                                                                    </>
                                                                </Stack>
                                                            </Group>
                                                        </Group>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </form>
                        </Box>
                    </ScrollArea>
                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default ProductCategoryDrawer;
