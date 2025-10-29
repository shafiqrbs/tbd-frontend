import React from "react";
import {
    IconDeviceFloppy,
    IconPlus,
    IconDashboard,
    IconReportMoney,
    IconReportAnalytics,
    IconBuildingCottage,
    IconArmchair2,
    IconCellSignal4,
    IconSettings,
    IconIcons,
    IconCategory,
    IconUsers
} from "@tabler/icons-react";
import {Button, Flex, Text, Tooltip, ScrollArea} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useNavigate, useOutletContext} from "react-router-dom";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";

export default function _Shortcut(props) {
    const {module, id} = props;
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 30;
    const {configData} = useConfigData();
    const navigate = useNavigate();
    return (
        <>
            <ScrollArea h={height} bg="white" type="never" className="border-radius">
                <Flex direction={`column`} align={"center"} gap={"16"}>
                    <Flex direction={`column`} align={"center"} mt={"xs"} pt={5}>
                        <Tooltip
                            label={t("B2BDomainDashboard")}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={"white"}
                            bg={"#4CAF50"}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Button
                                bg={"#4CAF50"}
                                size="md"
                                pl={"12"}
                                pr={"12"}
                                variant={"light"}
                                color={`black`}
                                radius="xl"
                                onClick={(e) => {
                                    navigate("/b2b/dashboard");
                                }}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconDashboard size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            {t("Dashboard")}
                        </Flex>
                    </Flex>

                    <Flex direction={`column`} align={"center"} pt={5}>
                        <Tooltip
                            label={t("B2BDomain")}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={"white"}
                            bg='var(--theme-primary-color-4)'
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Button
                                bg='var(--theme-primary-color-4)'
                                size="md"
                                pl={"12"}
                                pr={"12"}
                                variant={"light"}
                                color={`black`}
                                radius="xl"
                                onClick={(e) => {
                                    navigate("/b2b/domain");
                                }}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconDashboard size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            {t("Domain")}
                        </Flex>
                    </Flex>
                    <Flex direction={`column`} align={"center"} pt={5}>
                        <Tooltip
                            label={t("B2BDomain")}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={"white"}
                            bg={"lime"}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Button
                                bg={"lime"}
                                size="md"
                                pl={"12"}
                                pr={"12"}
                                variant={"light"}
                                color={`black`}
                                radius="xl"
                                onClick={(e) => {
                                    navigate("/b2b/stock");
                                }}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconUsers size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            {t("Stock")}
                        </Flex>
                    </Flex>
                    <Flex direction={`column`} align={"center"} pt={5}>
                        <Tooltip
                            label={t("B2BDomain")}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={"white"}
                            bg={"orange"}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Button
                                bg={"orange"}
                                size="md"
                                pl={"12"}
                                pr={"12"}
                                variant={"light"}
                                color={`black`}
                                radius="xl"
                                onClick={(e) => {
                                    navigate("/b2b/stock-price");
                                }}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconUsers size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            {t("StockPrice")}
                        </Flex>
                    </Flex>
                    <Flex direction={`column`} align={"center"} pt={5}>
                        <Tooltip
                            label={t("B2BDomain")}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={"white"}
                            bg={"blue"}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Button
                                bg={"blue"}
                                size="md"
                                pl={"12"}
                                pr={"12"}
                                variant={"light"}
                                color={`black`}
                                radius="xl"
                                onClick={(e) => {
                                    navigate("/b2b/master-user");
                                }}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconUsers size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            {t("MasterUsers")}
                        </Flex>
                    </Flex>

                    {module !== "b2b_dashboard" && (
                        <>

                            <Flex direction={`column`} align={"center"} mb={"8"}>
                                <Tooltip
                                    label={t("B2BProduct")}
                                    px={16}
                                    py={2}
                                    withArrow
                                    position={"left"}
                                    c={"white"}
                                    bg={"#3F51B5"}
                                    transitionProps={{
                                        transition: "pop-bottom-left",
                                        duration: 500,
                                    }}
                                >
                                    <Button
                                        bg={"#3F51B5"}
                                        size="md"
                                        pl={"12"}
                                        pr={"12"}
                                        variant={"light"}
                                        color={`black`}
                                        radius="xl"
                                        onClick={(e) => {
                                            navigate(`/b2b/sub-domain/product/${id}`);
                                        }}
                                    >
                                        <Flex direction={`column`} align={"center"}>
                                            <IconIcons size={16} color={"white"}/>
                                        </Flex>
                                    </Button>
                                </Tooltip>
                                <Flex
                                    direction={`column`}
                                    align={"center"}
                                    fz={"12"}
                                    c={"black"}
                                >
                                    {t("Product")}
                                </Flex>
                            </Flex>

                            <Flex direction={`column`} align={"center"} mb={"8"}>
                <Tooltip
                  label={t("B2BProductStock")}
                  px={16}
                  py={2}
                  withArrow
                  position={"left"}
                  c={"white"}
                  bg={"#3F51B5"}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 500,
                  }}
                >
                  <Button
                    bg={"#3F51B5"}
                    size="md"
                    pl={"12"}
                    pr={"12"}
                    variant={"light"}
                    color={`black`}
                    radius="xl"
                    onClick={(e) => {
                      navigate(`/b2b/sub-domain/stock/${id}`);
                    }}
                  >
                    <Flex direction={`column`} align={"center"}>
                      <IconIcons size={16} color={"white"} />
                    </Flex>
                  </Button>
                </Tooltip>
                <Flex
                  direction={`column`}
                  align={"center"}
                  fz={"12"}
                  c={"black"}
                >
                  {t("Stock")}
                </Flex>
              </Flex>


                            <Flex direction={`column`} align={"center"} mb={"8"}>
                                <Tooltip
                                    label={t("B2BCategory")}
                                    px={16}
                                    py={2}
                                    withArrow
                                    position={"left"}
                                    c={"white"}
                                    bg={"#E53935"}
                                    transitionProps={{
                                        transition: "pop-bottom-left",
                                        duration: 500,
                                    }}
                                >
                                    <Button
                                        bg={"#E53935"}
                                        size="md"
                                        pl={"12"}
                                        pr={"12"}
                                        variant={"light"}
                                        color={`black`}
                                        radius="xl"
                                        onClick={(e) => {
                                            navigate(`/b2b/sub-domain/category/${id}`);
                                        }}
                                    >
                                        <Flex direction={`column`} align={"center"}>
                                            <IconCategory size={16} color={"white"}/>
                                        </Flex>
                                    </Button>
                                </Tooltip>
                                <Flex
                                    direction={`column`}
                                    align={"center"}
                                    fz={"12"}
                                    c={"black"}
                                >
                                    {t("Category")}
                                </Flex>
                            </Flex>
                            <Flex direction={`column`} align={"center"} mb={"8"}>
                                <Tooltip
                                    label={t("B2BSetting")}
                                    px={16}
                                    py={2}
                                    withArrow
                                    position={"left"}
                                    c={"white"}
                                    bg={"#FFC107"}
                                    transitionProps={{
                                        transition: "pop-bottom-left",
                                        duration: 500,
                                    }}
                                >
                                    <Button
                                        bg={"#FFC107"}
                                        size="md"
                                        pl={"12"}
                                        pr={"12"}
                                        variant={"light"}
                                        color={`black`}
                                        radius="xl"
                                        onClick={(e) => {
                                            navigate(`/b2b/sub-domain/setting/${id}`);
                                        }}
                                    >
                                        <Flex direction={`column`} align={"center"}>
                                            <IconSettings size={16} color={"white"}/>
                                        </Flex>
                                    </Button>
                                </Tooltip>
                                <Flex
                                    direction={`column`}
                                    align={"center"}
                                    fz={"12"}
                                    c={"black"}
                                >
                                    {t("Setting")}
                                </Flex>
                            </Flex>
                        </>
                    )}
                </Flex>
            </ScrollArea>
        </>
    );
}
