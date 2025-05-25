import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { Grid, Box, Text, Card, ScrollArea, Loader, Center } from "@mantine/core";
import { getIndexEntityData } from "../../../../store/core/crudSlice.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";

export default function VoucherNavigation({
                                              activeVoucher, setActiveVoucher,
                                              setReloadList, reloadList,
                                              setAllVoucherList, allVoucherList,
                                              setMainLedgerHeadData, loadMyItemsFromStorage,
                                              setMainLedgerHeadObject, setLedgerHeadDropdownData,
                                              setMainLedgerDropdownData, mainLedgerHeadData,
                                              setLedgerHead, setPrimaryLedgerDropdownEnable
                                          }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { mainAreaHeight } = useOutletContext();
    const height = useMemo(() => mainAreaHeight - 184, [mainAreaHeight]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await dispatch(getIndexEntityData({
                    url: "accounting/voucher/wise-ledger-details",
                    param: {},
                }));

                if (getIndexEntityData.fulfilled.match(result)) {
                    setAllVoucherList(result.payload?.data || []);
                } else {
                    setError(t("FailedToFetchVouchers"));
                }
            } catch (err) {
                setError(t("UnexpectedError"));
            } finally {
                setLoading(false);
                setReloadList(false);
            }
        };

        fetchData();
    }, [dispatch, reloadList]);

    const handleActiveVoucher = (item) => {
        // Transform primary & secondary groups
        const transformGroups = (groups) =>
            groups?.map((group) => ({
                group: group.name,
                items: group.child_account_heads.map((child) => ({
                    value: String(child.id),
                    label: child.name,
                })),
            })) || [];

        // Set dropdowns
        setMainLedgerDropdownData(transformGroups(item.ledger_account_head_primary));
        setLedgerHeadDropdownData(transformGroups(item.ledger_account_head_secondary));

        // Reset state
        setActiveVoucher(item);
        setLedgerHead(null);
        setMainLedgerHeadData(null);
        setPrimaryLedgerDropdownEnable(false);
        localStorage.removeItem("temp-voucher-entry");

        loadMyItemsFromStorage();
    };

    const voucherListItems = useMemo(() => {
        return allVoucherList?.map((item) => (
            <Box
                key={item.id}
                className={`${classes.pressableCard} border-radius`}
                mih={40}
                mt={4}
                style={{ cursor: "pointer" }}
                bg={activeVoucher?.id === item.id ? "#f8eedf" : "gray.1"}
                onClick={() => handleActiveVoucher(item)}
            >
                <Text size="sm" pt={8} pl={8} fw={500} color="black">
                    {item.name || t("UnnamedVoucher")}
                </Text>
            </Box>
        ));
    }, [allVoucherList, activeVoucher]);

    return (
        <Box>
            <Card shadow="md" radius="4" className={classes.card} padding="xs">
                <Grid gutter={2}>
                    <Grid.Col span={11}>
                        <Text fz="md" fw={500} className={classes.cardTitle}>
                            {t("VoucherNavigation")}
                        </Text>
                    </Grid.Col>
                </Grid>
                <Grid columns={9} gutter={1}>
                    <Grid.Col span={9}>
                        <ScrollArea h={height + 42} scrollbarSize={2} scrollbars="y" type="never">
                            {loading ? (
                                <Center><Loader size="sm" /></Center>
                            ) : error ? (
                                <Center><Text color="red">{error}</Text></Center>
                            ) : voucherListItems?.length ? (
                                voucherListItems
                            ) : (
                                <Center><Text>{t("NoVouchersFound")}</Text></Center>
                            )}
                        </ScrollArea>
                    </Grid.Col>
                </Grid>
            </Card>
        </Box>
    );
}




/*

import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import {
    Grid,
    Box,
    Text,
    Card,
    ScrollArea,
    Loader,
    Center,
    Alert,
    ActionIcon,
    Tooltip,
    Badge,
} from "@mantine/core";
import { IconRefresh, IconAlertCircle } from "@tabler/icons-react";
import { getIndexEntityData } from "../../../../store/core/crudSlice.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";

// Custom hook for voucher data management
const useVoucherData = () => {
    const transformLedgerData = useCallback((ledgerGroups) => {
        if (!Array.isArray(ledgerGroups)) return [];

        return ledgerGroups.map((group) => ({
            group: group?.name || "Unnamed Group",
            items: Array.isArray(group?.child_account_heads)
                ? group.child_account_heads.map((child) => ({
                    value: String(child?.id || ""),
                    label: child?.name || "Unnamed Account",
                }))
                : [],
        }));
    }, []);

    const clearVoucherStorage = useCallback(() => {
        try {
            localStorage.removeItem("temp-voucher-entry");
        } catch (error) {
            console.warn("Failed to clear voucher storage:", error);
        }
    }, []);

    return { transformLedgerData, clearVoucherStorage };
};

// Custom hook for API operations
const useVoucherAPI = (dispatch, setAllVoucherList, setReloadList) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const { t } = useTranslation();

    const fetchVouchers = useCallback(async (isRetry = false) => {
        if (!isRetry) {
            setLoading(true);
        }
        setError(null);

        const value = {
            url: "accounting/voucher/wise-ledger-details",
            param: {},
        };

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.rejected.match(resultAction)) {
                const errorMessage = resultAction.payload?.message || t("FailedToFetchVouchers");
                console.error("API Error:", resultAction);
                setError(errorMessage);

                // Auto-retry on network errors (max 3 attempts)
                if (retryCount < 2 && !isRetry) {
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                        fetchVouchers(true);
                    }, 2000);
                }
            } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                const data = resultAction.payload?.data || [];
                setAllVoucherList(data);
                setRetryCount(0); // Reset retry count on success

                if (data.length === 0) {
                    setError(t("NoVouchersAvailable"));
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setError(t("UnexpectedError"));
        } finally {
            setLoading(false);
            setReloadList(false);
        }
    }, [dispatch, setAllVoucherList, setReloadList, retryCount, t]);

    const retryFetch = useCallback(() => {
        setRetryCount(0);
        fetchVouchers();
    }, [fetchVouchers]);

    return { loading, error, fetchVouchers, retryFetch, retryCount };
};

export default function VoucherNavigation(props) {
    const {
        activeVoucher,
        setActiveVoucher,
        setReloadList,
        reloadList,
        setAllVoucherList,
        allVoucherList,
        setMainLedgerHeadData,
        loadMyItemsFromStorage,
        setMainLedgerHeadObject,
        setLedgerHeadDropdownData,
        setMainLedgerDropdownData,
        mainLedgerHeadData,
        setLedgerHead,
        setPrimaryLedgerDropdownEnable
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();

    // Custom hooks
    const { transformLedgerData, clearVoucherStorage } = useVoucherData();
    const { loading, error, fetchVouchers, retryFetch, retryCount } = useVoucherAPI(
        dispatch,
        setAllVoucherList,
        setReloadList
    );

    // Memoized height calculation
    const height = useMemo(() => mainAreaHeight - 184, [mainAreaHeight]);

    // Fetch vouchers on component mount and reload
    useEffect(() => {
        if (reloadList || allVoucherList.length === 0) {
            fetchVouchers();
        }
    }, [reloadList, fetchVouchers, allVoucherList.length]);

    // Handle voucher selection with comprehensive state management
    const handleActiveVoucher = useCallback((item) => {
        try {
            // Validate item data
            if (!item || !item.id) {
                console.warn("Invalid voucher item:", item);
                return;
            }

            // Transform primary ledger data
            const primaryLedgerData = transformLedgerData(item?.ledger_account_head_primary);
            setMainLedgerDropdownData(primaryLedgerData);

            // Transform secondary ledger data
            const secondaryLedgerData = transformLedgerData(item?.ledger_account_head_secondary);
            setLedgerHeadDropdownData(secondaryLedgerData);

            // Clear storage and reset state
            clearVoucherStorage();
            setPrimaryLedgerDropdownEnable(false);
            setMainLedgerHeadData(null);
            setMainLedgerHeadObject(null);
            setLedgerHead(null);

            // Set active voucher and reload storage
            setActiveVoucher(item);
            loadMyItemsFromStorage();

            console.log("Voucher activated:", item.name || item.id);
        } catch (error) {
            console.error("Error activating voucher:", error);
        }
    }, [
        transformLedgerData,
        setMainLedgerDropdownData,
        setLedgerHeadDropdownData,
        clearVoucherStorage,
        setPrimaryLedgerDropdownEnable,
        setMainLedgerHeadData,
        setMainLedgerHeadObject,
        setLedgerHead,
        setActiveVoucher,
        loadMyItemsFromStorage
    ]);

    // Memoized voucher list items with enhanced styling
    const voucherListItems = useMemo(() => {
        if (!Array.isArray(allVoucherList) || allVoucherList.length === 0) {
            return null;
        }

        return allVoucherList.map((item, index) => {
            const isActive = activeVoucher?.id === item?.id;
            const voucherName = item?.name || `${t("Voucher")} #${item?.id || index + 1}`;

            return (
                <Box
                    key={item?.id || `voucher-${index}`}
                    style={{
                        borderRadius: 4,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: isActive ? "2px solid #228be6" : "1px solid transparent"
                    }}
                    className={`${classes.pressableCard} border-radius`}
                    mih={50}
                    mt={4}
                    onClick={() => handleActiveVoucher(item)}
                    bg={isActive ? "#e7f5ff" : "gray.1"}
                    p="xs"
                    pos="relative"
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <Text
                                size="sm"
                                fw={isActive ? 600 : 500}
                                c={isActive ? "blue.7" : "black"}
                                lineClamp={1}
                            >
                                {voucherName}
                            </Text>
                            {item?.description && (
                                <Text size="xs" c="dimmed" mt={2} lineClamp={1}>
                                    {item.description}
                                </Text>
                            )}
                        </div>

                        {isActive && (
                            <Badge size="xs" color="blue" variant="filled">
                                {(item?.mode || item?.type) && (
                                    <Box mt="xs" style={{ display: "flex", gap: 4 }}>
                                        {item?.mode && (
                                            <Badge size="xs" color="gray" variant="outline">
                                                {item.mode}
                                            </Badge>
                                        )}
                                        {item?.type && (
                                            <Badge size="xs" color="gray" variant="outline">
                                                {item.type}
                                            </Badge>
                                        )}
                                    </Box>
                                )}
                            </Badge>
                        )}
                    </div>
                </Box>
            );
        });
    }, [allVoucherList, activeVoucher, handleActiveVoucher, t]);

    // Error display component
    const ErrorDisplay = ({ error, onRetry, retryCount }) => (
        <Alert
            icon={<IconAlertCircle size={16} />}
            title={t("Error")}
            color="red"
            variant="light"
            mt="md"
        >
            <Text size="sm" mb="xs">{error}</Text>
            {retryCount > 0 && (
                <Text size="xs" c="dimmed" mb="xs">
                    {t("RetryAttempt", { count: retryCount })}
                </Text>
            )}
            <ActionIcon
                size="sm"
                color="red"
                variant="light"
                onClick={onRetry}
                loading={loading}
            >
                <IconRefresh size={14} />
            </ActionIcon>
        </Alert>
    );

    // Loading display component
    const LoadingDisplay = () => (
        <Center mt="xl" py="xl">
            <div style={{ textAlign: 'center' }}>
                <Loader size="md" />
                <Text size="sm" c="dimmed" mt="xs">
                    {t("LoadingVouchers")}
                </Text>
            </div>
        </Center>
    );

    // Empty state display
    const EmptyStateDisplay = () => (
        <Center mt="xl" py="xl">
            <div style={{ textAlign: 'center' }}>
                <Text size="lg" c="dimmed" mb="xs">
                    {t("NoVouchersFound")}
                </Text>
                <Text size="sm" c="dimmed">
                    {t("CreateVoucherToGetStarted")}
                </Text>
            </div>
        </Center>
    );

    return (
        <Box>
            <Card shadow="md" radius="4" className={classes.card} padding="xs">
                {/!* Header *!/}
                <Grid gutter={2} align="center">
                    <Grid.Col span={8}>
                        <Text fz="md" fw={500} className={classes.cardTitle}>
                            {t("VoucherNavigation")}
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                            {/!* Online status indicator *!/}
                            <Badge
                                size="xs"
                                color={isOnline ? "green" : "red"}
                                variant="dot"
                            >
                                {isOnline ? t("Online") : t("Offline")}
                            </Badge>

                            {/!* Refresh button *!/}
                            <Tooltip label={t("RefreshVouchers")}>
                                <ActionIcon
                                    size="sm"
                                    variant="light"
                                    onClick={retryFetch}
                                    loading={loading}
                                    disabled={!isOnline}
                                >
                                    <IconRefresh size={14} />
                                </ActionIcon>
                            </Tooltip>
                        </div>
                    </Grid.Col>
                </Grid>

                {/!* Voucher count *!/}
                {allVoucherList?.length > 0 && (
                    <Text size="xs" c="dimmed" mt="xs">
                        {t("VoucherCount", { count: allVoucherList.length })}
                        {activeVoucher && ` • ${t("ActiveVoucher")}: ${activeVoucher.name || activeVoucher.id}`}
                    </Text>
                )}

                {/!* Content *!/}
                <Grid columns={9} gutter={1}>
                    <Grid.Col span={9}>
                        <Box bg="white">
                            <Box mt={8} pt={8}>
                                <ScrollArea
                                    h={height + 42}
                                    scrollbarSize={2}
                                    scrollbars="y"
                                    type="never"
                                >
                                    {loading ? (
                                        <LoadingDisplay />
                                    ) : error ? (
                                        <ErrorDisplay
                                            error={error}
                                            onRetry={retryFetch}
                                            retryCount={retryCount}
                                        />
                                    ) : voucherListItems?.length ? (
                                        <Box pb="md">
                                            {voucherListItems}
                                        </Box>
                                    ) : (
                                        <EmptyStateDisplay />
                                    )}
                                </ScrollArea>
                            </Box>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Card>
        </Box>
    );
}*/
