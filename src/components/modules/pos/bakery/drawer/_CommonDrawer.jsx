import { Drawer, ScrollArea, Flex, ActionIcon, Box } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import __AdditionalItems from "./__AdditionalItems";
import __SplitPayment from "./__SplitPayment";
import __KitchenPrint from "./__KitchenPrint";

export default function _CommonDrawer(props) {
  const {
    setLoadCartProducts,
    enableTable,
    tableId,
    commonDrawer,
    setCommonDrawer,
    eventName,
    salesDueAmount,
    getAdditionalItem,
    getSplitPayment,
    currentSplitPayments,
    tableSplitPaymentMap,
    loadCartProducts,
    salesByUserName,
  } = props;

  const closeDrawer = () => {
    setCommonDrawer(false);
  };
  return (
    <>
      <Drawer.Root
        opened={commonDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
        bg={"gray.1"}
      >
        <Drawer.Overlay />
        <Drawer.Content style={{ overflow: "hidden" }}>
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
                color='var( --theme-remove-color)'
                size="md"
                onClick={closeDrawer}
                variant="outline"
              >
                <IconX style={{ width: "80%", height: "80%" }} stroke={1.5} />
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
                  currentSplitPayments={currentSplitPayments}
                  tableSplitPaymentMap={tableSplitPaymentMap}
                />
              )}

              {eventName === "additionalProductAdd" && (
                <__AdditionalItems
                  closeDrawer={closeDrawer}
                  getAdditionalItem={getAdditionalItem}
                />
              )}
              {eventName === "kitchen" && (
                <__KitchenPrint
                  salesByUserName={salesByUserName}
                  closeDrawer={closeDrawer}
                  tableId={tableId}
                  loadCartProducts={loadCartProducts}
                  setLoadCartProducts={setLoadCartProducts}
                  enableTable={enableTable}
                />
              )}
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
