import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
    Grid,
    Box,
    Button,
    Group,
    TextInput,
    LoadingOverlay,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { getHotkeyHandler } from "@mantine/hooks";

import tableCss from "../../../../assets/css/Table.module.css";
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
    getIndexEntityData,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";

import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";

// ─── Reusable Input for Inline Percentage Fields ──────────────────────────────
const EditableNumberInput = ({ item, field, value, onUpdate }) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (e) => {
        const val = e.currentTarget.value;
        setInputValue(val);
        onUpdate(item.id, field, val);
    };

    return (
        <TextInput
            type="number"
            size="xs"
            id={`inline-update-${field}-${item.id}`}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={getHotkeyHandler([
                [
                    "Enter",
                    () => {
                        document
                            .getElementById(`inline-update-${field}-${item.id}`)
                            .focus();
                    },
                ],
            ])}
        />
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CategoryTable({ id }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();

    const height = mainAreaHeight - 120;
    const perPage = 50;

    const [page, setPage] = useState(1);
    const [reloadList, setReloadList] = useState(true);
    const [onlyReloadSetting, setOnlyReloadSetting] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [selectedDomainId, setSelectedDomainId] = useState(id);
    const [subDomainCategoryData, setSubDomainCategoryData] = useState(null);

    const [modeMap, setModeMap] = useState({});
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad);

    const form = useForm({ initialValues: { mode_id: "" } });

    useEffect(() => {
        dispatch(
            getCategoryDropdown({
                url: "inventory/select/category",
                param: { type: "all" },
            })
        );
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

                const initialMap = {};
                payload?.sub_domain_category.forEach((item) => {
                    initialMap[item.id] = item.percent_mode || null;
                });
                setModeMap(initialMap);
            }
        } catch (err) {
            console.error("Fetching error:", err);
        } finally {
            setFetching(false);
            setReloadList(false);
            setOnlyReloadSetting(false);
        }
    }, [dispatch, selectedDomainId]);

    useEffect(() => {
        if (reloadList || onlyReloadSetting) {
            fetchTableData();
        }
    }, [fetchTableData, reloadList, onlyReloadSetting]);

    const handleInlineUpdate = (id, field, value) => {
        setTimeout(() => {
            dispatch(
                storeEntityData({
                    url: "domain/b2b/inline-update/category",
                    data: { id, field_name: field, value },
                })
            );
            setOnlyReloadSetting(true);
        },1500)
    };

    return (
        <Box style={{ position: "relative" }}>
            <LoadingOverlay visible={reloadList} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{color : "red"}} />

            <Grid columns={24} gutter={{ base: 8 }}>
                <Grid.Col span={4}>
                    <_ManageBranchAndFranchise
                        classes={classes}
                        setSelectedDomainId={setSelectedDomainId}
                        selectedDomainId={selectedDomainId}
                        setReloadList={setReloadList}
                        id={id}
                        module={"category"}
                    />
                </Grid.Col>

                <Grid.Col span={20}>
                    <Box p="xs" bg="white" className="borderRadiusAll">
                        <Box pl="xs" pb="xs" pr={8} pt="xs" mb="xs" className="boxBackground borderRadiusAll">
                            <_Search module="product" />
                        </Box>

                        <Box className="borderRadiusAll">
                            <DataTable
                                classNames={tableCss}
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
                                    { accessor: "category_name", title: t("Category") },

                                    {
                                        accessor: "percent_mode",
                                        title: t("Mode"),
                                        width: "220px",
                                        textAlign: "center",
                                        render: (item) => (
                                            <SelectForm
                                                tooltip={t("ChooseMode")}
                                                placeholder={t("ChooseMode")}
                                                required
                                                name="percent_mode"
                                                form={form}
                                                dropdownValue={["Increase", "Decrease"]}
                                                id={`percent_mode_${item.id}`}
                                                searchable
                                                value={modeMap[item.id] || null}
                                                changeValue={(value) => {
                                                    setModeMap((prev) => ({ ...prev, [item.id]: value }));
                                                    handleInlineUpdate(item.id, "percent_mode", value);
                                                }}
                                            />
                                        ),
                                    },
                                    {
                                        accessor: "purchase_percent",
                                        title: t("Purchase(%)"),
                                        textAlign: "center",
                                        width: "220px",
                                        render: (item) => (
                                            <EditableNumberInput
                                                item={item}
                                                field="purchase_percent"
                                                value={item.purchase_percent}
                                                onUpdate={handleInlineUpdate}
                                            />
                                        ),
                                    },
                                    {
                                        accessor: "mrp_percent",
                                        title: t("MRP(%)"),
                                        textAlign: "center",
                                        width: "220px",
                                        render: (item) => (
                                            <EditableNumberInput
                                                item={item}
                                                field="mrp_percent"
                                                value={item.mrp_percent}
                                                onUpdate={handleInlineUpdate}
                                            />
                                        ),
                                    },

                                    {
                                        accessor: "bonus_percent",
                                        title: t("Bonus(%)"),
                                        textAlign: "center",
                                        width: "220px",
                                        render: (item) => (
                                            <EditableNumberInput
                                                item={item}
                                                field="bonus_percent"
                                                value={item.bonus_percent}
                                                onUpdate={handleInlineUpdate}
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
                                                        color={item.not_process === 1 ? 'var(--theme-primary-color-4)' : "red.3"}
                                                        fw={100}
                                                        fz={12}
                                                        disabled={item.not_process !== 1}
                                                        onClick={async () => {
                                                            setReloadList(true);
                                                            try {
                                                                const resultAction = await dispatch(
                                                                    getIndexEntityData({
                                                                        url: `domain/b2b/category-wise/price-update/${item.id}`,
                                                                        param: {},
                                                                    })
                                                                );

                                                                if (getIndexEntityData.fulfilled.match(resultAction)) {
                                                                    showNotificationComponent(resultAction?.payload?.message, "red", "", true);
                                                                }
                                                            } catch (err) {
                                                                console.error("Update error", err);
                                                            } finally {
                                                                setReloadList(false);
                                                            }
                                                        }}
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
                                onPageChange={(p) => setPage(p)}
                                loaderSize="xs"
                                loaderColor="grape"
                                height={height}
                                scrollAreaProps={{ type: "never" }}
                            />
                        </Box>
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>
    );
}
