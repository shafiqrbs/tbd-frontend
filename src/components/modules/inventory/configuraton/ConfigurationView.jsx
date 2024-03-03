import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    Text,
    Tooltip,
    Box,
    ScrollArea,
    Title,
    TextInput, Grid, ActionIcon,rem
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconFilter, IconSearch, IconInfoCircle, IconEye, IconEdit, IconTrash, IconRestore} from "@tabler/icons-react";
import axios from "axios";
import {DataTable} from 'mantine-datatable';
import ConfigurationForm from "./ConfigurationForm";
import {useDispatch, useSelector} from "react-redux";
import {setFetching} from "../../../../store/core/utilitySlice.js";
import PrintSetupForm from "./PrintSetupForm";
import ProductSetupForm from "./ProductSetupForm";

function ConfigurationView(props) {

    const {form} = props
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 104

    return (
        <>
            <Box pr={12} pl={'12'} mt={16}>
                <Grid gutter="xs">
                    <Grid.Col span="auto" className={"grid-radius"} >
                        <Box bg={"white"} pd={`md`}>
                            <Box pb={`xs`} pl={'md'} >
                                <Grid>
                                    <Grid.Col span={12} h={52}>
                                        <Title order={6}>{t('ProductSetup')}</Title>
                                        <Text fz={`xs`}>{t('ProductSetupDetails')}</Text>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box h={1} bg={`gray.1`}></Box>
                            <ScrollArea h={height}  scrollbarSize={2}>
                                <ProductSetupForm form={form}/>
                            </ScrollArea>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span="auto" className={"grid-radius"} >
                        <Box bg={"white"} pd={`md`}>
                            <Box pb={`xs`} pl={'md'} >
                                <Grid>
                                    <Grid.Col span={12} h={52}>
                                        <Title order={6}>{t('CustomerInformation')}</Title>
                                        <Text fz={`xs`}>{t('CustomerInformationFormDetails')}</Text>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box h={1} bg={`gray.1`}></Box>
                            <ScrollArea h={height}  scrollbarSize={2}>
                                <ConfigurationForm form={form}/>
                            </ScrollArea>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span="auto" className={"grid-radius"} >
                        <Box bg={"white"} pd={`md`}>
                            <Box pb={`xs`} pl={'md'} >
                                <Grid>
                                    <Grid.Col span={12} h={52}>
                                        <Title order={6}>{t('CustomerInformation')}</Title>
                                        <Text fz={`xs`}>{t('CustomerInformationFormDetails')}</Text>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box h={1} bg={`gray.1`}></Box>
                            <ScrollArea h={height}  scrollbarSize={2}>
                                <PrintSetupForm form={form}/>
                            </ScrollArea>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

export default ConfigurationView;