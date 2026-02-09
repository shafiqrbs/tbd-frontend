/*
import React, {useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import {Box, Text, Card, ScrollArea, Loader, Center, TextInput, Tooltip} from "@mantine/core";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {IconInfoCircle, IconSearch, IconX} from "@tabler/icons-react";

function useDebouncedValue(value, delay) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export default function VoucherNavigation({
                                              activeVoucher,
                                              setActiveVoucher,
                                              setReloadList,
                                              reloadList,
                                              setAllVoucherList,
                                              allVoucherList,
                                              setPrimaryLedgerHeadData,
                                              loadMyItemsFromStorage,
                                              setSecondaryLedgerHeadDropdownData,
                                              setPrimaryLedgerDropdownData,
                                              setSecondaryLedgerHead,
                                              setPrimaryLedgerDropdownEnable,
                                              setLastVoucherDate,
    setPrimaryLedgerHeadObject,submitForm
                                          }) {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {mainAreaHeight} = useOutletContext();
    const height = useMemo(() => mainAreaHeight - 150, [mainAreaHeight]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebouncedValue(searchValue, 250);

    const filteredVoucherList = useMemo(() => {
        if (!allVoucherList) return [];

        const keyword = debouncedSearchValue.trim().toLowerCase();

        if (!keyword) return allVoucherList;

        return allVoucherList.filter((voucher) =>
            voucher.name?.toLowerCase().includes(keyword)
        );
    }, [allVoucherList, debouncedSearchValue]);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                //  Fetch voucher list
                const result = await dispatch(
                    getIndexEntityData({
                        url: "accounting/voucher/wise-ledger-details",
                        param: {},
                    })
                );

                if (getIndexEntityData.fulfilled.match(result)) {
                    setAllVoucherList(result.payload?.data || []);
                } else {
                    setError(t("FailedToFetchVouchers"));
                }

                // Fetch last voucher date
                const lastDate = await dispatch(
                    getIndexEntityData({
                        url: "accounting/voucher/last-date",
                        param: {},
                    })
                );

                if (getIndexEntityData.fulfilled.match(lastDate)) {
                    setLastVoucherDate(lastDate.payload?.data || null);
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
        const transformGroups = (groups) =>
            groups?.map((group) => ({
                group: group.name,
                items: group.child_account_heads.map((child) => ({
                    value: String(child.id),
                    label: child.name,
                })),
            })) || [];

        // Set dropdowns
        setPrimaryLedgerDropdownData(transformGroups(item.ledger_account_head_primary));
        setSecondaryLedgerHeadDropdownData(transformGroups(item.ledger_account_head_secondary));

        // Reset state
        setActiveVoucher(item);
        setSecondaryLedgerHead(null);
        setPrimaryLedgerHeadData(null);
        setPrimaryLedgerDropdownEnable(false);
        localStorage.removeItem("temp-voucher-entry");
        loadMyItemsFromStorage();
    };

    const handleResetVoucher = (e) => {
        e.stopPropagation();

        localStorage.removeItem("temp-voucher-entry");
        setPrimaryLedgerDropdownEnable(false);
        setPrimaryLedgerHeadObject(null)
        setPrimaryLedgerHeadData(null);
        setSecondaryLedgerHead(null);
        setActiveVoucher(null);
        loadMyItemsFromStorage();
        submitForm.reset()
    };


    const voucherListItems = useMemo(() => {
        return filteredVoucherList.map((item) => {
            const isActive = activeVoucher?.id === item.id;
            const isDisabled = activeVoucher && !isActive;

            return (
                <Tooltip
                    key={item.id}
                    label={t("FinishCurrentVoucherFirst")}
                    disabled={!isDisabled}
                >
                    <Box
                        className={`${classes.pressableCard} border-radius`}
                        mih={40}
                        mt={4}
                        bg={
                            isActive
                                ? "var(--theme-primary-color-2)"
                                : "var(--theme-secondary-color-2)"
                        }
                        style={{
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            opacity: isDisabled ? 0.5 : 1,
                            pointerEvents: isDisabled ? "none" : "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingRight: 8,
                        }}
                        onClick={() => {
                            if (!isDisabled) {
                                handleActiveVoucher(item);
                            }
                        }}
                    >
                        <Text size="sm" fw={500} color="black" pl={8}>
                            {item.name || t("UnnamedVoucher")}
                        </Text>

                        {isActive && (
                            <Tooltip label={t("Reset")} withArrow>
                                <IconX
                                    size={16}
                                    color="red"
                                    style={{ cursor: "pointer" }}
                                    onClick={handleResetVoucher}
                                />
                            </Tooltip>
                        )}
                    </Box>
                </Tooltip>
            );
        });
    }, [filteredVoucherList, activeVoucher]);



    return (
        <Box>
            <Card shadow="md" radius="4" className={classes.card}>
                <Box bg='var(--theme-primary-color-4)' mb={'xs'} p={'4'} ml={'-md'} mr={'-md'}>
                    <Tooltip
                        label={t("EnterSearchAnyKeyword")}
                        px={8}
                        py={2}
                        position="top-end"
                        color='var(--theme-primary-color-6)'
                        withArrow
                        offset={2}
                        zIndex={100}
                        transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 1000,
                        }}
                    >
                        <TextInput
                            leftSection={
                                <IconSearch size={16} opacity={0.5}/>
                            }
                            size="sm"
                            required={false}
                            placeholder={t("VoucherType")}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }}
                            value={searchValue}
                            id={"SearchKeyword"}
                            rightSection={
                                searchValue ? (
                                    <Tooltip
                                        label={t("Close")}
                                        withArrow
                                        bg={`red`}
                                    >
                                        <IconX
                                            color='var( --theme-remove-color)'
                                            size={16}
                                            opacity={0.5}
                                            onClick={() => {
                                                setSearchValue("");
                                            }}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip
                                        label={t("FieldIsRequired")}
                                        withArrow
                                        position={"bottom"}
                                        c={"red"}
                                        bg={`red.1`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                                )
                            }
                        />
                    </Tooltip>
                </Box>
                <box>
                    <ScrollArea h={height + 30} scrollbarSize={2} scrollbars="y" type="never">
                        {loading ? (
                            <Center><Loader size="sm"/></Center>
                        ) : error ? (
                            <Center><Text color='var(--theme-primary-color-6)'>{error}</Text></Center>
                        ) : voucherListItems?.length ? (
                            voucherListItems
                        ) : (
                            <Center><Text>{t("NoVouchersFound")}</Text></Center>
                        )}
                    </ScrollArea>
                </box>
            </Card>
        </Box>
    );
}*/


import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import {Box, Text, Card, ScrollArea, Center, TextInput, Tooltip, Skeleton} from "@mantine/core";
import { getIndexEntityData } from "../../../../store/core/crudSlice.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import { IconInfoCircle, IconSearch, IconX } from "@tabler/icons-react";

// Debounce hook
function useDebouncedValue(value, delay) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export default function VoucherNavigation({
                                              activeVoucher,
                                              setActiveVoucher,
                                              setReloadList,
                                              reloadList,
                                              setAllVoucherList,
                                              allVoucherList,
                                              setPrimaryLedgerHeadData,
                                              loadMyItemsFromStorage,
                                              setSecondaryLedgerHeadDropdownData,
                                              setPrimaryLedgerDropdownData,
                                              setSecondaryLedgerHead,
                                              setPrimaryLedgerDropdownEnable,
                                              setLastVoucherDate,
                                              setPrimaryLedgerHeadObject,
                                              submitForm
                                          }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { mainAreaHeight } = useOutletContext();
    const height = useMemo(() => mainAreaHeight - 150, [mainAreaHeight]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebouncedValue(searchValue, 250);

    // Filter vouchers based on search
    const filteredVoucherList = useMemo(() => {
        if (!allVoucherList) return [];
        const keyword = debouncedSearchValue.trim().toLowerCase();
        if (!keyword) return allVoucherList;
        return allVoucherList.filter((voucher) =>
            voucher.name?.toLowerCase().includes(keyword)
        );
    }, [allVoucherList, debouncedSearchValue]);

    // Fetch voucher list & last date once reloadList is true
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1️⃣ Fetch voucher list
                const result = await dispatch(
                    getIndexEntityData({
                        url: "accounting/voucher/wise-ledger-details",
                        param: {},
                    })
                );

                if (getIndexEntityData.fulfilled.match(result)) {
                    setAllVoucherList(result.payload?.data || []);
                } else setError(t("FailedToFetchVouchers"));

                // 2️⃣ Fetch last voucher date
                const lastDate = await dispatch(
                    getIndexEntityData({
                        url: "accounting/voucher/last-date",
                        param: {},
                    })
                );

                if (getIndexEntityData.fulfilled.match(lastDate)) {
                    setLastVoucherDate(lastDate.payload?.data || null);
                } else setError(t("FailedToFetchVouchers"));

            } catch (err) {
                setError(t("UnexpectedError"));
            } finally {
                setLoading(false);
                setReloadList(false); // Stop further reload
            }
        };

        if (reloadList) {
            fetchData();
        }
    }, [dispatch, reloadList, setAllVoucherList, setLastVoucherDate, setReloadList, t]);

    // Activate a voucher
    const handleActiveVoucher = (item) => {
        const transformGroups = (groups) =>
            groups?.map((group) => ({
                group: group.name,
                items: group.child_account_heads.map((child) => ({
                    value: String(child.id),
                    label: child.name,
                })),
            })) || [];

        // Set dropdowns
        setPrimaryLedgerDropdownData(transformGroups(item.ledger_account_head_primary));
        setSecondaryLedgerHeadDropdownData(transformGroups(item.ledger_account_head_secondary));

        // Reset state
        setActiveVoucher(item);
        setSecondaryLedgerHead(null);
        setPrimaryLedgerHeadData(null);
        setPrimaryLedgerDropdownEnable(false);
        localStorage.removeItem("temp-voucher-entry");
        loadMyItemsFromStorage();
    };

    // Reset voucher
    const handleResetVoucher = (e) => {
        e.stopPropagation();
        localStorage.removeItem("temp-voucher-entry");
        setPrimaryLedgerDropdownEnable(false);
        setPrimaryLedgerHeadObject(null);
        setPrimaryLedgerHeadData(null);
        setSecondaryLedgerHead(null);
        setActiveVoucher(null);
        loadMyItemsFromStorage();
        submitForm.reset();
    };

    // Voucher list items
    const voucherListItems = useMemo(() => {
        return filteredVoucherList.map((item) => {
            const isActive = activeVoucher?.id === item.id;
            const isDisabled = activeVoucher && !isActive;

            return (
                <Tooltip
                    key={item.id}
                    label={t("FinishCurrentVoucherFirst")}
                    disabled={!isDisabled}
                >
                    <Box
                        className={`${classes.pressableCard} border-radius`}
                        mih={40}
                        mt={4}
                        bg={isActive ? "var(--theme-primary-color-2)" : "var(--theme-secondary-color-2)"}
                        style={{
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            opacity: isDisabled ? 0.5 : 1,
                            pointerEvents: isDisabled ? "none" : "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingRight: 8,
                        }}
                        onClick={() => !isDisabled && handleActiveVoucher(item)}
                    >
                        <Text size="sm" fw={500} color="black" pl={8}>
                            {item.name || t("UnnamedVoucher")}
                        </Text>

                        {isActive && (
                            <Tooltip label={t("Reset")} withArrow>
                                <IconX
                                    size={16}
                                    color="red"
                                    style={{ cursor: "pointer" }}
                                    onClick={handleResetVoucher}
                                />
                            </Tooltip>
                        )}
                    </Box>
                </Tooltip>
            );
        });
    }, [filteredVoucherList, activeVoucher, t]);

    return (
        <Box>
            <Card shadow="md" radius="4" className={classes.card}>
                <Box bg="var(--theme-primary-color-4)" mb="xs" p="4" ml="-md" mr="-md">
                    <Tooltip
                        label={t("EnterSearchAnyKeyword")}
                        px={8}
                        py={2}
                        position="top-end"
                        color="var(--theme-primary-color-6)"
                        withArrow
                        offset={2}
                        zIndex={100}
                        transitionProps={{ transition: "pop-bottom-left", duration: 1000 }}
                    >
                        <TextInput
                            leftSection={<IconSearch size={16} opacity={0.5} />}
                            size="sm"
                            placeholder={t("VoucherType")}
                            onChange={(e) => setSearchValue(e.target.value)}
                            value={searchValue}
                            id="SearchKeyword"
                            rightSection={
                                searchValue ? (
                                    <Tooltip label={t("Close")} withArrow bg="red">
                                        <IconX
                                            color="var(--theme-remove-color)"
                                            size={16}
                                            opacity={0.5}
                                            onClick={() => setSearchValue("")}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip
                                        label={t("FieldIsRequired")}
                                        withArrow
                                        position="bottom"
                                        c="red"
                                        bg="red.1"
                                    >
                                        <IconInfoCircle size={16} opacity={0.5} />
                                    </Tooltip>
                                )
                            }
                        />
                    </Tooltip>
                </Box>

                <Box>
                    <ScrollArea h={height + 30} scrollbarSize={2} scrollbars="y" type="never">
                        {loading ? (
                            <>
                                <Skeleton height={50}  />
                                <Skeleton height={50} mt={6} />
                                <Skeleton height={50} mt={6} />
                                <Skeleton height={50} mt={6} />
                                <Skeleton height={50} mt={6} />
                            </>
                        ) : error ? (
                            <Center>
                                <Text color="var(--theme-primary-color-6)">{error}</Text>
                            </Center>
                        ) : voucherListItems?.length ? (
                            voucherListItems
                        ) : (
                            <Center>
                                <Text>{t("NoVouchersFound")}</Text>
                            </Center>
                        )}
                    </ScrollArea>
                </Box>
            </Card>
        </Box>
    );
}
