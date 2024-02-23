import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Tooltip,
    Box,
    TextInput, Grid, ActionIcon,rem
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconFilter, IconSearch, IconInfoCircle, IconEye, IconEdit, IconTrash, IconRestore} from "@tabler/icons-react";
import axios from "axios";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {getIndexEntityData, setFetching} from "../../../../store/core/crudSlice.js";


function VendorTable(props) {

    const {form} = props
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 104
    const fetching = useSelector((state) => state.crudSlice.fetching)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    useEffect(() => {
        dispatch(getIndexEntityData('vendor'))
    }, [fetching]);

    return (
        <>
            <Box>
                <Box bg={`white`}>
                    <Box pb={`xs`} pl={`xs`} pr={8} >
                        <Grid justify="flex-end" align="flex-end">
                            <Grid.Col span={10}>
                                <TextInput
                                    leftSection={<IconSearch size={16} opacity={0.5}/>}
                                    rightSection={
                                        <Tooltip
                                            label={t("FiledIsRequired")}
                                            withArrow
                                            position={"bottom"}
                                            c={'indigo'}
                                            bg={`indigo.1`}
                                        >
                                            <IconInfoCircle size={16} opacity={0.5}/>
                                        </Tooltip>
                                    }
                                    size="sm"
                                    placeholder={t('EnterSearchAnyKeyword')}
                                />
                            </Grid.Col>
                            <Grid.Col span={2}>

                                <ActionIcon.Group mt={'1'}>
                                    <ActionIcon variant="transparent" size="lg" mr={16} aria-label="Gallery">
                                        <Tooltip
                                            label={t('SearchButton')}
                                            px={16}
                                            py={2}
                                            withArrow
                                            position={"bottom"}
                                            c={'indigo'}
                                            bg={`gray.1`}
                                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                        >
                                            <IconSearch  style={{ width: rem(20) }} stroke={2.0} />
                                        </Tooltip>
                                    </ActionIcon>

                                    <ActionIcon variant="transparent" size="lg"  mr={16} aria-label="Settings">
                                        <Tooltip
                                            label={t("FilterButton")}
                                            px={16}
                                            py={2}
                                            withArrow
                                            position={"bottom"}
                                            c={'indigo'}
                                            bg={`gray.1`}
                                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                        >
                                            <IconFilter style={{ width: rem(20) }} stroke={2.0} />
                                        </Tooltip>
                                    </ActionIcon>
                                    <ActionIcon variant="transparent" size="lg" aria-label="Settings">
                                        <Tooltip
                                            label={t("ResetButton")}
                                            px={16}
                                            py={2}
                                            withArrow
                                            position={"bottom"}
                                            c={'indigo'}
                                            bg={`gray.1`}
                                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                        >
                                            <IconRestore style={{ width: rem(20) }} stroke={2.0} />
                                        </Tooltip>
                                    </ActionIcon>
                                </ActionIcon.Group>
                            </Grid.Col>
                        </Grid>
                    </Box>
                    <Box h={1} bg={`gray.1`}></Box>
                </Box>
                <Box>
                    {
                        // (customerIndexData && customerIndexData.length > 0) &&
                        <DataTable
                            withBorder
                            records={indexData}
                            columns={[
                                {
                                    accessor: 'index',
                                    title: 'S/N',
                                    textAlignment: 'right',
                                    render: (item) => (indexData.indexOf(item) + 1)
                                },
                                { accessor: 'id' , title: "ID", },
                                { accessor: 'name',  title: "Name" },
                                {
                                    accessor: "action",
                                    title: "Action",
                                    textAlign: "right",
                                    render: (data) => (
                                        <Group gap={4} justify="right" wrap="nowrap">
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
                            fetching={fetching}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={height}
                            scrollAreaProps={{ type: 'never' }}
                        />
                    }

                </Box>
            </Box>
        </>
    );
}

export default VendorTable;