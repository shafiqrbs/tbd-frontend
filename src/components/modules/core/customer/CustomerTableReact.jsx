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
import {useMemo} from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';

function CustomerTableReact(props) {

    const {isFormSubmit, setFormSubmit, setFormSubmitData, form} = props
    const iconStyle = {width: rem(12), height: rem(12)};
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 90; //TabList height 36
    const tableHeight = mainAreaHeight - 36; //TabList height 36
    const [fetching, setFetching] = useState(true)
    const [data, setRecords] = useState([]);

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

    const columns = useMemo(
        () => [
            {
                accessorKey: 'title', //access nested data with dot notation
                header: ' Name',
                enableClickToCopy: true,
            }
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data,
    });
    console.log(tableHeight);
    console.log(height);
    return (
        <>
            <Box>
                <SimpleGrid>
                    <div h={height} className={'table-fixed'}>
                        {
                            (data && data.length > 0) &&
                            <MantineReactTable
                                columns={columns}
                                data={data}
                                enableColumnFilterModes={true}
                                positionGlobalFilter="left"
                                enableDensityToggle={false}
                                enablePagination={false}
                                enableStickyHeader={true}
                                initialState={{
                                    columnVisibility: { required: false, description: false },
                                    density: 'xs',
                                    showGlobalFilter: true,
                                    sorting: [{ id: 'tableOption', desc: false }],
                                }}
                                mantineTableContainerProps={{ sx: { maxHeight:'300px' } }}
                                mantineSearchTextInputProps={{
                                    placeholder: `Search ${data.length} rows`,
                                    sx: { minWidth: '450px' },
                                    variant: 'filled',
                                }}
                            />

                        }
                    </div>
                    {/*<div bg={`rose.5`} className="view-gird">
                        <Box p={`xs`}>
                            <TitenableColumnActions={!onlyOptions}
      enableColumnFilterModes
      enablePagination={false}
      enablePinning
      enableRowNumbers
      enableBottomToolbar={false}
      enableTopToolbar={!onlyOptions}le order={4}>Details Data</Title>
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
                    </div>*/}
                </SimpleGrid>
            </Box>
        </>
    );
}

export default CustomerTableReact;
