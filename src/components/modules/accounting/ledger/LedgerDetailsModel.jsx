import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    Accordion,
    NavLink,
    ScrollArea,
    Table,
    Text,
    Modal,
    LoadingOverlay,
    ActionIcon,
    Tooltip,
    rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

import {
    IconSearch,
    IconCalendar,
    IconPdf,
    IconFileTypeXls,
    IconRestore,
    IconFilter,
} from "@tabler/icons-react";

import {
    getIndexEntityData,
} from "../../../../store/accounting/crudSlice.js";
import {
    getIndexEntityData as downloadSlice,
} from "../../../../store/report/reportSlice.js";
import {
    showInstantEntityData,
} from "../../../../store/inventory/crudSlice.js";

import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import DatePickerForm from "../../../form-builders/DatePicker";
import classes from "../../../../assets/css/FeaturesCards.module.css";

function LedgerDetailsModel({ ledgerDetails, setLedgerDetails }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();

    const height = mainAreaHeight - 72;
    const [opened, { open, close }] = useDisclosure(true);
    const [page] = useState(1);
    const perPage = 50;
    const fetching = useSelector((state) => state.crudSlice.fetching);
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);

    const [journalItems, setJournalItems] = useState([]);
    const [indexData, setIndexData] = useState([]);
    const [downloadFile, setDownloadFile] = useState(false);
    const [downloadType, setDownloadType] = useState("xlsx");

    const getInitialDateRange = () => {
        const start = dayjs().startOf("month").format("YYYY-MM-DD");
        const end = dayjs().endOf("month").format("YYYY-MM-DD");
        return { startDate: start, endDate: end };
    };

    const [dateRange, setDateRange] = useState(getInitialDateRange());

    const form = useForm({
        initialValues: {
            financial_start_date: dayjs(dateRange.startDate).toDate(),
            financial_end_date: dayjs(dateRange.endDate).toDate(),
        },
    });

    const handleSearch = () => {
        const start = dayjs(form.values.financial_start_date);
        const end = dayjs(form.values.financial_end_date);

        if (!start.isValid() || !end.isValid()) {
            showNotificationComponent("Invalid date selected", "red");
            return;
        }

        setDateRange({
            startDate: start.format("YYYY-MM-DD"),
            endDate: end.format("YYYY-MM-DD"),
        });
    };

    const handleReset = () => {
        const reset = getInitialDateRange();
        form.setValues({
            financial_start_date: dayjs(reset.startDate).toDate(),
            financial_end_date: dayjs(reset.endDate).toDate(),
        });
        setDateRange(reset);
    };

    useEffect(() => {
        const fetchLedgerAccounts = async () => {
            const value = {
                url: "accounting/account-head",
                param: {
                    group: "ledger",
                    term: searchKeyword,
                    page,
                    offset: perPage,
                },
            };
            try {
                const result = await dispatch(getIndexEntityData(value));
                if (getIndexEntityData.fulfilled.match(result)) {
                    setIndexData(result.payload);
                }
            } catch (e) {
                console.error("Ledger list error", e);
            }
        };

        fetchLedgerAccounts();
    }, [dispatch, page, perPage, searchKeyword, fetching]);

    useEffect(() => {
        const fetchJournal = async () => {
            if (!ledgerDetails?.id) return;
            const url = `accounting/account-ledger-wise/journal/${ledgerDetails.id}?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`;
            try {
                const result = await dispatch(showInstantEntityData(url));
                if (
                    showInstantEntityData.fulfilled.match(result) &&
                    result.payload.data?.status === 200
                ) {
                    setJournalItems(result.payload.data.data);
                } else {
                    showNotificationComponent("Failed to fetch journal", "red");
                }
            } catch (e) {
                console.error("Fetch journal error:", e);
            }
        };

        fetchJournal();
    }, [dispatch, ledgerDetails, dateRange]);

    useEffect(() => {
        if (!downloadFile || !ledgerDetails?.id) return;

        const fetchDownload = async () => {
            const { startDate, endDate } = dateRange;
            const route = `accounting/account-ledger-wise/journal/generate/file/${ledgerDetails.id}/${downloadType}`;
            const url = `${route}?start_date=${startDate}&end_date=${endDate}`;

            try {
                const result = await dispatch(downloadSlice({ url, param: {} }));
                if (
                    downloadSlice.fulfilled.match(result) &&
                    result.payload.status === 200
                ) {
                    const href =
                        import.meta.env.VITE_API_GATEWAY_URL +
                        "ledger-report/download/" +
                        result.payload.filename;
                    const a = document.createElement("a");
                    a.href = href;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } else {
                    showNotificationComponent(result.payload.error || "Download failed", "red");
                }
            } catch (e) {
                console.error("Download file error", e);
            } finally {
                setDownloadFile(false);
            }
        };

        fetchDownload();
    }, [dispatch, downloadFile, downloadType, ledgerDetails, dateRange]);

    const groupByParentName = (items) =>
        (items || []).reduce((acc, item) => {
            if (!item.parent_name) return acc;
            acc[item.parent_name] = acc[item.parent_name] || [];
            acc[item.parent_name].push(item);
            return acc;
        }, {});

    const grouped = groupByParentName(indexData?.data || []);
    const entries = Object.entries(grouped);

    const records = journalItems?.ledgerItems?.map((row, idx) => (
        <Table.Tr key={row.id}>
            <Table.Td>{idx + 1}</Table.Td>
            <Table.Td>{row.created_date}</Table.Td>
            <Table.Td>{row.invoice_no}</Table.Td>
            <Table.Td>{row.voucher_name}</Table.Td>
            <Table.Td>{row.ledger_name}</Table.Td>
            <Table.Td>{row.opening_amount}</Table.Td>
            <Table.Td>{row.mode === "Debit" && row.amount}</Table.Td>
            <Table.Td>{row.mode === "Credit" && row.amount}</Table.Td>
            <Table.Td>{row.closing_amount}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Modal
            opened={opened}
            onClose={() => {
                setLedgerDetails(null);
                close();
            }}
            title={ledgerDetails?.name || "Ledger Details"}
            overlayProps={{ opacity: 0.55, blur: 4 }}
            fullScreen
        >
            <LoadingOverlay visible={downloadFile} overlayBlur={1} />

            <Box p="8">
                <Grid columns={24} gutter={8}>
                    {/* LEFT LEDGER TREE */}
                    <Grid.Col span={6}>
                        <Card className={classes.card} shadow="sm" padding="xs">
                            <Box className="boxBackground borderRadiusAll">
                                <Text pt="xs" px="md" pb="xs">{t("ManageLedger")}</Text>
                            </Box>
                            <ScrollArea h={height - 12}>
                                <Accordion defaultValue={ledgerDetails?.parent_name} mt="sm" mx="sm">
                                    {entries.map(([parent, children]) => (
                                        <Accordion.Item key={parent} value={parent}>
                                            <Accordion.Control>{t(parent)}</Accordion.Control>
                                            <Accordion.Panel bg="white">
                                                {children.map((entry) => (
                                                    <NavLink
                                                        key={entry.id}
                                                        label={entry.name}
                                                        onClick={() => setLedgerDetails(entry)}
                                                    />
                                                ))}
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </ScrollArea>
                        </Card>
                    </Grid.Col>

                    {/* RIGHT LEDGER DETAILS */}
                    <Grid.Col span={18}>
                        <Box className="borderRadiusAll" bg="white" p="xs">
                            {/* Ledger Info */}
                            <Box bg="white" mb="xs" p="xs" className="boxBackground borderRadiusAll">
                                <Grid columns={24} gutter={8} grow>
                                    <Grid.Col span={3}><Box>{t("LedgerName")}</Box></Grid.Col>
                                    <Grid.Col span={6}><Box>{ledgerDetails?.name || 'Ledger Details'}</Box></Grid.Col>
                                    <Grid.Col span={3}><Box>{t("AccountHead")}</Box></Grid.Col>
                                    <Grid.Col span={6}><Box>{ledgerDetails?.parent_name}</Box></Grid.Col>
                                    <Grid.Col span={3}><Box>{t("Balance")}</Box></Grid.Col>
                                    <Grid.Col span={3}><Box>{ledgerDetails?.amount}</Box></Grid.Col>
                                </Grid>
                            </Box>

                            {/* Filters + Actions */}
                            <Grid columns={24} grow gutter={8} align="center" mb="md">
                                <Grid.Col span={4}>
                                    <DatePickerForm
                                        label=""
                                        placeholder="Start Date"
                                        name="financial_start_date"
                                        id="financial_start_date"
                                        leftSection={<IconCalendar size={16} />}
                                        form={form}
                                        closeIcon
                                    />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <DatePickerForm
                                        label=""
                                        placeholder="End Date"
                                        name="financial_end_date"
                                        id="financial_end_date"
                                        leftSection={<IconCalendar size={16} />}
                                        form={form}
                                        closeIcon
                                    />
                                </Grid.Col>
                                <Grid.Col span="auto">
                                    <ActionIcon.Group mt="1">
                                        <ActionIcon variant="default" size="lg" c="red.4" onClick={handleSearch}>
                                            <Tooltip label="Search" withArrow>
                                                <IconSearch size={18} />
                                            </Tooltip>
                                        </ActionIcon>
                                        <ActionIcon variant="default" size="lg" c="gray.6" onClick={handleReset}>
                                            <Tooltip label={t("ResetButton")} withArrow>
                                                <IconRestore size={18} />
                                            </Tooltip>
                                        </ActionIcon>
                                        <ActionIcon variant="default" size="lg" c="gray.6" onClick={() => {
                                            console.log("Filter Clicked"); // placeholder
                                        }}>
                                            <Tooltip label={t("FilterButton")} withArrow>
                                                <IconFilter size={18} />
                                            </Tooltip>
                                        </ActionIcon>
                                        <ActionIcon variant="default" size="lg" c="green.8" onClick={() => {
                                            setDownloadType("pdf");
                                            setDownloadFile(true);
                                        }}>
                                            <Tooltip label="PDF" withArrow>
                                                <IconPdf size={18} />
                                            </Tooltip>
                                        </ActionIcon>
                                        <ActionIcon variant="default" size="lg" c="green.8" onClick={() => {
                                            setDownloadType("xlsx");
                                            setDownloadFile(true);
                                        }}>
                                            <Tooltip label="Excel" withArrow>
                                                <IconFileTypeXls size={18} />
                                            </Tooltip>
                                        </ActionIcon>
                                    </ActionIcon.Group>
                                </Grid.Col>
                            </Grid>

                            {/* Table */}
                            <Table.ScrollContainer height={height - 190}>
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr bg="var(--theme-primary-color-5)" c="white">
                                            <Table.Th>{t("S/N")}</Table.Th>
                                            <Table.Th>{t("Date")}</Table.Th>
                                            <Table.Th>{t("JVNo")}</Table.Th>
                                            <Table.Th>{t("VoucherType")}</Table.Th>
                                            <Table.Th>{t("Ledger Name")}</Table.Th>
                                            <Table.Th>{t("Opening")}</Table.Th>
                                            <Table.Th>{t("Debit")}</Table.Th>
                                            <Table.Th>{t("Credit")}</Table.Th>
                                            <Table.Th>{t("Closing")}</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>{records}</Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </Modal>
    );
}

export default LedgerDetailsModel;
