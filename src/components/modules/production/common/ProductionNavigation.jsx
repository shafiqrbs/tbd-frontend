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
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import axios from "axios";

export default function ProductionNavigation(props) {
  const { module, id } = props;
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 20;
  const { configData } = getConfigData();
  const location = useLocation();
  const currentRoute = location.pathname;
  const navigate = useNavigate();
  const CallProductionBatchCreateApi = (e) => {
    e.preventDefault()
    event.preventDefault();
    axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_GATEWAY_URL + "production/batch"}`,
      headers: {
        Accept: `application/json`,
        "Content-Type": `application/json`,
        "Access-Control-Allow-Origin": "*",
        "X-Api-Key": import.meta.env.VITE_API_KEY,
        "X-Api-User": JSON.parse(localStorage.getItem("user")).id,
      },
      data: {
        mode: "in-house",
      },
    })
      .then((res) => {
        if (res.data.status === 200) {
          navigate("/production/batch/" + res.data.data.id);
        }
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      });
  };
  return (
    <>
      <ScrollArea h={height} bg="white" type="never" className="border-radius">
        <Flex direction={`column`} align={"center"} gap={"16"}>
          <Flex direction={`column`} align={"center"} mt={"xs"} pt={5}>
            <Tooltip
              label={t("GeneralProductionIssue")}
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
                  navigate("/production/issue-production-general");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              <Text
                mt={"4"}
                size="xs"
                c="black"
                ta="center"
                w={58}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("GeneralProductionIssue")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("BatchProdcutionIssue")}
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
                  navigate("/production/issue-production-batch");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              <Text
                mt={4}
                size="xs"
                c="black"
                ta="center"
                w={58}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("BatchProdcutionIssue")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("NewBatch")}
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
                  CallProductionBatchCreateApi(event);
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
                {t("NewBatch")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("ProductionBatch")}
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
                  navigate("/production/batch");
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
                w={58}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("ProductionBatch")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("ProductionItems")}
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
                  navigate("/production/items");
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
                w={58}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("ProductionItems")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("ProductionSetting")}
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
                  navigate("/production/setting");
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
                {t("ProductionSetting")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("ProductionConfig")}
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
                  navigate("/production/config");
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
                {t("ProductionConfig")}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </ScrollArea>
    </>
  );
}
