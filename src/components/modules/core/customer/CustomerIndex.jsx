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
    IconX,
} from "@tabler/icons-react";
import CustomerView from "./CustomerView";
import {hasLength, isEmail, useForm} from "@mantine/form";
import {modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';
import CustomerTable from "./CustomerTable";
import CustomerSales from "./CustomerView";
import CustomerLedger from "./CustomerLedger";
import CustomerInvoice from "./CustomerInvoice";

function CustomerIndex() {
    const {t, i18n} = useTranslation();
    const iconStyle = {width: rem(12), height: rem(12)};
    const [activeTab, setActiveTab] = useState("CustomerView");
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
        <Group mt={4} pos={`absolute`} right={0} gap={0}>
            <Tooltip
                label={t("Refresh")}
                color={`red.6`}
                withArrow
                offset={2}
                position={"bottom"}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Button bg={`red.3`} size="md" ml={1} mr={1} variant="light" color={`white`}>
                    <IconReload size={18} />
                </Button>
            </Tooltip>


            <>
                <Button
                    size="md"
                    color={`blue.7`}
                    type="submit"
                    leftSection={<IconDeviceFloppy size={24} />}
                >
                    <LoadingOverlay
                        visible={saveCreateLoading}
                        zIndex={1000}
                        overlayProps={{radius: "xs", blur: 2}}
                        size={'xs'}
                        position="center"
                    />

                    <Flex direction={`column`} gap={0}>
                        <Text fz={14} fw={400}>
                          {t("CreateAndSave")}
                        </Text>
                    </Flex>
                </Button>
            </>
        </Group>
    );
    const tabCustomerLedgerButtons = (
        <Group mt={4} pos={`absolute`} right={0} gap={0}>
            <Tooltip
                label={t("Refresh")}
                color={`red.6`}
                withArrow
                offset={2}
                position={"bottom"}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Button bg={`red.3`} size="md" ml={1} mr={1} variant="light" color={`white`}>
                    <IconReload size={18} />
                </Button>
            </Tooltip>


            <>
                <Button
                    size="md"
                    color={`blue.7`}
                    type="submit"
                    leftSection={<IconDeviceFloppy size={24} />}
                >
                    <LoadingOverlay
                        visible={saveCreateLoading}
                        zIndex={1000}
                        overlayProps={{radius: "xs", blur: 2}}
                        size={'xs'}
                        position="center"
                    />

                    <Flex direction={`column`} gap={0}>
                        <Text fz={14} fw={400}>
                            {t("NewReceive")}
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
                defaultValue="CustomerView"
                onChange={(value) => setActiveTab(value)}
            >
                <Tabs.List pos={`relative`} h={'52'}>
                    <Tabs.Tab h={'52'} fz={14} fw={700}
                              value="CustomerView"
                              leftSection={<IconList style={iconStyle}/>}>
                        {t("ManageCustomer")}
                    </Tabs.Tab>
                    <Tabs.Tab h={'52'} fz={14} fw={700}
                        value="CustomerTable"
                        leftSection={<IconList style={iconStyle}/>}>
                        {t("ManageCustomerTable")}
                    </Tabs.Tab>
                    <Tabs.Tab h={'52'} fz={14} fw={700}
                              value="CustomerLedger"
                              leftSection={<IconList style={iconStyle}/>}>
                        {t("ManageCustomerLedger")}
                    </Tabs.Tab>
                    <Tabs.Tab h={'52'} fz={14} fw={700}
                              value="CustomerInvoice"
                              leftSection={<IconList style={iconStyle}/>}>
                        {t("CustomerInvoice")}
                    </Tabs.Tab>
                    {activeTab === "CustomerTable" && isOnline && tabCreateNewRightButtons}
                    {activeTab === "CustomerLedger" && isOnline && tabCustomerLedgerButtons}
                </Tabs.List>
                <Tabs.Panel value="CustomerView" h={'52'}>
                    <CustomerView
                        isFormSubmit={isFormSubmit}
                        setFormSubmitData={setFormSubmitData}
                        setFormSubmit={setFormSubmit}
                        form={form}
                    />
                </Tabs.Panel>
                <Tabs.Panel value="CustomerTable" h={'52'}>
                    <CustomerTable
                        isFormSubmit={isFormSubmit}
                        setFormSubmitData={setFormSubmitData}
                        setFormSubmit={setFormSubmit}
                        form={form}
                    />
                </Tabs.Panel>
                <Tabs.Panel value="CustomerLedger" h={'52'}>
                    <CustomerLedger
                        isFormSubmit={isFormSubmit}
                        setFormSubmitData={setFormSubmitData}
                        setFormSubmit={setFormSubmit}
                        form={form}
                    />
                </Tabs.Panel>
                <Tabs.Panel value="CustomerInvoice" h={'52'}>
                    <CustomerInvoice
                        isFormSubmit={isFormSubmit}
                        setFormSubmitData={setFormSubmitData}
                        setFormSubmit={setFormSubmit}
                        form={form}
                    />
                </Tabs.Panel>
            </Tabs>

        </form>
    );
}

export default CustomerIndex;
