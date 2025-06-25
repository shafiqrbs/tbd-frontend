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
} from "@tabler/icons-react";
import { Button, Flex, Text, Tooltip, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import getConfigData from "../../../global-hook/config-data/getConfigData";

export default function _DiscountShortcut() {
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 30;
  const { configData } = getConfigData();
  const navigate = useNavigate();
  return (
    <>
      <ScrollArea h={height} bg="white" type="never" className="border-radius">
        <Flex direction={`column`} align={"center"} gap={"16"}>
          <Flex direction={`column`} align={"center"} mt={"xs"} pt={5}>
            <Tooltip
              label={t("DiscountDashboard")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={"#4CAF50"}
              transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
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
                  navigate("/discount");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              {t("Dashboard")}
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"} pt={5}>
            <Tooltip
              label={t("Discount")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg='var(--theme-primary-color-4)'
              transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
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
                  navigate("/discount/users");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              {t("Discount")}
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"} pt={5}>
            <Tooltip
                label={t("UsersDiscount")}
                px={16}
                py={2}
                withArrow
                position={"left"}
                c={"white"}
                bg={"#F59E0B"}
                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
            >
              <Button
                  bg={"#F59E0B"}
                  size="md"
                  pl={"12"}
                  pr={"12"}
                  variant={"light"}
                  color={`black`}
                  radius="xl"
                  onClick={(e) => {
                    navigate("/discount/users");
                  }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              {t("Users")}
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"} pt={5}>
            <Tooltip
                label={t("Configuration")}
                px={16}
                py={2}
                withArrow
                position={"left"}
                c={"white"}
                bg={"#3F51B5"}
                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
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
                    navigate("/discount/config");
                  }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              {t("Config")}
            </Flex>
          </Flex>
        </Flex>
      </ScrollArea>
    </>
  );
}
