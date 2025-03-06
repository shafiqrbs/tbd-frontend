import React from "react";
import {
  IconSearch,
  IconDeviceFloppy,
  IconRestore,
  IconPlus,
  IconClockPause,
  IconHandStop,
  IconUser,
  IconRotateClockwise,
} from "@tabler/icons-react";
import {
  Button,
  Flex,
  Text,
  Tooltip,
  Box,
  Center,
  Stack,
  Container,
  ScrollArea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useWindowScroll } from "@mantine/hooks";
import { useOutletContext } from "react-router-dom";
import classes from "./Table.module.css";

function __ShortcutPos(props) {
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const formHeight = mainAreaHeight - 106; //TabList height 104
  return (
    <>
      <ScrollArea
        h={formHeight}
        bg="gray.8"
        type="never"
        className="border-radius"
      >
        <Flex direction={`column`} align={"center"} gap={"16"}>
          <Flex direction={`column`} align={"center"} mb={"8"} mt={2} pt={5}>
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
                bg={"red.5"}
                size="md"
                pl={"12"}
                pr={"12"}
                variant={"light"}
                color={`black`}
                radius="xl"
                onClick={(e) => {
                  document.getElementById(props.Name).focus();
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconPlus size={16} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"gray.5"}>
              alt+n
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"} mb={"8"}>
            <Tooltip
              label={t("AltTextSave")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={`red.5`}
              transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
            >
              <Button
                size="md"
                pl={"12"}
                pr={"12"}
                variant={"filled"}
                color={`green.8`}
                radius="xl"
                onClick={(e) => {
                  document.getElementById(props.FormSubmit).click();
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDeviceFloppy size={16} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"gray.5"}>
              alt+s
            </Flex>
          </Flex>
        </Flex>
      </ScrollArea>
    </>
  );
}

export default __ShortcutPos;
