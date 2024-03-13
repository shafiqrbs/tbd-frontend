import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
    IconRestore,
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import {
    getCustomerDropdown,
} from "../../../../store/core/utilitySlice";
import {setDropdownLoad, setFetching,storeEntityData} from "../../../../store/inventory/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import CategoryGroupModal from "./CategoryGroupModal.jsx";
import {getCategoryDropdown} from "../../../../store/inventory/utilitySlice.js";


function CategoryForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104
    const navigate = useNavigate();
    const [opened, {open, close}] = useDisclosure(false);
    const icon = <IconInfoCircle />;
    const [categoryGroupData, setCategoryGroupData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerData, setCustomerData] = useState(null);

    const categoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.categoryDropdownData)
    const customerDropdownData = useSelector((state) => state.utilitySlice.customerDropdownData)
    const fetching = useSelector((state) => state.inventoryCrudSlice.fetching)
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)

    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    // console.log(categoryDropdownData)

    let categoryDropdown = categoryDropdownData && categoryDropdownData.length > 0 ?
        categoryDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    let customerDropdown = customerDropdownData && customerDropdownData.length > 0 ?
        customerDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {
        dispatch(getCustomerDropdown('core/select/customer'))

        const value = {
            url : 'inventory/select/category-group',
            param : {
                type : 'parent'
            }
        }
        dispatch(getCategoryDropdown(value))
        dispatch(setDropdownLoad(false))
    }, [dropdownLoad]);

    const form = useForm({
        initialValues: {
            parent: '', name: '', status: true
        },
        validate: {
            parent: isNotEmpty(),
            name: hasLength({min: 2, max: 20}),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('CompanyName').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('VendorFormSubmit').click()
    }]], []);


    return (
        <Box bg={"white"} mt={`xs`}>
            <form onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: 'Please confirm your action',
                    children: (
                        <Text size="sm">
                            This action is so important that you are required to confirm it with a
                            modal. Please click
                            one of these buttons to proceed.
                        </Text>
                    ),
                    labels: {confirm: 'Confirm', cancel: 'Cancel'},
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {

                        const value = {
                            url : 'inventory/category-group',
                            data : form.values
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
                            setCategoryGroupData(null)
                            dispatch(setFetching(true))
                        }, 700)
                    },
                });
            })}>
                <Box pb={`xs`} pl={`xs`} pr={8}>
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('CategoryInformation')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0}  gap={0}>
                                <>
                                    {!saveCreateLoading &&
                                        <Button
                                        size="xs"
                                        color={`indigo.6`}
                                        type="submit"
                                        mt={4}
                                        mr={'xs'}
                                        id="VendorFormSubmit"
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
                <Box  h={1} bg={`gray.3`}></Box>
                <Box m={'md'}>
                 <Grid columns={24}>
                    <Grid.Col span={'auto'}>
                        <ScrollArea h={height} scrollbarSize={2} type="never">
                            <Box pb={'md'}>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={10}>
                                        <SelectForm
                                            tooltip={t('ChooseCategoryGroup')}
                                            label={t('CategoryGroup')}
                                            placeholder={t('ChooseCategoryGroup')}
                                            required={true}
                                            nextField={'name'}
                                            name={'parent'}
                                            form={form}
                                            dropdownValue={categoryDropdown}
                                            mt={8}
                                            id={'category_group'}
                                            searchable={false}
                                            value={categoryGroupData}
                                            changeValue={setCategoryGroupData}
                                        />

                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Button
                                            mt={32}
                                            color={'gray'}
                                            variant={'outline'}
                                            onClick={open}>
                                            <IconPlus size={12} opacity={0.5}
                                        /></Button>
                                    </Grid.Col>
                                    {opened &&
                                    <CategoryGroupModal openedModel={opened} open={open} close={close}/>
                                    }
                                </Grid>
                                <InputForm
                                    tooltip={t('CategoryNameValidateMessage')}
                                    label={t('CategoryName')}
                                    placeholder={t('CategoryName')}
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
                                    nextField={'VendorFormSubmit'}
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
                            FormSubmit={'VendorFormSubmit'}
                            Name={'CompanyName'}
                        />
                    </Grid.Col>
                </Grid>
                </Box>
            </form>
        </Box>

    );
}
export default CategoryForm;
