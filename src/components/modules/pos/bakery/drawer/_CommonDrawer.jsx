import { Drawer, ScrollArea, Flex, ActionIcon, Box } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import __AdditionalItems from "./__AdditionalItems";
import __SplitPayment from "./__SplitPayment";

export default function _CommonDrawer(props) {
  const {
    additionalItemDrawer,
    setAdditionalItemDrawer,
    eventName,
    salesDueAmount,
    getAdditionalItem,
    getSplitPayment,
  } = props;

  const closeDrawer = () => {
    setAdditionalItemDrawer(false);
  };
  return (
    <>
      <Drawer.Root
        opened={additionalItemDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
        bg={"gray.1"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Box>
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
                color="red.6"
                size="md"
                onClick={closeDrawer}
              >
                <IconX style={{ width: "100%", height: "100%" }} stroke={1.5} />
              </ActionIcon>
            </Flex>
          </Box>
          <Drawer.Body>
            <Box>
              {eventName === "splitPayment" && (
                <__SplitPayment
                  closeDrawer={closeDrawer}
                  salesDueAmount={salesDueAmount}
                  getSplitPayment={getSplitPayment}
                />
              )}

              {eventName === "additionalProductAdd" && (
                <__AdditionalItems
                  closeDrawer={closeDrawer}
                  getAdditionalItem={getAdditionalItem}
                />
              )}
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
