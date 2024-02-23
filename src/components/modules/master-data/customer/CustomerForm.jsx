import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Tooltip, TextInput, Switch, Group, Text, LoadingOverlay, Modal,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {IconInfoCircle, IconPlus, IconX, IconXboxX} from "@tabler/icons-react";
import CustomerView from "./CustomerView";
import {getHotkeyHandler, useDisclosure} from "@mantine/hooks";
import CustomerGroupModel from "./CustomerGroupModal";
import axios from "axios";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import {useDispatch, useSelector} from "react-redux";
import {
    getMarketingExecutiveDropdown,
    getUserDropdown
} from "../../../../store/core/customerSlice";
import {
    getExecutiveDropdown,
    getLocationDropdown,

} from "../../../../store/core/utilitySlice";
import {modals} from "@mantine/modals";


function CustomerForm(props) {
    const {form} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');
    const [dropdownValue, setDropdownValue] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [testModelOpend, setTestModelOpend] = useState(false);

    // console.log(opened,open,close)

    const userDropdownData = useSelector((state) => state.customerSlice.userDropdownData)
    const locationDropdownData = useSelector((state) => state.utilitySlice.locationDropdownData)
    const executiveDropdownData = useSelector((state) => state.utilitySlice.executiveDropdownData)
    const marketingExecutiveDropdownData = useSelector((state) => state.customerSlice.marketingExecutiveDropdownData)
    let locationDropdown = locationDropdownData && locationDropdownData.length > 0 ? locationDropdownData.map((type, index) => {return ({'label': type.name, 'value': String(type.id)})}):[]
    let executiveDropdown = executiveDropdownData && executiveDropdownData.length > 0 ? executiveDropdownData.map((type, index) => {return ({'label': type.name, 'value': String(type.id)})}):[]
    let marketingExecutiveDropdown = marketingExecutiveDropdownData && marketingExecutiveDropdownData.length > 0 ?marketingExecutiveDropdownData.map((type, index) => {return ({'label': type.name, 'value': String(type.id)})}):[]

    console.log(locationDropdown);
    useEffect(() => {
        dispatch(getLocationDropdown('location'))
        dispatch(getExecutiveDropdown('executive'))
        dispatch(getMarketingExecutiveDropdown('user'))
    }, []);

    useEffect(() => {
        if (searchValue.length>1) {
            const param = {
                "value": searchValue
            }
            const apiData = {
                'url' : 'users/keyword/search',
                'param' : param
            }
            dispatch(getUserDropdown(apiData))

        }
    }, [searchValue]);
    let testDropdown = userDropdownData && userDropdownData.length > 0 ?userDropdownData.map((type, index) => {return ({'label': type.full_name, 'value': String(type.id)})}):[]


    return (
        <Box p={`md`}>
            <Button onClick={()=>{setTestModelOpend(true)}}>Test Model</Button>

            <Modal
                opened={testModelOpend}
                onClose={(e)=>{
                    console.log(e)
                    setTestModelOpend(false)
                }}
                title={t('CustomerGroupModel')}
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                scrollAreaComponent={ScrollArea.Autosize}
                closeButtonProps={{
                    icon: <IconXboxX size={20} stroke={1.5} />,
                }}
            >
                test
            </Modal>


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
                    <SelectForm
                        tooltip={t('CustomerGroup')}
                        label={t('CustomerGroup')}
                        placeholder={t('ChooseCustomerGroup')}
                        required = {false}
                        nextField = {'CreditLimit'}
                        name = {'customer_group'}
                        form = {form}
                        dropdownValue={["Family", "Local"]}
                        mt={8}
                        id = {'CustomerGroup'}
                        searchable={false}
                    />
                    {/*<SelectServerSideForm
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
                    />*/}
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
                name = {'reference_id'}
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
                name = {'location_id'}
                form = {form}
                dropdownValue={locationDropdown}
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
                name = {'marketing_id'}
                form = {form}
                dropdownValue={executiveDropdown}
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
