import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    Text,
    Tooltip,
    ScrollArea,
    TextInput, Switch, Modal, LoadingOverlay,
} from "@mantine/core";
import {useTranslation} from "react-i18next";

import {
    IconInfoCircle, IconX, IconXboxX
} from "@tabler/icons-react";
import {getHotkeyHandler} from "@mantine/hooks";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine component features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import {modals} from "@mantine/modals";
import {hasLength, useForm} from "@mantine/form";

function CustomerGroupModel(props) {
    const {openedModel, open, close} = props
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();

    const [modelSubmit, setModelSubmit] = useState(false)

    const formModal = useForm({
        initialValues: {
            customer_group_name: '', customer_group_status: ''
        },
        validate: {
            customer_group_name: hasLength({min: 2, max: 20}),
            customer_group_status: hasLength({min: 11, max: 11}),
        },
    });

    return (
        <>
            <Modal
                opened={openedModel}
                onClose={close}
                title={t('CustomerGroupModel')}
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                scrollAreaComponent={ScrollArea.Autosize}
                closeButtonProps={{
                    icon: <IconXboxX size={20} stroke={1.5}/>,
                }}
            >

                <Tooltip
                    label={t('NameValidateMessage')}
                    opened={!!formModal.errors.customer_group_name}
                    // opened={true}
                    px={20}
                    py={3}
                    position="top-end"
                    color="red"
                    withArrow
                    offset={2}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <TextInput
                        size="sm"
                        label={t('Name')}
                        placeholder={t('CustomerName')}
                        {...formModal.getInputProps("customer_group_name")}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                document.getElementById('CustomerGroupStatus').focus();
                            }],
                        ])}
                        rightSection={
                            formModal.values.customer_group_name ?
                                <Tooltip
                                    label={t("Close")}
                                    withArrow
                                    bg={`red.5`}
                                >
                                    <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
                                        formModal.setFieldValue('customer_group_name', '');
                                    }}/>
                                </Tooltip>
                                :
                                <Tooltip
                                    label={t("NameValidateMessage")}
                                    withArrow
                                    bg={`blue.5`}
                                >
                                    <IconInfoCircle size={16} opacity={0.5}/>
                                </Tooltip>
                        }
                    />
                </Tooltip>

                <Tooltip
                    label={"Status"}
                    opened={!!formModal.errors.customer_group_status}
                    px={20}
                    py={3}
                    position="top-end"
                    color="red"
                    withArrow
                    offset={2}
                    zIndex={0}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Switch
                        defaultChecked
                        labelPosition="left"
                        mt={12}
                        label={t('Status')}
                        size="md"
                        radius="sm"
                        id={"CustomerGroupStatus"}
                        {...formModal.getInputProps("customer_group_status")}
                    />
                </Tooltip>

                <Group justify="flex-end" mt="md">
                    <Button disabled={!isOnline}
                            onClick={() => {
                                if (!formModal.values.customer_group_name) {
                                    formModal.setFieldError('customer_group_name', true);
                                } else {
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
                                            setModelSubmit(true)
                                            setTimeout((e) => {
                                                setModelSubmit(false)
                                            }, 2000000)
                                        },
                                    });
                                }
                            }}
                    >
                        <LoadingOverlay
                            visible={modelSubmit}
                            zIndex={1000}
                            overlayProps={{radius: "xs", blur: 2}}
                            position="center"
                        />
                        Submit
                    </Button>
                </Group>
            </Modal>
        </>
    );
}

export default CustomerGroupModel;
