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
  IconCopyCheck,
  IconShoppingBag,
  IconShoppingCart,
} from "@tabler/icons-react";
import { Button, Flex, Text, Tooltip, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

export default function RequisitionNavigation(props) {
  const { module, id } = props;
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 30;
  const { configData } = getConfigData();
  const navigate = useNavigate();
  return (
    <>
      <ScrollArea
        h={
          module === "requisition"
            ? height - 52
            : module === 'config'
            ? height - 8
            : module
            ? height - 63
            : height
        }
        bg="white"
        type="never"
        className="border-radius"
      >
        <Flex direction={`column`} align={"center"} gap={"16"}>
          <Flex direction={`column`} align={"center"} mt={"xs"} pt={5}>
            <Tooltip
              label={t("Requisition")}
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
                  navigate("/procurement/requisition");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              <Text
                size="xs"
                c="black"
                ta="center"
                w={56}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("Requisition")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("NewRequisition")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={"#6f1225"}
              transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
            >
              <Button
                bg={"#6f1225"}
                size="md"
                pl={"12"}
                pr={"12"}
                variant={"light"}
                color={`black`}
                radius="xl"
                onClick={(e) => {
                  navigate("/procurement/new-requisition");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              <Text
                size="xs"
                c="black"
                ta="center"
                w={56}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("NewRequisition")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("RequisitionDashboard")}
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
                  navigate("/procurement/requisition-board");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconCategory size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              <Text
                size="xs"
                c="black"
                ta="center"
                w={56}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("RequisitionDashboard")}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </ScrollArea>
    </>
  );
}
