import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box, Grid,
    ActionIcon, Text, Title, Stack, rem, Menu, Flex, Switch
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconEye, IconEdit, IconTrash, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFetching, setFormLoading,
    setInsertType,
    showEntityData,
    deleteEntityData
} from "../../../../store/accounting/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";
import tableCss from "../../../../assets/css/Table.module.css";
import HeadSubGroupViewDrawer from "./HeadSubGroupViewDrawer";
function HeadSubGroupTable(props) {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104
    const perPage = 50;
    const [page, setPage] = useState(1);
    const [headGroupDrawer, setHeadGroupDrawer] = useState(false)

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const navigate = useNavigate()
    const [switchEnable, setSwitchEnable] = useState({});

    const handleSwitch = (event, item) => {
        setSwitchEnable((prev) => ({ ...prev, [item.id]: true }));
        dispatch(
            editEntityData(
                `accounting/account-head/status-update/${item.id}`
            )
        );
    };

    useEffect(() => {
        const value = {
            url: 'accounting/account-head',
            param: {
                group: 'sub-head',
                term: searchKeyword,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    return (

        <>
            <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'} >
                <KeywordSearch module={'account-head'} />
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
                        { accessor: 'parent_name', title: t('AccountHead') },
                        { accessor: 'name', title: t('Name') },
                        { accessor: 'code', title: t('AccountCode') },
                        {
                            accessor: 'amount',
                            title: t('Amount'),
                            render: (item) => Math.round(item.amount),
                        },
                        {
                            accessor: "status",
                            title: t("Status"),
                            textAlign: "center",
                            render: (data) => (
                                <>
                                    <Flex justify="center" align="center">
                                        <Switch
                                            defaultChecked={data.status == 1 ? true : false}
                                            color='var(--theme-primary-color-6)'
                                            radius="xs"
                                            size="md"
                                            onLabel="Enable"
                                            offLabel="Disable"
                                            onChange={(event) => {
                                                handleSwitch(event.currentTarget.checked, data);
                                            }}
                                        />
                                    </Flex>
                                </>
                            ),
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <>
                                {data.is_private !== 1 &&(
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color='var(--theme-primary-color-6)' radius="xl" aria-label="Settings">
                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    dispatch(editEntityData(`accounting/account-head/${data.id}`))
                                                    dispatch(setFormLoading(true))
                                                    navigate(`/accounting/head-subgroup/${data.id}`)
                                                }}
                                            >
                                                {t('Edit')}
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={() => {
                                                    // setHeadGroupDrawer(true)
                                                    navigate(
														`/accounting/ledger/view/${data.id}`, {state: {headSubGroup: true}}
													);
                                                    // dispatch(showEntityData('core/customer/' + data.id))
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Show')}
                                            </Menu.Item>
                                            <Menu.Item
                                                // href={``}
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
                                                        labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                        confirmProps: { color: 'red.6' },
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            dispatch(deleteEntityData('accounting/account-head/' + data.id))
                                                            dispatch(setFetching(true))
                                                        },
                                                    });
                                                }}
                                                rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
                                            >
                                                {t('Delete')}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                                )}
                                </>
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
            {headGroupDrawer && <HeadSubGroupViewDrawer headGroupDrawer={headGroupDrawer}
                                                        setHeadGroupDrawer={setHeadGroupDrawer} />}
        </>

    );
}
export default HeadSubGroupTable;
