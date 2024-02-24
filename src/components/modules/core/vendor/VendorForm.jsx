import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Tooltip, TextInput, Switch, Group, Text, LoadingOverlay, Modal,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {IconInfoCircle, IconPlus, IconX, IconXboxX} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure} from "@mantine/hooks";
import axios from "axios";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import {useDispatch, useSelector} from "react-redux";
import {getCustomerDropdown} from "../../../../store/core/utilitySlice";
function VendorForm(props) {
    const {form} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 104

    const customerDropdownData = useSelector((state) => state.utilitySlice.customerDropdownData)
    // console.log(customerDropdownData)
    let customerDropdown = customerDropdownData && customerDropdownData.length > 0 ? customerDropdownData.map((type, index) => {return ({'label': type.name, 'value': String(type.id)})}):[]
    useEffect(() => {
        dispatch(getCustomerDropdown('core/select/customer'))
    }, []);


    return (
        <ScrollArea h={height}  scrollbarSize={2}>
        <Box p={`md`}>
            <InputForm
                form = {form}
                tooltip={t('CompanyNameValidateMessage')}
                label={t('CompanyName')}
                placeholder={t('CompanyName')}
                required = {true}
                name = {'company_name'}
                id = {'VendorName'}
                nextField = {'VendorName'}
                mt={0}
            />

            <InputForm
                form = {form}
                tooltip={t('VendorName')}
                label={t('VendorName')}
                placeholder={t('VendorName')}
                required = {false}
                name = {'vendor_name'}
                id = {'VendorName'}
                nextField = {'Mobile'}
                mt={8}
            />

            <InputForm
                form = {form}
                tooltip={t('Mobile')}
                label={t('Mobile')}
                placeholder={t('Mobile')}
                required = {false}
                name = {'mobile'}
                id = {'Mobile'}
                nextField = {'TPPercent'}
                mt={8}
            />

            <InputForm
                form = {form}
                tooltip={t('TPPercent')}
                label={t('TPPercent')}
                placeholder={t('TPPercent')}
                required = {false}
                name = {'tp_percent'}
                id = {'TPPercent'}
                nextField = {'Email'}
                mt={8}
            />

            <InputForm
                tooltip={t('InvalidEmail')}
                label={t('Email')}
                placeholder={t('Email')}
                required = {false}
                nextField = {'Customer'}
                name = {'email'}
                form = {form}
                mt={8}
                id = {'Email'}
            />

            <SelectForm
                tooltip={t('Customer')}
                label={t('Customer')}
                placeholder={t('ChooseCustomer')}
                required = {false}
                nextField = {'Address'}
                name = {'customer_id'}
                form = {form}
                // dropdownValue={customerDropdown}
                dropdownValue={['Customer1','Customer2']}
                mt={8}
                id = {'Customer'}
                searchable={false}
            />

            <TextAreaForm
                tooltip={t('Address')}
                label={t('Address')}
                placeholder={t('Address')}
                required = {false}
                nextField = {'Status'}
                name = {'address'}
                form = {form}
                mt={8}
                id = {'Address'}
            />
        </Box>
        </ScrollArea>
    );
}

export default VendorForm;
