import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text, Menu, rem,
    TextInput, Center,
    Button, Grid, Flex, ScrollArea, Divider, Image, Select, SimpleGrid,Badge,
    Checkbox, Paper, Switch,
    Stack
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconChevronRight, IconChevronLeft, IconCheck, IconSearch, IconChevronDown, IconX, IconPlus, IconMinus, IconTrash, IconSum, IconUserFilled, IconPrinter, IconDeviceFloppy } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import tableCss from './Table.module.css';
import classes from './PosSales.module.css';
import { IconChefHat } from "@tabler/icons-react";


function PosSales() {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 190; //TabList height 104 
    const heightHalf = height /2;

    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const handleScroll = () =>{
        if(scrollRef.current){
            const { scrollLeft, scrollWidth, clientWidth} = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    }
    useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    })

    const scroll = (direction) => {
        if(scrollRef.current){
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior : 'smooth'
            })
        }
    }

    const [profitShow, setProfitShow] = useState(false);

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

    const [id, setId] = useState(null)
    const clicked = (id) => {
        setId(id);
    }

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

    // Demo
    const price = 1000;

    const paymentPartners = [
        {id : 1, name : 'Bkash', img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 2, name : 'Nogod',  img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 3, name : 'MTB',  img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 4, name : 'Google Pay',  img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 5, name : 'Wise',  img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 6, name : 'SCB',  img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 7, name : 'Brac Bank',  img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 8, name : 'Trust Bank',  img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
        {id : 9, name : 'Sonali bank',  img : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'},
    ];

    return (
        <>
        <Box w={'100%'} h={height + 72} className={classes['box-white']}>
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
                        leftSection={<IconChefHat height={18} width={18} stroke={2} /> }
                    >
                        <Text fw={600} size="sm">
                            {t('Kitchen')}
                        </Text>
                    </Button>
                </Group>
                <Box>

                    <ScrollArea h={heightHalf - 48} type="never" scrollbars="y">
                        <Paper p="8" radius="md" style={{ backgroundColor: checked ? '#4CAF50' : '#E8F5E9' }}>
                            <Grid align="center">
                                <Grid.Col span={11}>
                                    <Text weight={500} c={checked ? 'white' : 'black'}>Select additional table</Text>
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
                        <Box >
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
                                                            size={'sm'}
                                                                bg={'#596972'}
                                                                onClick={() => handleDecrement(data.id)}
                                                            >
                                                                <IconMinus height={'12'} width={'12'} />
                                                            </ActionIcon>
                                                            <Text size="sm" ta={'center'} fw={600} maw={30} miw={30}>
                                                                {data.qty}
                                                            </Text>
                                                            <ActionIcon
                                                            size={'sm'}
                                                                bg={'#596972'}
                                                                onClick={() => handleIncrement(data.id)}
                                                            >
                                                                <IconPlus height={'12'} width={'12'} />
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
                                                height={220}
                                                scrollAreaProps={{ type: 'never' }}
                        /> 
                        </Box>
                    </ScrollArea>
                </Box>
                <Box className={classes['box-border']} h={heightHalf + 52 } pl={4} pr={4} pb={4} pt={2} mt={6}>
                    <Box>
                        <Flex h={heightHalf - 142} direction={'column'} w={'100%'}  justify={'center'} gap={0} pl={4} pr={4} mb={8}>
                            <TextInput
                                pb={4}
                                size={'sm'}
                                w={'100%'}
                                pt={'xs'}
                                placeholder={t('CustomerMobileNumber')}
                                leftSection={<IconSearch height={18} width={18} stroke={2} />}
                                rightSection={<IconUserFilled height={18} width={18} stroke={2} />}
                            ></TextInput>
                            <Box className={classes['box-white']} p={'4'} 
                                w={'100%'}>
                                <Grid columns={12} gutter={0} pt={4} pl={12} pr={12}>
                                    <Grid.Col span={6} >
                                        <Grid columns={12} gutter={0} >
                                            <Grid.Col span={2} >
                                                <Text fw={500} c={'#333333'}>
                                                {t('VAT')}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={'auto'} >
                                                <Text  fw={800} c={'#333333'}>
                                                {t('$')} {price}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                        <Grid columns={12} gutter={0} pt={0}>
                                            <Grid.Col span={2} >
                                                <Text fw={500} c={'#333333'}>
                                                {t('SD')}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={'auto'} >
                                                <Text  fw={800} c={'#333333'}>
                                                {t('$')} {price}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                        <Grid columns={12} gutter={0} pt={0}>
                                            <Grid.Col span={2} >
                                                <Text fw={500} c={'#333333'}>
                                                {t('DIS.')}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={'auto'} >
                                                <Text  fw={800} c={'#333333'}>
                                                {t('$')} {price}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Box className={classes['box-border']} p={6}>
                                            <Flex direction={'column'} justify={'center'} align={'center'} h={"100%"} p={2}>
                                                <Text fw={500} c={'#333333'} size={'md'}>
                                                    {t('Total')}
                                                </Text>
                                                <Text fw={800} c={'#00542B'} size={'lg'}>
                                                    $ {price}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </Flex>
                    </Box>
                    <Box className={classes['box-white']} ml={4} mr={4}>
                                <Box style={{position : 'relative'}}>
                                    <ScrollArea
                                            type="never"
                                            pl={'sm'}
                                            pr={'sm'}
                                            viewportRef={scrollRef}
                                            onScrollPositionChange={handleScroll}
                                            >
                                                <Group m={0} p={0} justify="flex-start" align="flex-start" gap="0" wrap="nowrap">
                                                {paymentPartners.map((partners) => (
                                                    <Box
                                                        onClick={() => {
                                                            console.log("Clicked on Table -", partners.id),
                                                            clicked(partners.id)
                                                        }
                                                    }
                                                    key={partners.id}
                                                    p={4}
                                                    style={{
                                                        position: 'relative',
                                                        cursor: 'pointer'
                                                    }}
                                                    >
                                                    <Flex
                                                        bg={partners.id === id ? '#E6F5ED' : 'white'}
                                                        direction="column"
                                                        align="center"
                                                        justify="center"
                                                        p={4}
                                                        style={{
                                                        width: '100px',
                                                        borderRadius: '8px',
                                                        }}
                                                    >
                                                        <Image h={'60%'} w={'60%'} fit="contain" src={partners.img} ></Image>
                                                        <Text pt={'4'} c={'#333333'} fw={500}>{partners.name}</Text>
                                                    </Flex>
                                                    </Box>
                                                ))}
                                                </Group>
                                        </ScrollArea>
                                {showLeftArrow && (
                                        <ActionIcon
                                        variant="filled"
                                        color="#EAECED"
                                        radius="xl"
                                        size="lg"
                                        h={24}
                                        w={24}
                                        style={{
                                            position: 'absolute',
                                            left: 5,
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                        onClick={() => scroll('left')}
                                        >
                                        <IconChevronLeft height={18} width={18} stroke={2} color="#30444F"/>
                                        </ActionIcon>
                                )}
                                {showRightArrow && (
                                        <ActionIcon
                                        variant="filled"
                                        color="#EAECED"
                                        radius="xl"
                                        size="lg"
                                        h={24}
                                        w={24}
                                        style={{
                                            position: 'absolute',
                                            right: 5,
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                        onClick={() => scroll('right')}
                                        >
                                        <IconChevronRight height={18} width={18} stroke={2} color="#30444F"/>
                                        </ActionIcon>
                                )}
                                </Box>
                            </Box>
                    <Box m={8}>
                                <Group  justify="center" grow gap={'xs'} preventGrowOverflow={true}>
                                    <Box className={classes['box-green']}>
                                        <Grid columns={12} gutter={0}>
                                            <Grid.Col span={4}>
                                                <Flex h={40} justify={'center'} align={'center'}   >
                                                    <Checkbox color="lime" size="lg" onClick={''}/>
                                                </Flex>
                                            </Grid.Col>
                                            <Grid.Col span={8}>
                                                <Flex h={40} justify={'center'} align={'center'} >
                                                    <Text>
                                                        {t('Flat')}
                                                    </Text>
                                                </Flex>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <TextInput
                                        type="number"
                                        placeholder="0"
                                        size={rem(40)} 
                                        classNames={{input : classes.input}} 
                                    />
                                    <TextInput 
                                        type="number"
                                        placeholder="0" size={rem(40)} classNames={{input : classes.input}}
                                    />
                                </Group>
                            </Box>
                    <Group grow gap={'xs'} p={8} mb={'0'} pt={6} style={{ borderTop: '#c0c0c0 solid 2px' }} className="divider" >
                                <Button bg={'#30444F'} size={'sm'} fullWidth={true} leftSection={<IconPrinter />}>
                                    {t('POS Print')}
                                </Button>
                                <Button size={'sm'} bg={'#00994f'} fullWidth={true} leftSection={<IconDeviceFloppy />}>
                                    {t('Save')}
                                </Button>
                    </Group>
                </Box>
                
            </Box>
        </Box>

            

        </>
    );
}

export default PosSales;