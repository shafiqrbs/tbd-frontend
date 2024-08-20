import React, { useEffect } from "react";
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
import ProductCategoryDrawerForm from "./ProductCategoryDrawerForm";
import { getGroupCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";
import { useSelector, useDispatch } from "react-redux";


function ProductCategoryDrawer(props) {
    // const configData = localStorage.getItem('config-data');
    const dispatch = useDispatch()

    const { groupDrawer, setGroupDrawer, saveId } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeModel = () => {
        setGroupDrawer(false)
    }
    const groupCategoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.groupCategoryDropdown)
    let groupCategoryDropdown = groupCategoryDropdownData && groupCategoryDropdownData.length > 0 ?
        groupCategoryDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'inventory/select/group-category',
        }
        dispatch(getGroupCategoryDropdown(value))
    }, []);


    return (
        <>
            <Drawer.Root opened={groupDrawer} position="right" onClose={closeModel} size={'30%'}  >
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
                                color="red.6" size="md"
                                onClick={closeModel}
                            >
                                <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                            </ActionIcon>
                        </Flex>
                        <Box ml={2} mr={2} mb={0}>
                            <ProductCategoryDrawerForm groupCategoryDropdown={groupCategoryDropdown} setGroupDrawer={setGroupDrawer} saveId={saveId} />
                        </Box>
                    </ScrollArea>
                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default ProductCategoryDrawer;
