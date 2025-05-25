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
import { Button, Flex, Text, Tooltip, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import getConfigData from "../../../global-hook/config-data/getConfigData";

export default function _Navigation(props) {
  const { module, id } = props;
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
              label={t("Domain")}
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
                  navigate("/domain");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              {t("Domain")}
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"} pt={5}>
            <Tooltip
                label={t("DomainMasterUser")}
                px={16}
                py={2}
                withArrow
                position={"left"}
                c={"white"}
                bg={"#fd7e14"}
                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
            >
              <Button
                  bg={"#fd7e14"}
                  size="md"
                  pl={"12"}
                  pr={"12"}
                  variant={"light"}
                  color={`black`}
                  radius="xl"
                  onClick={(e) => {
                    navigate("/domain/user");
                  }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconUsers size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              {t("MasterUsers")}
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"} pt={5}>
            <Tooltip
                label={t("DomainHead")}
                px={16}
                py={2}
                withArrow
                position={"left"}
                c={"white"}
                bg={"#6f42c1"}
                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
            >
              <Button
                  bg={"#6f42c1"}
                  size="md"
                  pl={"12"}
                  pr={"12"}
                  variant={"light"}
                  color={`black`}
                  radius="xl"
                  onClick={(e) => {
                    navigate("/domain/head");
                  }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconUsers size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              {t("Head")}
            </Flex>
          </Flex>

          <Flex direction={`column`} align={"center"} pt={5}>
            <Tooltip
                label={t("SiteMap")}
                px={16}
                py={2}
                withArrow
                position={"left"}
                c={"white"}
                bg={"blue"}
                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
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
                    navigate("/domain/sitemap");
                  }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconUsers size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              {t("SiteMap")}
            </Flex>
          </Flex>
        </Flex>
      </ScrollArea>
    </>
  );
}
