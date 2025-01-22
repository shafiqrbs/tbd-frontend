import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text, rem, Menu
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconCheck,
    IconDotsVertical,
    IconTrashX
} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFormLoading,
    setInsertType,
    deleteEntityData,
    setFetching
} from "../../../../store/inventory/crudSlice.js";
import {modals} from "@mantine/modals";
import KeywordSearch from "../../filter/KeywordSearch.jsx";
import {notifications} from "@mantine/notifications";
import tableCss from "../../../../assets/css/Table.module.css";
import _ParticularViewModal from "./_ParticularViewModal.jsx";

function _ParticularTable(props) {
    const {particularFetching,setParticularFetching} =props
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104
    const perPage = 50;
    const [page, setPage] = useState(1);

    const searchKeyword = useSelector((state) => state.inventoryCrudSlice.searchKeyword)
    const fetching = useSelector((state) => state.inventoryCrudSlice.fetching)
    const indexData = useSelector((state) => state.inventoryCrudSlice.indexEntityData)
    const productionSettingFilterData = useSelector((state) => state.productionCrudSlice.productionSettingFilterData)

    const [productionSettingView, setProductionSettingViewModal] = useState(false)
    const [productionSettingData, setProductionSettingViewData] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const value = {
            url: 'inventory/particular',
            param: {
                term: searchKeyword,
                name: productionSettingFilterData.name && productionSettingFilterData.name,
                setting_type_id: productionSettingFilterData.setting_type_id && productionSettingFilterData.setting_type_id,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
        setParticularFetching(false)
    }, [fetching ,particularFetching]);

    return (
        <>
            <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'}>
                <KeywordSearch module={'production-setting'}/>
            </Box>
            <Box className={'borderRadiusAll border-top-none'}>
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
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (item) => (indexData.data.indexOf(item) + 1)
                        },
                        {accessor: 'setting_type_name', title: t("SettingType")},
                        {accessor: 'name', title: t("SettingName")},
                        {accessor: 'created', title: t("CreatedDate")},
                        {
                            accessor: 'status',
                            title: t("Status"),
                            render: (data) => (
                                data.status == 1 ? 'Active' : 'Inactive'
                            )
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100}
                                          closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color="red" radius="xl"
                                                        aria-label="Settings">
                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5}/>
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    dispatch(editEntityData('inventory/particular/' + data.id))
                                                    dispatch(setFormLoading(true))
                                                    navigate(`/inventory/particular/${data.id}`)
                                                }}
                                            >
                                                {t('Edit')}
                                            </Menu.Item>

                                            <Menu.Item
                                                onClick={() => {
                                                    setProductionSettingViewData(data)
                                                    setProductionSettingViewModal(true)
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Show')}
                                            </Menu.Item>
                                            <Menu.Item
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                                mt={'2'}
                                                bg={'red.1'}
                                                c={'red.6'}
                                                onClick={() => {
                                                    modals.openConfirmModal({
                                                        title: (
                                                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                        ),
                                                        children: (
                                                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                        ),
                                                        labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                        confirmProps: {color: 'red.6'},
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            dispatch(deleteEntityData('inventory/particular/' + data.id))
                                                            notifications.show({
                                                                color: 'red',
                                                                title: t('DeleteSuccessfully'),
                                                                icon: <IconCheck
                                                                    style={{width: rem(18), height: rem(18)}}/>,
                                                                loading: false,
                                                                autoClose: 700,
                                                                style: {backgroundColor: 'lightgray'},
                                                            });
                                                        },
                                                    });
                                                }}
                                                rightSection={<IconTrashX style={{width: rem(14), height: rem(14)}}/>}
                                            >
                                                {t('Delete')}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            ),
                        },
                    ]
                    }
                    fetching={fetching || particularFetching}
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
            {productionSettingView &&
                <_ParticularViewModal
                    productionSettingView={productionSettingView}
                    setProductionSettingViewModal={setProductionSettingViewModal}
                    productionSettingData={productionSettingData}
                    setProductionSettingViewData={setProductionSettingViewData}
                />}
        </>
    );
}

export default _ParticularTable;