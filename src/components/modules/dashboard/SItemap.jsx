import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    Tabs,
    rem,
    Text,
    Tooltip,
    Flex,
    LoadingOverlay,
    Badge,
    Title,
    Card,
    SimpleGrid,
    Container,
    useMantineTheme, ScrollArea, Grid, List, ThemeIcon, NavLink,
} from "@mantine/core";
import {
    IconGauge,
    IconUser,
    IconCookie,
    IconBuildingStore,
    IconBasket,
    IconShoppingBagSearch, IconShoppingBagPlus, IconShoppingCartUp, IconMoneybag, IconUsersGroup, IconUsers
} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck,
    IconColorFilter,
    IconList,
    IconX,
} from "@tabler/icons-react";
import {hasLength, isEmail, useForm} from "@mantine/form";
import {modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';
import classes from '../../../assets/css/FeaturesCards.module.css';

const mockdata = [
    {
        title: 'Extreme performance',
        description:
            'This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit',
        icon: IconGauge,
    },
    {
        title: 'Privacy focused',
        description:
            'People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma',
        icon: IconUser,
    },
    {
        title: 'No third parties',
        description:
            'They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves',
        icon: IconCookie,
    },
];

function Sitemap() {
    const {t, i18n} = useTranslation();
    const iconStyle = {width: rem(12), height: rem(12)};
    const [activeTab, setActiveTab] = useState("ThreeGrid");
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [isFormSubmit, setFormSubmit] = useState(false);
    const [formSubmitData, setFormSubmitData] = useState([]);
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 80; //TabList height 104
    const theme = useMantineTheme();
    const features = mockdata.map((feature) => (
        <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
            <feature.icon
                style={{ width: rem(50), height: rem(50) }}
                stroke={2}
                color={theme.colors.blue[6]}
            />
            <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
                {feature.title}
            </Text>
            <Text fz="sm" c="dimmed" mt="sm">
                {feature.description}
            </Text>
        </Card>
    ));

    const form = useForm({
        initialValues: {},
        validate: {
            name: hasLength({min: 2, max: 10}),
            email: isEmail(),

        },
    });
    return (
        <>
            <Container fluid pt="xs">
                <Group justify="center">
                    <Badge variant="filled" size="lg">
                        { t('Sitemap')}
                    </Badge>
                </Group>
                <Title order={2} className={classes.title} ta="center" mt="sm">
                    { t('SitemapContent')}
                </Title>
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
                                        <NavLink pl={'md'} href="inventory/sales" label={t('ManageSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="inventory/sales-invoice" label={t('NewSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="inventory/purchase" label={t('ManagePurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline" ><IconShoppingCartUp/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="inventory/purchase-invoice" label={t('NewPurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
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
                                        <NavLink pl={'md'} href="accounting/sales" label={t('ManageSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/sales-invoice" label={t('NewSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/purchase" label={t('ManagePurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingCartUp/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/purchase-invoice" label={t('NewPurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
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
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline" ><IconBasket/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/sales" label={t('ManageProduct')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/sales-invoice" label={t('Category')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                    </List.Item>
                                    <List.Item pl={'xs'} icon={<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/purchase" label={t('CategoryGroup')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
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
                    </SimpleGrid>
                </ScrollArea>
            </Container>
        </>
    );
}
export default Sitemap;
