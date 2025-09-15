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
import useConfigData from "../../../global-hook/config-data/useConfigData.js";

export default function Navigation(props) {
  const { module, id } = props;
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 20;
  const { configData } = useConfigData();
  const navigate = useNavigate();
  const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))
  return (
    <>
      <ScrollArea
        h={height - 8}
        bg="white"
        type="never"
        className="border-radius"
      >
        <Flex direction={`column`} align={"center"} gap={"16"}>
          <Flex direction={`column`} align={"center"} mt={"xs"} pt={5}>
            <Tooltip
              label={t("Customer")}
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
                  navigate("/core/customer");
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
                {t("Customer")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("Vendor")}
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
                  navigate("/core/vendor");
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
                {t("Vendor")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("User")}
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
                  navigate("/core/user");
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
                {t("User")}
              </Text>
            </Flex>
          </Flex>

          {domainConfigData && domainConfigData?.inventory_config && domainConfigData?.inventory_config?.sku_warehouse ===1 && (
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("Warehouse")}
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
                  navigate("/core/warehouse");
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
                w={62}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("Warehouse")}
              </Text>
            </Flex>
          </Flex>
          )}
          {domainConfigData && domainConfigData?.inventory_config && domainConfigData?.inventory_config?.is_marketing_executive ===1 && (
              <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("MarketingExecutive")}
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
                  navigate("/core/marketing-executive");
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
                w={56}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("MarketingExecutive")}
              </Text>
            </Flex>
          </Flex>
          )}
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("Setting")}
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
                  navigate("/core/setting");
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
