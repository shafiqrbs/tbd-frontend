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
  IconCirclePlus,
} from "@tabler/icons-react";
import { Button, Flex, Text, Tooltip, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

export default function Navigation(props) {
  const { module, id } = props;
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 28;
  const { configData } = getConfigData();
  const navigate = useNavigate();
  return (
      <>
        <ScrollArea h={module === "voucher-entry" ? height - 38 : height} bg="white" type="never" className="border-radius">
          <Flex direction={`column`} align={"center"} gap={"16"}>

              <Flex direction={`column`} align={"center"} mt="xs">
                  <Tooltip
                      label={t("AccountLedger")}
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
                              navigate("/accounting/entry");
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
                          w={58}
                          style={{
                              wordBreak: "break-word",
                              hyphens: "auto",
                          }}
                      >
                          {t("EntryList")}
                      </Text>
                  </Flex>
              </Flex>


            <Flex direction={`column`} align={"center"}>
              <Tooltip
                  label={t("VoucherEntry")}
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
                      navigate("/accounting/voucher-entry");
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
                    w={58}
                    style={{
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                >
                  {t("Entry")}
                </Text>
              </Flex>
            </Flex>
            <Flex direction={`column`} align={"center"}>
              <Tooltip
                  label={t("AccountLedger")}
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
                      navigate("/accounting/ledger");
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
                    w={58}
                    style={{
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                >
                  {t("Ledger")}
                </Text>
              </Flex>
            </Flex>

            <Flex direction={`column`} align={"center"}>
              <Tooltip
                  label={t("AccountHeadGroup")}
                  px={16}
                  py={2}
                  withArrow
                  position={"left"}
                  c={"white"}
                  bg={"#F59E0B"}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 500,
                  }}
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
                      navigate("/accounting/head-group");
                    }}
                >
                  <Flex direction={`column`} align={"center"}>
                    <IconShoppingBag size={16} color={"white"} />
                  </Flex>
                </Button>
              </Tooltip>
              <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                <Text
                    size="xs"
                    c="black"
                    ta="center"
                    w={68}
                    style={{
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                >
                  {t("Head")}
                </Text>
              </Flex>
            </Flex>
            <Flex direction={`column`} align={"center"}>
              <Tooltip
                  label={t("AccountSubHeadGroup")}
                  px={16}
                  py={2}
                  withArrow
                  position={"left"}
                  c={"white"}
                  bg={"#06B6D4"}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 500,
                  }}
              >
                <Button
                    bg={"#06B6D4"}
                    size="md"
                    pl={"12"}
                    pr={"12"}
                    variant={"light"}
                    color={"black"}
                    radius="xl"
                    onClick={(e) => {
                      navigate("/accounting/head-subgroup");
                    }}
                >
                  <Flex direction={`column`} align={"center"}>
                    <IconShoppingCart size={16} color={"white"} />
                  </Flex>
                </Button>
              </Tooltip>
              <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                <Text
                    size="xs"
                    c="black"
                    ta="center"
                    w={58}
                    style={{
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                >
                  {t("SubHead")}
                </Text>
              </Flex>
            </Flex>

            <Flex direction={`column`} align={"center"} >
              <Tooltip
                  label={t("Voucher")}
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
                      navigate("/accounting/voucher-create");
                    }}
                >
                  <Flex direction={`column`} align={"center"}>
                    <IconCirclePlus size={16} color={"white"} />
                  </Flex>
                </Button>
              </Tooltip>
              <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                <Text
                    size="xs"
                    c="black"
                    ta="center"
                    w={58}
                    style={{
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                >
                  {t("Voucher")}
                </Text>
              </Flex>
            </Flex>
            <Flex direction={`column`} align={"center"}>
              <Tooltip
                  label={t("Transaction")}
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
                      navigate("/accounting/transaction-mode");
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
                    w={64}
                    style={{
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                >
                  {t("Transaction")}
                </Text>
              </Flex>
            </Flex>
            <Flex direction={`column`} align={"center"}>
              <Tooltip
                  label={t("Settings")}
                  px={16}
                  py={2}
                  withArrow
                  position={"left"}
                  c={"white"}
                  bg={"#10B981"}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 500,
                  }}
              >
                <Button
                    bg={"#10B981"}
                    size="md"
                    pl={"12"}
                    pr={"12"}
                    variant={"light"}
                    color={`black`}
                    radius="xl"
                    onClick={(e) => {
                      navigate("/accounting/config");
                    }}
                >
                  <Flex direction={`column`} align={"center"}>
                    <IconCopyCheck size={16} color={"white"} />
                  </Flex>
                </Button>
              </Tooltip>
              <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                <Text
                    size="xs"
                    c="black"
                    ta="center"
                    w={58}
                    style={{
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                >
                  {t("Settings")}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </ScrollArea>
      </>
  );
}
