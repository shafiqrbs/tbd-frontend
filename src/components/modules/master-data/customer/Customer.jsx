import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    rem,
    Text,
    Tooltip,
    Box,
    ScrollArea,
    Title,
    TextInput, SimpleGrid, List, ColorInput, Select, ThemeIcon, Switch, Textarea, Modal, Grid,
} from "@mantine/core";
import {useTranslation} from "react-i18next";

import {
    IconCircleCheck,
    IconFilter, IconEyeSearch,
    IconUserCircle, IconInfoCircle, IconList, IconPlus, IconEyeClosed, IconX, IconXboxX
} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useViewportSize} from "@mantine/hooks";

import axios from "axios";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine component features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import {useMemo} from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import {hasLength, useForm} from "@mantine/form";
import CustomerGroupModel from "./CustomerGroupModal";

function Customer(props) {
    const {isFormSubmit, setFormSubmit, setFormSubmitData, form} = props
    const iconStyle = {width: rem(12), height: rem(12)};


    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 90; //TabList height 36
    const [fetching, setFetching] = useState(true)
    const [data, setRecords] = useState([]);

    const [searchValue, setSearchValue] = useState('');
    const [dropdownValue, setDropdownValue] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);

    // let testDropdown = []
    // console.log(dropdownValue)

    useEffect(() => {
        if (searchValue.length>1) {
            axios({
                method: "get",
                url: "http://www.npms.local/api/users/keyword/search",
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

    useEffect(() => {
        axios({
            method: "get",
            url: "https://jsonplaceholder.typicode.com/users",
        })
            .then(function (res) {
                setRecords(res.data);
                setFetching(false)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name', //access nested data with dot notation
                header: ' Name',
            },
            {
                accessorKey: 'username',
                header: 'User Name',
            },
            {
                accessorKey: 'email', //normal accessorKey
                header: 'Email',
            },
            {
                accessorKey: 'phone',
                header: 'Phone',
            },
            {
                accessorKey: 'website',
                header: 'Website',
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data,
    });

    const searchForDropdownValue = ()=>{
        console.log(searchValue)
    }


    const formModal = useForm({
        initialValues: {
             customer_group_name:'', customer_group_status:''
        },
        validate: {
            customer_group_name: hasLength({min: 2, max: 20}),
            customer_group_status: hasLength({min: 11, max: 11}),

        },
    });

    return (
        <>
            <Box>
                <SimpleGrid cols={3}>
                    <div>
                        <Box p={`md`}>
                            <Group right={0} gap={0}>
                                <TextInput
                                    leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                    rightSection={
                                        <Tooltip
                                            label={t("this_filed_is_required")}
                                            withArrow
                                            bg={`blue.5`}
                                        >
                                            <IconInfoCircle size={16} opacity={0.5}/>
                                        </Tooltip>
                                    }
                                    size="sm"
                                    placeholder={t('EnterSearchAnyKeyword')}
                                />

                                <Tooltip
                                    label={t('ClickHereForListOfRows')}
                                    px={20}
                                    py={3}
                                    color={`blue.3`}
                                    withArrow
                                    position={"bottom"}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <Button size="sm" color={`blue.5`} variant="light" ml={4} mr={2}>
                                        <IconEyeSearch size={18}/>
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    label={t("ClickHereForFilterWithAdvanceSearch")}
                                    px={20}
                                    py={3}
                                    color={`green.3`}
                                    withArrow
                                    position={"bottom"}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <Button size="sm" variant="light" color={`green.5`}>
                                        <IconFilter size={18}/>
                                    </Button>
                                </Tooltip>
                            </Group>
                        </Box>


                        <Box h={1} bg={`gray.1`}></Box>

                        <ScrollArea style={{height: '500px'}}>
                            {
                                (data && data.length > 0) &&
                                <MantineReactTable table={table}/>

                            }
                        </ScrollArea>
                    </div>
                    <div bg={`rose.5`} className="view-gird">
                        <Box p={`xs`}>
                            <Title order={4}>Details Data</Title>
                            <Text fz={`sm`}>We'll always let you know about important changes</Text>
                        </Box>
                        <Box h={1} bg={`gray.1`}></Box>

                        <ScrollArea h={height} scrollbarSize={2}>
                            <List
                                px={4}
                                pt={10}
                                spacing="xs"
                                size="sm"
                                center
                                icon={
                                    <ThemeIcon color="teal" size={24} radius="xl">
                                        <IconCircleCheck style={{width: rem(16), height: rem(16)}}/>
                                    </ThemeIcon>
                                }
                            >
                                <List.Item>Clone or download repository from GitHub </List.Item>
                                <List.Item>Install dependencies with yarn</List.Item>
                                <List.Item>To start development server run npm start command</List.Item>
                                <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                                <List.Item>Clone or download repository from GitHub</List.Item>
                                <List.Item>Install dependencies with yarn</List.Item>
                                <List.Item>To start development server run npm start command</List.Item>
                                <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                                <List.Item>Clone or download repository from GitHub</List.Item>
                                <List.Item>Install dependencies with yarn</List.Item>
                                <List.Item>To start development server run npm start command</List.Item>
                                <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                                <List.Item>Clone or download repository from GitHub</List.Item>
                                <List.Item>Install dependencies with yarn</List.Item>
                                <List.Item>To start development server run npm start command</List.Item>
                                <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                                <List.Item>Clone or download repository from GitHub</List.Item>
                                <List.Item>Install dependencies with yarn</List.Item>
                                <List.Item>To start development server run npm start command</List.Item>
                                <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                                <List.Item>Clone or download repository from GitHub</List.Item>
                                <List.Item>Install dependencies with yarn</List.Item>
                                <List.Item>To start development server run npm start command</List.Item>
                                <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                                <List.Item>Clone or download repository from GitHub</List.Item>
                                <List.Item>Install dependencies with yarn</List.Item>
                                <List.Item>To start development server run npm start command</List.Item>
                                <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                            </List>
                        </ScrollArea>
                    </div>
                    <div className={"form-grid"}>
                        <Box p={`xs`} pl={`md`}>
                            <Title order={4}>{t('CustomerInformation')}</Title>
                            <Text fz={`sm`}>{t('CustomerInformationFormDetails')}</Text>
                        </Box>
                        <Box h={1} bg={`gray.1`}></Box>

                        <ScrollArea h={height} scrollbarSize={2}>
                            <Box p={`md`}>

                                <Tooltip
                                    label={t('NameValidateMessage')}
                                    opened={!!form.errors.name}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <TextInput
                                        size="sm"
                                        label={t('Name')}
                                        placeholder={t('CustomerName')}
                                        withAsterisk
                                        {...form.getInputProps("name")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('CustomerGroup').focus();
                                            }],
                                        ])}
                                        rightSection={
                                            props.form.values.name ?
                                            <Tooltip
                                                label={t("Close")}
                                                withArrow
                                                bg={`red.5`}
                                            >
                                                <IconX color={`red`} size={16} opacity={0.5} onClick={()=>{
                                                    form.setFieldValue('name', '');
                                                }}/>
                                            </Tooltip>
                                                :
                                                <Tooltip
                                                    label={t("NameValidateMessage")}
                                                    withArrow
                                                    bg={`blue.5`}
                                                >
                                                    <IconInfoCircle size={16} opacity={0.5}/>
                                                </Tooltip>

                                        }
                                    />
                                </Tooltip>
                                <Grid gutter={{ base:6}}>
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
                                </Grid>

                                {/*<Tooltip
                                    label={t('CustomerGroup')}
                                    opened={!!form.errors.customer_group}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >*/}
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

                                {opened &&
                                    <CustomerGroupModel openedModel={opened} open={open} close={close}  />
                                }


                                {/*</Tooltip>*/}

                                <Tooltip
                                    label={t('CreditLimit')}
                                    opened={!!form.errors.credit_limit}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <TextInput
                                        size="sm"
                                        id="CreditLimit"
                                        mt={8}
                                        label={t('CreditLimit')}
                                        placeholder={t('CreditLimit')}
                                        {...form.getInputProps("credit_limit")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('OLDReferenceNo').focus();
                                            }],
                                        ])}
                                        rightSection={
                                            props.form.values.credit_limit ?
                                                <Tooltip
                                                    label={t("Close")}
                                                    withArrow
                                                    bg={`red.5`}
                                                >
                                                    <IconX color={`red`} size={16} opacity={0.5} onClick={()=>{
                                                        form.setFieldValue('credit_limit', '');
                                                    }}/>
                                                </Tooltip>
                                                :
                                                <Tooltip
                                                    label={t("CreditLimit")}
                                                    withArrow
                                                    bg={`blue.5`}
                                                >
                                                    <IconInfoCircle size={16} opacity={0.5}/>
                                                </Tooltip>

                                        }
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={t('OLDReferenceNo')}
                                    opened={!!form.errors.old_reference_no}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <TextInput
                                        size="sm"
                                        id="OLDReferenceNo"
                                        mt={8}
                                        label={t('OLDReferenceNo')}
                                        placeholder={t('OLDReferenceNo')}
                                        {...form.getInputProps("old_reference_no")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('Mobile').focus();
                                            }],
                                        ])}
                                        rightSection={
                                            props.form.values.old_reference_no ?
                                                <Tooltip
                                                    label={t("Close")}
                                                    withArrow
                                                    bg={`red.5`}
                                                >
                                                    <IconX color={`red`} size={16} opacity={0.5} onClick={()=>{
                                                        form.setFieldValue('old_reference_no', '');
                                                    }}/>
                                                </Tooltip>
                                                :
                                                <Tooltip
                                                    label={t("OLDReferenceNo")}
                                                    withArrow
                                                    bg={`blue.5`}
                                                >
                                                    <IconInfoCircle size={16} opacity={0.5}/>
                                                </Tooltip>

                                        }
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={t('MobileValidateMessage')}
                                    opened={!!form.errors.mobile}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <TextInput
                                        size="sm"
                                        id={"Mobile"}
                                        label={t('Mobile')}
                                        placeholder={t('Mobile')}
                                        mt={8}
                                        withAsterisk
                                        {...form.getInputProps("mobile")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('AlternativeMobile').focus();
                                            }],
                                        ])}
                                        rightSection={
                                            props.form.values.mobile ?
                                                <Tooltip
                                                    label={t("Close")}
                                                    withArrow
                                                    bg={`red.5`}
                                                >
                                                    <IconX color={`red`} size={16} opacity={0.5} onClick={()=>{
                                                        form.setFieldValue('mobile', '');
                                                    }}/>
                                                </Tooltip>
                                                :
                                                <Tooltip
                                                    label={t("MobileValidateMessage")}
                                                    withArrow
                                                    bg={`blue.5`}
                                                >
                                                    <IconInfoCircle size={16} opacity={0.5}/>
                                                </Tooltip>

                                        }
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={t('AlternativeMobile')}
                                    opened={!!form.errors.alternative_mobile}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <TextInput
                                        size="sm"
                                        id="AlternativeMobile"
                                        mt={8}
                                        label={t('AlternativeMobile')}
                                        placeholder={t('AlternativeMobile')}
                                        {...form.getInputProps("alternative_mobile")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('Email').focus();
                                            }],
                                        ])}
                                        rightSection={
                                            props.form.values.alternative_mobile ?
                                                <Tooltip
                                                    label={t("Close")}
                                                    withArrow
                                                    bg={`red.5`}
                                                >
                                                    <IconX color={`red`} size={16} opacity={0.5} onClick={()=>{
                                                        form.setFieldValue('alternative_mobile', '');
                                                    }}/>
                                                </Tooltip>
                                                :
                                                <Tooltip
                                                    label={t("AlternativeMobile")}
                                                    withArrow
                                                    bg={`blue.5`}
                                                >
                                                    <IconInfoCircle size={16} opacity={0.5}/>
                                                </Tooltip>

                                        }
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={t('Email')}
                                    opened={!!form.errors.email}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <TextInput
                                        size="sm"
                                        id="Email"
                                        mt={8}
                                        label={t('Email')}
                                        placeholder={t('Email')}
                                        {...form.getInputProps("email")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('Location').focus();
                                            }],
                                        ])}
                                        rightSection={
                                            props.form.values.email ?
                                                <Tooltip
                                                    label={t("Close")}
                                                    withArrow
                                                    bg={`red.5`}
                                                >
                                                    <IconX color={`red`} size={16} opacity={0.5} onClick={()=>{
                                                        form.setFieldValue('email', '');
                                                    }}/>
                                                </Tooltip>
                                                :
                                                <Tooltip
                                                    label={t("Email")}
                                                    withArrow
                                                    bg={`blue.5`}
                                                >
                                                    <IconInfoCircle size={16} opacity={0.5}/>
                                                </Tooltip>

                                        }
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={t('Location')}
                                    opened={!!form.errors.email}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <Select
                                        id="Location"
                                        label={t('Location')}
                                        size="sm"
                                        mt={8}
                                        data={["React", "Angular", "Vue", "Svelte"]}
                                        placeholder={t('ChooseLocation')}
                                        clearable
                                        {...form.getInputProps("location")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('MarketingExecutive').focus();
                                            }],
                                        ])}
                                        /*leftSection={
                                            <Tooltip
                                                label={t("Location")}
                                                withArrow
                                                bg={`blue.5`}
                                            >
                                                <IconInfoCircle size={16} opacity={0.5}/>
                                            </Tooltip>
                                        }*/
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={t('MarketingExecutive')}
                                    opened={!!form.errors.email}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <Select
                                        id="MarketingExecutive"
                                        label={t('MarketingExecutive')}
                                        size="sm"
                                        mt={8}
                                        data={["React", "Angular", "Vue", "Svelte"]}
                                        placeholder={t('ChooseMarketingExecutive')}
                                        clearable
                                        {...form.getInputProps("marketing_executive")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('Address').focus();
                                            }],
                                        ])}
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={t('Address')}
                                    opened={!!form.errors.email}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <Textarea
                                        mt={8}
                                        id={"Address"}
                                        label={t('Address')}
                                        size="sm"
                                        placeholder={t("Address")}
                                        {...form.getInputProps("address")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('Status').focus();
                                            }],
                                        ])}
                                        rightSection={
                                            props.form.values.address ?
                                                <Tooltip
                                                    label={t("Close")}
                                                    withArrow
                                                    bg={`red.5`}
                                                >
                                                    <IconX color={`red`} size={16} opacity={0.5} onClick={()=>{
                                                        form.setFieldValue('address', '');
                                                    }}/>
                                                </Tooltip>
                                                :
                                                <Tooltip
                                                    label={t("Address")}
                                                    withArrow
                                                    bg={`blue.5`}
                                                >
                                                    <IconInfoCircle size={16} opacity={0.5}/>
                                                </Tooltip>

                                        }
                                    />
                                </Tooltip>

                                <Tooltip
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
                                </Tooltip>
                            </Box>
                        </ScrollArea>
                    </div>
                </SimpleGrid>
            </Box>
        </>
    );
}

export default Customer;
