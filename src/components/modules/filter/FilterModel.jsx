import React from "react";
import {
    rem, Modal, List, ThemeIcon,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck, IconCircleDashed
} from "@tabler/icons-react";

function FilterModel(props) {
    const {t, i18n} = useTranslation();

    const closeModel = () => {
        props.setFilterModel(false)
    }

    return (
        <Modal opened={props.filterModel} onClose={closeModel} title="User View Model" size="55%" top>
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
                <List.Item>Clone or download repository from GitHub</List.Item>
                <List.Item>Install dependencies with yarn</List.Item>
                <List.Item>To start development server run npm start command</List.Item>
                <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                <List.Item
                    icon={
                        <ThemeIcon color="blue" size={24} radius="xl">
                            <IconCircleDashed style={{ width: rem(16), height: rem(16) }} />
                        </ThemeIcon>
                    }
                >
                    Submit a pull request once you are done
                </List.Item>
            </List>
        </Modal>

    );
}

export default FilterModel;
