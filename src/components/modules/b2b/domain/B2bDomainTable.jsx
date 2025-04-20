import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    Button,
    LoadingOverlay,
    Tooltip,
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import _Search from "../common/_Search.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import { useForm } from "@mantine/form";
import {
    getIndexEntityData,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";
import useUtilityDomainTypeDropdownData from "../../../global-hook/dropdown/getUtilityDomainTypeDropdownData.js";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";

export default function B2bDomainTable({ id }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const navigate = useNavigate();
    const height = mainAreaHeight - 120;

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [domainTypeMap, setDomainTypeMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [indexData, setIndexData] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);

    const loginUser = (() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
            return {};
        }
    })();

    const form = useForm({
        initialValues: {
            mode_id: "",
        },
    });

    const domainTypeDropdownData = useUtilityDomainTypeDropdownData(refresh);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const action = await dispatch(
                getIndexEntityData({
                    url: "domain/b2b/domain",
                    param: {
                        term: searchKeyword,
                        page,
                        offset: perPage,
                    },
                })
            );

            if (getIndexEntityData.fulfilled.match(action)) {
                setIndexData(action.payload);
            } else {
                console.error("Fetch error:", action);
                showNotificationComponent(t("Fetch failed"), "red");
            }
        } catch (err) {
            console.error("Unexpected fetch error:", err);
            showNotificationComponent(t("Unexpected fetch error"), "red");
        } finally {
            setLoading(false);
            setRefresh(false);
        }
    }, [dispatch, searchKeyword, page, perPage, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDomainTypeChange = async (id, value) => {
        setDomainTypeMap((prev) => ({ ...prev, [id]: value }));

        try {
            const payload = {
                url: "domain/b2b/inline-update/domain",
                data: {
                    domain_id: id,
                    field_name: "domain_type",
                    value,
                },
            };
            await dispatch(storeEntityData(payload));
            setRefresh(true);
        } catch (error) {
            console.error("Domain type update failed", error);
            showNotificationComponent(t("Update failed"), "red");
        }
    };

    const handleProcess = async (itemId) => {
        setLoading(true);
        const data = {
            url: "domain/b2b/inline-update/domain",
            data: {
                domain_id: itemId,
                field_name: "status",
                value: true,
            },
        };

        try {
            const action = await dispatch(storeEntityData(data));
            const payload = action.payload;

            if (payload?.status === 200 && payload?.data?.data?.id) {
                showNotificationComponent(t("Domain process successfully"), "green");
                navigate(`/b2b/sub-domain/setting/${payload.data.data.id}`);
            } else {
                showNotificationComponent(t("Something went wrong"), "red");
            }
        } catch (error) {
            console.error("Error updating domain status", error);
            showNotificationComponent(t("Request failed"), "red");
        } finally {
            setLoading(false);
            setRefresh(true);
        }
    };

    return (
        <>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />

            {/* Search Bar */}
            <Box
                className="boxBackground borderRadiusAll"
                pl="xs"
                pr={8}
                pt="xs"
                pb="xs"
                mb="xs"
            >
                <_Search module="category" />
            </Box>

            {/* Table */}
            <Box className="borderRadiusAll">
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer,
                        pagination: tableCss.pagination,
                    }}
                    records={
                        (indexData?.data || []).filter(
                            (item) => item.id !== loginUser.domain_id
                        )
                    }
                    columns={[
                        {
                            accessor: "index",
                            title: t("S/N"),
                            textAlignment: "right",
                            render: (item) => {
                                const index = (indexData?.data || []).findIndex((i) => i.id === item.id);
                                return index + 1 + (page - 1) * perPage;
                            },
                        },
                        { accessor: "company_name", title: t("CompanyName") },
                        { accessor: "name", title: t("ClientName") },
                        { accessor: "mobile", title: t("Mobile") },
                        { accessor: "email", title: t("Email") },
                        { accessor: "unique_code", title: t("LicenseNo") },
                        {
                            accessor: "domain_type",
                            title: t("DomainType"),
                            width: "220px",
                            textAlign: "center",
                            render: (item) => (
                                <SelectForm
                                    tooltip={t("ChooseDomainType")}
                                    placeholder={t("ChooseDomainType")}
                                    required
                                    searchable
                                    name={`domain_type_${item.id}`}
                                    form={form}
                                    dropdownValue={domainTypeDropdownData}
                                    value={
                                        String(domainTypeMap[item.id] ?? item.domain_type ?? "")
                                    }
                                    changeValue={(value) =>
                                        handleDomainTypeChange(item.id, value)
                                    }
                                />
                            ),
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => {
                                const selectedDomainType =
                                    domainTypeMap[item.id] ?? item.domain_type;

                                if (!selectedDomainType && item.status !== 1) return null;

                                return (
                                    <Group gap={4} justify="right" wrap="nowrap">
                                        <Tooltip
                                            label={t("DomainGenerateCategoryProduct")}
                                            px={16}
                                            py={2}
                                            withArrow
                                            position="left"
                                            c="white"
                                            className="btnPrimaryBg"
                                            transitionProps={{
                                                transition: "pop-bottom-left",
                                                duration: 500,
                                            }}
                                        >
                                            <Button
                                                size="compact-xs"
                                                radius="xs"
                                                variant="filled"
                                                fw={100}
                                                fz={12}
                                                className="btnPrimaryBg"
                                                mr={4}
                                                onClick={() => handleProcess(item.id)}
                                            >
                                                {t("Process")}
                                            </Button>
                                        </Tooltip>
                                    </Group>
                                );
                            },
                        },
                    ]}
                    fetching={loading}
                    totalRecords={indexData.total || 0}
                    recordsPerPage={perPage}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p);
                        setRefresh(true);
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    scrollAreaProps={{ type: "never" }}
                />
            </Box>
        </>
    );
}
