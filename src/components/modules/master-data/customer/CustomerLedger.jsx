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
    IconPdf,
    IconPrinter,
    IconMessage,
    IconPhoneCall,
    IconShare,
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
import CustomerGroupModel from "../../core/customer/CustomerGroupModal";
import {hasLength, useForm} from "@mantine/form";
import InputForm from "../../../form-builders/InputForm";

function CustomerLedger(props) {

    const {isFormSubmit, setFormSubmit, setFormSubmitData, form} = props
    const iconStyle = {width: rem(12), height: rem(12)};
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 96; //TabList height 36
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

                    <div className={"form-grid"}>
                        <Box pl={`xs`} pr={`xs`} pb={`md`} pt={`xs`} >
                            <Grid>
                                <Grid.Col span={12}>
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
                                        placeholder={t('EnterCustomer&Invoice')}
                                    />
                                </Grid.Col>

                            </Grid>
                        </Box>
                        <Box pl={`xs`} pr={`xs`}>
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
                                                textAlign: 'center',
                                                render: (record) => data.indexOf(record) + 1,
                                            },
                                            {
                                                accessor: 'title',  title: "Date"
                                            },
                                            {
                                                accessor: 'title',  title: "Invoice"
                                            },
                                            {
                                                accessor: 'title',  title: "Sales"
                                            },
                                            {
                                                accessor: 'title',  title: "Receive"
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
                        </Box>

                    </div>
                    <div className="view-gird">
                        <Box pl={`xs`}  pb={`xs`} pt={`xs`}>
                            <Grid>
                                <Grid.Col span={6}>
                                    <Title order={6}>Md Shafiqul Islam</Title>
                                    <Text fz={`xs`}>01828148148</Text>
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Tooltip
                                        label={t('ClickHereForListOfRows')}
                                        px={20}
                                        py={3}
                                        color={`blue.3`}
                                        withArrow
                                        position={"bottom"}
                                        transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                    >
                                        <Button size="xs" color={`blue.5`} variant="light">
                                            <IconPhoneCall size={18}/>
                                        </Button>
                                    </Tooltip>
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Tooltip
                                        label={t('ClickHereForListOfRows')}
                                        px={20}
                                        py={3}
                                        color={`blue.3`}
                                        withArrow
                                        position={"bottom"}
                                        transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                    >
                                        <Button size="xs" color={`blue.5`} variant="light">
                                            <IconMessage size={18}/>
                                        </Button>
                                    </Tooltip>
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Tooltip
                                        label={t('ClickHereForListOfRows')}
                                        px={20}
                                        py={3}
                                        color={`blue.3`}
                                        withArrow
                                        position={"bottom"}
                                        transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                    >
                                        <Button size="xs" color={`blue.5`} variant="light">
                                            <IconPdf size={18}/>
                                        </Button>
                                    </Tooltip>
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Tooltip
                                        label={t('ClickHereForListOfRows')}
                                        px={20}
                                        py={3}
                                        color={`blue.3`}
                                        withArrow
                                        position={"bottom"}
                                        transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                    >
                                        <Button size="xs" color={`blue.5`} variant="light">
                                            <IconPrinter size={18}/>
                                        </Button>
                                    </Tooltip>
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Tooltip
                                        label={t('ClickHereForListOfRows')}
                                        px={20}
                                        py={3}
                                        color={`blue.3`}
                                        withArrow
                                        position={"bottom"}
                                        transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                    >
                                        <Button size="xs" color={`blue.5`} variant="light">
                                            <IconShare size={18}/>
                                        </Button>
                                    </Tooltip>
                                </Grid.Col>


                            </Grid>

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
                </SimpleGrid>
            </Box>
        </>
    );
}

export default CustomerLedger;
