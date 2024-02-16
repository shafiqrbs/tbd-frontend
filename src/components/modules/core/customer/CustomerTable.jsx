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
    Timeline,
    NumberFormatter,
    TextInput, SimpleGrid, List, ColorInput, Select, ThemeIcon, Switch, Textarea, Modal, Grid, ActionIcon,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconCircleCheck,
    IconCurrency,
    IconFilter, IconSearch,
    IconUserCircle, IconInfoCircle, IconList, IconPlus, IconEyeClosed, IconX, IconXboxX, IconEye, IconEdit, IconTrash
} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useViewportSize} from "@mantine/hooks";
import axios from "axios";
import {useMemo} from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';

import {
    DataTable
} from 'mantine-datatable';
import CustomerGroupModel from "./CustomerGroupModal";
import {hasLength, useForm} from "@mantine/form";
import InputForm from "../../../form-builders/InputForm";

function CustomerTable(props) {

    const {isFormSubmit, setFormSubmit, setFormSubmitData, form} = props
    const iconStyle = {width: rem(12), height: rem(12)};
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 36
    const tableHeight = mainAreaHeight - 36; //TabList height 36
    const [fetching, setFetching] = useState(true)
    const [data, setRecords] = useState([]);
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

    useEffect(() => {
        axios({
            method: "get",
            url: "https://jsonplaceholder.typicode.com/posts",
        })
            .then(function (res) {
                setRecords(res.data);
                setFetching(false)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

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
                    <Box pb={`md`} pt={`xs`} >
                        <Grid>
                            <Grid.Col span={8}>
                                <TextInput
                                leftSection={<IconSearch size={16} opacity={0.5}/>}
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
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Group grow preventGrowOverflow={true} >
                                    <Tooltip
                                        label={t('ClickHereForListOfRows')}
                                        px={20}
                                        py={3}
                                        color={`blue.3`}
                                        withArrow
                                        position={"bottom"}
                                        transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                    >
                                        <Button size="sm" color={`blue.5`} variant="light">
                                            <IconSearch size={18}/>
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
                            </Grid.Col>
                        </Grid>
                    </Box>

                        {
                            (data && data.length > 0) &&
                            <DataTable
                                withTableBorder
                                withRowBorders={false}
                                striped
                                highlightOnHover
                                columns={
                                    [
                                        {
                                            accessor: 'index',
                                            title: 'S/N',
                                            textAlign: 'right',
                                            width: 45,
                                            render: (record) => data.indexOf(record) + 1,
                                        },
                                        {
                                            accessor: 'title',  title: "Post Title"
                                        },
                                        {
                                            accessor: "action",
                                            title: "",
                                            textAlign: "right",
                                            render: (data) => (
                                                <Group gap={4} jus
                                                       tify="right" wrap="nowrap">
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="green"
                                                    >
                                                        <IconEye size={16}/>
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="blue"
                                                    >
                                                        <IconEdit size={16}/>
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="red"
                                                    >
                                                        <IconTrash size={16}/>
                                                    </ActionIcon>
                                                </Group>
                                            ),
                                        },

                                    ]
                                }
                                records={data}
                                height={height}
                                scrollAreaProps={{ type: 'never' }}

                            />

                        }

                    </div>
                    <div className="view-gird">
                        <Box pl={`xs`}  pb={`xs`} pt={`xs`}>
                            <Title order={6}>{t('CustomerInformation')}</Title>
                            <Text fz={`xs`}>{t('CustomerInformation')}</Text>
                        </Box>
                        <Box  h={1} bg={`gray.2`}></Box>
                        <Box pl={`xs`}>
                            <ScrollArea scrollbars="y" h={height} mt={10} scrollbarSize={2}>
                                <Box pl={`xs`}>
                                    <Timeline active={1} lineWidth={1} bulletSize={24}>
                                        <Timeline.Item bullet={<IconUserCircle size={12} />} title={t('CustomerInformation')}>
                                            <List
                                                px={4}
                                                pt={10}
                                                spacing="xs"
                                                size="sm"
                                                cente
                                                center
                                                icon={
                                                    <ThemeIcon color="teal" size={24} radius="xl">
                                                        <IconCircleCheck style={{width: rem(16), height: rem(16)}}/>
                                                    </ThemeIcon>
                                                }
                                            >
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <List.Item>{t('Name')}</List.Item>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Text c="dimmed" size="sm">Md Shafiq Islam</Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <List.Item>{t('Mobile')}</List.Item>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Text c="dimmed" size="sm">1828148148</Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <List.Item>{t('Address')}</List.Item>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Text c="dimmed" size="sm">Hosue No# 18 , Road # 3, Block : G</Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </List>
                                        </Timeline.Item>
                                        <Timeline.Item bullet={<IconCurrency size={12} />} title={t('Transaction')}>
                                            <List
                                                px={4}
                                                pt={10}
                                                spacing="xs"
                                                size="sm"
                                                cente
                                                center
                                                icon={
                                                    <ThemeIcon color="red" size={24} radius="xl">
                                                        <IconCurrency style={{width: rem(16), height: rem(16)}}/>
                                                    </ThemeIcon>
                                                }
                                            >
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <List.Item>{t('TotalSales')}</List.Item>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Text c="dimmed" size="md">
                                                            <NumberFormatter prefix="$" value={100} />
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <List.Item>{t('TotalReceive')}</List.Item>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Text c="dimmed" size="md">
                                                            <NumberFormatter prefix="$" value={100} />
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <List.Item>{t('Outstanding')}</List.Item>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Text c="dimmed" size="md">
                                                            <NumberFormatter prefix="$" value={100} />
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </List>
                                        </Timeline.Item>
                                        <Timeline.Item bullet={<IconUserCircle size={12} />} title={t('PersonalDetails')}>
                                            <List
                                                px={4}
                                                pt={10}
                                                spacing="xs"
                                                size="sm"
                                                cente
                                                center
                                                icon={
                                                    <ThemeIcon color="blue" size={24} radius="xl">
                                                        <IconCurrency style={{width: rem(16), height: rem(16)}}/>
                                                    </ThemeIcon>
                                                }
                                            >
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <List.Item>{t('TotalSales')}</List.Item>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Text c="dimmed" size="md">
                                                            <NumberFormatter prefix="$" value={100} />
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <List.Item>{t('TotalReceive')}</List.Item>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Text c="dimmed" size="md">
                                                            <NumberFormatter prefix="$" value={100} />
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <List.Item>{t('Outstanding')}</List.Item>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Text c="dimmed" size="md">
                                                            <NumberFormatter prefix="$" value={100} />
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </List>
                                        </Timeline.Item>
                                    </Timeline>
                                </Box>

                            </ScrollArea>
                        </Box>

                    </div>
                    <div className={"form-grid"}>
                        <Box pl={`xs`}  pb={`xs`} pt={`xs`}>
                            <Title order={6}>{t('CustomerInformation')}</Title>
                            <Text fz={`xs`}>{t('CustomerInformationFormDetails')}</Text>
                        </Box>
                        <Box h={1} bg={`gray.1`}></Box>
                        <ScrollArea h={height} scrollbarSize={2}>
                            <Box p={`md`}>
                                <InputForm></InputForm>
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

export default CustomerTable;
