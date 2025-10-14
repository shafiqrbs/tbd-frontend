import React, {useState} from "react";
import {Box, Card, Grid, ScrollArea, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {useNavigate, useParams} from "react-router-dom";
import getCoreWarehouseData from "../../../global-hook/dropdown/core/getCoreWarehouseData.js";

function WarehouseStockNav({active}) {
    const {t, i18n} = useTranslation();
    const {warehouse} = useParams();
    const [selectedDomainId, setSelectedDomainId] = useState(warehouse);
    const navigate = useNavigate();
    let warehouseDropdownData = getCoreWarehouseData();

    return (
        <>
            <Card shadow="md" radius="4" className={classes.card} padding="xs">
                <Grid gutter={{base: 2}}>
                    <Grid.Col span={10}>
                        <Text fz="md" fw={500} className={classes.cardTitle}>
                            {t("WarehouseStock")}
                        </Text>
                    </Grid.Col>
                </Grid>
                <ScrollArea bg="white" type="never" className="border-radius">

                    <Box
                        style={{
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                        className={`${classes["pressable-card"]} border-radius`}
                        mih={40}
                        mt="4"
                        variant="default"
                        onClick={() => {
                            navigate(`/inventory/stock`);
                        }}
                        bg={
                            active == "stock" && !warehouse ? "#f8eedf" : "gray.1"
                        }
                    >
                        <Text
                            size="sm"
                            pt={8}
                            pl={8}
                            fw={500}
                            c="black"
                        >
                            {t("Stocks")}
                        </Text>
                    </Box>

                    <Box
                        style={{
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                        className={`${classes["pressable-card"]} border-radius`}
                        mih={40}
                        mt="4"
                        variant="default"
                        onClick={() => {
                            navigate(`/inventory/stock/matrix`);
                        }}
                        bg={
                            active == "matrix" ? "#f8eedf" : "gray.1"
                        }
                    >
                        <Text
                            size="sm"
                            pt={8}
                            pl={8}
                            fw={500}
                            c="black"
                        >
                            {t("StockMatrix")}
                        </Text>
                    </Box>

                    <Box
                        style={{
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                        className={`${classes["pressable-card"]} border-radius`}
                        mih={40}
                        mt="4"
                        variant="default"
                        onClick={() => {
                            navigate(`/inventory/stock/expiry`);
                        }}
                        bg={
                            active == "expire" ? "#f8eedf" : "gray.1"
                        }
                    >
                        <Text
                            size="sm"
                            pt={8}
                            pl={8}
                            fw={500}
                            c="black">
                            {t("ExpiryStock")}
                        </Text>
                    </Box>

                    {warehouseDropdownData && (
                        warehouseDropdownData.map((data, index) => (
                            <Box
                                style={{
                                    borderRadius: 4,
                                    cursor: "pointer",
                                }}
                                className={`${classes["pressable-card"]} border-radius`}
                                mih={40}
                                mt="4"
                                variant="default"
                                bg={
                                    data?.id === selectedDomainId && warehouse ? "#f8eedf" : "gray.1"
                                }
                                key={data.id}
                                onClick={() => {
                                    setSelectedDomainId(data.id);
                                    navigate(`/inventory/stock/${data.id}`);
                                }}
                            >
                                <Text
                                    size="sm"
                                    pt={8}
                                    pl={8}
                                    fw={500}
                                    c="black"
                                >
                                    {data?.name}
                                </Text>
                            </Box>
                        ))
                    )}
                </ScrollArea>
            </Card>
        </>
    );
}

export default WarehouseStockNav;
