import React from "react";
import {
    Drawer, Button, Box, Grid, Flex, Text
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
import { IconSearch } from "@tabler/icons-react";
import __ProductionSettingFilterForm from "../production/settings/__ProductionSettingFilterForm.jsx";

function FilterModel(props) {
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight; //TabList height 104

    const dispatch = useDispatch();

    const closeModel = () => {
        props.setFilterModel(false)
    }

    return (

        <Drawer opened={props.filterModel} position="right" onClose={closeModel} title={t('FilterData')}>
            <Box mb={0} bg={'white'} h={height}>

                <Box p={'md'} mb={4} className="boxBackground borderRadiusAll" h={height - 44}>

                    {props.module === 'customer' && <CustomerFilterForm module={props.module} />}
                    {props.module === 'category-group' && <CategoryGroupFilterForm module={props.module} />}
                    {props.module === 'vendor' && <VendorFilterForm module={props.module} />}
                    {props.module === 'user' && <UserFilterForm module={props.module} />}
                    {props.module === 'product' && <ProductFilterForm module={props.module} />}
                    {props.module === 'category' && <CategoryFilterForm module={props.module} />}
                    {props.module === 'production-setting' && <__ProductionSettingFilterForm module={props.module} />}
                </Box>
                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                    <Grid columns={4} gutter={0}>
                        <Grid.Col span={1}>

                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Button
                                id={'submit'}
                                p={'absolute'}
                                right
                                variant="filled"
                                w={'100%'}
                                size="sm"
                                color="green.8"
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
                        </Grid.Col>
                        <Grid.Col span={1}>

                        </Grid.Col>
                    </Grid>
                </Box>
            </Box>
        </Drawer>
    );
}

export default FilterModel;
