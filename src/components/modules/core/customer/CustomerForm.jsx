import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import { IconPlus} from "@tabler/icons-react";
import CustomerView from "./CustomerView";
import { useDisclosure} from "@mantine/hooks";
import CustomerGroupModel from "./CustomerGroupModal";
import axios from "axios";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import {useDispatch, useSelector} from "react-redux";
import {userDropdown} from "../../../../store/core/customerSlice";
// import.meta.env as ImportMetaEnv


function CustomerForm(props) {
    const {form} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');
    const [dropdownValue, setDropdownValue] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);

    const userDropdownData = useSelector((state) => state.customerSlice.userDropdownData)

    useEffect(() => {
        if (searchValue.length>1) {
            const param = {
                "value": searchValue
            }
            const apiData = {
                'url' : 'users/keyword/search',
                'param' : param
            }
            dispatch(userDropdown(apiData))

        }
    }, [searchValue]);
    let testDropdown = userDropdownData && userDropdownData.length > 0 ?userDropdownData.map((type, index) => {return ({'label': type.full_name, 'value': String(type.id)})}):[]


    return (
        <Box p={`md`}>

            <InputForm
                tooltip={t('NameValidateMessage')}
                label={t('Name')}
                placeholder={t('CustomerName')}
                required = {true}
                nextField = {'CustomerGroup'}
                name = {'name'}
                form = {form}
                mt={0}
                id = {'Name'}
            />

            <Grid gutter={{ base:6}}>
                <Grid.Col span={10}>
                    <SelectServerSideForm
                        tooltip={t('CustomerGroup')}
                        label={t('CustomerGroup')}
                        placeholder={t('ChooseCustomerGroup')}
                        required = {false}
                        nextField = {'CreditLimit'}
                        name = {'customer_group'}
                        form = {form}
                        mt={8}
                        id = {'CustomerGroup'}
                        searchable={true}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        dropdownValue={testDropdown}
                    />
                </Grid.Col>
                <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'} onClick={open}><IconPlus size={16} opacity={0.5}/></Button></Grid.Col>
                {opened &&
                <CustomerGroupModel openedModel={opened} open={open} close={close}  />
                }
            </Grid>

            <InputForm
                tooltip={t('CreditLimit')}
                label={t('CreditLimit')}
                placeholder={t('CreditLimit')}
                required = {false}
                nextField = {'OLDReferenceNo'}
                name = {'credit_limit'}
                form = {form}
                mt={8}
                id = {'CreditLimit'}
            />

            <InputForm
                tooltip={t('OLDReferenceNo')}
                label={t('OLDReferenceNo')}
                placeholder={t('OLDReferenceNo')}
                required = {false}
                nextField = {'Mobile'}
                name = {'old_reference_no'}
                form = {form}
                mt={8}
                id = {'OLDReferenceNo'}
            />

            <InputForm
                tooltip={t('MobileValidateMessage')}
                label={t('Mobile')}
                placeholder={t('Mobile')}
                required = {true}
                nextField = {'AlternativeMobile'}
                name = {'mobile'}
                form = {form}
                mt={8}
                id = {'Mobile'}
            />

            <InputForm
                tooltip={t('AlternativeMobile')}
                label={t('AlternativeMobile')}
                placeholder={t('AlternativeMobile')}
                required = {false}
                nextField = {'Email'}
                name = {'alternative_mobile'}
                form = {form}
                mt={8}
                id = {'AlternativeMobile'}
            />

            <InputForm
                tooltip={t('InvalidEmail')}
                label={t('Email')}
                placeholder={t('Email')}
                required = {false}
                nextField = {'Location'}
                name = {'email'}
                form = {form}
                mt={8}
                id = {'Email'}
            />

            <SelectForm
                tooltip={t('Location')}
                label={t('Location')}
                placeholder={t('ChooseLocation')}
                required = {false}
                nextField = {'MarketingExecutive'}
                name = {'location'}
                form = {form}
                dropdownValue={["React", "Angular", "Vue", "Svelte"]}
                mt={8}
                id = {'Location'}
                searchable={false}
            />


            <SelectForm
                tooltip={t('MarketingExecutive')}
                label={t('MarketingExecutive')}
                placeholder={t('ChooseMarketingExecutive')}
                required = {false}
                nextField = {'Address'}
                name = {'marketing_executive'}
                form = {form}
                dropdownValue={["React", "Angular", "Vue", "Svelte"]}
                mt={8}
                id = {'MarketingExecutive'}
                searchable={true}
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
    );
}

export default CustomerForm;
