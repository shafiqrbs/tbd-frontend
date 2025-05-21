import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group, Box, ActionIcon, Text, rem, Menu
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData, getIndexEntityData, setFetching,
    setFormLoading, setInsertType, deleteEntityData
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";
import tableCss from "../../../../assets/css/Table.module.css";
import HeadDomainUpdateFrom from "./HeadDomainUpdateFrom";
import HeadDomainViewDrawer from "./HeadDomainViewDrawer";

function HeadDomainTable() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 98;
    const perPage = 50;
    const [page, setPage] = useState(1);
    const [headGroupDrawer, setHeadGroupDrawer] = useState(false);
    const navigate = useNavigate();

    const fetching = useSelector((state) => state.crudSlice.fetching);
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);

    const [indexData, setIndexData] = useState({
        data: [],
        total: 0,
        loading: true,
        error: null
    });

    const fetchData = useCallback(async () => {
        setIndexData(prev => ({ ...prev, loading: true, error: null }));

        try {
            const resultAction = await dispatch(getIndexEntityData({
                url: 'accounting/account-head',
                param: {
                    group: 'head',
                    term: searchKeyword,
                    page: page,
                    offset: perPage
                }
            }));

            if (getIndexEntityData.fulfilled.match(resultAction)) {
                setIndexData({
                    data: resultAction.payload.data || [],
                    total: resultAction.payload.total || 0,
                    loading: false,
                    error: null
                });
            } else if (getIndexEntityData.rejected.match(resultAction)) {
                setIndexData(prev => ({
                    ...prev,
                    loading: false,
                    error: t('Failed to load data')
                }));
            }
        } catch (err) {
            setIndexData(prev => ({
                ...prev,
                loading: false,
                error: t('An unexpected error occurred')
            }));
        } finally {
            dispatch(setFetching(false));
        }
    }, [dispatch, searchKeyword, page, perPage, t]);

    useEffect(() => {
        const controller = new AbortController();
        fetchData();
        return () => controller.abort();
    }, [fetchData, fetching]);

    const handleEdit = (id) => {
        dispatch(setInsertType('update'));
        dispatch(editEntityData(`accounting/account-head/${id}`));
        dispatch(setFormLoading(true));
        navigate(`/accounting/head-group/${id}`);
    };

    const handleShow = (id) => {
        setHeadGroupDrawer(true);
        // dispatch(showEntityData('core/customer/' + id)) if needed
    };

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: t('Confirm'), cancel: t('Cancel') },
            confirmProps: { color: 'red.6' },
            onConfirm: () => {
                dispatch(deleteEntityData(`accounting/account-head/${id}`));
                dispatch(setFetching(true));
            },
        });
    };

    const columns = useMemo(() => [
        {
            accessor: 'index',
            title: t('S/N'),
            textAlignment: 'right',
            render: (item) => (indexData.data.indexOf(item) + 1)
        },
        { accessor: 'name', title: t('Name') },
        { accessor: 'mother_name', title: t('NatureOfGroup') },
        { accessor: 'code', title: t('AccountCode') },
        { accessor: 'amount', title: t('Amount') },
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
                            <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                onClick={() => handleEdit(data.id)}
                            >
                                {t('Edit')}
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => handleShow(data.id)}
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
                                onClick={() => handleDelete(data.id)}
                                rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
                            >
                                {t('Delete')}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
                    )}</>
            ),
        },
    ], [t, indexData.data]);

    return (
        <>
            <Box pl="xs" pr={8} pt="6" pb="4" className="boxBackground borderRadiusAll border-bottom-none">
                <KeywordSearch module="account-head" />
            </Box>

            <Box className="borderRadiusAll border-top-none" pos="relative">

                {indexData.error ? (
                    <Box p="md" ta="center">
                        <Text c="red">{indexData.error}</Text>
                        <Button mt="sm" onClick={fetchData}>
                            {t('Retry')}
                        </Button>
                    </Box>
                ) : (
                    <DataTable
                        classNames={{
                            root: tableCss.root,
                            table: tableCss.table,
                            header: tableCss.header,
                            footer: tableCss.footer,
                            pagination: tableCss.pagination,
                        }}
                        records={indexData.data}
                        fetching={fetching}
                        columns={columns}
                        totalRecords={indexData.total}
                        recordsPerPage={perPage}
                        page={page}
                        onPageChange={(p) => {
                            setPage(p);
                            dispatch(setFetching(true));
                        }}
                        loaderSize="xs"
                        loaderColor="grape"
                        height={height}
                        scrollAreaProps={{ type: 'never' }}
                    />
                )}
            </Box>

            {headGroupDrawer && (
                <HeadDomainViewDrawer
                    headGroupDrawer={headGroupDrawer}
                    setHeadGroupDrawer={setHeadGroupDrawer}
                />
            )}
        </>
    );
}

export default HeadDomainTable;