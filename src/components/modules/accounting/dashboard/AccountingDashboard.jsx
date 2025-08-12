import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Progress,
    Title,
    rem,
    Card,
    Text,
    List,
    ThemeIcon,
    NavLink,
    SimpleGrid,
    useMantineTheme, Tooltip, Image, Divider, Table, ScrollArea
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import classesScroll from "../../../../assets/css/Scrollbar.module.css";
import {
    IconArrowRight,
    IconBasket,
    IconCurrencyMonero,
    IconMoneybag, IconShoppingBagPlus,
    IconShoppingBagSearch
} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import {getIndexEntityData} from "../../../../store/accounting/crudSlice";
import {notifications} from "@mantine/notifications";
import pos from "../../../../assets/images/pos/pos.png";
import invoice from "../../../../assets/images/pos/invoice.png";
import voucher from "../../../../assets/images/pos/voucher.png";
import requisition from "../../../../assets/images/pos/requisition.png";
import production from "../../../../assets/images/pos/production.png";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig";
import {useNavigate, useOutletContext} from "react-router-dom";
import getAccessControl from "../../../global-hook/access_control/getAccessControl";
import LedgerDetailsModel from "../ledger/LedgerDetailsModel";

function AccountingDashboard(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const progress = getLoadingProgress()
    const theme = useMantineTheme();
    const { domainConfig, fetchDomainConfig } = getDomainConfig();
    let configData = domainConfig?.inventory_config;
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 98;
    const userRole = getAccessControl();
    const navigate = useNavigate();
    const [ledgerDetails,setLedgerDetails] = useState(null)

    // const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const [indexData,setIndexData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'accounting/report/dashboard',
                param: {},
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                }
            } catch (error) {
                console.error("Unexpected error in fetchData:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {progress !== 100 &&
                <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
            <Box>
                <AccountingHeaderNavbar
                    pageTitle={t('ManageCongifuration')}
                    roles={t('Roles')}
                    allowZeroPercentage=''
                    currencySymbol=''
                />
                <Box p={'8'}>
                    <Box>
                        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs" mb={"xs"}>
                            <Card shadow="md" radius="md" className={classes.card} padding="lg">
                                <Grid gutter={{ base: 2 }}>
                                    <Grid.Col span={6}>
                                        <Tooltip
                                            label={t("CustomerVoucher")}
                                            withArrow
                                            position="top-center"
                                            bg="var(--theme-primary-color-4)"
                                            px={16}
                                            py={2}
                                            c={"white"}
                                            offset={2}
                                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                        >
                                            <Image
                                                bg="var(--theme-primary-color-4)"
                                                h={60}
                                                radius="sm"
                                                src={domainConfig?.inventory_config?.is_pos === 1 ? pos : invoice}
                                                fit="cover"
                                                w="100%"
                                                onClick={() => {
                                                    navigate("/accounting/voucher-entry");
                                                }}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </Tooltip>
                                    </Grid.Col>
                                    <Grid.Col span={"6"}>
                                        <Title order={4} align="center" mt={0} mb={0} onClick={() => {
                                            navigate("/accounting/voucher-entry");
                                        }}>
                                            {t("CustomerVoucher")}
                                        </Title>
                                        <Divider my={5} />
                                        <Grid columns={18}>
                                            <Grid.Col span={8}>
                                                <Title order={5} align="right" mt={0} mb={0}>
                                                    {configData?.currency?.symbol} 0.00
                                                </Title>
                                            </Grid.Col>
                                            <Grid.Col span={2}>
                                                <Box
                                                    style={{ border: "1px solid #e0e0e0", height: "100%", width: "2px" }}
                                                ></Box>
                                            </Grid.Col>
                                            <Grid.Col span={8}>
                                                <Title order={5} align="left" mt={0} mb={0}>
                                                    0
                                                </Title>
                                            </Grid.Col>
                                        </Grid>
                                    </Grid.Col>
                                </Grid>
                            </Card>
                            {userRole &&
                            userRole.length > 0 &&
                            (userRole.includes("role_accounting") || userRole.includes("role_domain")) && (
                                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                                    <Grid gutter={{ base: 2 }}>
                                        <Grid.Col span={6}>
                                            <Tooltip
                                                label={t("VendorVoucher")}
                                                withArrow
                                                position="top-center"
                                                bg={"#3d83d8"}
                                                px={16}
                                                py={2}
                                                c={"white"}
                                                offset={2}
                                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                            >
                                                <Image
                                                    bg={"#3d83d8"}
                                                    h={60}
                                                    radius="sm"
                                                    src={voucher}
                                                    fit="cover"
                                                    w="100%"
                                                    onClick={() => {
                                                        navigate("/accounting/voucher-entry");
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </Tooltip>
                                        </Grid.Col>
                                        <Grid.Col span={"6"}>
                                            <Title order={4} align="center" mt={0} mb={0} onClick={() => {
                                                navigate("/accounting/voucher-entry");
                                            }}>
                                                {t("VendorVoucher")}
                                            </Title>
                                            <Divider my={5} />
                                            <Grid columns={18}>
                                                <Grid.Col span={8}>
                                                    <Title order={5} align="right" mt={0} mb={0}>
                                                        {configData?.currency?.symbol} 0.00
                                                    </Title>
                                                </Grid.Col>
                                                <Grid.Col span={2}>
                                                    <Box
                                                        style={{
                                                            border: "1px solid #e0e0e0",
                                                            height: "100%",
                                                            width: "2px",
                                                        }}
                                                    ></Box>
                                                </Grid.Col>
                                                <Grid.Col span={8}>
                                                    <Title order={5} align="left" mt={0} mb={0}>
                                                        0
                                                    </Title>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                    </Grid>
                                </Card>
                            )}
                            {}
                            {["role_procurement", "role_domain"].some((value) => userRole.includes(value)) && (
                                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                                    <Grid gutter={{ base: 2 }}>
                                        <Grid.Col span={6}>
                                            <Tooltip
                                                label={t("ExpenseVoucher")}
                                                withArrow
                                                position="top-center"
                                                bg={"#8251dd"}
                                                px={16}
                                                py={2}
                                                c={"white"}
                                                offset={2}
                                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                            >
                                                <Image
                                                    bg={"#8251dd"}
                                                    h={60}
                                                    radius="sm"
                                                    src={requisition}
                                                    fit="cover"
                                                    w="100%"
                                                    onClick={() => {
                                                        navigate("/accounting/voucher-entry");
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </Tooltip>
                                        </Grid.Col>
                                        <Grid.Col span={"6"}>
                                            <Title order={4} align="center" mt={0} mb={0} onClick={() => {
                                                navigate("/accounting/voucher-entry");
                                            }}>
                                                {t("ExpenseVoucher")}
                                            </Title>
                                            <Divider my={5} />
                                            <Grid columns={18}>
                                                <Grid.Col span={8}>
                                                    <Title order={5} align="right" mt={0} mb={0}>
                                                        {configData?.currency?.symbol} 0.00
                                                    </Title>
                                                </Grid.Col>
                                                <Grid.Col span={2}>
                                                    <Box
                                                        style={{
                                                            border: "1px solid #e0e0e0",
                                                            height: "100%",
                                                            width: "2px",
                                                        }}
                                                    ></Box>
                                                </Grid.Col>
                                                <Grid.Col span={8}>
                                                    <Title order={5} align="left" mt={0} mb={0}>
                                                        0
                                                    </Title>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                    </Grid>
                                </Card>
                            )}
                            {["role_inventory", "role_domain"].some((value) => userRole.includes(value)) && (
                                <Card shadow="md" radius="md" className={classes.card} padding="lg">
                                    <Grid gutter={{ base: 2 }}>
                                        <Grid.Col span={6}>
                                            <Tooltip
                                                label={t("ContraVoucher")}
                                                withArrow
                                                position="top-center"
                                                bg={"#75a54d"}
                                                px={16}
                                                py={2}
                                                c={"white"}
                                                offset={2}
                                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                            >
                                                <Image
                                                    bg={"#75a54d"}
                                                    h={60}
                                                    radius="sm"
                                                    src={production}
                                                    fit="cover"
                                                    w="100%"
                                                    onClick={() => {
                                                        navigate("/accounting/voucher-entry");
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </Tooltip>
                                        </Grid.Col>
                                        <Grid.Col span={"6"}>
                                            <Title order={4} align="center" mt={0} mb={0}
                                                   onClick={() => { navigate("/accounting/voucher-entry")} }>
                                                {t("ContraVoucher")}
                                            </Title>
                                            <Divider my={5} />
                                            <Grid columns={18}>
                                                <Grid.Col span={8}>
                                                    <Title order={5} align="right" mt={0} mb={0}>
                                                        {configData?.currency?.symbol} 0.00
                                                    </Title>
                                                </Grid.Col>
                                                <Grid.Col span={2}>
                                                    <Box
                                                        style={{
                                                            border: "1px solid #e0e0e0",
                                                            height: "100%",
                                                            width: "2px",
                                                        }}
                                                    >
                                                        &nbsp;
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={8}>
                                                    <Title order={5} align="left" mt={0} mb={0}>
                                                        0
                                                    </Title>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                    </Grid>
                                </Card>
                            )}
                        </SimpleGrid>
                    </Box>
                    <Box>
                        <ScrollArea h={height-48} type="never" scrollbars="y" scrollAreaProps={{ type: 'never' }}>
                            <Grid columns={24} gutter={{ base: 8 }}>
                                <Grid.Col span={9} >
                                    <Card shadow="md" mb={'xs'} radius="md" className={classes.card} padding="md">
                                        <Grid gutter={{ base: 2 }}>
                                            <Grid.Col span={10}>
                                                <Text fz="md" fw={500} className={classes.cardSubTitle}>
                                                    {t("ListOfCustomerLedger")}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                        <Box fz="sm" c="dimmed" mt="sm">
                                            <Table variant="vertical" layout="fixed" withTableBorder>
                                                <Table.Tbody>
                                                    <Table.Tr>
                                                        <Table.Th w={160}>Account Name</Table.Th>
                                                        <Table.Td>Details</Table.Td>
                                                        <Table.Td align="right">Amount</Table.Td>
                                                    </Table.Tr>
                                                    {indexData.data?.bankAccounts?.map((item) => (
                                                        <>
                                                            <Table.Tr>
                                                                <Table.Th>{item?.name}</Table.Th>
                                                                <Table.Td>{item?.name}</Table.Td>
                                                                <Table.Td align="right">{item?.amount}</Table.Td>
                                                                <Table.Td align="right">
                                                                    <Button
                                                                        variant="light"
                                                                        rightSection={<IconArrowRight size={14} />}
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            setLedgerDetails(item)
                                                                        }}
                                                                    >
                                                                        Details
                                                                    </Button>
                                                                </Table.Td>
                                                            </Table.Tr>
                                                        </>
                                                    ))}
                                                </Table.Tbody>
                                            </Table>
                                        </Box>
                                    </Card>
                                    <Card shadow="md" radius="md"  className={classes.card} padding="md">
                                        <Grid gutter={{ base: 2 }}>
                                            <Grid.Col span={10}>
                                                <Text fz="md" fw={500} className={classes.cardSubTitle}>
                                                    {t("ListOfCustomerLedger")}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                        <Box fz="sm" c="dimmed" mt="sm">
                                            <Table.ScrollContainer overscrollBehavior="contain" scrollbarSize={2} classNames={classesScroll} h={250}>
                                                <Table
                                                    variant="vertical"
                                                    layout="fixed"
                                                    withTableBorder// Optional offset for sticky position
                                                >
                                                    <Table.Thead>
                                                        <Table.Tr>
                                                            <Table.Th w={160}>Account Name</Table.Th>
                                                            <Table.Td>Details</Table.Td>
                                                            <Table.Td align="right">Amount</Table.Td>
                                                        </Table.Tr>
                                                    </Table.Thead>
                                                    <Table.Tbody>
                                                        {indexData.data?.customerAccounts?.map((item) => (
                                                            <>
                                                                <Table.Tr>
                                                                    <Table.Th>{item?.name}</Table.Th>
                                                                    <Table.Td>{item?.name}</Table.Td>
                                                                    <Table.Td align="right">{item?.amount}</Table.Td>
                                                                    <Table.Td align="right">
                                                                        <Button
                                                                            onClick={(e) => {
                                                                                e.preventDefault()
                                                                                setLedgerDetails(item)
                                                                            }}
                                                                            variant="light"
                                                                            rightSection={<IconArrowRight size={14} />}
                                                                        >
                                                                            Details
                                                                        </Button>

                                                                    </Table.Td>
                                                                </Table.Tr>
                                                            </>
                                                        ))}

                                                    </Table.Tbody>
                                                </Table>
                                            </Table.ScrollContainer>
                                        </Box>
                                    </Card>
                                </Grid.Col>
                                <Grid.Col span={9} >
                                    <Card shadow="md" radius="md" mb={'xs'}  className={classes.card} padding="lg">
                                        <Grid gutter={{ base: 2 }}>
                                            <Grid.Col span={10}>
                                                <Text fz="md" fw={500} className={classes.cardSubTitle}>
                                                    {t("ListOfCashLedger")}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                        <Box fz="sm" c="dimmed" mt="sm">
                                            <Table variant="vertical" layout="fixed" withTableBorder>
                                                <Table.Tbody>
                                                    <Table.Tr>
                                                        <Table.Th w={160}>Account Name</Table.Th>
                                                        <Table.Td>7.x migration</Table.Td>
                                                    </Table.Tr>
                                                    {indexData.data?.cashAccounts?.map((item) => (
                                                        <>
                                                            <Table.Tr>
                                                                <Table.Th>{item?.name}</Table.Th>
                                                                <Table.Td>{item?.name}</Table.Td>
                                                                <Table.Td align="right">{item?.amount}</Table.Td>
                                                                <Table.Td align="right">
                                                                    <Button
                                                                        variant="light"
                                                                        rightSection={<IconArrowRight size={14} />}
                                                                    >
                                                                        Details
                                                                    </Button>
                                                                </Table.Td>
                                                            </Table.Tr>
                                                        </>
                                                    ))}

                                                </Table.Tbody>
                                            </Table>
                                        </Box>
                                    </Card>
                                    <Card shadow="md" radius="md" mb={'xs'}  className={classes.card} padding="lg">
                                        <Grid gutter={{ base: 2 }}>
                                            <Grid.Col span={10}>
                                                <Text fz="md" fw={500} className={classes.cardSubTitle}>
                                                    {t("ListOfMobileLedger")}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                        <Box fz="sm" c="dimmed" mt="sm">
                                            <Table variant="vertical" layout="fixed" withTableBorder>
                                                <Table.Tbody>
                                                    <Table.Tr>
                                                        <Table.Th w={160}>Account Name</Table.Th>
                                                    </Table.Tr>
                                                    {indexData.data?.mobileAccounts?.map((item) => (
                                                        <>
                                                            <Table.Tr>
                                                                <Table.Th>{item?.name}</Table.Th>
                                                                <Table.Td>{item?.name}</Table.Td>
                                                                <Table.Td align="right">{item?.amount}</Table.Td>
                                                                <Table.Td align="right">
                                                                    <Button
                                                                        variant="light"
                                                                        rightSection={<IconArrowRight size={14} />}

                                                                    >
                                                                        Details
                                                                    </Button>
                                                                </Table.Td>
                                                            </Table.Tr>
                                                        </>
                                                    ))}
                                                </Table.Tbody>
                                            </Table>
                                        </Box>
                                    </Card>
                                    <Card shadow="md" radius="md" className={classes.card} padding="lg">
                                        <Grid gutter={{ base: 2 }}>
                                            <Grid.Col span={10}>
                                                <Text fz="md" fw={500} className={classes.cardSubTitle}>
                                                    {t("ListOfVendorLedger")}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                        <Box fz="sm" c="dimmed" mt="sm">
                                            <Table variant="vertical" layout="fixed" withTableBorder>
                                                <Table.Tbody>
                                                    <Table.Tr>
                                                        <Table.Th w={160}>Account Name</Table.Th>
                                                        <Table.Td>Details</Table.Td>
                                                        <Table.Td align="right">Amount</Table.Td>
                                                    </Table.Tr>
                                                    {indexData.data?.vendorAccounts?.map((item) => (
                                                        <>
                                                            <Table.Tr>
                                                                <Table.Th>{item?.name}</Table.Th>
                                                                <Table.Td></Table.Td>
                                                                <Table.Td align="right">{item?.amount}</Table.Td>
                                                                <Table.Td align="right">
                                                                    <Button
                                                                        variant="light"
                                                                        rightSection={<IconArrowRight size={14} />}
                                                                    >
                                                                        Details
                                                                    </Button>
                                                                </Table.Td>
                                                            </Table.Tr>
                                                        </>
                                                    ))}

                                                </Table.Tbody>
                                            </Table>
                                        </Box>
                                    </Card>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    {domainConfig?.modules?.includes("accounting") &&
                                    ["role_accounting", "role_domain"].some((value) => userRole.includes(value)) && (
                                        <Card shadow="md" radiu  s="md" mb={'xs'} className={classes.card} padding="lg">
                                            <Grid gutter={{ base: 2 }}>
                                                <Grid.Col span={2}>
                                                    <IconMoneybag
                                                        style={{ width: rem(42), height: rem(42) }}
                                                        stroke={2}
                                                        color={theme.colors.blue[6]}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={10}>
                                                    <Text fz="md" fw={500} className={classes.cardTitle}>
                                                        {t("ListOfVendorLedger")}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Box fz="sm" c="dimmed" mt="sm">
                                                <List spacing="ms" size="sm" center>
                                                    {["role_accounting"].some((value) => userRole.includes(value)) && (
                                                        <List.Item
                                                            pl={"xs"}
                                                            icon={
                                                                <ThemeIcon
                                                                    color="blue.6"
                                                                    size={20}
                                                                    radius="xl"
                                                                    variant="outline"
                                                                >
                                                                    <IconBasket />
                                                                </ThemeIcon>
                                                            }
                                                        >
                                                            <NavLink
                                                                pl={"md"}
                                                                href="accounting/voucher-entry"
                                                                label={t("VoucherEntry")}
                                                                component="button"
                                                                onClick={(e) => {
                                                                    navigate("/accounting/voucher-entry");
                                                                }}
                                                                onAuxClick={(e) => {
                                                                    // Handle middle mouse button click for browsers that support it
                                                                    if (e.button === 1) {
                                                                        window.open("/accounting/voucher-entry", "_blank");
                                                                    }
                                                                }}
                                                            />
                                                        </List.Item>
                                                    )}


                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/sales-invoice" label={t('NewSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/purchase" label={t('ManagePurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconCurrencyMonero />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="/accounting/transaction-mode"
                                                            label={t("TransactionMode")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("accounting/transaction-mode");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                // Handle middle mouse button click for browsers that support it
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/transaction-mode", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/ledger"
                                                            label={t("Ledger")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/ledger");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                // Handle middle mouse button click for browsers that support it
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/ledger", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/head-group"
                                                            label={t("HeadGroup")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/head-group");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                // Handle middle mouse button click for browsers that support it
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/head-group", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/head-subgroup"
                                                            label={t("HeadSubGroup")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/head-subgroup");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                // Handle middle mouse button click for browsers that support it
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/head-subgroup", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                     <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconBasket /></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/voucher-entry" label={t('SampleModal')} component="button" onClick={(e) => { navigate('/accounting/modalIndex') }} onAuxClick={(e) => {
                                            // Handle middle mouse button click for browsers that support it
                                            if (e.button === 1) {
                                                window.open('/accounting/voucher-entry', '_blank');
                                            }
                                        }} />
                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/balance-sheet"
                                                            label={t("BalanceSheet")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/balance-sheet");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/balance-sheet", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/balance-entry"
                                                            label={t("BalanceEntry")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/balance-entry");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/balance-entry", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                </List>
                                            </Box>
                                        </Card>
                                    )}
                                    {domainConfig?.modules?.includes("accounting") &&
                                    ["role_accounting", "role_domain"].some((value) => userRole.includes(value)) && (
                                        <Card shadow="md" radius="md" className={classes.card} padding="lg">
                                            <Grid gutter={{ base: 2 }}>
                                                <Grid.Col span={2}>
                                                    <IconMoneybag
                                                        style={{ width: rem(42), height: rem(42) }}
                                                        stroke={2}
                                                        color={theme.colors.blue[6]}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={10}>
                                                    <Text fz="md" fw={500} className={classes.cardTitle}>
                                                        {t("Financial Reports")}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Box fz="sm" c="dimmed" mt="sm">
                                                <List spacing="ms" size="sm" center>
                                                    {["role_accounting"].some((value) => userRole.includes(value)) && (
                                                        <List.Item
                                                            pl={"xs"}
                                                            icon={
                                                                <ThemeIcon
                                                                    color="blue.6"
                                                                    size={20}
                                                                    radius="xl"
                                                                    variant="outline"
                                                                >
                                                                    <IconBasket />
                                                                </ThemeIcon>
                                                            }
                                                        >
                                                            <NavLink
                                                                pl={"md"}
                                                                href="accounting/voucher-entry"
                                                                label={t("VoucherEntry")}
                                                                component="button"
                                                                onClick={(e) => {
                                                                    navigate("/accounting/voucher-entry");
                                                                }}
                                                                onAuxClick={(e) => {
                                                                    // Handle middle mouse button click for browsers that support it
                                                                    if (e.button === 1) {
                                                                        window.open("/accounting/voucher-entry", "_blank");
                                                                    }
                                                                }}
                                                            />
                                                        </List.Item>
                                                    )}


                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagSearch/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/sales-invoice" label={t('NewSales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconShoppingBagPlus/></ThemeIcon>}>
                                    <NavLink pl={'md'} href="accounting/purchase" label={t('ManagePurchase')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                                </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconCurrencyMonero />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="/accounting/transaction-mode"
                                                            label={t("TransactionMode")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("accounting/transaction-mode");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                // Handle middle mouse button click for browsers that support it
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/transaction-mode", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/ledger"
                                                            label={t("Ledger")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/ledger");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                // Handle middle mouse button click for browsers that support it
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/ledger", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/head-group"
                                                            label={t("HeadGroup")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/head-group");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                // Handle middle mouse button click for browsers that support it
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/head-group", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/head-subgroup"
                                                            label={t("HeadSubGroup")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/head-subgroup");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                // Handle middle mouse button click for browsers that support it
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/head-subgroup", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                     <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconBasket /></ThemeIcon>}>
                                        <NavLink pl={'md'} href="accounting/voucher-entry" label={t('SampleModal')} component="button" onClick={(e) => { navigate('/accounting/modalIndex') }} onAuxClick={(e) => {
                                            // Handle middle mouse button click for browsers that support it
                                            if (e.button === 1) {
                                                window.open('/accounting/voucher-entry', '_blank');
                                            }
                                        }} />
                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/balance-sheet"
                                                            label={t("BalanceSheet")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/balance-sheet");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/balance-sheet", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                    <List.Item
                                                        pl={"xs"}
                                                        icon={
                                                            <ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
                                                                <IconBasket />
                                                            </ThemeIcon>
                                                        }
                                                    >
                                                        <NavLink
                                                            pl={"md"}
                                                            href="accounting/balance-entry"
                                                            label={t("BalanceEntry")}
                                                            component="button"
                                                            onClick={(e) => {
                                                                navigate("/accounting/balance-entry");
                                                            }}
                                                            onAuxClick={(e) => {
                                                                if (e.button === 1) {
                                                                    window.open("/accounting/balance-entry", "_blank");
                                                                }
                                                            }}
                                                        />
                                                    </List.Item>
                                                </List>
                                            </Box>
                                        </Card>
                                    )}
                                </Grid.Col>
                            </Grid>
                        </ScrollArea>
                    </Box>
                </Box>
            </Box>

            }
            {ledgerDetails &&
            <LedgerDetailsModel ledgerDetails={ledgerDetails} setLedgerDetails={setLedgerDetails} />
            }
        </>
    );

}

export default AccountingDashboard;
