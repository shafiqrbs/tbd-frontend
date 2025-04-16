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

export default function __Navigation(props) {
  const { module, id } = props;
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 20;
  const { configData } = getConfigData();
  const navigate = useNavigate();
  return (
    <>
      <ScrollArea h={height} bg="white" type="never" className="border-radius">
        <Flex direction={`column`} align={"center"} gap={"16"}>
          <Flex direction={`column`} align={"center"} mt={"xs"} pt={5}>
            <Tooltip
              label={t("AltTextNew")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={`red.5`}
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
                  navigate("/inventory/invoice-batch");
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
                {t("InvoiceBatch")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("B2BDomain")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={`red.5`}
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
                  navigate("/inventory/sales");
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
                {t("Sales")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("AltTextNew")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={`red.5`}
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
                  navigate("/inventory/sales-invoice");
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
                {t("NewSales")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("AltTextNew")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={`red.5`}
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
                  navigate("/inventory/purchase");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconIcons size={16} color={"white"} />
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
                {t("Purchase")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("AltTextNew")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={`red.5`}
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
                  navigate("/inventory/purchase-invoice");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconSettings size={16} color={"white"} />
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
                {t("NewPurchase")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("AltTextNew")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={`red.5`}
              transitionProps={{
                transition: "pop-bottom-left",
                duration: 500,
              }}
            >
              <Button
                bg={"gray.6"}
                size="md"
                pl={"12"}
                pr={"12"}
                variant={"light"}
                color={`black`}
                radius="xl"
                onClick={(e) => {
                  navigate("/inventory/opening-stock");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconSettings size={16} color={"white"} />
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
                {t("OpeningStock")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("AltTextNew")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={`red.5`}
              transitionProps={{
                transition: "pop-bottom-left",
                duration: 500,
              }}
            >
              <Button
                bg={"gray.6"}
                size="md"
                pl={"12"}
                pr={"12"}
                variant={"light"}
                color={`black`}
                radius="xl"
                onClick={(e) => {
                  navigate("/inventory/opening-approve-stock");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconSettings size={16} color={"white"} />
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
                {t("ApproveStock")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("AltTextNew")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={`red.5`}
              transitionProps={{
                transition: "pop-bottom-left",
                duration: 500,
              }}
            >
              <Button
                bg={"gray.6"}
                size="md"
                pl={"12"}
                pr={"12"}
                variant={"light"}
                color={`black`}
                radius="xl"
                onClick={(e) => {
                  navigate("/inventory/config");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconSettings size={16} color={"white"} />
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
                {t("Setting")}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </ScrollArea>
    </>
  );
}
