import React, {useEffect, useState} from "react";
import {ActionIcon, Box, Button, Grid, Group, Text, TextInput, Title} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import axios from "axios";
import {
    IconArrowBackUp,
    IconCheck,
    IconEdit,
    IconEye,
    IconTrash,
} from "@tabler/icons-react";
import "mantine-datatable/styles.css";
import {useOutletContext} from "react-router-dom";

function FullTable() {
    const {isOnline, mainAreaHeight} = useOutletContext();

    const [records, setRecords] = useState([]);
    useEffect(() => {
        axios({
            method: "get",
            url: "https://jsonplaceholder.typicode.com/posts",
            //url: "https://jsonplaceholder.typicode.com/users",
        })
            .then(function (res) {
                setRecords(res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <>
            <Box p={`xs`}>
                <Title order={4}>Notifications</Title>
                <Text fz={`sm`}>We'll always let you know about important changes</Text>
            </Box>
            <Box h={1} bg={`gray.1`}></Box>
            <DataTable
                withTableBorder
                withColumnBorders
                pinLastColumn
                pinFirstColumn
                height={mainAreaHeight - 110} // 36 is tab list height
                scrollAreaProps={{type: "hover", scrollbarSize: 4}}
                columns={[
                    {accessor: "id"},
                    {accessor: "name"},
                    {accessor: "username"},
                    {accessor: "email"},
                    {accessor: "phone"},
                    {accessor: "website"},
                    {
                        accessor: "address.street",
                        title: "Street",
                    },
                    {
                        accessor: "address.suite",
                        title: "Suite",
                    },
                    {
                        accessor: "address.city",
                        title: "City",
                    },
                    {
                        accessor: "address.zipcode",
                        title: "Zip code",
                    },
                    {
                        accessor: "company.name",
                        title: "Company name",
                    },
                    {
                        accessor: "actions",
                        textAlign: "right",
                        render: (record) => (
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
                ]}
                records={records}
                rowExpansion={{
                    content: ({record, collapse}) => (
                        <Box p="md">
                            <Grid>
                                <Grid.Col span={{base: 12, xs: 6}}>
                                    <TextInput
                                        label="Name"
                                        size="xs"
                                        value={record.name}
                                        onChange={(value) => console.log(value)}
                                    />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Group justify="center">
                                        <Button
                                            variant="default"
                                            size="xs"
                                            leftSection={<IconArrowBackUp size={16}/>}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="xs"
                                            leftSection={<IconCheck size={16}/>}
                                        >
                                            Save
                                        </Button>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    ),
                }}
            />
        </>
    );
}

export default FullTable;
