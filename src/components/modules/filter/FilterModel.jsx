import React from "react";
import {
    Drawer, Button, Box
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
import ProductionSettingFilterForm from "../production/settings/ProductionSettingFilterForm.jsx";
import { useOutletContext } from "react-router-dom";

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
                <Box p={'md'} className="boxBackground borderRadiusAll" h={height}>

                    {props.module === 'customer' && <CustomerFilterForm module={props.module} />}
                    {props.module === 'category-group' && <CategoryGroupFilterForm module={props.module} />}
                    {props.module === 'vendor' && <VendorFilterForm module={props.module} />}
                    {props.module === 'user' && <UserFilterForm module={props.module} />}
                    {props.module === 'product' && <ProductFilterForm module={props.module} />}
                    {props.module === 'category' && <CategoryFilterForm module={props.module} />}
                    {props.module === 'production-setting' && <ProductionSettingFilterForm module={props.module} />}
                    <Button
                        id={'submit'}
                        mt={8}
                        p={'absolute'}
                        right
                        variant="filled"
                        color="green.8"
                        onClick={() => {
                            dispatch(setFetching(true))
                            closeModel()
                        }}
                    >
                        {t('Submit')}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}

export default FilterModel;
