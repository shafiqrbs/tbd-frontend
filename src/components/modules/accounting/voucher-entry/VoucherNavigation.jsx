import React, {useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import {Grid, Box, Text, Card, ScrollArea, Loader, Center} from "@mantine/core";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";

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
        return allVoucherList?.map((item) => (
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