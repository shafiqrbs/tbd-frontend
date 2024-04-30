import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    rem,
    Text,
    Card,
    SimpleGrid,
    Container,
    useMantineTheme, List, ThemeIcon, Anchor, ScrollArea, Grid, NavLink
} from "@mantine/core";
import { IconGauge, IconUser,IconUsers,IconUsersGroup,IconBuildingStore,IconBasket,IconShoppingCartUp,IconShoppingBagSearch,IconCurrencyMonero,
    IconCookie,IconCircleDashed,IconHttpPost,IconShoppingBagPlus,IconCurrencyTaka,IconMoneybag,IconListDetails,IconCategory,IconCategory2
} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import classes from '../../../assets/css/FeaturesCards.module.css';

function MainDashboard(props) {
    const {t, i18n} = useTranslation();
    const iconStyle = {width: rem(12), height: rem(12)};
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [isFormSubmit, setFormSubmit] = useState(false);
    const [formSubmitData, setFormSubmitData] = useState([]);
    const height = props.height -105; //TabList height 104
    const navigate = useNavigate()
    const theme = useMantineTheme();
    return (
        <>
            <Container fluid mt={'xs'}>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xs" mb={'xs'}>
                    <Card  shadow="md" radius="md" className={classes.card} padding="lg">
                        <Grid gutter={{ base:2}}>
                            <Grid.Col span={2}>
                                <IconMoneybag style={{ width: rem(42), height: rem(42) }}  stroke={2} color={theme.colors.teal[6]}
                                /></Grid.Col>
                            <Grid.Col span={10}>
                                <Text fz="md" fw={500} className={classes.cardTitle} >{ t('Sales&PurchaseOverview') }</Text>
                            </Grid.Col>
                        </Grid>
                    </Card>
                    <Card  shadow="md" radius="md" className={classes.card} padding="lg">
                        <Grid gutter={{ base:2}}>
                            <Grid.Col span={2}>
                                <IconMoneybag style={{ width: rem(42), height: rem(42) }}  stroke={2} color={theme.colors.blue[6]}
                                /></Grid.Col>
                            <Grid.Col span={10}>
                                <Text fz="md" fw={500} className={classes.cardTitle} >{ t('AccountingOverview') }</Text>
                            </Grid.Col>
                        </Grid>
                    </Card>

                </SimpleGrid>
                <ScrollArea h={height} scrollbarSize={2} type="never">
                    <SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs">
                        <Card  shadow="md" radius="md" className={classes.card} padding="lg">
                        <Grid gutter={{ base:2}}>
                            <Grid.Col span={2}>
                                <IconBuildingStore style={{ width: rem(42), height: rem(42) }}  stroke={2} color={theme.colors.teal[6]}
                            /></Grid.Col>
                            <Grid.Col span={10}>
                                <Text fz="md" fw={500} className={classes.cardTitle} >{ t('SalesandPurchase') }</Text>
                            </Grid.Col>
                        </Grid>
                        <Text fz="sm" c="dimmed" mt="sm">
                            <List spacing="ms" size="sm" center>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline" ><IconBasket/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="/inventory/sales" label={t('ManageSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="/inventory/sales-invoice" label={t('NewSales')} component="button" onClick={(e)=>{navigate('inventory/sales-invoice')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="/inventory/purchase" label={t('ManagePurchase')} component="button" onClick={(e)=>{navigate('inventory/purchase')}}  />
                                </List.Item>
                                 <List.Item pl={'xs'} icon={<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline" ><IconShoppingCartUp/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="/inventory/purchase-invoice" label={t('NewPurchase')} component="button" onClick={(e)=>{navigate('inventory/purchase-invoice')}}  />
                                </List.Item>
                            </List>
                        </Text>
                    </Card>
                        <Card  shadow="md" radius="md" className={classes.card} padding="lg">
                        <Grid gutter={{ base:2}}>
                            <Grid.Col span={2}>
                                <IconMoneybag style={{ width: rem(42), height: rem(42) }}  stroke={2} color={theme.colors.blue[6]}
                                /></Grid.Col>
                            <Grid.Col span={10}>
                                <Text fz="md" fw={500} className={classes.cardTitle} >{ t('AccountingandFinancial') }</Text>
                            </Grid.Col>
                        </Grid>
                        <Text fz="sm" c="dimmed" mt="sm">
                            <List spacing="ms" size="sm" center>
                               <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconBasket/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/voucher-entry" label={t('VoucherEntry')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                {/*
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/sales-invoice" label={t('NewSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/purchase" label={t('ManagePurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>*/}
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconCurrencyMonero/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="/accounting/transaction-mode" label={t('TransactionMode')} component="button" onClick={(e)=>{navigate('accounting/transaction-mode')}}  />
                                </List.Item>
                            </List>
                        </Text>
                    </Card>
                        <Card  shadow="md" radius="md" className={classes.card} padding="lg">
                            <Grid gutter={{ base:2}}>
                                <Grid.Col span={2}>
                                    <IconMoneybag style={{ width: rem(42), height: rem(42) }}  stroke={2} color={theme.colors.orange[6]}
                                    /></Grid.Col>
                                <Grid.Col span={10}>
                                    <Text fz="md" fw={500} className={classes.cardTitle} >{ t('InventoryandProduct') }</Text>
                                </Grid.Col>
                            </Grid>
                            <Text fz="sm" c="dimmed" mt="sm">
                                <List spacing="ms" size="sm" center>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline" ><IconListDetails/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="/inventory/product" label={t('ManageProduct')} component="button" onClick={(e)=>{navigate('inventory/product')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline" ><IconCategory/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="/inventory/category" label={t('Category')} component="button" onClick={(e)=>{navigate('inventory/category')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline" ><IconCategory2/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="/inventory/category-group" label={t('CategoryGroup')} component="button" onClick={(e)=>{navigate('inventory/category-group')}}  />
                                    </List.Item>
                                </List>
                            </Text>
                        </Card>
                        <Card  shadow="md" radius="md" className={classes.card} padding="lg">
                            <Grid gutter={{ base:2}}>
                                <Grid.Col span={2}>
                                    <IconMoneybag style={{ width: rem(42), height: rem(42) }}  stroke={2} color={theme.colors.cyan[6]}
                                    /></Grid.Col>
                                <Grid.Col span={10}>
                                    <Text fz="md" fw={500} className={classes.cardTitle} >{ t('CustomerAndVendor') }</Text>
                                </Grid.Col>
                            </Grid>
                            <Text fz="sm" c="dimmed" mt="sm">
                                <List spacing="ms" size="sm" center>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline" ><IconUsersGroup/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/sales" label={t('ManageCustomers')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline" ><IconUsersGroup/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/sales-invoice" label={t('ManageVendors')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline" ><IconUsers/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/purchase" label={t('ManageUsers')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                </List>
                            </Text>
                        </Card>
                        <Card  shadow="md" radius="md" className={classes.card} padding="lg">
                            <Grid gutter={{ base:2}}>
                                <Grid.Col span={2}>
                                    <IconMoneybag style={{ width: rem(42), height: rem(42) }}  stroke={2} color={theme.colors.blue[6]}
                                    /></Grid.Col>
                                <Grid.Col span={10}>
                                    <Text fz="md" fw={500} className={classes.cardTitle} >{ t('AccountingandFinancial') }</Text>
                                </Grid.Col>
                            </Grid>
                            <Text fz="sm" c="dimmed" mt="sm">
                                <List spacing="ms" size="sm" center>
                                    {/*<List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconBasket/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/sales" label={t('ManageSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/sales-invoice" label={t('NewSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/purchase" label={t('ManagePurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>*/}
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconCurrencyMonero/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="/domain" label={t('ManageDomain')} component="button" onClick={(e)=>{navigate('domain')}}  />
                                    </List.Item>
                                </List>
                            </Text>
                        </Card>
                    </SimpleGrid>
                </ScrollArea>
            </Container>
        </>
    );
}

export default MainDashboard;
