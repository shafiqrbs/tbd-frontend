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
    LoadingOverlay, TextInput,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconList,
    IconDeviceFloppy,
    IconRestore,
    IconCheck,
} from "@tabler/icons-react";

import {useForm} from "@mantine/form";
import {modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';
import {useHotkeys} from "@mantine/hooks";
import {useNavigate} from 'react-router-dom'

import {useDispatch, useSelector} from "react-redux";
import {storeEntityData, updateEntityData} from "../../../../store/core/crudSlice";

import CustomerView from "./CustomerView";

function CustomerIndex() {
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const iconStyle = {width: rem(12), height: rem(12)};

    const [activeTab, setActiveTab] = useState("CustomerView");
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerGroup, setCustomerGroup] = useState('');
    const [location, setLocation] = useState('');
    const [marketing, setMarketing] = useState('');

    const insertType = useSelector((state) => state.crudSlice.insertType)
    const entityEditData = useSelector((state) => state.crudSlice.editEntityData)

    const form = useForm({
        initialValues: {
            location_id: '',
            marketing_id: '',
            name: '',
            mobile: '',
            customer_group: '',
            credit_limit: '',
            reference_id: '',
            alternative_mobile: '',
            address: '',
            email: '',
            status: ''
        }
    });

    useHotkeys([['shift+r', () => {
        navigate(0);
    }]], []);

    useHotkeys([['shift+s', () => {
        document.getElementById('customerSave').click()
    }]], []);

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
                    <IconRestore style={{width: rem(24)}}/>
                </Button>
            </Tooltip>
            <>
                <Button
                    id={'customerSave'}
                    disabled={saveCreateLoading}
                    size="md"
                    color={`indigo.7`}
                    type="submit"
                    leftSection={<IconDeviceFloppy size={24}/>}
                    onClick={() => {
                        if (activeTab === 'CustomerView') {
                            let validation = true
                            if (!form.values.name) {
                                form.setFieldError('name', true);
                                validation = false
                            }
                            if (!form.values.mobile || isNaN(form.values.mobile)) {
                                form.setFieldError('mobile', true);
                                validation = false
                            }
                            if (form.values.email && !/^\S+@\S+$/.test(form.values.email)) {
                                form.setFieldError('email', true);
                                validation = false
                            }

                            validation &&
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
                                    setSaveCreateLoading(true)
                                    const formData = form.values

                                    marketing && (formData['marketing_id'] = Number(marketing))
                                    location && (formData['location_id'] = Number(location))
                                    customerGroup && (formData['customer_group'] = customerGroup)

                                    const value = {
                                        url: insertType === 'update' ? 'customer/' + entityEditData.id : 'customer',
                                        data: formData
                                    }

                                    insertType === 'create' && dispatch(storeEntityData(value))
                                    insertType === 'update' && dispatch(updateEntityData(value))

                                    notifications.show({
                                        color: 'teal',
                                        title: insertType === 'update' ?
                                            t('UpdateSuccessfully') :
                                            t('CreateSuccessfully'),
                                        icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                        loading: false,
                                        autoClose: 700,
                                        style: {backgroundColor: 'lightgray'},
                                    });

                                    setTimeout(() => {
                                        /*form.setFieldValue('location_id', '')
                                        setLocation('')
                                        form.setFieldValue('marketing_id', '')
                                        setMarketing('')
                                        form.setFieldValue('customer_group', '')
                                        setCustomerGroup('')
                                        form.reset()
                                        setSaveCreateLoading(false)
                                        dispatch(setFetching(true))*/
                                        navigate(0);
                                    }, 700)
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
                <Button bg={`white`} size="md" ml={1} mr={1} variant="light" color={`black`}>
                    <IconRestore size={24}/>
                </Button>
            </Tooltip>


            <>
                <Button
                    size="md"
                    color={`blue.7`}
                    type="submit"
                    leftSection={<IconDeviceFloppy size={24}/>}
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
                {(activeTab === "CustomerTable" || activeTab === 'CustomerView') && isOnline && tabCreateNewRightButtons}
                {activeTab === "CustomerLedger" && isOnline && tabCustomerLedgerButtons}
            </Tabs.List>
            <Tabs.Panel value="CustomerView" h={'52'}>

                <CustomerView
                    form={form}
                    customerGroup={customerGroup}
                    setCustomerGroup={setCustomerGroup}
                    location={location}
                    setLocation={setLocation}
                    marketing={marketing}
                    setMarketing={setMarketing}
                />
            </Tabs.Panel>

        </Tabs>

    );
}

export default CustomerIndex;
