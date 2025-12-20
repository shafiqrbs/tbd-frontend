import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Grid,
    Table,
    Text,
    Progress,
    LoadingOverlay, Divider
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import { getIndexEntityData } from "../../../../store/report/reportSlice";

import ReportNavigation from "../ReportNavigation";

import batchTableCss from "../../../../assets/css/ProductBatchTable.module.css";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent";
import _AccountingReportSearch from "./_AccountingReportSearch.jsx";

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
    const [downloadFile, setDownloadFile] = useState(false);
    const [downloadType, setDownloadType] = useState("xlsx");

    const fetching = useSelector((state) => state.productionCrudSlice.fetching);
    const accountingFilterData = useSelector(
        (state) => state.reportSlice.productionIssueFilterData
    );
    const productionIssueFilterData = useSelector((state) => state.reportSlice.productionIssueFilterData);


    /* ============================
       Fetch Accounting Report Data
    ============================ */

    // Safely destructure accounts and outletSales
    const accounts = indexData?.receive?.accounts || [];
    const outletSales = indexData?.receive?.outletSales || [];


    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: "accounting/report/income-expense",
                param: {
                    start_date: productionIssueFilterData.start_date,
                    end_date: productionIssueFilterData.end_date,
                    page: page,
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

        if (productionIssueFilterData.start_date) {
            fetchData();
        }
    }, [dispatch, productionIssueFilterData.start_date, page, perPage, searchValue]);


    /* ============================
       XLSX / PDF Download
    ============================ */
    useEffect(() => {
        if (!downloadFile) return;

        const downloadReport = async () => {
            let route = downloadType === "pdf"
                ? "accounting/report/daily-pdf"
                : "accounting/report/daily-xlsx";

            try {
                const result = await dispatch(
                    getIndexEntityData({ url: route, param: {} })
                );

                if (getIndexEntityData.fulfilled.match(result)) {
                    if (result.payload.status === 200) {
                        const href = `${import.meta.env.VITE_API_GATEWAY_URL}accounting/download/${downloadType}`;
                        const a = document.createElement("a");
                        a.href = href;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    } else {
                        showNotificationComponent(result.payload.error, "red");
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setDownloadFile(false);
            }
        };

        downloadReport();
    }, [downloadFile]);

    /* ============================
       Totals (XLSX Style)
    ============================ */
    /*const totals = indexData?.data?.reduce(
        (acc, row) => {
            acc.debit += Number(row.debit || 0);
            acc.credit += Number(row.credit || 0);
            return acc;
        },
        { debit: 0, credit: 0 }
    );*/

    /* ================= DEMO DATA ================= */

    const bankTransfers = [
        { date: "10.11.25", desc: "Bank Transfer Prime Bank AC:17266",opening:5000,received:3000,payment:2000, amount: 6000 },
        { date: "10.11.25", desc: "Bank Transfer Prime Bank AC:17266", opening:5000,received:3000,payment:2000, amount: 6000 },
        { date: "10.11.25", desc: "Withdrawn From Dhaka Bank", opening:5000,received:3000,payment:2000, amount: 6000 },
        { date: "10.11.25", desc: "Withdrawn From Brac Bank", opening:5000,received:3000,payment:2000, amount: 6000 },
        { date: "10.11.25", desc: "Cheque Withdraw Prime Bank (Sadek Vai)", opening:5000,received:3000,payment:2000, amount: 6000 }
    ];

    const outletSales1 = [
        {
            date: "10.11.25",
            outlet: "E Block Banasree Outlet",
            foodpanda: 800,
            card: 19000,
            bkash: 7625,
            excess: 30,
            cashSale: 86796,
            netCash: 86826,
            total: 114221
        },
        {
            date: "10.11.25",
            outlet: "E Block Banashree Tea Shop",
            foodpanda: 3365,
            card: 10315,
            bkash: 1185,
            excess: 116,
            cashSale: 100775,
            netCash: 100891,
            total: 115640
        }
    ];

    const expenses = [
        { date: "10.11.25", desc: "Outlet Rent Basundhara Nov 25", amount: 50000 },
        { date: "10.11.25", desc: "Electricity Bill Oct 25 Basundhara", amount: 5778 },
        { date: "10.11.25", desc: "Raw Materials Purchase", amount: 7585 },
        { date: "10.11.25", desc: "Staff Food Bill", amount: 4560 },
        { date: "10.11.25", desc: "Director Current A/C Expense", amount: 6000 }
    ];

    // const bankTotal = bankTransfers.reduce((s, i) => s + i.amount, 0);
    const bankTotal = 0;
    const totalSales = outletSales.reduce((sum, row) => sum + (row.total || 0), 0);
    // const expenseTotal = expenses.reduce((s, i) => s + i.amount, 0);
    const expenseTotal = 0;

    const grandTotal = bankTotal + totalSales;
    const netBalance = grandTotal - expenseTotal;


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
                        visible={searchValue || downloadFile}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                    />

                    <Box p="xs">
                        <Grid columns={24} gutter={8}>
                            <Grid.Col span={4}>
                                <ReportNavigation height={height} />
                            </Grid.Col>

                            <Grid.Col span={20}>
                                {/* Header */}
                                <Box className="boxBackground borderRadiusAll">
                                    <Grid columns={24}>
                                        <Grid.Col span={8}>
                                            <Text p="md">
                                                {t("Daily Income & Expense Report")}
                                            </Text>
                                        </Grid.Col>

                                        <Grid.Col span={16}>
                                            <_AccountingReportSearch
                                                module="production-issue"
                                                setSearchValue={setSearchValue}
                                                setDownloadFile={setDownloadFile}
                                                setDownloadType={setDownloadType}
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
                                                10.11.2025
                                            </Text>

                                            {/* ================= BANK TRANSFER ================= */}
                                            <Text fw={700} mt="md">Bank Purpose Received</Text>

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
                                                    {bankTransfers.map((row, i) => (
                                                        <Table.Tr key={i}>
                                                            <Table.Td>{row.desc}</Table.Td>
                                                            <Table.Td ta="right">{row.opening.toLocaleString()}</Table.Td>
                                                            <Table.Td ta="right">{row.received.toLocaleString()}</Table.Td>
                                                            <Table.Td ta="right">{row.payment.toLocaleString()}</Table.Td>
                                                            <Table.Td ta="right">{row.amount.toLocaleString()}</Table.Td>
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

                                        <Table withTableBorder withColumnBorders striped>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>Description</Table.Th>
                                                    {accounts.map(acc => (
                                                        <Table.Th key={acc.id} ta="right">{acc.display_name}</Table.Th>
                                                    ))}
                                                    <Table.Th ta="right">Total</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>

                                            <Table.Tbody>
                                                {outletSales.map((row, i) => (
                                                    <Table.Tr key={i}>
                                                        <Table.Td>{row.outlet}</Table.Td>

                                                        {accounts.map(acc => (
                                                            <Table.Td key={acc.id} ta="right">
                                                                {row[acc.id]?.toLocaleString() || "0"}
                                                            </Table.Td>
                                                        ))}

                                                        <Table.Td ta="right">{row.total?.toLocaleString() || "0"}</Table.Td>
                                                    </Table.Tr>
                                                ))}

                                                {/* Optional: Grand Total Row */}
                                                {outletSales.length > 0 && (
                                                    <Table.Tr style={{ fontWeight: "bold" }}>
                                                        <Table.Td colSpan={1} ta="right">Grand Total</Table.Td>
                                                        {accounts.map(acc => {
                                                            const sum = outletSales.reduce((total, row) => total + (row[acc.id] || 0), 0);
                                                            return (
                                                                <Table.Td key={acc.id} ta="right">{sum.toLocaleString()}</Table.Td>
                                                            );
                                                        })}
                                                        <Table.Td ta="right">
                                                            {outletSales.reduce((total, row) => total + (row.total || 0), 0).toLocaleString()}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                )}
                                            </Table.Tbody>
                                        </Table>

                                            {/* ================= GRAND TOTAL ================= */}
                                            <Divider my="md" />

                                            <Text fw={700}>
                                                Grand Total (Bank + Total Sales)
                                                <span style={{ float: "right" }}>
                                                    {grandTotal.toLocaleString()}
                                                </span>
                                            </Text>

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
                                                            <Table.Td>{row.desc}</Table.Td>
                                                            <Table.Td ta="right">{row.amount.toLocaleString()}</Table.Td>
                                                        </Table.Tr>
                                                    ))}

                                                    <Table.Tr className={batchTableCss.errorBackground}>
                                                        <Table.Td colSpan={2} ta="right"><b>Total Expense</b></Table.Td>
                                                        <Table.Td ta="right"><b>{expenseTotal.toLocaleString()}</b></Table.Td>
                                                    </Table.Tr>
                                                </Table.Tbody>
                                            </Table>

                                            {/* ================= NET BALANCE ================= */}
                                            <Divider my="md" />

                                            <Text fw={800} size="lg">
                                                Net Balance
                                                <span style={{ float: "right" }}>
                    {netBalance.toLocaleString()}
                </span>
                                            </Text>

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
