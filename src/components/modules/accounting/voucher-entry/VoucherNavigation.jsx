import React, {useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import {Grid, Box, Text, Card, ScrollArea, Loader, Center, TextInput, Tooltip} from "@mantine/core";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";
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
                                              setPrimaryLedgerDropdownEnable
                                          }) {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {mainAreaHeight} = useOutletContext();
    const height = useMemo(() => mainAreaHeight - 184, [mainAreaHeight]);

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

    const voucherListItems = useMemo(() => {
        return filteredVoucherList.map((item) => (
            <Box
                key={item.id}
                className={`${classes.pressableCard} border-radius`}
                mih={40}
                mt={4}
                style={{cursor: "pointer"}}
                bg={activeVoucher?.id === item.id ? "#f8eedf" : "gray.1"}
                onClick={() => handleActiveVoucher(item)}
            >
                <Text size="sm" pt={8} pl={8} fw={500} color="black">
                    {item.name || t("UnnamedVoucher")}
                </Text>
            </Box>
        ));
    }, [filteredVoucherList, activeVoucher]);

    return (
        <Box>
            <Card shadow="md" radius="4" className={classes.card} padding="xs">
                <Grid gutter={2}>
                    <Grid.Col span={11}>
                        <Text fz="md" fw={500} className={classes.cardTitle}>

                            <Box p={"xs"} className={genericClass.genericHighlightedBox}>
                                <Tooltip
                                    label={t("EnterSearchAnyKeyword")}
                                    px={16}
                                    py={2}
                                    position="top-end"
                                    color="red"
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
                                        placeholder={t("Voucher")}
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
                                                    bg={`red.5`}
                                                >
                                                    <IconX
                                                        color={`red`}
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
                        </Text>
                    </Grid.Col>
                </Grid>
                <Grid columns={9} gutter={1}>
                    <Grid.Col span={9}>
                        <ScrollArea h={height + 42} scrollbarSize={2} scrollbars="y" type="never">
                            {loading ? (
                                <Center><Loader size="sm"/></Center>
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