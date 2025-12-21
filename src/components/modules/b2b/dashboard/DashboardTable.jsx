import {
    Group,
    Box,
    ActionIcon,
    Text,
    Menu,
    rem,
    Button,
    Container,
    SimpleGrid,
    Card,
    Grid,
    useMantineTheme,
    LoadingOverlay,
    Modal,
    Table, ScrollArea
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import tableCss from "../../../../assets/css/Table.module.css";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IconMoneybag } from "@tabler/icons-react";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {
    getIndexEntityData,
    deleteEntityData
} from "../../../../store/core/crudSlice.js";
import { modals } from "@mantine/modals";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function DashBoardTable() {
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 98;
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const perPage = 20;
    const [page, setPage] = useState(1);

    const [reloadList, setReloadList] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [indexData, setIndexData] = useState([]);

    // Failed product modal state
    const [failedModalOpen, setFailedModalOpen] = useState(false);
    const [failedProducts, setFailedProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: "domain/b2b/sub-domain",
                param: {}
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setReloadList(false);
            }
        };

        fetchData();
    }, [dispatch, fetching]);

    const handleSubDomainDelete = async (id) => {
        modals.openConfirmModal({
            title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "blue" },
            onCancel: () => console.log("Cancel"),
            onConfirm: async () => {
                try {
                    const action = await dispatch(
                        deleteEntityData(`domain/b2b/sub-domain/delete/` + id)
                    );
                    const payload = action.payload;
                    if (payload?.status === 200) {
                        showNotificationComponent(
                            t("Account head deleted successfully"),
                            "green"
                        );
                    } else {
                        showNotificationComponent(t("Something went wrong"), "red");
                    }
                } catch (error) {
                    showNotificationComponent(t("Request failed"), "red");
                }
            }
        });
    };

    const handleSyncProduct = async (id = null) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("AreYouSureSyncProduct")}</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "blue" },
            onCancel: () => console.log("Cancel"),
            onConfirm: async () => {
                setReloadList(true);

                const value = {
                    url: "domain/b2b/domain-wise/product-update",
                    param: { domain_id: id }
                };

                try {
                    const resultAction = await dispatch(getIndexEntityData(value));

                    if (getIndexEntityData.rejected.match(resultAction)) {
                        console.error("Error:", resultAction);
                        showNotificationComponent("Failed to sync products.", "red");
                    } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                        const { message, failed_products } = resultAction.payload;

                        showNotificationComponent(message ?? "Successfully updated products.", failed_products?.length > 0 ? "orange" : "green");

                        if (failed_products && failed_products.length > 0) {
                            setFailedProducts(failed_products);
                            setFailedModalOpen(true);
                        }
                    }
                } catch (err) {
                    console.error("Unexpected error:", err);
                    showNotificationComponent("Unexpected error occurred.", "red");
                } finally {
                    setReloadList(false);
                }
            }
        });
    };

    const exportFailedProducts = (failedProducts) => {
        if (!failedProducts || failedProducts.length === 0) return;

        // Create worksheet from JSON
        const worksheet = XLSX.utils.json_to_sheet(
            failedProducts.map((p, index) => ({
                "#": index + 1,
                "Product Name": p.product_name,
                "Category ID": p.category_id,
            }))
        );

        // Create workbook and append worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Products");

        //Generate buffer
        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

        // Save file
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        saveAs(blob, "failed_products.xlsx");
    };

    return (
        <Box style={{ position: "relative" }}>
            <Box pl={`4`} pr={8} pt={"6"} pb={"4"} className={"borderRadiusAll"} bg={"white"}>
                <Container fluid mt={"xs"}>
                    <SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs" mb={"xs"}>
                        <Card h={150} shadow="md" radius="md" className={classes.card} padding="lg">
                            <Grid gutter={{ base: 2 }}>
                                <Grid.Col span={2}>
                                    <IconMoneybag
                                        style={{ width: rem(42), height: rem(42) }}
                                        stroke={2}
                                        color={theme.colors.blue[6]}
                                    />
                                </Grid.Col>
                                <Grid.Col span={10}>
                                    <Text fz="md" fw={500} className={classes.cardTitle}>
                                        {t("AccountingOverview")}
                                    </Text>
                                </Grid.Col>
                            </Grid>
                        </Card>

                        <Card h={150} shadow="md" radius="md" className={classes.card} padding="lg">
                            <Grid gutter={{ base: 2 }}>
                                <Button
                                    component="a"
                                    size="compact-xs"
                                    radius="xs"
                                    variant="filled"
                                    fw={"100"}
                                    fz={"12"}
                                    bg={"red"}
                                    mr={"4"}
                                    onClick={() => handleSyncProduct()}
                                >
                                    {t("AllDomainSyncProduct")}
                                </Button>
                            </Grid>
                        </Card>
                    </SimpleGrid>
                </Container>
            </Box>

            <LoadingOverlay
                visible={reloadList}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ color: "red", size: "sm" }}
            />

            <Box p={"xs"} bg={"white"} className={"borderRadiusAll"} mt={"4"}>
                <Box bg={"white"} className={"borderRadiusAll"}>
                    <DataTable
                        classNames={{
                            root: tableCss.root,
                            table: tableCss.table,
                            header: tableCss.header,
                            footer: tableCss.footer,
                            pagination: tableCss.pagination
                        }}
                        records={indexData.data}
                        columns={[
                            { accessor: "name", title: t("Name") },
                            { accessor: "email", title: t("Email") },
                            { accessor: "mobile", title: t("Mobile") },
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
                                            bg={"red"}
                                            onClick={() => handleSyncProduct(data.sub_domain_id)}
                                        >
                                            {t("B2bPriceUpdate")}
                                        </Button>
                                        <Button
                                            component="a"
                                            size="compact-xs"
                                            radius="xs"
                                            variant="filled"
                                            fw={"100"}
                                            fz={"12"}
                                            className={"btnPrimaryBg"}
                                            onClick={() => {
                                                navigate(`/b2b/sub-domain/setting/${data.id}`);
                                            }}
                                        >
                                            {t("Manage")}
                                        </Button>
                                        <Button
                                            component="a"
                                            size="compact-xs"
                                            radius="xs"
                                            variant="filled"
                                            fw={"100"}
                                            bg={"red"}
                                            fz={"12"}
                                            onClick={() => handleSubDomainDelete(data.id)}
                                        >
                                            {t("Delete")}
                                        </Button>
                                    </Group>
                                )
                            }
                        ]}
                        fetching={fetching}
                        totalRecords={indexData.total}
                        recordsPerPage={perPage}
                        page={page}
                        onPageChange={(p) => {
                            setPage(p);
                            setFetching(true);
                        }}
                        loaderSize="xs"
                        loaderColor="grape"
                        height={height - 140}
                        scrollAreaProps={{ type: "never" }}
                    />
                </Box>
            </Box>

            {/* Failed Products Modal */}
            <Modal
                opened={failedModalOpen}
                onClose={() => setFailedModalOpen(false)}
                title="Failed Products"
                size="xl"
                overflow="inside"
            >
                <ScrollArea style={{ height: 400 }}>
                    <Table
                        striped
                        highlightOnHover
                        withBorder
                        withColumnBorders
                        verticalSpacing="sm"
                    >
                        <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>#</th>
                            <th style={{ width: "50%", textAlign: "left" }}>Product Name</th>
                            <th style={{ width: "50%", textAlign: "left" }}>Category ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        {failedProducts.map((p, index) => (
                            <tr key={p.product_id}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td>{p.product_name}</td>
                                <td>{p.category_id}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </ScrollArea>
                <Button mt="md" fullWidth onClick={() => setFailedModalOpen(false)}>
                    Close
                </Button>
                <Button
                    color="red"
                    mt="sm"
                    fullWidth
                    onClick={() => exportFailedProducts(failedProducts)}
                >
                    Download XLSX
                </Button>

            </Modal>

        </Box>
    );
}
