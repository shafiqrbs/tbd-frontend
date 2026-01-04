import React, {useEffect, useState, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useOutletContext} from "react-router-dom";
import {
    Grid,
    Box,
    Button,
    Group,
    TextInput,
    LoadingOverlay, Text, rem,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {DataTable} from "mantine-datatable";
import {useTranslation} from "react-i18next";
import {getHotkeyHandler} from "@mantine/hooks";

import classes from "../../../../assets/css/FeaturesCards.module.css";

import _Search from "../common/_Search.jsx";
import _ManageBranchAndFranchise from "../common/_ManageBranchAndFranchise.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";

import {
    getCategoryDropdown,
} from "../../../../store/inventory/utilitySlice.js";
import {
    setDropdownLoad,
} from "../../../../store/inventory/crudSlice.js";
import {
    getIndexEntityData, setFetching,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";

import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";

export default function CategoryTable({id}) {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {mainAreaHeight} = useOutletContext();

    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad);
    const height = mainAreaHeight - 120;
    const perPage = 50;

    const [page, setPage] = useState(1);
    const [reloadList, setReloadList] = useState(true);
    const [onlyReloadSetting, setOnlyReloadSetting] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [selectedDomainId, setSelectedDomainId] = useState(id);
    const [subDomainCategoryData, setSubDomainCategoryData] = useState(null);
    const [modeMap, setModeMap] = useState({});
    const [purchaseModeMap, setPurchaseModeMap] = useState({});
    const [percentValues, setPercentValues] = useState({});
    const [modifiedRows, setModifiedRows] = useState(new Set());

    const form = useForm({initialValues: {mode_id: "",purchase_mode_id: ""}});

    useEffect(() => {
        dispatch(getCategoryDropdown({
            url: "inventory/select/category",
            param: {type: "all"},
        }));
        dispatch(setDropdownLoad(false));
    }, [dropdownLoad, dispatch]);

    const fetchTableData = useCallback(async () => {
        const value = {
            url: `domain/b2b/sub-domain/setting/${selectedDomainId}`,
            param: {},
        };
        setFetching(true);

        try {
            const resultAction = await dispatch(getIndexEntityData(value));
            if (getIndexEntityData.fulfilled.match(resultAction)) {
                const payload = resultAction.payload.data;
                setSubDomainCategoryData(payload);

                console.log(payload.sub_domain_category)

                const initialModes = {};
                payload?.sub_domain_category?.forEach((item) => {
                    initialModes[item.id] = item.percent_mode || null;
                });
                setModeMap(initialModes);

                const initialPurchaseModes = {};
                payload?.sub_domain_category?.forEach((item) => {
                    initialPurchaseModes[item.id] = item.purchase_mode || null;
                });
                setPurchaseModeMap(initialPurchaseModes);
            }
        } catch (err) {
            console.error("Fetching error:", err);
        } finally {
            setFetching(false);
            setReloadList(false);
            setOnlyReloadSetting(false);
        }
    }, [dispatch, selectedDomainId]);

    console.log(purchaseModeMap)

    useEffect(() => {
        if (reloadList || onlyReloadSetting) {
            fetchTableData();
        }
    }, [fetchTableData, reloadList, onlyReloadSetting]);

    useEffect(() => {
        if (subDomainCategoryData?.sub_domain_category?.length > 0) {
            const initial = {};
            subDomainCategoryData.sub_domain_category.forEach((item) => {
                initial[item.id] = {
                    mrp_percent: item.mrp_percent ?? null,
                    purchase_percent: item.purchase_percent ?? null,
                    bonus_percent: item.bonus_percent ?? null,
                };
            });
            setPercentValues(initial);
        }
    }, [subDomainCategoryData]);

    const updateModifiedTracking = (id, changedMode, changedPercents, original) => {
        if (!original) return;

        const isModified =
            changedMode !== original.percent_mode ||
            changedMode !== original.purchase_mode ||
            changedPercents.purchase_percent !== original.purchase_percent ||
            changedPercents.mrp_percent !== original.mrp_percent ||
            changedPercents.bonus_percent !== original.bonus_percent;

        setModifiedRows((prev) => {
            const next = new Set(prev);
            isModified ? next.add(id) : next.delete(id);
            return next;
        });
    };

    const handlePurchaseModeChange = (id, value) => {
        const original = subDomainCategoryData?.sub_domain_category.find((item) => item.id === id);
        setPurchaseModeMap((prev) => {
            const updated = {...prev, [id]: value};
            updateModifiedTracking(id, updated[id], percentValues[id] || {}, original);
            return updated;
        });
    };

    const handleModeChange = (id, value) => {
        const original = subDomainCategoryData?.sub_domain_category.find((item) => item.id === id);
        setModeMap((prev) => {
            const updated = {...prev, [id]: value};
            updateModifiedTracking(id, updated[id], percentValues[id] || {}, original);
            return updated;
        });
    };

    const handlePercentChange = (id, key, value) => {
        const original = subDomainCategoryData?.sub_domain_category.find((item) => item.id === id);
        setPercentValues((prev) => {
            const updated = {...prev[id], [key]: value};
            const next = {...prev, [id]: updated};
            updateModifiedTracking(id, modeMap[id], updated, original);
            return next;
        });
    };

    const handleProcessClick = async (item) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: t('Submit'), cancel: t('Cancel') },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                const mode = modeMap[item.id];
                const purchaseMode = purchaseModeMap[item.id];
                const inputValues = percentValues[item.id];

                const payload = {
                    id: item.id,
                    percent_mode: mode,
                    purchase_mode: purchaseMode,
                    ...inputValues,
                };

                setReloadList(true);
                try {
                    const requestData = {
                        url: `domain/b2b/category-wise/price-update/${item.id}`,
                        data: payload,
                    };
                    const resultAction = await dispatch(storeEntityData(requestData));
                    if (storeEntityData.fulfilled.match(resultAction)) {
                        showNotificationComponent(resultAction.payload.data.message, "red", "", true);
                    }
                } catch (err) {
                    console.error("Update error", err);
                } finally {
                    setModifiedRows((prev) => {
                        const updated = new Set(prev);
                        updated.delete(item.id);
                        return updated;
                    });
                    setReloadList(false);
                }
            },
        });
    };

    return (
        <Box style={{position: "relative"}}>
            <LoadingOverlay
                visible={reloadList}
                zIndex={1000}
                overlayProps={{radius: "sm", blur: 2}}
                loaderProps={{color: "red"}}
            />

            <Grid columns={24} gutter={{base: 8}}>
                <Grid.Col span={4}>
                    <_ManageBranchAndFranchise
                        classes={classes}
                        setSelectedDomainId={setSelectedDomainId}
                        selectedDomainId={selectedDomainId}
                        setReloadList={setReloadList}
                        id={id}
                        module="category"
                    />
                </Grid.Col>

                <Grid.Col span={20}>
                    <Box p="xs" bg="white" className="borderRadiusAll">
                        <Box
                            pl="xs"
                            pb="xs"
                            pr={8}
                            pt="xs"
                            mb="xs"
                            className="boxBackground borderRadiusAll"
                        >
                            <_Search module="product"/>
                        </Box>

                        <Box className="borderRadiusAll">
                            <DataTable
                                records={subDomainCategoryData?.sub_domain_category || []}
                                columns={[
                                    {
                                        accessor: "index",
                                        title: t("S/N"),
                                        textAlignment: "right",
                                        render: (item) =>
                                            subDomainCategoryData?.sub_domain_category.indexOf(item) +
                                            1 +
                                            (page - 1) * perPage,
                                    },
                                    {
                                        accessor: "category_name",
                                        title: t("Category"),
                                    },
                                    {
                                        accessor: "purchase_mode",
                                        title: t("PurchaseMode"),
                                        width: "220px",
                                        textAlign: "center",
                                        render: (item) => (
                                            <SelectForm
                                                tooltip={t("ChoosePurchaseMode")}
                                                placeholder={t("ChoosePurchaseMode")}
                                                required
                                                name="purchase_mode"
                                                form={form}
                                                dropdownValue={["Increase", "Decrease"]}
                                                id={`purchase_mode_${item.id}`}
                                                searchable
                                                value={purchaseModeMap[item.id] || item.purchase_mode}
                                                changeValue={(value) => handlePurchaseModeChange(item.id, value)}
                                            />
                                        ),
                                    },
                                    {
                                        accessor: "purchase_percent",
                                        title: t("Purchase(%)"),
                                        width: "220px",
                                        textAlign: "center",
                                        render: (item) => (
                                            <TextInput
                                                type="text"
                                                size="xs"
                                                id={`inline-update-purchase_percent-${item.id}`}
                                                value={
                                                    percentValues[item.id]?.purchase_percent ?? item.purchase_percent ?? ""
                                                }
                                                onChange={(e) =>
                                                    handlePercentChange(item.id, "purchase_percent", Number(e.target.value))
                                                }
                                                onKeyDown={getHotkeyHandler([
                                                    [
                                                        "Enter",
                                                        () => {
                                                            document
                                                                .getElementById(`inline-update-mrp_percent-${item.id}`)
                                                                ?.focus();
                                                        },
                                                    ],
                                                ])}
                                            />
                                        ),
                                    },
                                    {
                                        accessor: "percent_mode",
                                        title: t("MrpMode"),
                                        width: "220px",
                                        textAlign: "center",
                                        render: (item) => (
                                            <SelectForm
                                                tooltip={t("ChooseMrpMode")}
                                                placeholder={t("ChooseMrpMode")}
                                                required
                                                name="percent_mode"
                                                form={form}
                                                dropdownValue={["Increase", "Decrease"]}
                                                id={`percent_mode_${item.id}`}
                                                searchable
                                                value={modeMap[item.id] || item.percent_mode}
                                                changeValue={(value) => handleModeChange(item.id, value)}
                                            />
                                        ),
                                    },
                                    {
                                        accessor: "mrp_percent",
                                        title: t("MRP(%)"),
                                        width: "220px",
                                        textAlign: "center",
                                        render: (item) => (
                                            <TextInput
                                                type="text"
                                                size="xs"
                                                id={`inline-update-mrp_percent-${item.id}`}
                                                value={percentValues[item.id]?.mrp_percent ?? item.mrp_percent ?? ""}
                                                onChange={(e) =>
                                                    handlePercentChange(item.id, "mrp_percent", Number(e.target.value))
                                                }
                                                onKeyDown={getHotkeyHandler([
                                                    [
                                                        "Enter",
                                                        () => {
                                                            document
                                                                .getElementById(`inline-update-bonus_percent-${item.id}`)
                                                                ?.focus();
                                                        },
                                                    ],
                                                ])}
                                            />
                                        ),
                                    },
                                    {
                                        accessor: "bonus_percent",
                                        title: t("Bonus(%)"),
                                        width: "220px",
                                        textAlign: "center",
                                        render: (item) => (
                                            <TextInput
                                                type="text"
                                                size="xs"
                                                id={`inline-update-bonus_percent-${item.id}`}
                                                value={percentValues[item.id]?.bonus_percent ?? item.bonus_percent ?? ""}
                                                onChange={(e) =>
                                                    handlePercentChange(item.id, "bonus_percent", Number(e.target.value))
                                                }
                                                onKeyDown={getHotkeyHandler([
                                                    [
                                                        "Enter",
                                                        () => {
                                                            // Final field — maybe trigger save?
                                                        },
                                                    ],
                                                ])}
                                            />
                                        ),
                                    },
                                    {
                                        accessor: "action",
                                        title: t("Action"),
                                        textAlign: "right",
                                        render: (item) => (
                                            <Group gap={4} justify="right" wrap="nowrap">
                                                <Button
                                                    size="compact-xs"
                                                    radius="xs"
                                                    variant="filled"
                                                    color="var(--theme-primary-color-6)"
                                                    fw={100}
                                                    fz={12}
                                                    disabled={!modifiedRows.has(item.id)}
                                                    onClick={() => handleProcessClick(item)}
                                                >
                                                    {t("Process")}
                                                </Button>
                                            </Group>
                                        ),
                                    },
                                ]}
                                fetching={fetching}
                                totalRecords={subDomainCategoryData?.sub_domain_category?.length || 0}
                                recordsPerPage={perPage}
                                page={page}
                                onPageChange={setPage}
                                loaderSize="xs"
                                loaderColor="grape"
                                height={height}
                                scrollAreaProps={{type: "never"}}
                            />
                        </Box>
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>
    );
}
