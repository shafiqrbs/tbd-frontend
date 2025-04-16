import React from "react";
import { useOutletContext } from "react-router-dom";
import { ActionIcon, Box, ScrollArea, Drawer, Text, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { IconX } from "@tabler/icons-react";
import __SettingsForm from "./__SettingsForm";

function __SettingsDrawer(props) {
  const { settingDrawer, setSettingDrawer, module } = props;
  const { isOnline, mainAreaHeight } = useOutletContext();
  const { t, i18n } = useTranslation();
  const height = mainAreaHeight; //TabList height 104
  const closeDrawer = () => {
    setSettingDrawer(false);
  };

  return (
    <>
      <Drawer.Root
        opened={settingDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <ScrollArea
            h={height + 100}
            scrollbarSize={2}
            type="never"
            bg={"gray.1"}
          >
            <Flex
              mih={40}
              gap="md"
              justify="flex-end"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <ActionIcon
                mr={"sm"}
                radius="xl"
                color="grey.6"
                size="md"
                variant="outline"
                onClick={closeDrawer}
              >
                <IconX style={{ width: "80%", height: "80%" }} stroke={1.5} />
              </ActionIcon>
            </Flex>
            <Box ml={2} mr={2} mb={0}>
              <__SettingsForm
                module={module}
                setSettingDrawer={setSettingDrawer}
              />
            </Box>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

export default __SettingsDrawer;
