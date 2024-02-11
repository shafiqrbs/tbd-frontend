import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  Group,
  Tabs,
  rem,
  Text,
  Tooltip,
  Box,
  ScrollArea,
  Flex,
  Title,
  Grid,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconCircle,
  IconCircleCheck,
  IconColorFilter,
  IconCross,
  IconList,
  IconPlaylistAdd,
  IconSettings,
  IconX,
  IconXboxX,
} from "@tabler/icons-react";
import { useViewportSize } from "@mantine/hooks";
import _Datatable from "./_Datatable";
import _Form from "./_Form";
import _AnotherFormLayout from "./_AnotherFormLayout";
import CrudForm from "./CrudForm";
function Crud() {
  const { t, i18n } = useTranslation();
  const iconStyle = { width: rem(12), height: rem(12) };
  const [activeTab, setActiveTab] = useState("create_antother_form_layout");
  const { isOnline, mainAreaHeight } = useOutletContext();

  const height = mainAreaHeight - 36; //TabList height 36
  const tabDataListRightButtons = (
    <Group
      // display={"data_list" === activeTab ? "block" : "none"}
      pos={`absolute`}
      right={0}
      gap={0}
    >
      <Tooltip
        label={"Tooltip"}
        px={20}
        py={3}
        color={`red.8`}
        withArrow
        offset={2}
        transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
      >
        <Button size="xs" color={`red.8`}>
          <IconColorFilter size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        label={"Create CSV"}
        px={20}
        py={3}
        color={`green.8`}
        withArrow
        offset={2}
        transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
      >
        <Button size="xs" ml={`xs`} color={`green.8`}>
          CSV
        </Button>
      </Tooltip>

      <Tooltip
        label={"Create PDF"}
        px={20}
        py={3}
        color={`blue.7`}
        withArrow
        offset={2}
        transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
      >
        <Button size="xs" ml={`xs`} color={`blue.7`}>
          PDF
        </Button>
      </Tooltip>
    </Group>
  );

  const tabCreateNewRightButtons = (
    <Group pos={`absolute`} right={0} gap={0}>
      <Tooltip
        label={"Tooltip"}
        px={20}
        py={3}
        color={`blue.3`}
        withArrow
        offset={2}
        transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
      >
        <Button size="xs" color={`red.3`} variant="light">
          <IconX size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        label={t("check")}
        px={20}
        py={3}
        color={`blue.3`}
        withArrow
        offset={2}
        transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
      >
        <Button size="xs" ml={`xs`} variant="light" color={`yellow.5`}>
          <IconCircleCheck />
        </Button>
      </Tooltip>

      <Tooltip
        label={t("voice")}
        px={20}
        py={3}
        color={`blue.3`}
        withArrow
        offset={2}
        transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
      >
        <Button
          size="xs"
          ml={`xs`}
          color={`blue.6`}
          loading
          loaderProps={{ type: "dots" }}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        ></Button>
      </Tooltip>
      <Tooltip
        label={t("create_and_save")}
        px={20}
        py={3}
        color={`blue.7`}
        withArrow
        offset={2}
        transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
      >
        <Button
          size="xs"
          color={`blue.7`}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          <Flex direction={`column`} gap={0}>
            <Text fz={12} fw={700}>
              {t("create_and_save")} <br />{" "}
              <Text fz={9} fw={900}>
                ctrl + s
              </Text>
            </Text>
          </Flex>
        </Button>
      </Tooltip>
    </Group>
  );
  return (
    <Tabs
      defaultValue="create_antother_form_layout"
      onChange={(value) => setActiveTab(value)}
    >
      <Tabs.List pos={`relative`}>
        <Tabs.Tab
          value="data_list"
          leftSection={<IconList style={iconStyle} />}
        >
          {t("data_list")}
        </Tabs.Tab>
        <Tabs.Tab
          value="create_new"
          leftSection={<IconPlaylistAdd style={iconStyle} />}
        >
          {t("create_new")}
        </Tabs.Tab>
        <Tabs.Tab
          value="create_antother_form_layout"
          leftSection={<IconSettings style={iconStyle} />}
        >
          {t("create_antother_form_layout")}
        </Tabs.Tab>

        {/*{activeTab === "data_list" && tabDataListRightButtons}*/}
        {/*{activeTab === "create_new" && tabCreateNewRightButtons}*/}
      </Tabs.List>

      <Tabs.Panel value="data_list">
        {/* <ScrollArea h={height} scrollbarSize={4}> */}
          <_Datatable />
        {/* </ScrollArea> */}
      </Tabs.Panel>

      <Tabs.Panel value="create_new">
        <ScrollArea h={height} scrollbarSize={4}>
          <CrudForm />
        </ScrollArea>
      </Tabs.Panel>

      <Tabs.Panel value="create_antother_form_layout">
        <ScrollArea h={height} scrollbarSize={4}>
          <_AnotherFormLayout />
        </ScrollArea>
      </Tabs.Panel>
    </Tabs>
  );
}

export default Crud;
