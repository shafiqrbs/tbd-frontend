import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    Tabs,
    rem,
    Text,
    Tooltip,
    Flex,
    LoadingOverlay,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck,
    IconList,
    IconReload,
    IconDashboard,
    IconDeviceFloppy,
    IconRestore,
    IconX,
} from "@tabler/icons-react";

import UserView from "./UserView";
import {hasLength, isEmail, useForm} from "@mantine/form";
import {modals} from '@mantine/modals';

import axios from "axios";
import {storeEntityData, setFetching} from "../../../../store/core/crudSlice.js";
import {useDispatch, useSelector} from "react-redux";

function UserIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const iconStyle = {width: rem(12), height: rem(12)};
    const [activeTab, setActiveTab] = useState("UserView");
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const form = useForm({
        initialValues: {
            name:'', username:'', email:'', password:'',confirm_password:''
        }
    });
    const tabCreateNewRightButtons = (
        <Group mt={4} pos={`absolute`} right={12} gap={0}>
            <Tooltip
                label={t("Refresh")}
                color={`indigo.6`}
                withArrow
                offset={2}
                position={"bottom"}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}>
                <Button variant="transparent" size="md" ml={1} mr={1} color={`gray`}>
                    <IconRestore style={{ width: rem(24) }}  />
                </Button>
            </Tooltip>
            <>
                <Button
                    disabled={saveCreateLoading}
                    size="md"
                    color={`indigo.7`}
                    type="submit"
                    leftSection={<IconDeviceFloppy size={24} />}
                    onClick={()=>{
                        if (activeTab === 'UserView') {
                            let validation = true
                            if (!form.values.name) {
                                form.setFieldError('name', true);
                                validation = false
                            }
                            if (!form.values.username) {
                                form.setFieldError('username', true);
                                validation = false
                            }

                            if ( !/^\S+@\S+$/.test(form.values.email)) {
                                form.setFieldError('email', true);
                                validation = false
                            }

                            if (!form.values.password){
                                form.setFieldError('password', true);
                                validation = false
                            }

                            if (!form.values.confirm_password){
                                form.setFieldError('confirm_password', true);
                                validation = false
                            }

                            if (form.values.password !== form.values.confirm_password){
                                form.setFieldError('confirm_password', true);
                                validation = false
                            }


                            validation &&
                            modals.openConfirmModal({
                                title: (
                                    <Text size="sm"> {t("FormConfirmationTitle")}</Text>
                                ),
                                children: (
                                    <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                ),
                                labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                onCancel: () => console.log('Cancel'),
                                onConfirm: () => {
                                    /*setSaveCreateLoading(true)
                                    const value = {
                                        url : 'customer',
                                        data : form.values
                                    }
                                    dispatch(storeEntityData(value))
                                    setTimeout(()=>{
                                        form.setFieldValue('location_id', '')
                                        form.reset()
                                        setSaveCreateLoading(false)
                                        dispatch(setFetching(true))
                                    },500)*/
                                    console.log(form.values)

                                },
                            });
                        }
                    }}
                >
                    <LoadingOverlay
                        visible={saveCreateLoading}
                        zIndex={1000}
                        overlayProps={{radius: "xs", blur: 2}}
                        size={'xs'}
                        position="center"
                    />

                    <Flex direction={`column`}  gap={0}>
                        <Text fz={14} fw={400}>
                          {t("CreateAndSave")}
                        </Text>
                    </Flex>
                </Button>
            </>
        </Group>
    );
    return (

            <Tabs
                defaultValue="UserView"
                onChange={(value) => setActiveTab(value)}
            >
                <Tabs.List pos={`relative`} h={'52'}>
                    <Tabs.Tab h={'52'} fz={14} fw={700}
                              value="UserView"
                              leftSection={<IconList style={iconStyle}/>}>
                        {t("ManageUsers")}
                    </Tabs.Tab>
                    {tabCreateNewRightButtons}
                </Tabs.List>
                <Tabs.Panel value="UserView" h={'52'}>
                    <UserView
                        form={form}
                    />
                </Tabs.Panel>
            </Tabs>
    );
}

export default UserIndex;
