import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Group,
  ActionIcon,
  Text,
  Badge,
  Flex,
  Center,
  ScrollArea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { useScroll } from "./bakery/utils/ScrollOperations";

function HeaderNavbar(props) {
  const { tables, tableId, setTableId, tableCustomerMap, setCustomerObject } =
    props;
  const { t, i18n } = useTranslation();

  const clicked = (id) => {
    if (tableId === id) {
      setTableId(null);
      setCustomerObject({});
    } else {
      setTableId(id);
      if (tableCustomerMap && tableCustomerMap[id]) {
        setCustomerObject(tableCustomerMap[id]);
      } else {
        setCustomerObject({});
      }
    }
  };
  const { scrollRef, showLeftArrow, showRightArrow, handleScroll, scroll } =
    useScroll();

  return (
    <>
      <Box style={{ position: "relative" }}>
        <ScrollArea
          type="never"
          mt={"4"}
          pl={"sm"}
          pr={"sm"}
          viewportRef={scrollRef}
          onScrollPositionChange={handleScroll}
        >
          <Group justify="flex-start" align="flex-start" gap="xs" wrap="nowrap">
            {tables.map((table) => (
              <Box
                onClick={() => {
                  clicked(table.id);
                }}
                key={table.id}
                style={{
                  position: "relative",
                  width: "140px",
                  cursor: "pointer",
                }}
              >
                <Badge
                  mt={"14"}
                  size="xs"
                  w={104}
                  h={22}
                  color="green.8"
                  style={{
                    position: "absolute",
                    top: "-14px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "100px",
                  }}
                >
                  <Text c={"FFFFFF"} fw={600} fz={"sm"}>
                    {table.status}
                  </Text>
                </Badge>
                <Flex
                  bg={table.id === tableId ? "gray.8" : "white"}
                  mt={"9"}
                  direction="column"
                  align="center"
                  justify="center"
                  style={{
                    height: "100px",
                    width: "140px",
                    borderRadius: "8px",
                    border: "1px solid #BFC5C8",
                  }}
                >
                  <Center>
                    <Text
                      mt={"-20"}
                      fz="md"
                      fw={900}
                      c={table.id === tableId ? "white" : "black"}
                    >
                      Table - {table.id}
                    </Text>
                  </Center>
                  <Flex
                    gap={0}
                    h={24}
                    w={92}
                    justify={"center"}
                    align={"center"}
                    bg={table.id === tableId ? "white" : "green.0"}
                    style={{
                      borderRadius: "1px",
                    }}
                  >
                    {table.status !== "Free" ? (
                      <Text fz="sm" fw={400}>
                        {table.elapsedTime}
                      </Text>
                    ) : (
                      <Text fz="sm" fw={400} c={"black"}>
                        {table.time}
                      </Text>
                    )}
                  </Flex>
                  <Center>
                    <Text mt={8} mb={-28} fz="sm" fw={800} c={"red.6"}>
                      {tableCustomerMap && tableCustomerMap[table.id]
                        ? tableCustomerMap[table.id].mobile ||
                          tableCustomerMap[table.id].name
                        : ""}
                    </Text>
                  </Center>
                </Flex>
              </Box>
            ))}
          </Group>
        </ScrollArea>
        {showLeftArrow && (
          <ActionIcon
            variant="filled"
            color="gray"
            radius="xl"
            size="lg"
            h={48}
            w={48}
            style={{
              position: "absolute",
              left: 5,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() => scroll("left")}
          >
            <IconChevronLeft size={26} />
          </ActionIcon>
        )}
        {showRightArrow && (
          <ActionIcon
            variant="filled"
            color="gray"
            radius="xl"
            size="lg"
            h={48}
            w={48}
            style={{
              position: "absolute",
              right: 5,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() => scroll("right")}
          >
            <IconChevronRight size={26} />
          </ActionIcon>
        )}
      </Box>
    </>
  );
}

export default HeaderNavbar;
