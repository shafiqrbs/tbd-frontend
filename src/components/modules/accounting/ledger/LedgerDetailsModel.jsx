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
    editEntityData, setFetching,
    setFormLoading,
    setInsertType
} from "../../../../store/accounting/crudSlice.js";
import {modals} from "@mantine/modals";
import Navigation from "../common/Navigation.jsx";
import LedgerTable from "./LedgerTable.jsx";
import LedgerForm from "./LedgerForm.jsx";
import LedgerUpdateFrom from "./LedgerUpdateFrom.jsx";

function LedgerDetailsModel(props) {
    const configData = localStorage.getItem('config-data');

    const adjustment = -28;
    const [opened, { open, close }] = useDisclosure(true);


    const entityEditData = useSelector((state => state.crudSlice.entityEditData))

    const { ledgerDetails,setLedgerDetails } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104


    console.log(ledgerDetails)

    const elements = [
        { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
        { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
        { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
        { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
        { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    ];

    const rows = elements.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
        </Table.Tr>
    ));
    const rows1 = elements.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.position}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.symbol}</Table.Td>
            <Table.Td>{element.mass}</Table.Td>
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
                size={"70%"}
            >
                <Box p={'8'}>
                    <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                ledger Table
                                <Table striped highlightOnHover withTableBorder withColumnBorders>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Ledger Name</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>{rows}</Table.Tbody>
                                    {/*<Table.Caption>Scroll page to see sticky thead</Table.Caption>*/}
                                </Table>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={16}>
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            ledger details
                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Element position</Table.Th>
                                        <Table.Th>Element name</Table.Th>
                                        <Table.Th>Symbol</Table.Th>
                                        <Table.Th>Atomic mass</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{rows1}</Table.Tbody>
                                {/*<Table.Caption>Scroll page to see sticky thead</Table.Caption>*/}
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
