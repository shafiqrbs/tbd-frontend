import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import { IconEye, IconEdit, IconTrash} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    editEntityData,
    getIndexEntityData, setEditEntityData,
    setFetching, setFormLoading,
    setInsertType,
    showEntityData
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import VendorViewModel from "./VendorViewModel.jsx";
function VendorTable() {

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const perPage = 50;
    const [page,setPage] = useState(1);
    const [vendorViewModel,setVendorViewModel] = useState(false)

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)



    useEffect(() => {
        const value = {
            url: 'core/vendor',
            param: {
                term: searchKeyword,
                name: vendorFilterData.name,
                mobile: vendorFilterData.mobile,
                company_name: vendorFilterData.company_name,
                page: page,
                offset : perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    return (
        <>
            <Box>
                <Box bg={`white`}  >
                    <Box pt={'xs'} pb={`xs`} pl={`md`} pr={'xl'} >
                        <KeywordSearch module={'vendor'}/>
                    </Box>
                </Box>
                <Box bg={`white`}>

                    <Box pb={`xs`} pl={`md`} pr={'md'} >
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
                                { accessor: 'name',  title: "Name" },
                                { accessor: 'company_name',  title: "Company Name" },
                                { accessor: 'mobile',  title: "Mobile" },
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
                                                onClick={()=>{
                                                    setVendorViewModel(true)
                                                    dispatch(showEntityData('core/vendor/' + data.id))
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
                                                    dispatch(editEntityData('core/vendor/' + data.id))
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
                                                            dispatch(deleteEntityData('core/vendor/' + data.id))
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
                            scrollAreaProps={{ type: 'never' }}
                        />
                    </Box>
                </Box>
            </Box>
            {
                vendorViewModel && <VendorViewModel  vendorViewModel={vendorViewModel} setVendorViewModel={setVendorViewModel}/>
            }
        </>
    );
}

export default VendorTable;