import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, Drawer,
    Flex, Modal, Menu, Table
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import {
    IconDeviceFloppy,
    IconPrinter,
    IconCheck,
    IconX, IconDotsVertical, IconTrashX,

} from "@tabler/icons-react";
import {useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {
    deleteEntityData,
    editEntityData, getIndexEntityData, setFetching,
    setFormLoading,
    setInsertType
} from "../../../../store/accounting/crudSlice.js";
import {modals} from "@mantine/modals";
import Navigation from "../common/Navigation.jsx";
import LedgerTable from "./LedgerTable.jsx";
import LedgerForm from "./LedgerForm.jsx";
import LedgerUpdateFrom from "./LedgerUpdateFrom.jsx";
import {showInstantEntityData} from "../../../../store/inventory/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

function LedgerDetailsModel(props) {
    const configData = localStorage.getItem('config-data');
    const dispatch = useDispatch()

    const adjustment = -28;
    const [opened, { open, close }] = useDisclosure(true);

    const perPage = 50;
    const [page, setPage] = useState(1);
    const entityEditData = useSelector((state => state.crudSlice.entityEditData))
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)

    const { ledgerDetails,setLedgerDetails } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight-180; //TabList height 104
    const [journalItems,setJournalItems] = useState([])

    useEffect(() => {
        const value = {
            url: 'accounting/account-head',
            param: {
                group: 'ledger',
                term: searchKeyword,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resultAction = await dispatch(
                    showInstantEntityData(`accounting/account-ledger-wise/journal/${ledgerDetails.id}`)
                );

                if (showInstantEntityData.fulfilled.match(resultAction)) {
                    if (resultAction.payload.data.status === 200) {
                        setJournalItems(resultAction.payload.data.data)
                    } else {
                        showNotificationComponent('Failed to process', 'red', null, false, 1000, true);
                    }
                }
            } catch (error) {
                console.error("Error updating entity:", error);
                showNotificationComponent('Failed to process', 'red', null, false, 1000, true);
            }
        };

        if (ledgerDetails?.id) {
            fetchData();
        }
    }, [ledgerDetails, dispatch]);

    /*const rows = journalItems?.ledgerDetails.flatMap((element) => [
        <Table.Tr key={element.id} bg="red.6">
            <Table.Td>{element.ledger_name}</Table.Td>
            <Table.Td >{element.mode==='debit'?'Debit':'Credit'}</Table.Td>
            <Table.Td>{element.amount}</Table.Td>
            <Table.Td>{element.created_date}</Table.Td>
        </Table.Tr>,
        ...(element.childItems || []).map((c) => (
            <Table.Tr key={c.id} bg="red.4">
                <Table.Td>{c.ledger_name}</Table.Td>
                <Table.Td>{c.mode==='debit'?'Debit':'Credit'}</Table.Td>
                <Table.Td>{c.amount}</Table.Td>
                <Table.Td>{c.created_date}</Table.Td>
            </Table.Tr>
        )),
    ]);

    const rows2 = journalItems?.ledgerItems.map((element) => [
        <Table.Tr key={element.id} bg="blue.6">
            <Table.Td>{element.ledger_name}</Table.Td>
            <Table.Td >{element.mode==='debit'?'Debit':'Credit'}</Table.Td>
            <Table.Td>{element.amount}</Table.Td>
            <Table.Td>{element.created_date}</Table.Td>
        </Table.Tr>
    ]);*/

    const rows = journalItems?.ledgerDetails?.flatMap((element) => [
        <Table.Tr key={element.id} bg="red.6">
            <Table.Td>{element.ledger_name}</Table.Td>
            <Table.Td>{element.mode === 'debit' ? 'Debit' : 'Credit'}</Table.Td>
            <Table.Td>{element.amount}</Table.Td>
            <Table.Td>{element.created_date}</Table.Td>
        </Table.Tr>,
        ...(element.childItems || []).map((c) => (
            <Table.Tr key={c.id} bg="red.4">
                <Table.Td>{c.ledger_name}</Table.Td>
                <Table.Td>{c.mode === 'debit' ? 'Debit' : 'Credit'}</Table.Td>
                <Table.Td>{c.amount}</Table.Td>
                <Table.Td>{c.created_date}</Table.Td>
            </Table.Tr>
        )),
    ]);

    const rows2 = journalItems?.ledgerItems?.map((element) => (
        <Table.Tr key={element.id} bg="blue.6">
            <Table.Td>{element.ledger_name}</Table.Td>
            <Table.Td>{element.mode === 'debit' ? 'Debit' : 'Credit'}</Table.Td>
            <Table.Td>{element.amount}</Table.Td>
            <Table.Td>{element.created_date}</Table.Td>
        </Table.Tr>
    ));


    return (
        <>
            <Modal
                opened={opened}
                onClose={()=>{
                    setLedgerDetails(null)
                    close()
                }}
                title={ledgerDetails?.name || 'Ledger Details'}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                size={"100%"}
            >
                <Box p={'8'}>
                    <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                ledger Table
                                <DataTable
                                    classNames={{
                                        root: tableCss.root,
                                        table: tableCss.table,
                                        header: tableCss.header,
                                        footer: tableCss.footer,
                                        pagination: tableCss.pagination,
                                    }}
                                    records={indexData.data}
                                    columns={[
                                        { accessor: 'parent_name', title: t('ParentHead') },
                                        {
                                            accessor: 'name',
                                            title: t("Name"),
                                            render: (item) => (
                                                <Text
                                                    component="a"
                                                    size="sm"
                                                    variant="subtle"
                                                    c="red.6"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setLedgerDetails(item)
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {item.name}
                                                </Text>

                                            )
                                        },
                                        // { accessor: 'amount', title: t('Amount') },
                                    ]
                                    }
                                    fetching={fetching}
                                    totalRecords={indexData.total}
                                    recordsPerPage={perPage}
                                    page={page}
                                    onPageChange={(p) => {
                                        setPage(p)
                                        dispatch(setFetching(true))
                                    }}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={height}
                                    scrollAreaProps={{ type: 'never' }}
                                    rowBackgroundColor={(item) => {
                                        if (item.id === ledgerDetails.id) return '#e2c2c263';
                                    }}
                                />
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={16}>
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            ledger details
                            <Table striped highlightOnHover withTableBorder withColumnBorders maxHeight={height}>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Ledger Name</Table.Th>
                                        <Table.Th >Mode</Table.Th>
                                        <Table.Th>Amount</Table.Th>
                                        <Table.Th>Date</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{rows}</Table.Tbody>
                                <hr/>
                                <Table.Tbody>{rows2}</Table.Tbody>
                            </Table>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>

            </Modal>
        </>

    );
}

export default LedgerDetailsModel;
