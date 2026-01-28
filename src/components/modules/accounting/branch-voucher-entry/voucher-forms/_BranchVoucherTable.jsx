import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    Grid,
    Text,
    Button,
    Table, Menu, ActionIcon, rem
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconDotsVertical, IconTrashX} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    getIndexEntityData,
    setFetching,
} from "../../../../../store/accounting/crudSlice.js";
import KeywordSearch from "../../../filter/KeywordSearch.jsx";
import {modals} from "@mantine/modals";
import tableCss from "../../../../../assets/css/Table.module.css";
import Navigation from "../../common/Navigation.jsx";
import {showInstantEntityData} from "../../../../../store/inventory/crudSlice.js";
import {showNotificationComponent} from "../../../../core-component/showNotificationComponent.jsx";
import {useDisclosure} from "@mantine/hooks";
import ReconciliationModal from "../../common/ReconciliationModal.jsx";
import JournalViewModal from "../../common/JournalViewModal.jsx";
import {deleteEntityData} from "../../../../../store/core/crudSlice.js";

function _BranchVoucherTable(props) {

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const perPage = 50;
    const [page, setPage] = useState(1);
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 70; //TabList height 104
    const [loading, setLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState('');

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const [indexData, setIndexData] = useState([])
    const [reloadData, setReloadData] = useState(true)

    const [salesViewData, setSalesViewData] = useState({})

    useEffect(() => {
        setSalesViewData(indexData.data && indexData.data[0] && indexData.data[0])
        setSelectedRow(indexData.data && indexData.data[0] && indexData.data[0].invoice_no)
    }, [indexData.data])


    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'accounting/voucher-entry',
                param: {
                    term: searchKeyword,
                    is_branch: true,
                    page: page,
                    offset: perPage
                }
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                // Handle rejected state
                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                }
                // Handle fulfilled state
                else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload)
                }
            } catch (error) {
                console.error("Unexpected error in fetchData:", error);
            } finally {
                setReloadData(false);
                setLoading(false)

            }
        };

        // Call the async function
        fetchData();
    }, [dispatch, fetching, reloadData]);

    const handleVoucherApprove = async (id) => {
        try {
            const resultAction = await dispatch(showInstantEntityData('accounting/voucher-entry/approve/' + id));
            if (showInstantEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    // Show success notification
                    showNotificationComponent(t("ApproveSuccessfull"), 'teal', null, false, 1000, true)
                } else {
                    showNotificationComponent('Failed to approve', 'red', null, false, 1000, true)
                }
            }
        } catch (error) {
            console.error("Error updating entity:", error);
            showNotificationComponent('Failed to approve', 'red', null, false, 1000, true)
        } finally {
            setReloadData(true);
        }
    };

    const handleJournalDelete = async (id) => {
        const resultAction = await dispatch(deleteEntityData(`accounting/voucher-entry/${id}`));
        const status = resultAction?.payload?.data?.status;
        if (status === 200) {
            showNotificationComponent(resultAction?.payload?.data.message, "red");
            setReloadData(true)
        } else {
            showNotificationComponent("Something went wrong", "red");
        }
    };

    const [opened, {open, close}] = useDisclosure(false);
    const [journalViewOpened, journalView] = useDisclosure(false);

    return (
        <>
            <Box pt={6} bg={"#f0f1f9"}>
                <Box>
                    <Grid columns={24} gutter={{base: 8}}>
                        <Grid.Col span={1}><Navigation module={"voucher-entry"}/></Grid.Col>
                        <Grid.Col span={23}>
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'4'}
                                     className={'boxBackground borderRadiusAll border-bottom-none'}>
                                    <KeywordSearch module={'voucher-entry'} open={open}/>
                                </Box>
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
                                                title: t('S/N'),
                                                textAlignment: 'right',
                                                render: (item) => (indexData.data.indexOf(item) + 1)

                                            },

                                            {accessor: 'created', title: t("Created")},
                                            {accessor: 'branch_name', title: t("BranchName")},
                                            {
                                                accessor: 'invoice_no',
                                                title: t("Invoice"),
                                                render: (item) => (
                                                    <Text
                                                        component="a"
                                                        size="sm"
                                                        variant="subtle"
                                                        c='var(--theme-primary-color-6)'
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setLoading(true)
                                                            setSalesViewData(item)
                                                            setSelectedRow(item.invoice_no)
                                                            setLoading(false)
                                                            journalView.open();
                                                        }}
                                                        style={{cursor: "pointer"}}
                                                    >
                                                        {item.invoice_no}
                                                    </Text>

                                                )
                                            },
                                            {accessor: 'voucher_name', title: t('VoucherName')},
                                            {accessor: 'process', title: t('Process')},
                                            {accessor: 'debit', title: t('Amount')},
                                            {accessor: 'issue_date', title: t('IssueDate')},
                                            {
                                                accessor: "action",
                                                title: t("Action"),
                                                textAlign: "right",
                                                render: (data) => (
                                                    <Group gap={4} justify="right" wrap="nowrap">
                                                        {
                                                            data.process === 'Created' && data.can_approve &&
                                                            <Button
                                                                size="compact-xs"
                                                                radius="xs"
                                                                variant="filled"
                                                                fw={'100'} fz={'12'}
                                                                color='var(--theme-primary-color-6)'
                                                                mr={'4'}
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    modals.openConfirmModal({
                                                                        title: (<Text
                                                                            size="md"> {t("ApproveConformation")}</Text>),
                                                                        children: (
                                                                            <Text
                                                                                size="sm"> {t("FormConfirmationMessage")}</Text>),
                                                                        labels: {
                                                                            confirm: 'Confirm',
                                                                            cancel: 'Cancel'
                                                                        },
                                                                        onCancel: () => console.log('Cancel'),
                                                                        onConfirm: () => {
                                                                            handleVoucherApprove(data.id)
                                                                        },
                                                                    });
                                                                }}
                                                            >  {t('Approve')}</Button>
                                                        }

                                                        <Menu
                                                            position="bottom-end"
                                                            withArrow
                                                            trigger="hover"
                                                            width={200}
                                                            openDelay={100}
                                                            closeDelay={400}
                                                        >
                                                            <Menu.Target>
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="outline"
                                                                    color="var(--theme-primary-color-6)"
                                                                    radius="xl"
                                                                >
                                                                    <IconDotsVertical height={18} width={18}
                                                                                      stroke={1.5}/>
                                                                </ActionIcon>
                                                            </Menu.Target>
                                                            <Menu.Dropdown>

                                                                {!data.approved_by_id && (
                                                                    <Menu.Item
                                                                        bg="red.1"
                                                                        c="var(--theme-primary-color-6)"
                                                                        onClick={() =>
                                                                            modals.openConfirmModal({
                                                                                title: <Text
                                                                                    size="md">{t('FormConfirmationTitle')}</Text>,
                                                                                children: (
                                                                                    <Text
                                                                                        size="sm">{t('FormConfirmationMessage')}</Text>
                                                                                ),
                                                                                labels: {
                                                                                    confirm: 'Confirm',
                                                                                    cancel: 'Cancel'
                                                                                },
                                                                                confirmProps: {color: 'red.6'},
                                                                                onConfirm: () => handleJournalDelete(data.id)
                                                                            })
                                                                        }
                                                                        rightSection={
                                                                            <IconTrashX style={{
                                                                                width: rem(14),
                                                                                height: rem(14)
                                                                            }}/>
                                                                        }
                                                                    >
                                                                        {t('Delete')}
                                                                    </Menu.Item>
                                                                )}
                                                            </Menu.Dropdown>
                                                        </Menu>
                                                    </Group>
                                                ),
                                            }
                                        ]
                                        }
                                        fetching={reloadData}
                                        totalRecords={indexData.total}
                                        recordsPerPage={perPage}
                                        page={page}
                                        onPageChange={(p) => {
                                            setPage(p)
                                            dispatch(setFetching(true))
                                        }}
                                        loaderSize="xs"
                                        loaderColor="grape"
                                        height={tableHeight - 32}
                                        scrollAreaProps={{type: 'never'}}
                                        rowBackgroundColor={(item) => {
                                            if (item.invoice_no === selectedRow) return '#e2c2c263';
                                        }}
                                        rowColor={(item) => {
                                            if (item.invoice_no === selectedRow) return 'red.6';
                                        }}
                                    />
                                </Box>
                            </Box>

                        </Grid.Col>
                    </Grid>
                </Box>
            </Box>

            <ReconciliationModal opened={opened} close={close}/>
            <JournalViewModal
                opened={journalViewOpened}
                close={journalView.close}
                id={salesViewData?.id}
            />

        </>
    );
}

export default _BranchVoucherTable;
