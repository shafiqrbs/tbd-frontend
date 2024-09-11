import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text, Menu, rem,
    TextInput, Tooltip,
    Button, Grid, Flex, ScrollArea, Card, Image, Select, SimpleGrid,
    Checkbox, Paper
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconTrashX, IconDotsVertical, IconCheck, IconSearch, IconChevronDown, IconX, IconPlus, IconMinus, IconTrash, IconSum } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import classes from '../Sales.module.css';
import tableCss from './Table.module.css'


function PosSales() {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 202; //TabList height 104

    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const data = [
        { "id": 1, "name": "T-1" },
        { "id": 2, "name": "T-2" },
        { "id": 3, "name": "T-3" },
        { "id": 4, "name": "T-4" },
        { "id": 5, "name": "T-5" },
        { "id": 6, "name": "T-6" },
        { "id": 7, "name": "T-7" },
        { "id": 8, "name": "T-8" },
        { "id": 9, "name": "T-9" },
        { "id": 10, "name": "T-10" },
        { "id": 11, "name": "T-11" },
        { "id": 12, "name": "T-12" },
        { "id": 13, "name": "T-13" },
        { "id": 14, "name": "T-14" },
        { "id": 15, "name": "T-15" }
    ]
    const [tableData, setTableData] = useState([
        { id: 1, name: 'Spaghetti Bolognese', qty: 10, price: 1000 },
        { id: 2, name: 'Fettuccine Alfredo', qty: 8, price: 1200 },
        { id: 3, name: 'Fettuccine Lalamero', qty: 8, price: 1200 },
        { id: 4, name: 'Gigichano Alfredo', qty: 8, price: 1200 },
        { id: 5, name: 'Fettuccine Alfredo Kepukano', qty: 8, price: 1200 },
      ]);
    const [checked, setChecked] = useState(false);

    const handleIncrement = (id) => {
        setTableData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
          )
        );
      };

      const handleDecrement = (id) => {
        setTableData((prevData) =>
          prevData.map((item) =>
            item.id === id && item.qty > 0 ? { ...item, qty: item.qty - 1 } : item
          )
        );
      };
      const handleDelete = (id) => {
        setTableData((prevData) => prevData.filter((item) => item.id !== id));
      };
      const calculateSubtotal = (data) => {
        return data.reduce((total, item) => total + item.price * item.qty, 0);
    };
    const subtotal = calculateSubtotal(tableData);

    return (
        <>

            <Box pl={10} m={0} pr={10}>
                <Group  preventGrowOverflow={false} grow align="flex-start" wrap="nowrap" gap={10} mb={8}>
                    <Select
                        pt={10}
                        placeholder="Order Taken By"
                        data={['Rafi', 'Foysal', 'Mahmud', 'Hasan']}
                        clearable
                        searchable
                        value={value}
                        onChange={setValue}
                        nothingFoundMessage="Nothing found..."
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        rightSection={
                            (value || searchValue) ? (
                                <IconX
                                    style={{ width: rem(16), height: rem(16), cursor: 'pointer' }}
                                    onMouseDown={() => {
                                        setValue('');
                                    }}
                                />
                            ) : (
                                <IconChevronDown style={{ width: rem(16), height: rem(16) }} />
                            )
                        }
                    />

                    <Button
                        radius="md"
                        size="sm"
                        color="green"
                        mt={10}
                        miw={122}
                        maw={122}
                    >
                        <Text fw={600} size="sm">
                            Search
                        </Text>
                    </Button>
                </Group>
                <Box>

                    <ScrollArea h={height/2 } type="never" scrollbars="y">
                        <Paper p="xs" radius="md" style={{ backgroundColor: checked ? '#4CAF50' : '#E8F5E9' }}>
                            <Grid align="center">
                                <Grid.Col span={11}>
                                    <Text weight={500} color={checked ? 'white' : 'black'}>Select additional table</Text>
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Checkbox
                                        checked={checked}
                                        color="green.8"
                                        onChange={(event) => setChecked(event.currentTarget.checked)}
                                        styles={(theme) => ({
                                            input: {
                                                borderColor: 'white',
                                            },
                                        })}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Paper>

                        {checked && (
                            <Paper p="md" radius="md" bg={'#E6F5ED99'}>
                                <Grid columns={15} gutter="md">
                                    {data.map((item) => (
                                        <Grid.Col span={3} key={item.id}>
                                            <Checkbox
                                                label={item.name}
                                                color="green.8"
                                                styles={(theme) => ({
                                                    input: {
                                                        border: '1.5px solid #767676'
                                                    },
                                                    label: {
                                                        color: '#333333'
                                                    }
                                                })}
                                            />
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            </Paper>
                        )}
                        <ScrollArea h={268} type="never" scrollbars="y">
                        <DataTable
                                                classNames={{
                                                    root: tableCss.root,
                                                    table: tableCss.table,
                                                    header: tableCss.header,
                                                    footer: tableCss.footer,
                                                    pagination: tableCss.pagination,
                                                }}
                                                records={tableData}
                                                columns={[
                                                    
                                                    { accessor: 'name', title:t('Product'), 
                                                        footer: (
                                                            
                                                              <div>Sub Total -</div>
                                                          ),
                                                    },
                                                    { accessor: 'qty', title:t('Qty'),textAlign: "left",

                                                        render : (data) =>(
                                                            <Group w={120} gap={8} justify="left">
                                                            <ActionIcon
                                                                bg={'#596972'}
                                                                onClick={() => handleDecrement(data.id)}
                                                            >
                                                                <IconMinus height={'24'} width={'24'} />
                                                            </ActionIcon>
                                                            <Text size="sm" ta={'center'} fw={600} maw={30}>
                                                                {data.qty}
                                                            </Text>
                                                            <ActionIcon
                                                                bg={'#596972'}
                                                                onClick={() => handleIncrement(data.id)}
                                                            >
                                                                <IconPlus height={'24'} width={'24'} />
                                                            </ActionIcon>
                                                            </Group>
                                                        ),
                                                    },
                                                    { accessor: 'price', title:t('Price'), textAlign: 'center',
                                                        render : (data) =>(
                                                            <>
                                                            ${data.price}
                                                            </>
                                                        )
                                                    }, 
                                                    {
                                                        accessor: "action",
                                                        title: t(""),
                                                        textAlign: "right",
                                                        render: (data) => (
                                                            <Group justify="right" wrap="nowrap">
                                                                <ActionIcon size="sm" variant="white" color="#FF0000" aria-label="Settings" onClick={() => handleDelete(data.id)}>
                                                                            <IconTrash height={20} width={20} stroke={1.5} />
                                                                        </ActionIcon>
                                                            </Group>
                                                        ),
                                                        footer: (
                                                            <Group gap="0">
                                                              <Box mb={-4}>
                                                                <IconSum size="14" />
                                                              </Box>
                                                              <div>{subtotal}</div>
                                                            </Group>
                                                          ),
                                                    },
                                                ]
                                                }
                                                loaderSize="xs"
                                                loaderColor="grape"
                                                height={height - 356}
                                                scrollAreaProps={{ type: 'never' }}
                        /> 
                        </ScrollArea>

                    </ScrollArea>
                </Box>
            </Box>

        </>
    );
}

export default PosSales;