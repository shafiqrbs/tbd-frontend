import React from "react";
import { useOutletContext } from "react-router-dom";
import {
    ActionIcon, Box, ScrollArea, Drawer,
    Text,
    Flex
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import {
    IconX,

} from "@tabler/icons-react";
import AddVendorDrawerForm from "./AddVendorDrawerForm";

function AddVendorDrawer(props) {
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
                        <Flex
                            mih={40}
                            gap="md"
                            justify="flex-end"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <ActionIcon
                                mr={'sm'}
                                radius="xl"
                                color='var( --theme-remove-color)'  size="md"
                                onClick={closeModel}
                            >
                                <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                            </ActionIcon>
                        </Flex>
                        <Box ml={2} mr={2} mb={0}>
                            <AddVendorDrawerForm
                                setRefreshVendorDropdown={setRefreshVendorDropdown}
                                focusField={focusField}
                                fieldPrefix={fieldPrefix}
                                setVendorDrawer={setVendorDrawer}
                            />
                        </Box>
                    </ScrollArea>
                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default AddVendorDrawer;
