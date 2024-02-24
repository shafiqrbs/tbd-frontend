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
import {
    getLocationDropdown,
} from "../../../../store/core/utilitySlice";
import PasswordInput from "../../../form-builders/PasswordInputForm";
import PasswordInputForm from "../../../form-builders/PasswordInputForm";
function UserForm(props) {
    const {form} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 104
    const locationDropdownData = useSelector((state) => state.customerSlice.locationDropdownData)
    let locationDropdown = locationDropdownData && locationDropdownData.length > 0 ?locationDropdownData.map((type, index) => {return ({'label': type.name, 'value': String(type.id)})}):[]
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
                id = {'Name'}
                nextField = {'UserName'}
                mt={0}
            />

            <InputForm
                form = {form}
                tooltip={t('UserNameValidateMessage')}
                label={t('UserName')}
                placeholder={t('UserName')}
                required = {true}
                name = {'username'}
                id = {'UserName'}
                nextField = {'Email'}
                mt={8}
            />

            <InputForm
                form = {form}
                tooltip={t('RequiredAndInvalidEmail')}
                label={t('Email')}
                placeholder={t('Email')}
                required = {true}
                name = {'email'}
                id = {'Email'}
                nextField = {'Password'}
                mt={8}
            />

            {/*<InputForm
                form = {form}
                tooltip={t('Mobile')}
                label={t('Mobile')}
                placeholder={t('Mobile')}
                required = {true}
                name = {'mobile'}
                id = {'Mobile'}
                nextField = {'Mobile'}
                mt={8}
            />*/}

            <PasswordInputForm
                form = {form}
                tooltip={t('RequiredPassword')}
                label={t('Password')}
                placeholder={t('Password')}
                required = {true}
                name = {'password'}
                id = {'Password'}
                nextField = {'ConfirmPassword'}
                mt={8}
            />


            <PasswordInputForm
                form = {form}
                tooltip={t('ConfirmPassword')}
                label={t('ConfirmPassword')}
                placeholder={t('ConfirmPassword')}
                required = {true}
                name = {'confirm_password'}
                id = {'ConfirmPassword'}
                nextField = {'ConfirmPassword'}
                mt={8}
            />

        </Box>
        </ScrollArea>
    );
}

export default UserForm;
