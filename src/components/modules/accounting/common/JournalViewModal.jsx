import React, {useEffect, useState} from "react";
import {
    Modal,
    Box,
    ScrollArea,
    Table,
    Text,
    Grid,
    LoadingOverlay,
} from "@mantine/core";
import {useOutletContext} from "react-router-dom";
import {getIndexEntityData} from "../../../../store/accounting/crudSlice.js";
import {useDispatch} from "react-redux";
import {t} from "i18next";

function JournalViewModal({opened, close, id}) {
    const {mainAreaHeight} = useOutletContext();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [salesViewData, setSalesViewData] = useState(null);

    /* ---------------- FETCH DATA ---------------- */
    useEffect(() => {
        if (!opened || !id) return;

        const fetchViewData = async () => {
            setLoading(true);

            const result = await dispatch(
                getIndexEntityData({
                    url: `accounting/voucher-entry/${id}`,
                    param: {},
                })
            );

            if (getIndexEntityData.fulfilled.match(result)) {
                setSalesViewData(result.payload?.data || null);
            }

            setLoading(false);
        };

        fetchViewData();
    }, [dispatch, opened, id]);

    /* ---------------- TABLE ROWS ---------------- */
    const rows =
        salesViewData?.journal_items?.map((item, index) => (
            <Table.Tr key={index}>
                <Table.Td fz="xs">{index + 1}</Table.Td>
                <Table.Td fz="xs">{item.head_name}</Table.Td>
                <Table.Td fz="xs">{item.ledger_name}</Table.Td>
                <Table.Td fz="xs" ta="center">{item.debit}</Table.Td>
                <Table.Td fz="xs" ta="right">{item.credit}</Table.Td>
            </Table.Tr>
        )) || [];

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Journal Details"
            size="70%"
        >
            <ScrollArea h={mainAreaHeight - 120} scrollbarSize={4}>

                {loading && (
                    <LoadingOverlay
                        visible
                        zIndex={1000}
                        overlayProps={{radius: "sm", blur: 2}}
                    />
                )}

                {!salesViewData && !loading ? (
                    <Text ta="center" c="dimmed" mt="lg">
                        No view items found
                    </Text>
                ) : (
                    <Box bg="white" p="xs" className="borderRadiusAll">

                        {/* ---------- HEADER ---------- */}
                        <Box
                            mb="xs"
                            p="xs"
                            fw={600}
                            className="boxBackground textColor borderRadiusAll"
                        >
                            {t("Invoice")}: {salesViewData?.invoice_no}
                        </Box>

                        {/* ---------- INFO GRID ---------- */}
                        <Box
                            mb="xs"
                            p="xs"
                            className="boxBackground textColor borderRadiusAll"
                        >
                            <Grid gutter={4}>
                                <Grid.Col span={6}>
                                    <Text fz="sm">{t("Voucher")}: {salesViewData?.voucher_name}</Text>
                                    <Text fz="sm">{t("InvoiceNo")}: {salesViewData?.invoice_no}</Text>
                                    <Text fz="sm">{t("CreatedDate")}: {salesViewData?.created}</Text>
                                    <Text fz="sm">{t("IssueDate")}: {salesViewData?.issue_date}</Text>
                                </Grid.Col>

                                <Grid.Col span={6}>
                                    <Text fz="sm">{t("CreatedBy")}: {salesViewData?.created_by_name}</Text>
                                    <Text fz="sm">{t("ApproveBy")}: {salesViewData?.approve_by_name}</Text>
                                    <Text fz="sm">{t("RefNo")}: {salesViewData?.ref_no}</Text>
                                    <Text fz="sm">{t("Process")}: {salesViewData?.process}</Text>
                                </Grid.Col>
                            </Grid>
                        </Box>

                        {/* ---------- TABLE ---------- */}
                        <Table striped stickyHeader>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th fz="xs">#</Table.Th>
                                    <Table.Th fz="xs">{t("HeadName")}</Table.Th>
                                    <Table.Th fz="xs">{t("LedgerName")}</Table.Th>
                                    <Table.Th fz="xs" ta="center">{t("Debit")}</Table.Th>
                                    <Table.Th fz="xs" ta="right">{t("Credit")}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>{rows}</Table.Tbody>

                            <Table.Tfoot>
                                <Table.Tr>
                                    <Table.Th colSpan={3} ta="right" fz="xs">
                                        {t("Total")}
                                    </Table.Th>
                                    <Table.Th ta="center" fz="xs">
                                        {Number(salesViewData?.debit || 0).toFixed(2)}
                                    </Table.Th>
                                    <Table.Th ta="right" fz="xs">
                                        {Number(salesViewData?.credit || 0).toFixed(2)}
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Tfoot>
                        </Table>

                        {/* ---------- NARRATION ---------- */}
                        <Box mt="xs" pl="xs">
                            <Text fz="sm">
                                {t("Narration")}: {salesViewData?.description}
                            </Text>
                        </Box>

                    </Box>
                )}
            </ScrollArea>
        </Modal>
    );
}

export default JournalViewModal;
