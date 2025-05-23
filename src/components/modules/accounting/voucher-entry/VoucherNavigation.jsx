import {useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import {
    Grid,
    Box,
    Text,
    Card,
    ScrollArea,
    Loader,
    Center,
} from "@mantine/core";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";

export default function VoucherNavigation(props) {
    const {activeVoucher, setActiveVoucher, setReloadList, reloadList,setAllVoucherList,allVoucherList,setMainLedgerHeadData,loadMyItemsFromStorage,setMainLedgerHeadObject} = props;
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = useMemo(() => mainAreaHeight - 184, [mainAreaHeight]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch vouchers
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const value = {
                url: "accounting/voucher/wise-ledger-details",
                param: {},
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                    setError(t("FailedToFetchVouchers"));
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setAllVoucherList(resultAction.payload?.data || []);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError(t("UnexpectedError"));
            } finally {
                setLoading(false);
                setReloadList(false);
            }
        };

        fetchData();
    }, [dispatch, reloadList, setReloadList, t]);

    // Memoized voucher items
    const voucherListItems = useMemo(() => {
        if (!allVoucherList?.length) return null;

        return allVoucherList.map((item) => (
            <Box
                key={item.id}
                style={{borderRadius: 4, cursor: "pointer"}}
                className={`${classes.pressableCard} border-radius`}
                mih={40}
                mt={4}
                onClick={() => {
                    localStorage.removeItem("temp-voucher-entry");
                    setMainLedgerHeadData(null)
                    setActiveVoucher(item)
                    setMainLedgerHeadObject(null)
                    loadMyItemsFromStorage()
                }}
                bg={activeVoucher?.id === item?.id ? "#f8eedf" : "gray.1"}
            >
                <Text size="sm" pt={8} pl={8} fw={500} c="black">
                    {item?.name || t("UnnamedVoucher")}
                </Text>
            </Box>
        ));
    }, [allVoucherList, activeVoucher, setActiveVoucher, t]);

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
                        <Box bg="white">
                            <Box mt={8} pt={8}>
                                <ScrollArea
                                    h={height + 42}
                                    scrollbarSize={2}
                                    scrollbars="y"
                                    type="never"
                                >
                                    {loading ? (
                                        <Center mt="md">
                                            <Loader size="sm"/>
                                        </Center>
                                    ) : error ? (
                                        <Center mt="md">
                                            <Text color="red">{error}</Text>
                                        </Center>
                                    ) : voucherListItems?.length ? (
                                        voucherListItems
                                    ) : (
                                        <Center mt="md">
                                            <Text>{t("NoVouchersFound")}</Text>
                                        </Center>
                                    )}
                                </ScrollArea>
                            </Box>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Card>
        </Box>
    );
}
