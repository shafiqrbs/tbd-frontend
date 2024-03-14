import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button, Group, Text, ScrollArea, Modal, rem,
} from "@mantine/core";
import {useTranslation} from "react-i18next";

import {
    IconCheck, IconXboxX
} from "@tabler/icons-react";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import {modals} from "@mantine/modals";
import {hasLength, useForm} from "@mantine/form";
import InputForm from "../../../form-builders/InputForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    storeEntityData,
    setEntityNewData,
    setDropdownLoad
} from "../../../../store/inventory/crudSlice.js";
import {notifications} from "@mantine/notifications";

function CustomerGroupModel(props) {
    const {openedModel, open, close} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();

    const [modelSubmit, setModelSubmit] = useState(false)
    const validationMessage = useSelector((state) => state.inventoryCrudSlice.validationMessage)
    const validation = useSelector((state) => state.inventoryCrudSlice.validation)
    const entityNewData = useSelector((state) => state.inventoryCrudSlice.entityNewData)

    const formModal = useForm({
        initialValues: {
            name: '', status: true
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
            status: hasLength({min: 11, max: 11}),
        },
    });

    useEffect(() => {
        if (validation) {
            validationMessage.name && (formModal.setFieldError('name', true));
            dispatch(setValidationData(false))
        }

        if (entityNewData.message ==='success'){
            notifications.show({
                color: 'teal',
                title: t('CreateSuccessfully'),
                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                loading: false,
                autoClose: 700,
                style: {backgroundColor: 'lightgray'},
            });

            setTimeout(() => {
                formModal.reset()
                dispatch(setEntityNewData([]))
                close(false)
                dispatch(setDropdownLoad(true))
            }, 700)
        }
    }, [validation,validationMessage,formModal]);

    return (
        <>
            <Modal
                opened={openedModel}
                onClose={close}
                title={t('CategoryGroupModel')}
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

                <InputForm
                    tooltip={t('CategoryGroupValidateMessage')}
                    label={t('CategoryGroup')}
                    placeholder={t('CategoryGroup')}
                    required={true}
                    nextField={'category_group_status'}
                    form={formModal}
                    name={'name'}
                    mt={8}
                    id={'category_group'}
                />

                <SwitchForm
                    tooltip={t('Status')}
                    label={t('Status')}
                    nextField={'status'}
                    name={'status'}
                    form={formModal}
                    mt={12}
                    id={'category_group_status'}
                    position={'left'}
                    defaultChecked={1}
                />

                <Group justify="flex-end" mt="md">
                    <Button disabled={!isOnline || modelSubmit}
                            onClick={() => {

                                if (!formModal.values.name) {
                                    formModal.setFieldError('name', true);
                                    return;
                                }

                                modals.openConfirmModal({
                                    title: t('CategoryGroupFormSubmitConfirm'),
                                    children: (<Text size="sm">{t('CategoryGroupFormSubmitConfirmDetails')}</Text>),
                                    labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                    onCancel: () => console.log('Cancel'),
                                    onConfirm: () => {
                                        setModelSubmit(true)
                                        const value = {
                                            url : 'inventory/category-group',
                                            data : formModal.values
                                        }
                                        dispatch(storeEntityData(value))
                                        setTimeout((e) => {
                                            setModelSubmit(false)
                                        }, 1500)
                                    },
                                });
                            }}
                    >
                        Submit
                    </Button>
                </Group>
            </Modal>
        </>
    );
}

export default CustomerGroupModel;
