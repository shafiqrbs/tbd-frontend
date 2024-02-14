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
    IconX,
} from "@tabler/icons-react";
import Customer from "./Customer";
import {hasLength, isEmail, useForm} from "@mantine/form";
import {modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';

function DashBoard() {
    const {t, i18n} = useTranslation();
    const iconStyle = {width: rem(12), height: rem(12)};
    const [activeTab, setActiveTab] = useState("Customer");
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [isFormSubmit, setFormSubmit] = useState(false);
    const [formSubmitData, setFormSubmitData] = useState([]);
    const {isOnline, mainAreaHeight} = useOutletContext();

    const form = useForm({
        initialValues: {
            location:'', marketing_executive:'', name:'', mobile:'', customer_group:'', credit_limit:'', old_reference_no:'', alternative_mobile:'', address:'', email:'', status:''
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
            mobile: hasLength({min: 11, max: 11}),

        },
    });

    const tabCreateNewRightButtons = (
        <Group pos={`absolute`} right={0} gap={0}>
            <Tooltip
                label={"Tooltip"}
                px={20}
                py={3}
                color={`blue.3`}
                withArrow
                offset={2}
                position={"bottom"}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Button size="sm" color={`red.3`} variant="light">
                    <IconX size={18}/>
                </Button>
            </Tooltip>
            <Tooltip
                label={t("check")}
                px={20}
                py={3}
                color={`blue.3`}
                withArrow
                offset={2}
                position={"bottom"}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Button size="sm" ml={1} mr={1} variant="light" color={`yellow.5`}>
                    <IconCircleCheck/>
                </Button>
            </Tooltip>


            <>
                <Button
                    size="sm"
                    color={`blue.7`}
                    type="submit"
                >
                    <LoadingOverlay
                        visible={saveCreateLoading}
                        zIndex={1000}
                        overlayProps={{radius: "xs", blur: 2}}
                        size={'xs'}
                        position="center"
                    />

                    <Flex direction={`column`} gap={0}>
                        <Text fz={12} fw={700}>
                            {t("CreateAndSave")} <br/>{" "}
                            <Text fz={9} fw={900}>
                                ctrl + s
                            </Text>
                        </Text>
                    </Flex>
                </Button>
            </>
        </Group>
    );
    return (
        <form
            onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: 'Please confirm your action',
                    children: (
                        <Text size="sm">
                            This action is so important that you are required to confirm it with a modal. Please click
                            one of these buttons to proceed.
                        </Text>
                    ),
                    labels: {confirm: 'Confirm', cancel: 'Cancel'},
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        setSaveCreateLoading(true)

                        setTimeout((e) => {
                            console.log(values)

                            /*const getData = (url, params = null) => {
                                const response = axios.get(url, {
                                    params: params,
                                    headers: {
                                        "X-API-KEY": appConfig.API_KEY,
                                        "X-API-VALUE": appConfig.API_VALUE,
                                        "X-API-SECRET": appConfig.API_SECRET,
                                    },
                                });

                                return response;
                            };*/

                            notifications.show({
                                title: 'Default notification',
                                message: 'Hey there, your code is awesome! 🤥',
                            })

                            setSaveCreateLoading(false)
                        }, 3000)
                    },
                });


            })}
        >
            <Tabs
                defaultValue="Customer"
                onChange={(value) => setActiveTab(value)}
            >
                <Tabs.List pos={`relative`}>
                    <Tabs.Tab
                        value="Customer"
                        leftSection={<IconList style={iconStyle}/>}
                    >
                        {t("Customer")}
                    </Tabs.Tab>
                    {activeTab === "Customer" && isOnline && tabCreateNewRightButtons}
                </Tabs.List>

                <Tabs.Panel value="Customer">
                    <Customer
                        isFormSubmit={isFormSubmit}
                        setFormSubmitData={setFormSubmitData}
                        setFormSubmit={setFormSubmit} f
                        form={form}
                    />
                </Tabs.Panel>
            </Tabs>
        </form>
    );
}

export default DashBoard;
