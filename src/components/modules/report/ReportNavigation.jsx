import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../global-hook/loading-progress/getLoadingProgress";
import {
    Progress,
    Box,
    Grid,
    Table, Text, ScrollArea,Accordion,NavLink
} from "@mantine/core";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useOutletContext} from "react-router-dom";
import {IconChevronRight, IconGauge, IconHome2, IconShoppingBagDiscount,IconScale,IconBuildingFactory,IconReportMoney,IconShoppingCart,IconArchive,IconReport} from "@tabler/icons-react";

export default function ReportNavigation() {
    const progress = getLoadingProgress();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight-48;
    return (
        <>
            <Box className={"boxBackground borderRadiusAll"}>
                <Text pt={'xs'} pl={'md'} pb={'xs'}>{t("ManageReports")}</Text>
            </Box>
            <ScrollArea h={height}
                scrollbarSize={2}
                scrollbars="y"
                type="never"
                bg={'white'}>
                <Box ml={'4'} mr={'4'} mt={'4'}>
                    <Accordion chevronIconSize={20} variant="default" defaultValue="item-1" transitionDuration={1000}>
                        <Accordion.Item value="item-1">
                            <Accordion.Control icon={<IconBuildingFactory size={18} stroke={1.5} color="var(--mantine-color-green-8)" />} >{t("Production")}</Accordion.Control>
                            <Accordion.Panel>
                                <NavLink
                                    onClick ={(e)=>{
                                        navigate('/report/production/issue')
                                    }}
                                    label={t("Issue")}
                                    rightSection={
                                        <IconChevronRight size={12} stroke={1} className="mantine-rotate-rtl" />
                                    }
                                />
                                <NavLink
                                    onClick ={(e)=>{
                                        navigate('/report/production/daily')
                                    }}
                                    label={t("DailyExpense")}
                                    rightSection={
                                        <IconChevronRight size={12} stroke={1} className="mantine-rotate-rtl" />
                                    }
                                />
                                <NavLink
                                    href=""
                                    onClick ={(e)=>{
                                        navigate('/report/production/daily-warehouse')
                                    }}
                                    label={t("DailyWarehouseExpense")}
                                    rightSection={
                                        <IconChevronRight size={12} stroke={1} className="mantine-rotate-rtl" />
                                    }
                                />
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="item-2">
                            <Accordion.Control icon={<IconShoppingBagDiscount size={18} stroke={1.5} color="var(--mantine-color-green-8)" />}>{t("Sales")}</Accordion.Control>
                            <Accordion.Panel>
                                <NavLink
                                    href="#required-for-focus"
                                    label="With icon"
                                    leftSection={<IconHome2 size={16} stroke={1.5} />}
                                    rightSection={
                                        <IconChevronRight size={12} stroke={1.5} className="mantine-rotate-rtl" />
                                    }
                                />
                                <NavLink
                                    href="#required-for-focus"
                                    label="With right section"
                                    leftSection={<IconGauge size={16} stroke={1.5} />}
                                    rightSection={
                                        <IconChevronRight size={12} stroke={1.5} className="mantine-rotate-rtl" />
                                    }
                                />

                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="item-3">
                            <Accordion.Control icon={<IconShoppingCart size={18} stroke={1.5} color="var(--mantine-color-green-8)" />} >{t("Purchase")}</Accordion.Control>
                            <Accordion.Panel>
                                This is the third section content.
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="item-4">
                            <Accordion.Control icon={<IconArchive size={18} stroke={1.5} color="var(--mantine-color-green-8)" />}>{t("Inventory")}</Accordion.Control>
                            <Accordion.Panel>
                                <NavLink
                                    onClick ={(e)=>{
                                        navigate('/report/inventory/item/stock/history')
                                    }}
                                    label={t("ItemStockHistory")}
                                    rightSection={
                                        <IconChevronRight size={12} stroke={1} className="mantine-rotate-rtl" />
                                    }
                                />
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="item-5">
                            <Accordion.Control icon={<IconReportMoney size={18} stroke={1.5} color="var(--mantine-color-green-8)" />}>{t("Accounting")}</Accordion.Control>
                            <Accordion.Panel>
                                <NavLink
                                    onClick ={(e)=>{
                                        navigate('/report/accounting/summery-report')
                                    }}
                                    label={t("Summery")}
                                    rightSection={
                                        <IconChevronRight size={12} stroke={1} className="mantine-rotate-rtl" />
                                    }
                                />
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="item-6">
                            <Accordion.Control icon={<IconReport size={18} stroke={1.5} color="var(--mantine-color-green-8)" />}>{t("MIS")}</Accordion.Control>
                            <Accordion.Panel>
                                This is the third section content.
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Box>
            </ScrollArea>
        </>
    );
}
