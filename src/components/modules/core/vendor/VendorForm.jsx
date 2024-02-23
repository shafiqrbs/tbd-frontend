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
import { getLocationDropdown } from "../../../../store/core/utilitySlice.js";
function VendorForm(props) {
    const {form} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 104

    const locationDropdownData = useSelector((state) => state.utilitySlice.locationDropdownData)
    let locationDropdown = locationDropdownData && locationDropdownData.length > 0 ? locationDropdownData.map((type, index) => {return ({'label': type.name, 'value': String(type.id)})}):[]
    useEffect(() => {
        dispatch(getLocationDropdown('location'))
    }, []);


    return (
        <ScrollArea h={height}  scrollbarSize={2}>
        <Box p={`md`}>
            <InputForm
                form = {form}
                tooltip={t('NameValidateMessage')}
                label={t('Name')}
                placeholder={t('Name')}
                required = {true}
                name = {'name'}
                id = {'name'}
                nextField = {'username'}
                mt={0}
            />

            <InputForm
                form = {form}
                tooltip={t('UserName')}
                label={t('UserName')}
                placeholder={t('UserName')}
                required = {false}
                name = {'username'}
                id = {'username'}
                nextField = {'email'}
                mt={8}
            />

            <InputForm
                form = {form}
                tooltip={t('InvalidEmail')}
                label={t('Email')}
                placeholder={t('Email')}
                required = {false}
                name = {'email'}
                id = {'email'}
                nextField = {'mobile'}
                mt={8}
            />

            <InputForm
                form = {form}
                tooltip={t('Mobile')}
                label={t('Mobile')}
                placeholder={t('Mobile')}
                required = {false}
                name = {'mobile'}
                id = {'mobile'}
                nextField = {'mobile'}
                mt={8}
            />

            <InputForm
                form = {form}
                tooltip={t('Designation')}
                label={t('Designation')}
                placeholder={t('Designation')}
                required = {false}
                name = {'designation'}
                id = {'designation'}
                nextField = {'designation'}
                mt={8}
            />

            <SelectForm
                tooltip={t('Location')}
                label={t('Location')}
                placeholder={t('ChooseLocation')}
                required = {false}
                nextField = {'MarketingExecutive'}
                name = {'location_id'}
                form = {form}
                dropdownValue={locationDropdown}
                mt={8}
                id = {'Location'}
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

            <SwitchForm
                tooltip={t('Status')}
                label={t('Status')}
                required = {false}
                nextField = {'Address'}
                name = {'status'}
                form = {form}
                mt={12}
                id = {'Status'}
                position={'left'}
                defaultChecked={false}
            />
        </Box>
        </ScrollArea>
    );
}

export default VendorForm;
