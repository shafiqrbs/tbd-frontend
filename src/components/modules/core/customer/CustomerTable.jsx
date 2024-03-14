import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconEye, IconEdit, IconTrash} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFetching, setFormLoading,
    setInsertType,
    showEntityData
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import CustomerViewModel from "./CustomerViewModel.jsx";

function CustomerTable() {

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 80; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [customerViewModel, setCustomerViewModel] = useState(false)

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const customerFilterData = useSelector((state) => state.crudSlice.customerFilterData)

    useEffect(() => {
        const value = {
            url: 'core/customer',
            param: {
                term: searchKeyword,
                name: customerFilterData.name,
                mobile: customerFilterData.mobile,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    return (
        <>
            <Box>
                <div radius="xl">
                    <Box bg={`white`}>
                        <Box pt={'xs'} pb={`xs`} pl={`md`} pr={'xl'}>
                            <KeywordSearch module={'customer'}/>
                        </Box>
                    </Box>
                    <Box bg={`white`}>
                        <Box pb={`xs`} pl={`md`} pr={'md'}>
                            <DataTable
                                withTableBorder
                                records={indexData.data}
                                columns={[
                                    {
                                        accessor: 'index',
                                        title: 'S/N',
                                        textAlignment: 'right',
                                        render: (item) => (indexData.data.indexOf(item) + 1)
                                    },
                                    {accessor: 'id', title: "ID"},
                                    {accessor: 'name', title: "Name"},
                                    {accessor: 'mobile', title: "Mobile"},
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
                                                    onClick={() => {
                                                        setCustomerViewModel(true)
                                                        dispatch(showEntityData('core/customer/' + data.id))
                                                    }}
                                                >
                                                    <IconEye size={16}/>
                                                </ActionIcon>
                                                <ActionIcon
                                                    size="sm"
                                                    variant="subtle"
                                                    color="blue"
                                                    onClick={() => {
                                                        dispatch(setInsertType('update'))
                                                        dispatch(editEntityData('core/customer/' + data.id))
                                                        dispatch(setFormLoading(true))
                                                    }}
                                                >
                                                    <IconEdit size={16}/>
                                                </ActionIcon>
                                                <ActionIcon
                                                    size="sm"
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={() => {
                                                        modals.openConfirmModal({
                                                            title: (
                                                                <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                            ),
                                                            children: (
                                                                <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                            ),
                                                            labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                            onCancel: () => console.log('Cancel'),
                                                            onConfirm: () => {
                                                                dispatch(deleteEntityData('core/customer/' + data.id))
                                                                dispatch(setFetching(true))
                                                            },
                                                        });
                                                    }}
                                                >
                                                    <IconTrash size={16}/>
                                                </ActionIcon>
                                            </Group>
                                        ),
                                    },
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
                                scrollAreaProps={{type: 'never'}}
                            />
                        </Box>
                    </Box>
                </div>
            </Box>
            {
                customerViewModel &&
                <CustomerViewModel customerViewModel={customerViewModel} setCustomerViewModel={setCustomerViewModel}/>
            }
        </>
    );
}

export default CustomerTable;