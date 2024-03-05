import React from "react";
import {
    rem, Modal, List, ThemeIcon,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck
} from "@tabler/icons-react";

import {useDispatch, useSelector} from "react-redux";

function VendorViewModel(props) {
    const {t, i18n} = useTranslation();
    const showEntityData = useSelector((state) => state.crudSlice.showEntityData)

    // console.log(showEntityData)

    const closeModel = () => {
        props.setVendorViewModel(false)
    }

    return (
        <Modal opened={props.vendorViewModel} onClose={closeModel} title="User View Model" size="55%" centered>
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
                    <List.Item>Name : {showEntityData && showEntityData.name && showEntityData.name}</List.Item>
                    <List.Item>Company Name : {showEntityData && showEntityData.company_name && showEntityData.company_name}</List.Item>
                    <List.Item>Mobile : {showEntityData && showEntityData.mobile && showEntityData.mobile}</List.Item>
                    <List.Item>email : {showEntityData && showEntityData.email && showEntityData.email}</List.Item>
                </List>
        </Modal>

    );
}

export default VendorViewModel;
