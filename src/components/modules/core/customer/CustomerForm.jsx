import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    Tabs,
    rem,
    Text,
    Tooltip,
    Flex,
    LoadingOverlay, TextInput, Grid, Select, Textarea, Switch, Box,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck,
    IconList,
    IconReload,
    IconDashboard,
    IconDeviceFloppy,
    IconX, IconInfoCircle, IconPlus,
} from "@tabler/icons-react";
import CustomerView from "./CustomerView";
import {hasLength, isEmail, useForm} from "@mantine/form";
import {modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';
import CustomerTable from "./CustomerTable";
import CustomerSales from "./CustomerView";
import CustomerLedger from "./CustomerLedger";
import CustomerInvoice from "./CustomerInvoice";
import {getHotkeyHandler, useDisclosure} from "@mantine/hooks";
import CustomerGroupModel from "./CustomerGroupModal";
import axios from "axios";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";

function CustomerForm(props) {
    const {isFormSubmit, setFormSubmit, setFormSubmitData, form} = props

    const {t, i18n} = useTranslation();
    const iconStyle = {width: rem(12), height: rem(12)};
    const [activeTab, setActiveTab] = useState("CustomerView");
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    // const [isFormSubmit, setFormSubmit] = useState(false);
    // const [formSubmitData, setFormSubmitData] = useState([]);
    const {isOnline, mainAreaHeight} = useOutletContext();

    /*const form = useForm({
        initialValues: {
            location:'', marketing_executive:'', name:'', mobile:'', customer_group:'', credit_limit:'', old_reference_no:'', alternative_mobile:'', address:'', email:'', status:''
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
            mobile: hasLength({min: 11, max: 11}),

        },
    });*/
    const [searchValue, setSearchValue] = useState('');
    const [dropdownValue, setDropdownValue] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (searchValue.length>1) {
            axios({
                method: "get",
                url: "https://jsonplaceholder.typicode.com/posts",
                params: {
                    "value": searchValue
                }
            })
                .then(function (res) {
                    setDropdownValue(res.data.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [searchValue]);
    let testDropdown = dropdownValue && dropdownValue.length > 0 ?dropdownValue.map((type, index) => {return ({'label': type.full_name, 'value': type.id})}):[]

    return (
        <Box p={`md`}>

            <InputForm
                tooltip={t('NameValidateMessage')}
                label={t('Name')}
                placeholder={t('CustomerName')}
                required = {true}
                nextField = {'CreditLimit'}
                name = {'name'}
                form = {form}
                mt={0}
                id = {'Name'}
                // value={'ok'}
            />



            {/*<Grid gutter={{ base:6}}>
                <Grid.Col span={10}>
                    <Select
                        searchable
                        searchValue={searchValue}
                        onSearchChange={(e)=>{
                            setSearchValue(e)
                        }}
                        id="CustomerGroup"
                        label={t('CustomerGroup')}
                        size="sm"
                        mt={8}
                        mr={0}
                        data={testDropdown}
                        placeholder={t('ChooseCustomerGroup')}
                        clearable
                        {...form.getInputProps("customer_group")}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                document.getElementById('CreditLimit').focus();
                            }],
                        ])}
                    />
                </Grid.Col>
                <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'} onClick={open}><IconPlus size={16} opacity={0.5}/></Button></Grid.Col>
            </Grid>*/}

            {/*<Select
                searchable
                searchValue={searchValue}
                onSearchChange={(e)=>{
                    setSearchValue(e)
                }}
                id="CustomerGroup"
                label={t('CustomerGroup')}
                size="sm"
                mt={8}
                data={testDropdown}
                placeholder={t('ChooseCustomerGroup')}
                clearable
                {...form.getInputProps("customer_group")}
                onKeyDown={getHotkeyHandler([
                    ['Enter', (e) => {
                        document.getElementById('CreditLimit').focus();
                    }],
                ])}
            />*/}

            {/*{opened &&
            <CustomerGroupModel openedModel={opened} open={open} close={close}  />
            }*/}


            {/*</Tooltip>*/}

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
                tooltip={t('Email')}
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
                value={'Vue'}
            />


            <SelectForm
                tooltip={t('MarketingExecutive')}
                label={t('MarketingExecutive')}
                placeholder={t('ChooseMarketingExecutive')}
                required = {false}
                nextField = {'Address'}
                name = {'location'}
                form = {form}
                dropdownValue={["React", "Angular", "Vue", "Svelte"]}
                mt={8}
                id = {'MarketingExecutive'}
                searchable={true}
                value={'Angular'}
            />


            <TextAreaForm
                tooltip={t('Address')}
                label={t('Address')}
                placeholder={t('Address')}
                required = {false}
                nextField = {'Location'}
                name = {'address'}
                form = {form}
                mt={8}
                id = {'Address'}
            />

            {/*<Tooltip
                label={"Status"}
                opened={!!form.errors.select}
                px={20}
                py={3}
                position="top-end"
                color="red"
                withArrow
                offset={2}
                zIndex={0}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Switch
                    defaultChecked
                    mt={12}
                    label={t('Status')}
                    size="md"
                    radius="sm"
                    id={"Status"}
                    {...form.getInputProps("status")}
                />
            </Tooltip>*/}
        </Box>
    );
}

export default CustomerForm;
