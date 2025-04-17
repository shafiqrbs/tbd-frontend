import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {Box, Text, Grid, Card, ScrollArea} from "@mantine/core";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";

export default function _ManageBranchAndFranchise(props) {
    const {id, classes, selectedDomainId, setSelectedDomainId, setReloadList, module} = props;
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 120;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [subDomainData, setSubDomainData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'domain/b2b/sub-domain', param: {}
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setSubDomainData(resultAction.payload);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setReloadList(false)
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <>
            <Card shadow="md" radius="md" className={classes.card} padding="lg">
                <Grid gutter={{base: 2}}>
                    <Grid.Col span={10}>
                        <Text fz="md" fw={500} className={classes.cardTitle}>
                            {t("ManageBranchAndFranchise")}
                        </Text>
                    </Grid.Col>
                </Grid>
                <Grid columns={9} gutter={{base: 8}}>
                    <Grid.Col span={9}>
                        <Box bg={"white"}>
                            <Box mt={8} pt={"8"}>
                                <ScrollArea
                                    h={height}
                                    scrollbarSize={2}
                                    scrollbars="y"
                                    type="never"
                                >
                                    {subDomainData && subDomainData?.data && subDomainData.data.map((data) => (
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
                                                setSelectedDomainId(data.id);
                                                navigate(`/b2b/sub-domain/${module}/${data.id}`);
                                                setReloadList(true)
                                            }}
                                            bg={
                                                data.id == selectedDomainId ? "gray.6" : "gray.1"
                                            }
                                        >
                                            <Text
                                                size={"sm"}
                                                pl={14}
                                                pt={8}
                                                fw={500}
                                                c={data.id === selectedDomainId ? "white" : "black"}
                                            >
                                                {data.name}
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
