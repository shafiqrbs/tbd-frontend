import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    Text,
    Tooltip,
    Box,
    ScrollArea,
    Title,
    Grid,
    TextInput, ColorInput, Select,
} from "@mantine/core";
import {useTranslation} from "react-i18next";

import {
    IconFilter, IconEyeSearch,
    IconUserCircle, IconInfoCircle
} from "@tabler/icons-react";
import {getHotkeyHandler, useViewportSize} from "@mantine/hooks";

import axios from "axios";


import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine component features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import {useMemo} from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';


function TwoGrid(props) {
    const {isFormSubmit, setFormSubmit, setFormSubmitData, form} = props

    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 110; //TabList height 36
    const [fetching, setFetching] = useState(true)
    const [data, setRecords] = useState([]);

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

    return (
        <>
            <Box>
                <Grid cols={2}>
                    <Grid.Col span={8}>
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
                    </Grid.Col>
                    <Grid.Col className={"form-box"} span={4}>


                        <Box p={`xs`}>
                            <Title order={4}>Form</Title>
                            <Text fz={`sm`}>We'll always let you know about important changes</Text>
                        </Box>
                        <Box h={1} bg={`gray.1`}></Box>

                        <ScrollArea h={height} scrollbarSize={2}>
                            <Box p={`sm`}>
                                <Tooltip
                                    label={"Name must be 2-10 characters long"}
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
                                        label="Name"
                                        placeholder="Name y"
                                        withAsterisk
                                        {...form.getInputProps("name")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('email').focus();
                                            }],
                                        ])}
                                    />
                                </Tooltip>
                                <Tooltip
                                    label={"Invalid Email"}
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
                                        id="email"
                                        mt={8}
                                        label="Your email"
                                        placeholder="Your email"
                                        withAsterisk
                                        {...form.getInputProps("email")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('favoriteColor').focus();
                                            }],
                                        ])}
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={"Enter a valid hex color"}
                                    opened={!!form.errors.favoriteColor}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <ColorInput
                                        size="sm"
                                        label="Your favorite color"
                                        id="favoriteColor"
                                        mt={8}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('programming').focus()
                                            }],
                                        ])}
                                        withAsterisk
                                        {...form.getInputProps("favoriteColor")}
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={"Require"}
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
                                    <Select
                                        id="programming"
                                        label={"select"}
                                        size="sm"
                                        mt={8}
                                        data={["React", "Angular", "Vue", "Svelte"]}

                                        clearable
                                        withAsterisk
                                        {...form.getInputProps("select")}
                                    />
                                </Tooltip>
                            </Box>
                            <Box p={`sm`}>

                                <Tooltip
                                    label={"Name must be 2-10 characters long"}
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
                                        label="Name"
                                        placeholder="Name y"
                                        withAsterisk
                                        {...form.getInputProps("name")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('email').focus();
                                            }],
                                        ])}
                                    />
                                </Tooltip>
                                <Tooltip
                                    label={"Invalid Email"}
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
                                        id="email"
                                        mt={8}
                                        label="Your email"
                                        placeholder="Your email"
                                        withAsterisk
                                        {...form.getInputProps("email")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('favoriteColor').focus();
                                            }],
                                        ])}
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={"Enter a valid hex color"}
                                    opened={!!form.errors.favoriteColor}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <ColorInput
                                        size="sm"
                                        label="Your favorite color"
                                        id="favoriteColor"
                                        mt={8}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('programming').focus()
                                            }],
                                        ])}
                                        withAsterisk
                                        {...form.getInputProps("favoriteColor")}
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={"Require"}
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
                                    <Select
                                        id="programming"
                                        label={"select"}
                                        size="sm"
                                        mt={8}
                                        data={["React", "Angular", "Vue", "Svelte"]}

                                        clearable
                                        withAsterisk
                                        {...form.getInputProps("select")}
                                    />
                                </Tooltip>
                            </Box>
                            <Box p={`sm`}>

                                <Tooltip
                                    label={"Name must be 2-10 characters long"}
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
                                        label="Name"
                                        placeholder="Name y"
                                        withAsterisk
                                        {...form.getInputProps("name")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('email').focus();
                                            }],
                                        ])}
                                    />
                                </Tooltip>
                                <Tooltip
                                    label={"Invalid Email"}
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
                                        id="email"
                                        mt={8}
                                        label="Your email"
                                        placeholder="Your email"
                                        withAsterisk
                                        {...form.getInputProps("email")}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('favoriteColor').focus();
                                            }],
                                        ])}
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={"Enter a valid hex color"}
                                    opened={!!form.errors.favoriteColor}
                                    px={20}
                                    py={3}
                                    position="top-end"
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={0}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <ColorInput
                                        size="sm"
                                        label="Your favorite color"
                                        id="favoriteColor"
                                        mt={8}
                                        onKeyDown={getHotkeyHandler([
                                            ['Enter', (e) => {
                                                document.getElementById('programming').focus()
                                            }],
                                        ])}
                                        withAsterisk
                                        {...form.getInputProps("favoriteColor")}
                                    />
                                </Tooltip>

                                <Tooltip
                                    label={"Require"}
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
                                    <Select
                                        id="programming"
                                        label={"select"}
                                        size="sm"
                                        mt={8}
                                        data={["React", "Angular", "Vue", "Svelte"]}

                                        clearable
                                        withAsterisk
                                        {...form.getInputProps("select")}
                                    />
                                </Tooltip>
                            </Box>
                        </ScrollArea>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

export default TwoGrid;
