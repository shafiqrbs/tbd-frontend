import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text, Menu, rem,
    TextInput,Tooltip,
    Button,Grid,Flex, ScrollArea,Card, Image
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconTrashX, IconDotsVertical, IconCheck, IconSearch,IconInfoCircle } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setDeleteMessage,
    setFetching, setFormLoading,
    setInsertType,
} from "../../../../store/core/crudSlice.js";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import classes from './PosTable.module.css'


function PosTable() {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 202; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const customerFilterData = useSelector((state) => state.crudSlice.customerFilterData)
    const [customerObject, setCustomerObject] = useState({});

    const [viewDrawer, setViewDrawer] = useState(false)
    const [provisionDrawer, setProvisionDrawer] = useState(false)

    const navigate = useNavigate();
    const entityDataDelete = useSelector((state) => state.crudSlice.entityDataDelete)

    useEffect(() => {
        dispatch(setDeleteMessage(''))
        if (entityDataDelete?.message === 'delete') {
            notifications.show({
                color: 'red',
                title: t('DeleteSuccessfully'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: 'lightgray' },
            });

            setTimeout(() => {
                dispatch(setFetching(true))
            }, 700)
        }
    }, [entityDataDelete]);

    const [tc, setTc] = useState('#333333')
    const [bg , setBg] = useState('#E6F5ED')
    const [selected, setSelected] = useState([]);

    const handleSelect = (productId) => {
        setSelected((prevSelected) =>
          prevSelected.includes(productId)
            ? prevSelected.filter((id) => id !== productId)
            : [...prevSelected, productId] 
        );
      };

    useEffect(() => {
        const value = {
            url: 'core/customer',
            param: {
                term: searchKeyword,
                name: customerFilterData.name,
                mobile: customerFilterData.mobile,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    const data = [
        {id : 1, itemName : 'All'},
        {id : 2, itemName : 'Pizza'},
        {id : 3, itemName : 'Burger'},
        {id : 4, itemName : 'Set Menu'},
        {id : 5, itemName : 'Fries'},
        {id : 6, itemName : 'Soup'},
        {id : 7, itemName : 'Subway'},
        {id : 8, itemName : 'Sandwich'},
        {id : 9, itemName : 'Chicken'},
        {id : 10, itemName : 'Drinks'},
        {id : 11, itemName : 'Pasta'},
        {id : 12, itemName : 'Lemonade'},
        {id : 13, itemName : 'Juice'},
        {id : 14, itemName : 'Summer Special'},
    ]

    const products = [
        {id : 1, name : 'Margarita Pizza',price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 2, name : 'Lemonade Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 3, name : 'Barrista Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 4, name : 'Jhankar Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 5, name : 'Uttara Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 6, name : 'Chikni Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 7, name : 'Dambu Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 8, name : 'Gambu Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 9, name : 'Chontu Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 10, name : 'Pontu Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 11, name : 'Chintu Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 12, name : 'Kintu Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 13, name : 'Asta Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 14, name : 'Beef Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 15, name : 'Chicken Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 16, name : 'Mango Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 17, name : 'Django Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 18, name : 'Vue Pizza', price : 1000, img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
    ]

    const [id, setId] = useState(null)
    const clicked = (id) => {
        setId(id);
    }

    return (
        <>

            <Box p={0} m={0}>
            <Group preventGrowOverflow={false} grow align="flex-start" wrap="nowrap" gap={4}>
            <TextInput
                radius="md"
                leftSection={<IconSearch size={16} opacity={0.5} />}
                size="md"
                placeholder="Enter search keyword"
                rightSection={
                searchKeyword ? (
                    <Tooltip label="Clear" withArrow position="top">
                    <IconX
                        color="red"
                        size={16}
                        opacity={0.5}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSearchKeyword('')}
                    />
                    </Tooltip>
                ) : (
                    <Tooltip label="Field is required" withArrow position="top" color="red">
                    <IconInfoCircle size={16} opacity={0.5} />
                    </Tooltip>
                )
                }
            />
            <Button 
                radius="md" 
                size="sm" 
                color="green" 
                mt={2}
                miw={110}
                maw={110}
            >
                <Text fw={600} size="sm">
                Search
                </Text>
            </Button>
            </Group>
            </Box>
            <Grid columns={12} gutter={{base : 12}}>
                <Grid.Col span={3}>
                    <Box bg="white" w={'100%'}  mt={8} style={{ borderRadius: 8 }}>
                    <ScrollArea h={height - 40} type="never" scrollbars="y">
                        <Box p={'xs'}>
                            {
                            data.map((data) => (
                                <Box
                                    style={{
                                        borderRadius: 4
                                    }}
                                    className={classes['pressable-card']}
                                    mih={40}
                                    mt={'xs'}
                                    variant='default'
                                    key={data.id}
                                    onClick={() => {
                                        console.log("Clicked on Table -", data.id)
                                        clicked(data.id)
                                    }
                                    }
                                    bg={data.id === id ? 'green.8' : '#EAECED'}
                                    >
                                       <Text size={'md'} pl={14} pt={8} fw={500} c={data.id === id ? 'white' : '#333333'}>
                                            {data.itemName}
                                        </Text>
                                </Box>
                            ))
                            }
                        </Box>
                    </ScrollArea>
                    </Box>
                </Grid.Col>
                <Grid.Col span={9}>
                    <Box bg="white" w={'100%'} h={height - 40} mt={8} style={{ borderRadius: 8 }}>
                    <ScrollArea h={height - 40} type="never" pt={'18'} pl={'xs'} pr={'xs'} pb={'18'} scrollbars="y">
                    <Grid columns={12} gutter={{base : 8}}>
                        {products.map((product) => (
                            <Grid.Col span={4} key={product.id}>
                            <Card  radius="md" onClick={() =>{
                                handleSelect(product.id)
                            }} 
                            className={`${classes['pressable-card']} ${selected.includes(product.id) ? classes['border'] : classes['border-not']}`}
                            >
                                <Card.Section>
                                <Image
                                    p={'xs'}
                                    src={product.img}
                                    height={140}
                                    alt={product.name}
                                    fit="cover"
                                    radius="lg"
                                />
                                </Card.Section>

                                <Text fw={700} size="sm" mt="4" c={'#333333'}>
                                {product.name}
                                </Text>

                                <Text mt="4" fw={800} size="md" c={'#333333'}>
                                ${product.price}
                                </Text>
                            </Card>
                            </Grid.Col>
                        ))}
                    </Grid>

                    </ScrollArea>
                    </Box>
                </Grid.Col>
            </Grid>
            <Box bg="white" w={'100%'}  mt={8} style={{ borderRadius: 8 }} >
                <Group grow gap={4} h={54} justify="center" align="center" pl={8} pr={8}>
                    <Button bg={bg} onClick={()=>{
                        bg === '#E6F5ED' ? setBg('green.8') : setBg('#E6F5ED'),
                        tc === '#333333' ? setTc('white') : setTc('#333333')
                    }}>
                        <Text c={tc} size="sm" fw={600}
                        > 
                        Order
                        </Text>
                    </Button> 
                    <Button bg={'#E6F5ED'}>
                        <Text c={'#333333'} size="sm" fw={600}
                        > 
                        Kitchen
                        </Text>
                    </Button> 
                    <Button bg={'#E6F5ED'}>
                    <Text c={'#333333'} size="sm" fw={600}
                        > 
                        Hold
                        </Text>
                    </Button> 
                    <Button bg={'#E6F5ED'}>
                    <Text c={'#333333'} size="sm" fw={600}
                        > 
                        Reserved
                        </Text>
                    </Button> 
                    <Button bg={'#E6F5ED'}>
                    <Text c={'#333333'} size="sm" fw={600}
                        > 
                        Free
                        </Text>
                    </Button>
                </Group>
            </Box>
        </>
    );
}

export default PosTable;