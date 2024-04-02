import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import tableCss from '../../../../assets/css/Table.module.css';
import {
    Group,
    Box,
    ActionIcon, Text, Grid, Stack, TextInput
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconEye, IconEdit, IconTrash, IconSum, IconX} from "@tabler/icons-react";
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
import SalesViewModel from "./SalesViewModel.jsx";
import ShortcutTable from "../../shortcut/ShortcutTable";
function SalesTable() {

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 116; //TabList height 104
    const height = mainAreaHeight - 154; //TabList height 104

    const perPage = 50;
    const [page,setPage] = useState(1);
    const [vendorViewModel,setVendorViewModel] = useState(false)

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)



    useEffect(() => {
        const value = {
            url: 'vendor',
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
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={24} >
                        <Box pl={`xs`} pb={'4'} pr={'xs'} pt={'4'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                            <Grid>
                                <Grid.Col>
                                    <Stack >
                                        <KeywordSearch/>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box>
                <Grid columns={24} gutter={{base:8}}>
                    <Grid.Col span={9} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box className={'borderRadiusAll'}>
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
                                                            dispatch(showEntityData('vendor/' + data.id))
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
                                                            dispatch(editEntityData('vendor/' + data.id))
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
                                                                    dispatch(deleteEntityData('vendor/' + data.id))
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
                                    height={tableHeight}
                                    scrollAreaProps={{ type: 'never' }}
                                />
                            </Box>
                        </Box>
                        {
                            vendorViewModel && <SalesViewModel vendorViewModel={vendorViewModel} setVendorViewModel={setVendorViewModel}/>
                        }
                    </Grid.Col>
                    <Grid.Col span={6} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box h={'36'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'6'} mb={'4'} className={'boxBackground textColor borderRadiusAll'} >
                                In voice Title
                            </Box>
                            <Box className={'borderRadiusAll'} fz={'sm'} h={height} pl={'xs'} pt={'xs'}>
                                Body
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box h={'36'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'6'} mb={'4'} className={'boxBackground textColor borderRadiusAll'} >
                                In voice Details
                            </Box>
                            <Box className={'borderRadiusAll'} h={height} fz={'sm'} pl={'xs'} pt={'xs'}>
                                Body
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <ShortcutTable
                                form=''
                                FormSubmit={'EntityFormSubmit'}
                                Name={'CompanyName'}
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

export default SalesTable;