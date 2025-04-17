import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    Button,
    TextInput,
    Grid, LoadingOverlay, Tooltip,
} from "@mantine/core";

import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import _Search from "../common/_Search.jsx";
import {getHotkeyHandler} from "@mantine/hooks";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import {useForm} from "@mantine/form";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {getCategoryDropdown} from "../../../../store/inventory/utilitySlice.js";
import {setDropdownLoad} from "../../../../store/inventory/crudSlice.js";
import {getIndexEntityData, storeEntityData} from "../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import _ManageBranchAndFranchise from "../common/_ManageBranchAndFranchise.jsx";

export default function CategoryTable(props) {
    const {id} = props;
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 120;

    const perPage = 50;
    const [page, setPage] = useState(1);

    const [fetching, setFetching] = useState(false);
    const [reloadList, setReloadList] = useState(true)

    const form = useForm({
        initialValues: {
            mode_id: "",
        },
    });
    const [selectedDomainId, setSelectedDomainId] = useState(id);
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad);
    useEffect(() => {
        const value = {
            url: "inventory/select/category",
            param: {
                type: "all",
            },
        };
        dispatch(getCategoryDropdown(value));
        dispatch(setDropdownLoad(false));
    }, [dropdownLoad]);


    const [subDomainCategoryData, setSubDomainCategoryData] = useState(null)
    const [subDomainId, setSubDomainId] = useState(null)
    const [onlyReloadSetting, setOnlyReloadSetting] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'domain/b2b/sub-domain/setting/' + selectedDomainId, param: {}
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setSubDomainCategoryData(resultAction.payload.data);
                    setSubDomainId(resultAction?.payload?.data?.sub_domain_id)
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setReloadList(false)
                setOnlyReloadSetting(false)
            }
        };

        fetchData();
    }, [dispatch, fetching, reloadList, onlyReloadSetting]);

    const [modeMap, setModeMap] = useState({});

    useEffect(() => {
        if (subDomainCategoryData && subDomainCategoryData?.sub_domain_category.length > 0) {
            const initialMap = {};
            subDomainCategoryData?.sub_domain_category.forEach(item => {
                initialMap[item.id] = item.percent_mode || null;
            });
            setModeMap(initialMap);
        }
    }, [subDomainCategoryData?.sub_domain_category]);

    return (
        <>
            <LoadingOverlay visible={reloadList} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}/>

            <Grid columns={24} gutter={{base: 8}}>
                <Grid.Col span={4}>
                    <_ManageBranchAndFranchise
                        classes={classes}
                        setSelectedDomainId={setSelectedDomainId}
                        selectedDomainId={selectedDomainId}
                        setReloadList={setReloadList}
                        id={id}
                        module={'category'}
                    />
                </Grid.Col>
                <Grid.Col span={20}>
                    <Box p={"xs"} bg={"white"} className={"borderRadiusAll"}>
                        <Box
                            pl={`xs`}
                            pb={"xs"}
                            pr={8}
                            pt={"xs"}
                            mb={"xs"}
                            className={"boxBackground borderRadiusAll"}
                        >
                            <_Search module={"product"}/>
                        </Box>
                        <Box className={"borderRadiusAll"}>
                            <DataTable
                                classNames={{
                                    root: tableCss.root,
                                    table: tableCss.table,
                                    header: tableCss.header,
                                    footer: tableCss.footer,
                                    pagination: tableCss.pagination,
                                }}
                                records={subDomainCategoryData?.sub_domain_category}
                                columns={[
                                    {
                                        accessor: "index",
                                        title: t("S/N"),
                                        textAlignment: "right",
                                        render: (item) =>
                                            subDomainCategoryData?.sub_domain_category.indexOf(item) + 1 + (page - 1) * perPage,
                                    },
                                    {accessor: "category_name", title: t("Category")},

                                    {
                                        accessor: "percent_mode", // Optional if you're using render
                                        title: t("Mode"),
                                        width: "220px",
                                        textAlign: "center",
                                        render: (item) => (
                                            <>
                                                <SelectForm
                                                    tooltip={t("ChooseMode")}
                                                    placeholder={t("ChooseMode")}
                                                    required={true}
                                                    name="percent_mode"
                                                    form={form}
                                                    dropdownValue={["Increase", "Decrease"]}
                                                    id={`percent_mode_${item.id}`}
                                                    searchable={true}
                                                    value={modeMap[item.id] || null}
                                                    changeValue={(value) => {
                                                        setModeMap((prev) => ({
                                                            ...prev,
                                                            [item.id]: value,
                                                        }));

                                                        const payload = {
                                                            url: 'domain/b2b/inline-update/category',
                                                            data: {
                                                                id: item.id,
                                                                field_name: 'percent_mode',
                                                                value: value,
                                                            },
                                                        };
                                                        dispatch(storeEntityData(payload));
                                                        setOnlyReloadSetting(true)
                                                    }}
                                                />
                                            </>
                                        ),
                                    }
                                    ,
                                    {
                                        accessor: "mrp_percent",
                                        textAlign: "center",
                                        title: t("MRPPercent"),
                                        width: "220px",
                                        render: (item) => {
                                            const [editedMrpPercent, setEditedMrpPercent] = useState(item.mrp_percent);
                                            const handleMRPPercentageChange = (e) => {
                                                const editedMrpPercent = e.currentTarget.value;
                                                setEditedMrpPercent(editedMrpPercent);
                                                const payload = {
                                                    url: 'domain/b2b/inline-update/category',
                                                    data: {
                                                        id: item.id,
                                                        field_name: 'mrp_percent',
                                                        value: editedMrpPercent,
                                                    },
                                                };
                                                dispatch(storeEntityData(payload));
                                                setOnlyReloadSetting(true)
                                            };

                                            return (
                                                <>
                                                    <TextInput
                                                        type="number"
                                                        label=""
                                                        size="xs"
                                                        id={"inline-update-sales-percent-" + item.id}
                                                        value={Number(editedMrpPercent)}
                                                        onChange={(e) => {
                                                            handleMRPPercentageChange(e)
                                                        }}
                                                        onKeyDown={getHotkeyHandler([
                                                            [
                                                                "Enter",
                                                                (e) => {
                                                                    document
                                                                        .getElementById(
                                                                            "inline-update-sales-percent-" + item.id
                                                                        )
                                                                        .focus();
                                                                },
                                                            ],
                                                        ])}
                                                    />
                                                </>
                                            );
                                        },
                                    },
                                    {
                                        accessor: "purchase_percent",
                                        textAlign: "center",
                                        title: t("PurchasePercent"),
                                        width: "220px",
                                        render: (item) => {
                                            const [editedPurchasePercent, setEditedPurchasePercent] = useState(item.purchase_percent);
                                            const handlePurchasePercentageChange = (e) => {
                                                const editedPurchasePercent = e.currentTarget.value;
                                                setEditedPurchasePercent(editedPurchasePercent);
                                                const payload = {
                                                    url: 'domain/b2b/inline-update/category',
                                                    data: {
                                                        id: item.id,
                                                        field_name: 'purchase_percent',
                                                        value: editedPurchasePercent,
                                                    },
                                                };
                                                dispatch(storeEntityData(payload));
                                                setOnlyReloadSetting(true)
                                            };

                                            return (
                                                <>
                                                    <TextInput
                                                        type="number"
                                                        label=""
                                                        size="xs"
                                                        id={"inline-update-discount-price-" + item.id}
                                                        value={Number(editedPurchasePercent)}
                                                        onChange={(e) => {
                                                            handlePurchasePercentageChange(e)
                                                        }}
                                                        onKeyDown={getHotkeyHandler([
                                                            [
                                                                "Enter",
                                                                (e) => {
                                                                    document
                                                                        .getElementById(
                                                                            "inline-update-discount-price-" + item.id
                                                                        )
                                                                        .focus();
                                                                },
                                                            ],
                                                        ])}
                                                    />
                                                </>
                                            );
                                        },
                                    },
                                    {
                                        accessor: "bonus_percent",
                                        textAlign: "center",
                                        title: t("BonusPercent"),
                                        width: "220px",
                                        render: (item) => {
                                            const [editedBonusPercent, setEditedBonusPercent] = useState(item.bonus_percent);
                                            const handleBonusPercentageChange = (e) => {
                                                const editedBonusPercent = e.currentTarget.value;
                                                setEditedBonusPercent(editedBonusPercent);
                                                const payload = {
                                                    url: 'domain/b2b/inline-update/category',
                                                    data: {
                                                        id: item.id,
                                                        field_name: 'bonus_percent',
                                                        value: editedBonusPercent,
                                                    },
                                                };
                                                dispatch(storeEntityData(payload));
                                                setOnlyReloadSetting(true)
                                            };

                                            return (
                                                <>
                                                    <TextInput
                                                        type="number"
                                                        label=""
                                                        size="xs"
                                                        id={"inline-update-bonus-percent-" + item.id}
                                                        value={Number(editedBonusPercent)}
                                                        onChange={(e) => {
                                                            handleBonusPercentageChange(e)
                                                        }}
                                                        onKeyDown={getHotkeyHandler([
                                                            [
                                                                "Enter",
                                                                (e) => {
                                                                    document
                                                                        .getElementById(
                                                                            "inline-update-bonus-percent-" + item.id
                                                                        )
                                                                        .focus();
                                                                },
                                                            ],
                                                        ])}
                                                    />
                                                </>
                                            );
                                        },
                                    },
                                    {
                                        accessor: "action",
                                        title: t("Action"),
                                        textAlign: "right",
                                        render: (item) => (
                                            <Group gap={4} justify="right" wrap="nowrap">
                                                <Tooltip arrowPosition="side" arrowOffset={50} arrowSize={7}
                                                         position="left" label={item.not_process == 1 && "Process data"}
                                                         withArrow opened={item.not_process == 1} color="red">
                                                    <Button
                                                        disabled={item.not_process == 0}
                                                        component="a"
                                                        size="compact-xs"
                                                        radius="xs"
                                                        variant="filled"
                                                        fw={"100"}
                                                        fz={"12"}
                                                        color={item.not_process == 1 ? "blue" : "red.3"}
                                                        mr={"4"}
                                                        onClick={async () => {
                                                            setReloadList(true)
                                                            const value = {
                                                                url: 'domain/b2b/category-wise/price-update/' + item.id,
                                                                param: {}
                                                            }

                                                            try {
                                                                const resultAction = await dispatch(getIndexEntityData(value));

                                                                if (getIndexEntityData.rejected.match(resultAction)) {
                                                                    console.error('Error:', resultAction);
                                                                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                                                                    showNotificationComponent(resultAction?.payload?.message, 'red', '', '', true);
                                                                }
                                                            } catch (err) {
                                                                console.error('Unexpected error:', err);
                                                            } finally {
                                                                setReloadList(false)
                                                            }
                                                        }}
                                                    >
                                                        {t("Process")}
                                                    </Button>
                                                </Tooltip>
                                            </Group>
                                        ),
                                    },
                                ]}
                                fetching={fetching}
                                totalRecords={subDomainCategoryData?.sub_domain_category?.length || 0}
                                recordsPerPage={perPage}
                                page={page}
                                onPageChange={(p) => {
                                    setPage(p);
                                    dispatch(setFetching(true));
                                }}
                                loaderSize="xs"
                                loaderColor="grape"
                                height={height}
                                scrollAreaProps={{type: "never"}}
                            />
                        </Box>
                    </Box>
                </Grid.Col>
            </Grid>
        </>
    );
}
