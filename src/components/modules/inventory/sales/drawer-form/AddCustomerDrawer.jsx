import React, {useState, useEffect} from "react";
import {useOutletContext} from "react-router-dom";
import {ActionIcon, Box, ScrollArea, Drawer, Text, Flex} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconX} from "@tabler/icons-react";
import AddCustomerDrawerForm from "./AddCustomerDrawerForm";
import _AddCustomerFormPos from "./_AddCustomerFormPos";
import getLocationDropdownData from "../../../../global-hook/dropdown/getLocationDropdownData";
import getCoreSettingCustomerGroupDropdownData
    from "../../../../global-hook/dropdown/getCoreSettingCustomerGroupDropdownData";

function AddCustomerDrawer(props) {
    const {
        customerDrawer,
        setCustomerDrawer,
        setRefreshCustomerDropdown,
        focusField,
        fieldPrefix,
        setCustomerId,
        customersDropdownData,
        customerId,
        customerObject,
        setCustomerObject,
        enableTable,
        tableId,
        updateTableCustomer,
        clearTableCustomer,
        setReloadInvoiceData
    } = props;
    const {isOnline, mainAreaHeight} = useOutletContext();
    const {t, i18n} = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeModel = () => {
        setCustomerDrawer(false);
    };
    const locationDropdown = getLocationDropdownData();
    const customerGroupDropdownData = getCoreSettingCustomerGroupDropdownData();


    return (
        <>
            <Drawer.Root
                opened={customerDrawer}
                position="right"
                onClose={closeModel}
                size={"30%"}
            >
                <Drawer.Overlay/>
                <Drawer.Content>
                    <ScrollArea
                        h={height + 100}
                        scrollbarSize={2}
                        type="never"
                        bg={"gray.1"}
                    >
                        <Flex
                            mih={40}
                            gap="md"
                            justify="flex-end"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <ActionIcon
                                mr={"sm"}
                                radius="xl"
                                color='var( --theme-remove-color)'
                                size="md"
                                onClick={closeModel}
                            >
                                <IconX style={{width: "100%", height: "100%"}} stroke={1.5}/>
                            </ActionIcon>
                        </Flex>
                        {customersDropdownData ? (
                            <>
                                <Box ml={2} mr={2} mb={0}>
                                    <_AddCustomerFormPos
                                        customerObject={customerObject}
                                        locationDropdown={locationDropdown}
                                        customerGroupDropdownData={customerGroupDropdownData}
                                        setCustomerDrawer={setCustomerDrawer}
                                        setRefreshCustomerDropdown={setRefreshCustomerDropdown}
                                        focusField={focusField}
                                        fieldPrefix={fieldPrefix}
                                        customersDropdownData={customersDropdownData}
                                        setCustomerId={setCustomerId}
                                        customerId={customerId}
                                        setCustomerObject={setCustomerObject}
                                        enableTable={enableTable}
                                        tableId={tableId}
                                        updateTableCustomer={updateTableCustomer}
                                        clearTableCustomer={clearTableCustomer}
                                        setReloadInvoiceData={setReloadInvoiceData}
                                    />
                                </Box>
                            </>
                        ) : (
                            <Box ml={2} mr={2} mb={0}>
                                <AddCustomerDrawerForm
                                    setCustomerDrawer={setCustomerDrawer}
                                    setRefreshCustomerDropdown={setRefreshCustomerDropdown}
                                    focusField={focusField}
                                    fieldPrefix={fieldPrefix}
                                    locationDropdown={locationDropdown}
                                    customerGroupDropdownData={customerGroupDropdownData}
                                />
                            </Box>
                        )}
                    </ScrollArea>
                </Drawer.Content>
            </Drawer.Root>
        </>
    );
}

export default AddCustomerDrawer;
