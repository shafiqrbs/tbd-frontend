import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    Button,
    LoadingOverlay,
    Tooltip,
    Text,
} from "@mantine/core";
import { modals } from '@mantine/modals';

import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import _Search from "../common/_Search.jsx";
import { IconArrowRight } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
    getIndexEntityData,
    storeEntityData,
    showEntityData,
} from "../../../../store/core/crudSlice.js";
import useUtilityDomainTypeDropdownData from "../../../global-hook/dropdown/getUtilityDomainTypeDropdownData.js";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import useCommonDataStoreIntoLocalStorage from "../../../global-hook/local-storage/useCommonDataStoreIntoLocalStorage.js";
import useOrderProcessDropdownLocalDataStore from "../../../global-hook/local-storage/useOrderProcessDropdownLocalDataStore.js";

export default function B2bUserTable({ id }) {
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

    const loginUser = (userInfo) => {
        try {
            modals.openConfirmModal({
				title: t("Confirm Login"),
				children: (
					<Text size="sm">
						Are you sure you want to login as <strong>{userInfo.username}</strong>? This will log you out of your current session.
					</Text>
				),
				labels: { confirm: t("Confirm"), cancel: t("Cancel") },
				confirmProps: { color: "red" },
				onCancel: () => console.log("Login cancelled"),
				onConfirm: async () => {
                    const resultAction = await dispatch(showEntityData("domain/b2b/impersonate/" + userInfo.domain_id + "/" + userInfo.id));
                    if (showEntityData.rejected.match(resultAction)) {
                        console.log('Error'+resultAction)
                    } else if (showEntityData.fulfilled.match(resultAction)) {
                        if (resultAction.payload.data.status === 200) {
                            localStorage.setItem("user", JSON.stringify(resultAction.payload.data.data));
                            const allLocal = useCommonDataStoreIntoLocalStorage(resultAction.payload.data.data.id)
                            const orderProcess = useOrderProcessDropdownLocalDataStore(resultAction.payload.data.data.id)
                            navigate('/')
                        }
                    }
                },
			});
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
            return {};
        }
    };

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
                    url: "domain/b2b/sub-domain-users",
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

    return (
        <Box style={{position: "relative"}}>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{color:"red"}}
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
                <_Search module="user" />
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

                    records={indexData.data}
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
                        { accessor: "mobile", title: t("Mobile") },
                        { accessor: "name", title: t("Name") },
                        { accessor: "username", title: t("UserName") },
                        { accessor: "email", title: t("Email") },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Button
                                        component="a"
                                        size="compact-xs"
                                        radius="xs"
                                        variant="filled"
                                        fw={"100"}
                                        fz={"12"}
                                        className={'btnPrimaryBg'}
                                        mr={"4"}
                                        rightSection={<IconArrowRight size={14} />}
                                        onClick={() => loginUser(data)}
                                    >
                                        {t("Login")}
                                    </Button>
                                </Group>
                            ),
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
        </Box>
    );
}
