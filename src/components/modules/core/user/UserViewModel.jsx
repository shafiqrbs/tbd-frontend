import React from "react";
import {
    rem, Modal, List, ThemeIcon,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck
} from "@tabler/icons-react";

import {useDispatch, useSelector} from "react-redux";

function UserViewModel(props) {
    const {t, i18n} = useTranslation();
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)

    const closeModel = () => {
        props.setUserViewModel(false)
    }

    return (
        <Modal opened={props.userViewModel} onClose={closeModel} title="User View Model" size="55%" centered>
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
                    <List.Item>Name : {entityEditData && entityEditData.name && entityEditData.name}</List.Item>
                    <List.Item>User Name : {entityEditData && entityEditData.username && entityEditData.username}</List.Item>
                    <List.Item>Mobile : {entityEditData && entityEditData.mobile && entityEditData.mobile}</List.Item>
                    <List.Item>email : {entityEditData && entityEditData.email && entityEditData.email}</List.Item>
                </List>
        </Modal>

    );
}

export default UserViewModel;
