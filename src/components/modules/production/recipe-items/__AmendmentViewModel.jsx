import React from "react";
import { useTranslation } from 'react-i18next';

import { IconBookmark, IconHeart, IconShare } from '@tabler/icons-react';
import {
    Modal,
    Card,
    Image,
    Text,
    ActionIcon,
    Badge,
    Group,
    Center,
    Avatar,
    useMantineTheme,
    rem, SimpleGrid,
} from '@mantine/core';

function __AmendmentViewModel(props) {
    const {amendmentViewId,amendmentViewModal,setAmendmentViewModal,setAmendmentViewId} = props
    const { t, i18n } = useTranslation();

    const handelModal = () => {
        setAmendmentViewModal(!amendmentViewModal)
    }

    const linkProps = { href: 'https://mantine.dev', target: '_blank', rel: 'noopener noreferrer' };
    const theme = useMantineTheme();

    const card = (
        <Card withBorder radius="md" >

        </Card>
    )
    return (
        <>
            <Modal size={"100%"} opened={amendmentViewModal} onClose={handelModal} title={t('AmendmentHistory')} centered>
                <SimpleGrid cols={3}>
                    <div>{card}</div>
                    <div>{card}</div>
                    <div>{card}</div>
                </SimpleGrid>

            </Modal>
        </>
    );
}

export default __AmendmentViewModel;
