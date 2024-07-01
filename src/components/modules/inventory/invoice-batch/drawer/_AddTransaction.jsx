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
    rem, SimpleGrid, Button, Drawer,
} from '@mantine/core';
import CustomerFilterForm from "../../../core/customer/CustomerFilterForm";
import CategoryGroupFilterForm from "../../category-group/CategoryGroupFilterForm";
import VendorFilterForm from "../../../core/vendor/VendorFilterForm";
import UserFilterForm from "../../../core/user/UserFilterForm";
import ProductFilterForm from "../../product/ProductFilterForm";
import CategoryFilterForm from "../../category/CategoryFilterForm";
import {setFetching} from "../../../../../store/core/crudSlice";

function _AddTransaction(props) {
    const {addTransactionDrawer,setAddTransactionDrawer} = props
    const { t, i18n } = useTranslation();


    const closeModel = () => {
        setAddTransactionDrawer(false)
    }
    return (
        <Drawer opened={addTransactionDrawer} position="right" onClose={closeModel} title={t('AddTransaction')} size={'50%'}>
            test
        </Drawer>
    );
}

export default _AddTransaction;
