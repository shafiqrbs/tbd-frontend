import React from "react";
import {
    Drawer, Button, Box, Grid, Flex, Text,
    ScrollArea,
    ActionIcon,
    Group
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { setFetching } from "../../../store/core/crudSlice.js";
import { useDispatch } from "react-redux";
import CustomerFilterForm from "../core/customer/CustomerFilterForm.jsx";
import VendorFilterForm from "../core/vendor/VendorFilterForm.jsx";
import UserFilterForm from "../core/user/UserFilterForm.jsx";
import ProductFilterForm from "../inventory/product/ProductFilterForm.jsx";
import CategoryGroupFilterForm from "../inventory/category-group/CategoryGroupFilterForm.jsx";
import CategoryFilterForm from "../inventory/category/CategoryFilterForm.jsx";
import { useOutletContext } from "react-router-dom";
import { IconSearch, IconX } from "@tabler/icons-react";
import __ProductionSettingFilterForm from "../production/settings/__ProductionSettingFilterForm.jsx";
import WarehouseFilterForm from "../core/warehouse/WarehouseFilterForm.jsx";

function FilterModel(props) {
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight; //TabList height 104

    const dispatch = useDispatch();

    const closeModel = () => {
        props.setFilterModel(false)
    }

    return (

        <Drawer.Root opened={props.filterModel} position="right" onClose={closeModel} size={'30%'}  >
            <Drawer.Overlay />
            <Drawer.Content>
                <ScrollArea h={height + 100} scrollbarSize={2} type="never" bg={'gray.1'} >
                    <Group mih={40}  justify="space-between">
                        <Box >
                            <Text fw={'600'} fz={'16'} ml={'md'}>
                                {t('FilterData')}
                            </Text>
                        </Box>
                        <ActionIcon
                            mr={'sm'}
                            radius="xl"
                            color="red.6" size="md"
                            onClick={closeModel}
                        >
                            <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                        </ActionIcon>
                    </Group>

                    <Box ml={2} mr={2} mt={0} p={'xs'} className="borderRadiusAll" bg={'white'}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} h={height - 37}>
                            {props.module === 'customer' && <CustomerFilterForm module={props.module} />}
                            {props.module === 'warehouse' && <WarehouseFilterForm module={props.module} />}
                            {props.module === 'category-group' && <CategoryGroupFilterForm module={props.module} />}
                            {props.module === 'vendor' && <VendorFilterForm module={props.module} />}
                            {props.module === 'user' && <UserFilterForm module={props.module} />}
                            {props.module === 'product' && <ProductFilterForm module={props.module} />}
                            {props.module === 'category' && <CategoryFilterForm module={props.module} />}
                            {props.module === 'production-setting' && <__ProductionSettingFilterForm module={props.module} />}
                        </Box>
                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'2'} mt={4} className={'boxBackground borderRadiusAll'}>
                            <Group justify="flex-end">
                                <Button
                                    size="xs"
                                    color={`green.8`}
                                    type="submit"
                                    id={'submit'}
                                    w={142}
                                    onClick={() => {
                                        dispatch(setFetching(true))
                                        closeModel()
                                    }}
                                    leftSection={<IconSearch size={16} />}
                                >
                                    <Flex direction={`column`} gap={0}>
                                        <Text fz={14} fw={400}>
                                            {t("Submit")}
                                        </Text>
                                    </Flex>
                                </Button>
                            </Group>
                        </Box>
                    </Box>

                </ScrollArea>
            </Drawer.Content>
        </Drawer.Root >


    );
}

export default FilterModel;


