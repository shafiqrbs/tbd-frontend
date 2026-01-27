import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Grid,
    Table,
    Text,
    Progress,
    LoadingOverlay,
    Divider, Button
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import { getIndexEntityData } from "../../../../store/report/reportSlice";

import ReportNavigation from "../ReportNavigation";
import batchTableCss from "../../../../assets/css/ProductBatchTable.module.css";
import _AccountingReportSearch from "./_AccountingReportSearch.jsx";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AccountingIncomeExpenseReport() {
    const progress = getLoadingProgress();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();

    const height = mainAreaHeight - 66;
    const perPage = 20;

    const [indexData, setIndexData] = useState([]);
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState(false);

    const productionIssueFilterData = useSelector(
        (state) => state.reportSlice.productionIssueFilterData
    );

    const ledgers = indexData?.ledgers || [];
    const receives = indexData?.receives || [];

    // remove 0 value from receive
    const visibleLedgers = ledgers.filter(acc =>
        receives.some(row => (row[acc.id] || 0) !== 0)
    );
    const expenses = indexData?.expenses || [];
    const summary = indexData?.summary || [];

    const bankTotal = summary.reduce((s, i) => s + (i.amount || 0), 0);
    const totalSales = receives.reduce((sum, row) => sum + (row.total || 0), 0);
    const expenseTotal = expenses.reduce((s, i) => s + (i.amount || 0), 0);

    const grandTotal = bankTotal + totalSales;
    const netBalance = grandTotal - expenseTotal;

    // Safe date formatter
    const formatDateOnly = (value) => {
        if (!value) return "";
        if (value instanceof Date) {
            const y = value.getFullYear();
            const m = String(value.getMonth() + 1).padStart(2, "0");
            const d = String(value.getDate()).padStart(2, "0");
            return `${d}-${m}-${y}`;
        }
        if (typeof value === "string") {
            return value.split("-").reverse().join("-");
        }
        return "";
    };

    // Fetch data only when both dates exist
    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: "accounting/report/income-expense",
                param: {
                    start_date: formatDateOnly(productionIssueFilterData.start_date),
                    end_date: formatDateOnly(productionIssueFilterData.end_date),
                    page,
                    offset: perPage
                }
            };
            
            try {
                const resultAction = await dispatch(getIndexEntityData(value));
                if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction?.payload?.data);
                } else {
                    console.error(resultAction);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setSearchValue(false);
            }
        };

        if (
            productionIssueFilterData.start_date &&
            productionIssueFilterData.end_date
        ) {
            fetchData();
        }
    }, [
        dispatch,
        productionIssueFilterData.start_date,
        productionIssueFilterData.end_date,
        page,
        perPage,
        searchValue
    ]);

    const exportToExcel = () => {
        if (!indexData) return;

        const rows = [];

        // ================= REPORT HEADER =================
        rows.push(["Sandra Foods International Limited"]);
        rows.push(["Daily Income & Expense Details"]);
        rows.push([
            "Period:",
            `${formatDateOnly(productionIssueFilterData.start_date)} TO ${formatDateOnly(productionIssueFilterData.end_date)}`
        ]);
        rows.push([]); // empty row

        // ================= BANK =================
        rows.push(["Bank Purpose Received"]);
        rows.push(["Description", "Opening", "Received", "Payment", "Closing"]);

        summary.forEach(row => {
            rows.push([
                row.desc,
                row.opening || 0,
                row.received || 0,
                row.payment || 0,
                row.amount || 0
            ]);
        });

        rows.push(["Total", "", "", "", bankTotal]);
        rows.push([]); // spacing

        // ================= OUTLET SALES =================
        rows.push(["Cash Received from Outlet Sales"]);
        const ledgerHeaders = ledgers.map(l => l.display_name);
        rows.push(["Description", ...ledgerHeaders, "Total"]);

        receives.forEach(row => {
            const r = [row.outlet];
            ledgers.forEach(l => r.push(row[l.id] || 0));
            r.push(row.total || 0);
            rows.push(r);
        });

        const grandTotalRow = ["Grand Total"];
        ledgers.forEach(l => {
            const sum = receives.reduce((s, r) => s + (r[l.id] || 0), 0);
            grandTotalRow.push(sum);
        });
        grandTotalRow.push(receives.reduce((s, r) => s + (r.total || 0), 0));
        rows.push(grandTotalRow);
        rows.push([]); // spacing

        // ================= EXPENSES =================
        rows.push(["Expenses (Account)"]);
        rows.push(["Description", "Amount"]);

        expenses.forEach(row => {
            rows.push([row.sub_head_name, row.amount]);
        });

        rows.push(["Total Expense", expenseTotal]);
        rows.push([]); // spacing

        // ================= NET BALANCE =================
        rows.push(["Grand Total (Bank + Sales)", grandTotal]);
        rows.push(["Total Expense", expenseTotal]);
        rows.push(["Net Balance", netBalance]);

        // ================= CREATE SHEET =================
        const ws = XLSX.utils.aoa_to_sheet(rows);

        // ================= MERGES =================
        ws["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: Math.max(ledgers.length + 1, 4) } }, // company
            { s: { r: 1, c: 0 }, e: { r: 1, c: Math.max(ledgers.length + 1, 4) } }, // report title
            { s: { r: 2, c: 1 }, e: { r: 2, c: Math.max(ledgers.length + 1, 4) } }  // period text
        ];

        // ================= STYLING =================
        const range = XLSX.utils.decode_range(ws["!ref"]);

        for (let R = 0; R <= range.e.r; ++R) {
            for (let C = 0; C <= range.e.c; ++C) {
                const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = ws[cell_address];
                if (!cell) continue;

                if (!cell.s) cell.s = { font: {}, alignment: {} };

                // Report header bold & center
                if (R <= 1) {
                    cell.s.font.bold = true;
                    cell.s.alignment = { horizontal: "center" };
                }

                // Table headers bold
                if (
                    [5, 6, 8 + summary.length, 9 + summary.length + receives.length, 11 + summary.length + receives.length + expenses.length].includes(R)
                ) {
                    cell.s.font.bold = true;
                }

                // Totals bold
                if (
                    R === 5 + summary.length || // Bank total
                    R === 9 + summary.length + receives.length || // Outlet Grand total
                    R === 11 + summary.length + receives.length + expenses.length // Expense total
                ) {
                    cell.s.font.bold = true;
                    cell.s.fill = { fgColor: { rgb: "FFFF00" } }; // optional yellow fill
                }

                // Right-align numeric columns
                if (C > 0) {
                    cell.s.alignment.horizontal = "right";
                }

                // Table background colors
                if (R >= 5 && R <= 5 + summary.length) {
                    cell.s.fill = { fgColor: { rgb: "DDEBF7" } }; // Bank table: light blue
                }
                if (R >= 8 + summary.length && R <= 9 + summary.length + receives.length) {
                    cell.s.fill = { fgColor: { rgb: "E2EFDA" } }; // Outlet Sales: light green
                }
                if (R >= 11 + summary.length + receives.length && R <= 11 + summary.length + receives.length + expenses.length) {
                    cell.s.fill = { fgColor: { rgb: "FCE4D6" } }; // Expenses: light orange
                }
            }
        }

        // ================= COLUMN WIDTH =================
        const maxCols = Math.max(ledgers.length + 2, 5);
        ws["!cols"] = Array(maxCols).fill({ wch: 20 });

        // ================= EXPORT =================
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Income & Expense Report");

        const start = formatDateOnly(productionIssueFilterData.start_date);
        const end = formatDateOnly(productionIssueFilterData.end_date);
        XLSX.writeFile(wb, `Income_Expense_Report_${start}_to_${end}.xlsx`);
    };


    return (
        <>
            {progress !== 100 && (
                <Progress
                    color="var(--theme-primary-color-6)"
                    size="sm"
                    striped
                    animated
                    value={progress}
                />
            )}

            {progress === 100 && (
                <Box>
                    <LoadingOverlay
                        visible={searchValue}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                    />

                    <Box p="xs">
                        <Grid columns={24} gutter={8}>
                            <Grid.Col span={4}>
                                <ReportNavigation height={height} />
                            </Grid.Col>

                            <Grid.Col span={20}>
                                {/*<Button
                                    color="blue"
                                    onClick={exportToExcel}
                                    style={{ marginBottom: "10px" }}
                                >
                                    Export to Excel
                                </Button>*/}
                                {/* Header */}
                                <Box className="boxBackground borderRadiusAll">
                                    <Grid columns={24}>
                                        <Grid.Col span={8}>
                                            <Text p="md">{t("Daily Income & Expense Report")}</Text>
                                        </Grid.Col>

                                        <Grid.Col span={16}>
                                            <_AccountingReportSearch
                                                module="production-issue"
                                                setSearchValue={setSearchValue}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Box>

                                {/* Table */}
                                <Box bg="white" className="borderRadiusAll" p="8">
                                    <div
                                        className={batchTableCss.responsiveTableWrapper}
                                        style={{ height, overflow: "auto" }}
                                    >
                                        {/* ================= HEADER ================= */}
                                        <Text ta="center" fw={700} size="lg">
                                            Sandra Foods International Limited
                                        </Text>
                                        <Text ta="center" fw={600}>
                                            Daily Income & Expense Details
                                        </Text>
                                        <Text ta="center" mb="md">
                                            <Text span c="gray.6">
                                                {formatDateOnly(productionIssueFilterData.start_date)}
                                            </Text>
                                            {" TO "}
                                            <Text span c="gray.6">
                                                {formatDateOnly(productionIssueFilterData.end_date)}
                                            </Text>
                                        </Text>

                                        {/* ================= BANK TRANSFER ================= */}
                                        <Text fw={700} mt="md">
                                            Bank Purpose Received
                                        </Text>
                                        <Table withTableBorder withColumnBorders striped>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>Description</Table.Th>
                                                    <Table.Th ta="right">Opening</Table.Th>
                                                    <Table.Th ta="right">Received</Table.Th>
                                                    <Table.Th ta="right">Payment</Table.Th>
                                                    <Table.Th ta="right">Closing</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>

                                            <Table.Tbody>
                                                {summary
                                                    .filter(row =>
                                                        (row.opening || 0) !== 0 ||
                                                        (row.received || 0) !== 0 ||
                                                        (row.payment || 0) !== 0 ||
                                                        (row.amount || 0) !== 0
                                                    )
                                                    .map((row, i) => (
                                                        <Table.Tr key={i}>
                                                            <Table.Td>{row.desc}</Table.Td>
                                                            <Table.Td ta="right">{(row.opening || 0).toLocaleString()}</Table.Td>
                                                            <Table.Td ta="right">{(row.received || 0).toLocaleString()}</Table.Td>
                                                            <Table.Td ta="right">{(row.payment || 0).toLocaleString()}</Table.Td>
                                                            <Table.Td ta="right">{(row.amount || 0).toLocaleString()}</Table.Td>
                                                        </Table.Tr>
                                                    ))}


                                                <Table.Tr className={batchTableCss.highlightedRow}>
                                                    <Table.Td colSpan={4} ta="right"><b>Total</b></Table.Td>
                                                    <Table.Td ta="right"><b>{bankTotal.toLocaleString()}</b></Table.Td>
                                                </Table.Tr>
                                            </Table.Tbody>
                                        </Table>

                                        {/* ================= OUTLET SALES ================= */}
                                        <Text fw={700} mt="xl">Cash Received from Outlet Sales</Text>
                                        <div style={{ overflowX: "auto", width: "100%" }}>

                                        {/*with 0 value receive*/}
                                        {/*<Table withTableBorder withColumnBorders striped>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>Description</Table.Th>
                                                    {ledgers.map(acc => (
                                                        <Table.Th key={acc.id} ta="right">{acc.display_name}</Table.Th>
                                                    ))}
                                                    <Table.Th ta="right">Total</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>

                                            <Table.Tbody>
                                                {receives.map((row, i) => (
                                                    <Table.Tr key={i}>
                                                        <Table.Td>{row.outlet}</Table.Td>
                                                        {ledgers.map(acc => (
                                                            <Table.Td key={acc.id} ta="right">
                                                                {row[acc.id]?.toLocaleString() || "0"}
                                                            </Table.Td>
                                                        ))}
                                                        <Table.Td ta="right">{row.total?.toLocaleString() || "0"}</Table.Td>
                                                    </Table.Tr>
                                                ))}

                                                {receives.length > 0 && (
                                                    <Table.Tr style={{ fontWeight: "bold" }}>
                                                        <Table.Td colSpan={1} ta="right">Grand Total</Table.Td>
                                                        {ledgers.map(acc => {
                                                            const sum = receives.reduce((total, row) => total + (row[acc.id] || 0), 0);
                                                            return <Table.Td key={acc.id} ta="right">{sum.toLocaleString()}</Table.Td>;
                                                        })}
                                                        <Table.Td ta="right">{receives.reduce((total, row) => total + (row.total || 0), 0).toLocaleString()}</Table.Td>
                                                    </Table.Tr>
                                                )}
                                            </Table.Tbody>
                                        </Table>*/}

                                            {/*without 0 value receive*/}

                                            <Table withTableBorder withColumnBorders striped>
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th>Description</Table.Th>

                                                        {visibleLedgers.map(acc => (
                                                            <Table.Th key={acc.id} ta="right">
                                                                {acc.display_name}
                                                            </Table.Th>
                                                        ))}

                                                        <Table.Th ta="right">Total</Table.Th>
                                                    </Table.Tr>
                                                </Table.Thead>

                                                <Table.Tbody>
                                                    {receives.map((row, i) => (
                                                        <Table.Tr key={i}>
                                                            <Table.Td>{row.outlet}</Table.Td>

                                                            {visibleLedgers.map(acc => (
                                                                <Table.Td key={acc.id} ta="right">
                                                                    {(row[acc.id] || 0).toLocaleString()}
                                                                </Table.Td>
                                                            ))}

                                                            <Table.Td ta="right">
                                                                {(row.total || 0).toLocaleString()}
                                                            </Table.Td>
                                                        </Table.Tr>
                                                    ))}

                                                    {receives.length > 0 && (
                                                        <Table.Tr style={{ fontWeight: "bold" }}>
                                                            <Table.Td ta="right">Grand Total</Table.Td>

                                                            {visibleLedgers.map(acc => {
                                                                const sum = receives.reduce(
                                                                    (total, row) => total + (row[acc.id] || 0),
                                                                    0
                                                                );

                                                                return (
                                                                    <Table.Td key={acc.id} ta="right">
                                                                        {sum.toLocaleString()}
                                                                    </Table.Td>
                                                                );
                                                            })}

                                                            <Table.Td ta="right">
                                                                {receives
                                                                    .reduce((total, row) => total + (row.total || 0), 0)
                                                                    .toLocaleString()}
                                                            </Table.Td>
                                                        </Table.Tr>
                                                    )}
                                                </Table.Tbody>
                                            </Table>

                                        </div>

                                        {/* ================= GRAND TOTAL ================= */}
                                        {/*<Divider my="md" />
                                        <Text fw={700}>
                                            Grand Total (Bank + Total Sales)
                                            <span style={{ float: "right" }}>
                                                {grandTotal.toLocaleString()}
                                            </span>
                                        </Text>*/}

                                        {/* ================= EXPENSES ================= */}
                                        <Text fw={700} mt="md">Expenses (Account)</Text>
                                        <Table withTableBorder withColumnBorders striped>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>Description</Table.Th>
                                                    <Table.Th ta="right">Amount</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>

                                            <Table.Tbody>
                                                {expenses.map((row, i) => (
                                                    <Table.Tr key={i}>
                                                        <Table.Td>{row.sub_head_name}</Table.Td>
                                                        <Table.Td ta="right">{row.amount.toLocaleString()}</Table.Td>
                                                    </Table.Tr>
                                                ))}

                                                <Table.Tr className={batchTableCss.errorBackground}>
                                                    <Table.Td ta="right"><b>Total Expense</b></Table.Td>
                                                    <Table.Td ta="right"><b>{expenseTotal.toLocaleString()}</b></Table.Td>
                                                </Table.Tr>
                                            </Table.Tbody>
                                        </Table>

                                        {/* ================= NET BALANCE ================= */}
                                        {/*<Divider my="md" />
                                        <Text fw={800} size="lg">
                                            Net Balance
                                            <span style={{ float: "right" }}>
                                                {netBalance.toLocaleString()}
                                            </span>
                                        </Text>*/}
                                    </div>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </>
    );
}
