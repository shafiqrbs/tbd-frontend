import React from "react";
import { useOutletContext } from "react-router-dom";
import {
    ActionIcon, Box, ScrollArea, Drawer
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import {
    IconX,

} from "@tabler/icons-react";
import AddVendorDrawerForm from "./AddVendorDrawerForm";

function AddVendorDrawer(props) {
    // const configData = localStorage.getItem('config-data');

    const { vendorDrawer, setRefreshVendorDropdown, focusField, fieldPrefix, setVendorDrawer } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeModel = () => {
        setVendorDrawer(false)
    }



    return (
        <>
            <Drawer.Root opened={vendorDrawer} position="right" onClose={closeModel} size={'30%'}  >
                <Drawer.Overlay />
                <Drawer.Content>
                    <ScrollArea h={height + 100} scrollbarSize={2} type="never" bg={'gray.1'}>
                        <Drawer.Header>
                            <Drawer.Title>{t('InstantVendorCreate')}</Drawer.Title>
                            <ActionIcon
                                className="ActionIconCustom"
                                radius="xl"
                                color="red.6" size="lg"
                                onClick={closeModel}
                            >
                                <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>
                        </Drawer.Header>
                        <Box ml={2} mr={2} mb={0}>
                            <AddVendorDrawerForm setRefreshVendorDropdown={setRefreshVendorDropdown} focusField={focusField} fieldPrefix={fieldPrefix} setVendorDrawer={setVendorDrawer} />
                        </Box>
                    </ScrollArea>
                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default AddVendorDrawer;
