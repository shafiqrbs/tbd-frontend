import React from "react";
import {
    rem, Modal, List, ThemeIcon,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck
} from "@tabler/icons-react";

import {useSelector} from "react-redux";

function CustomerViewModel(props) {
    const {t, i18n} = useTranslation();
    const showEntityData = useSelector((state) => state.crudSlice.showEntityData)

    const closeModel = () => {
        props.setCustomerViewModel(false)
    }

    return (
        <Modal opened={props.customerViewModel} onClose={closeModel} title={t('CustomerDetailsData')} size="55%" top>
                <List
                    spacing="xs"
                    size="sm"
                    center
                    icon={
                        <ThemeIcon color="teal" size={24} radius="xl">
                            <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
                        </ThemeIcon>
                    }
                >
                    <List.Item>{t('CustomerId')} : {showEntityData && showEntityData.customerId && showEntityData.customerId}</List.Item>
                    <List.Item>{t('Name')} : {showEntityData && showEntityData.name && showEntityData.name}</List.Item>
                    <List.Item>{t('Mobile')} : {showEntityData && showEntityData.mobile && showEntityData.mobile}</List.Item>
                    <List.Item>{t('AlternativeMobile')} : {showEntityData && showEntityData.alternative_mobile && showEntityData.alternative_mobile}</List.Item>
                    <List.Item>{t('Email')} : {showEntityData && showEntityData.email && showEntityData.email}</List.Item>
                    <List.Item>{t('ReferenceId')} : {showEntityData && showEntityData.reference_id && showEntityData.reference_id}</List.Item>
                    <List.Item>{t('Created')} : {showEntityData && showEntityData.created && showEntityData.created}</List.Item>
                </List>
        </Modal>

    );
}

export default CustomerViewModel;
