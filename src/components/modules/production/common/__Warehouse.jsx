import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {Box, Text, Grid, Card, ScrollArea} from "@mantine/core";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";

export default function __Warehouse(props) {
    const {classes, selectWarehouseId, setWarehouseId, setReloadList, module} = props;
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 106;
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [userWarehouse, setUserWarehouse] = useState([]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUserWarehouse(userData?.user_warehouse || []);
    }, []);


    return (
        <>
            <Card shadow="md" radius="4"  className={classes.card} padding="xs">
                <Grid gutter={{base: 2}}>
                    <Grid.Col span={10}>
                        <Text fz="md" fw={500} className={classes.cardTitle}>
                            {t("Warehouse")}
                        </Text>
                    </Grid.Col>
                </Grid>
                <Grid columns={9} gutter={{base:1}}>
                    <Grid.Col span={9}>
                        <Box bg={"white"}>
                            <Box mt={8} pt={"8"}>
                                <ScrollArea
                                    h={height}
                                    scrollbarSize={2}
                                    scrollbars="y"
                                    type="never"
                                >
                                    {userWarehouse &&  userWarehouse.map((data) => (
                                        <Box
                                            style={{
                                                borderRadius: 4,
                                                cursor: "pointer",
                                            }}
                                            className={`${classes["pressable-card"]} border-radius`}
                                            mih={40}
                                            mt={"4"}
                                            variant="default"
                                            key={data.id}
                                            onClick={() => {
                                                // setWarehouseId(data.id);
                                                // navigate(`/b2b/sub-domain/${module}/${data.id}`);
                                                // setReloadList(true)
                                            }}
                                            /*bg={
                                                data.id == selectWarehouseId ? "#f8eedf" : "gray.1"
                                            }*/
                                        >
                                            <Text
                                                size={"sm"}
                                                pt={8}
                                                pl={8}
                                                fw={500}
                                                // c={data.id === selectWarehouseId ? "black" : "black"}
                                            >
                                                {data.warehouse_name}
                                            </Text>
                                        </Box>
                                    ))}
                                </ScrollArea>
                            </Box>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Card>
        </>
    );
}
