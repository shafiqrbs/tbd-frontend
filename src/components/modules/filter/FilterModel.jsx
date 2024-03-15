import React from "react";
import {
     Drawer, Button,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {setFetching} from "../../../store/core/crudSlice.js";
import {useDispatch} from "react-redux";
import CustomerFilterForm from "../core/customer/CustomerFilterForm.jsx";
import VendorFilterForm from "../core/vendor/VendorFilterForm.jsx";
import UserFilterForm from "../core/user/UserFilterForm.jsx";
import ProductFilterForm from "../inventory/product/ProductFilterForm.jsx";

function FilterModel(props) {
    const {t, i18n} = useTranslation();

    const dispatch = useDispatch();

    const closeModel = () => {
        props.setFilterModel(false)
    }

    return (

        <Drawer opened={props.filterModel} position="right" onClose={closeModel} title={t('FilterData')}>
            {props.module === 'customer' && <CustomerFilterForm module={props.module}/> }
            {props.module === 'vendor' && <VendorFilterForm module={props.module}/> }
            {props.module === 'user' && <UserFilterForm module={props.module}/> }
            {props.module === 'product' && <ProductFilterForm module={props.module}/> }
            <Button
                id={'submit'}
                mt={8}
                p={'absolute'}
                right
                variant="filled"
                onClick={() => {
                    dispatch(setFetching(true))
                    closeModel()
                }}
            >
                Submit
            </Button>
        </Drawer>
    );
}

export default FilterModel;
