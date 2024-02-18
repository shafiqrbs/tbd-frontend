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
    TextInput, Grid, ActionIcon,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconFilter, IconSearch, IconInfoCircle, IconEye, IconEdit, IconTrash} from "@tabler/icons-react";
import axios from "axios";
import {DataTable} from 'mantine-datatable';
import CustomerForm from "./CustomerForm";

function CustomerView(props) {

    const {form} = props
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 36
    const [data, setRecords] = useState([]);
    const [fetching, setFetching] = useState(false);

   // console.log(data)

    useEffect(() => {
        axios({
                method: "get",
               // url: "https://jsonplaceholder.typicode.com/posts",
                url: "https://backend.poskeeper.com/api/customer",
                headers: {
                    "Accept": `application/json`,
                    "Content-Type": `application/json`,
                    "Access-Control-Allow-Origin": '*',
                    "X-Api-Key": 'poskeeper'
                }
            })
            .then(function (res) {
             //   console.log(res.data)
                // setRecords(res.data);
                 setRecords(res.data.data.data);
            })
            /*.catch(function (error) {
                console.log(error);
            });*/
    }, []);


    return (
        <>
            <Box>
                <Grid cols={2}>
                    <Grid.Col span={8}>
                        <Box  pb={`md`} pt={`xs`} >
                            <Grid>
                                <Grid.Col span={8}>
                                    <TextInput
                                        leftSection={<IconSearch size={16} opacity={0.5}/>}
                                        rightSection={
                                            <Tooltip
                                                label={t("this_filed_is_required")}
                                                withArrow
                                                bg={`blue.5`}
                                            >
                                                <IconInfoCircle size={16} opacity={0.5}/>
                                            </Tooltip>
                                        }
                                        size="sm"
                                        placeholder={t('EnterSearchAnyKeyword')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Group grow preventGrowOverflow={true} >
                                        <Tooltip
                                            label={t('ClickHereForListOfRows')}
                                            px={20}
                                            py={3}
                                            color={`blue.3`}
                                            withArrow
                                            position={"bottom"}
                                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                        >
                                            <Button size="sm" color={`blue.5`} variant="light">
                                                <IconSearch size={18}/>
                                            </Button>
                                        </Tooltip>
                                        <Tooltip
                                            label={t("ClickHereForFilterWithAdvanceSearch")}
                                            px={20}
                                            py={3}
                                            color={`green.3`}
                                            withArrow
                                            position={"bottom"}
                                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                        >
                                            <Button size="sm" variant="light" color={`green.5`}>
                                                <IconFilter size={18}/>
                                            </Button>
                                        </Tooltip>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                        </Box>

                        {
                            (data && data.length > 0) &&
                            <DataTable
                                withTableBorder
                                columns={
                                    [
                                        { accessor: 'id' , title: "S/N", },
                                        { accessor: 'name',  title: "Post Title" },
                                        {
                                            accessor: "action",
                                            title: "",
                                            textAlign: "right",
                                            render: (data) => (
                                                <Group gap={4} justify="right" wrap="nowrap">
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="green"
                                                    >
                                                        <IconEye size={16}/>
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="blue"
                                                    >
                                                        <IconEdit size={16}/>
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="red"
                                                    >
                                                        <IconTrash size={16}/>
                                                    </ActionIcon>
                                                </Group>
                                            ),
                                        },

                                    ]
                                }
                                records={data}
                                fetching={fetching}
                                customLoader={
                                    <svg width={80} height={80} viewBox="0 0 40 40">
                                        <IconFilter size={18}/>
                                    </svg>
                                }
                                height={height}
                                scrollAreaProps={{ type: 'hover' }}
                                scrollbarSize={10}
                            />
                        }

                    </Grid.Col>
                    <Grid.Col span={4}>
                    <div className={"form-grid"}>
                        <Box pl={`xs`}  pb={`xs`} pt={`xs`}>
                            <Title order={6}>{t('CustomerInformation')}</Title>
                            <Text fz={`xs`}>{t('CustomerInformationFormDetails')}</Text>
                        </Box>
                        <Box h={1} bg={`gray.1`}></Box>
                        <ScrollArea h={height} scrollbarSize={2}>
                            <CustomerForm form={form}/>
                        </ScrollArea>

                    </div>
                   </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

export default CustomerView;
