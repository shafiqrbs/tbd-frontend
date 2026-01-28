import React, {useEffect, useState} from "react";
import {
    Modal,
    Box,
    ScrollArea,
    Table,
    Button,
    Group,
    NumberInput,
    Select,
    Loader,
    Text,
} from "@mantine/core";
import {DateInput} from "@mantine/dates";
import {useOutletContext} from "react-router-dom";
import {getIndexEntityData} from "../../../../store/accounting/crudSlice.js";
import {useDispatch} from "react-redux";
import {storeEntityData} from "../../../../store/core/crudSlice.js";
import {modals} from "@mantine/modals";
import {t} from "i18next";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {useDisclosure} from "@mantine/hooks";
import JournalViewModal from "./JournalViewModal.jsx";

function ReconciliationModal({opened, close}) {
    const {mainAreaHeight} = useOutletContext();
    const [height] = useState(mainAreaHeight - 250);

    const dispatch = useDispatch();

    const [filters, setFilters] = useState({
        start_date: new Date(),
        branch_id: "",
        head_id: "",
    });

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const allRowsApproved = rows.length > 0 && rows.every(r => r.approved_by_id);


    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d.toLocaleDateString('en-CA');
    };

    /* ---------------- FETCH BRANCH  ---------------- */
    const [branchDropdown, setBranchDropdown] = useState([])
    const [accountHeadDropdown, setAccountHeadDropdown] = useState([])

    useEffect(() => {
        const fetchDropdowns = async () => {
            // Fetch branch list
            const branchList = await dispatch(
                getIndexEntityData({
                    url: "domain/b2b/sub-domain",
                    param: {},
                })
            );

            if (getIndexEntityData.fulfilled.match(branchList)) {
                const data = branchList.payload?.data || [];
                setBranchDropdown(
                    data.map(type => ({
                        label: type.name,
                        value: String(type.sub_domain_id),
                    }))
                );
            }

            // Fetch account head list
            const accountHeadList = await dispatch(
                getIndexEntityData({
                    url: "accounting/select/head-for-reconciliation",
                    param: {},
                })
            );

            if (getIndexEntityData.fulfilled.match(accountHeadList)) {
                const data = accountHeadList.payload?.data || [];
                setAccountHeadDropdown(
                    data.map(type => ({
                        label: type.head_name,
                        value: String(type.id),
                    }))
                );
            }
        };

        fetchDropdowns();
    }, [dispatch]);

    /* ---------------- FETCH LIST ---------------- */
    const fetchData = async () => {
        setLoading(true);
        try {
            const value = {
                url: 'accounting/voucher-entry/reconciliation/items',
                param: {
                    start_date: formatDate(filters.start_date),
                    branch_id: filters.branch_id || null,
                    head_id: filters.head_id || null,
                }
            }
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.rejected.match(resultAction)) {
                console.error("Error:", resultAction);
            } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                setRows(resultAction.payload.data || [])
            }
        } catch (e) {
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    /* Fetch when modal opens or filters change */
    useEffect(() => {
        if (opened) fetchData();
    }, [opened]);


    /* ---------------- UPDATE AMOUNT ---------------- */

    const updateAmount = (i, field, value) => {
        setRows((prevRows) => {
            return prevRows.map((row, idx) => {
                if (idx !== i) return row;
                return {
                    ...row,
                    [field]: value || 0,
                    [field === "debit" ? "credit" : "debit"]: 0,
                    ["amount"]: value,
                };
            });
        });
    };

    const updateAmountIntoDB = (row) => {
        dispatch(storeEntityData({
            url: 'accounting/voucher-entry/reconciliation/inline-update',
            data: row,
        }));
    }

    const handleAllJournalApproved = () => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red"},
            onCancel: () => {
            },
            onConfirm: () => confirmApproved(),
        });
    };

    const confirmApproved = async () => {
        const journalIds = rows.map(item => item.journal_id);
        try {
            const resultAction = await dispatch(storeEntityData({
                url: 'accounting/voucher-entry/reconciliation/approve',
                data: {ids: journalIds},
            }));

            if (storeEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    setRows(prevRows =>
                        prevRows.map(r => ({...r, approved_by_id: true}))
                    );

                    showNotificationComponent(
                        t("ApproveSuccessfull"),
                        'teal',
                        null,
                        false,
                        1000,
                        true
                    );
                } else {
                    showNotificationComponent('Failed to approve', 'red', null, false, 1000, true)
                }
            }
        } catch (error) {
            console.error("Error updating entity:", error);
            showNotificationComponent('Failed to approve', 'red', null, false, 1000, true)
        } finally {
            fetchData();
        }
    };

    const [journalViewOpened, journalView] = useDisclosure(false);
    const [salesViewData, setSalesViewData] = useState(null)


    return (
        <>
            <Modal opened={opened} onClose={close} title="Voucher Reconciliation" size="70%">

                <Box
                    bg="white"
                    pos="sticky"
                    top={0}
                    p="sm"
                    style={{zIndex: 10, borderBottom: '1px solid #e9ecef'}}
                >
                    <Group>
                        <DateInput
                            value={filters.start_date}
                            onChange={(v) => setFilters({...filters, start_date: v})}
                            placeholder="Date"
                            clearable
                        />

                        <Select
                            placeholder="Branch"
                            data={branchDropdown}
                            value={filters.branch_id}
                            onChange={(v) => setFilters({...filters, branch_id: v})}
                            clearable
                        />

                        <Select
                            placeholder="Account Head"
                            data={accountHeadDropdown}
                            value={filters.head_id}
                            onChange={(v) => setFilters({...filters, head_id: v})}
                            clearable
                        />

                        <Button onClick={fetchData}>Search</Button>
                    </Group>
                </Box>

                {/* SCROLLABLE TABLE ONLY */}
                <ScrollArea h={height}>
                    {loading ? (
                        <Group justify="center" mt="lg">
                            <Loader/>
                        </Group>
                    ) : rows.length === 0 ? (
                        <Text ta="center" c="dimmed" mt="lg">
                            No reconciliation items found
                        </Text>
                    ) : (
                        <Table striped stickyHeader>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>#</Table.Th>
                                    <Table.Th>Journal No</Table.Th>
                                    <Table.Th>Head</Table.Th>
                                    <Table.Th>Ledger</Table.Th>
                                    <Table.Th ta="right">Debit</Table.Th>
                                    <Table.Th ta="right">Credit</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {rows.map((row, i) => (
                                    <Table.Tr
                                        key={row.id}
                                        bg={row.approved_by_id ? 'green.1' : undefined}
                                    >
                                        <Table.Td>{i + 1}</Table.Td>
                                        <Table.Td>
                                            <Text
                                                component="a"
                                                size="sm"
                                                variant="subtle"
                                                c='var(--theme-primary-color-6)'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSalesViewData(row.journal_id)
                                                    journalView.open();
                                                }}
                                                style={{cursor: "pointer"}}
                                            >
                                                {row.invoice_no}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>{row.head_name}</Table.Td>
                                        <Table.Td>{row.sub_head_name}</Table.Td>

                                        <Table.Td ta="right">
                                            {row.mode === 'debit' && (
                                                <NumberInput
                                                    size="xs"
                                                    value={row.amount}
                                                    onChange={(v) =>
                                                        updateAmount(i, "credit", v)
                                                    }
                                                    onBlur={() => updateAmountIntoDB(rows[i])}
                                                    disabled={!!row.approved_by_id}
                                                />
                                            )}
                                        </Table.Td>

                                        <Table.Td ta="right">
                                            {row.mode === 'credit' && (
                                                <NumberInput
                                                    size="xs"
                                                    value={row.amount}
                                                    onChange={(v) =>
                                                        updateAmount(i, "debit", v)
                                                    }
                                                    onBlur={() => updateAmountIntoDB(rows[i])}
                                                    disabled={!!row.approved_by_id}
                                                />
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}
                </ScrollArea>

                <Box
                    pos="sticky"
                    bottom={0}
                    bg="white"
                    p="sm"
                    style={{borderTop: '1px solid #e9ecef'}}
                >
                    <Group justify="flex-end">
                        <Button
                            color="green"
                            onClick={handleAllJournalApproved}
                            disabled={rows.length === 0 || allRowsApproved}
                        >
                            Approve
                        </Button>
                    </Group>
                </Box>

            </Modal>
            <JournalViewModal
                opened={journalViewOpened}
                close={journalView.close}
                id={salesViewData}
            />
        </>
    );
}

export default ReconciliationModal;
