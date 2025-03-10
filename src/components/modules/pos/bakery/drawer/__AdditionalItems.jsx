import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  rem,
  Flex,
  Grid,
  Box,
  ScrollArea,
  Text,
  Title,
  Stack,
  Group,
  ActionIcon,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconCheck,
  IconDeviceFloppy,
  IconRefreshDot,
  IconUserCircle,
  IconX,
  IconXboxX,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import tableCss from "../../../../../assets/css/Table.module.css";
import { DataTable } from "mantine-datatable";
import { hasLength, useForm } from "@mantine/form";
import getConfigData from "../../../../global-hook/config-data/getConfigData.js";
import { IconMinus, IconPlus } from "@tabler/icons-react";

export default function __AdditionalItems(props) {
  const { closeDrawer, getAdditionalItem } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100; //TabList height 104
  const configData = getConfigData();

  const additionalItemsForm = useForm({});
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [indexData, setIndexData] = useState({
    data: [
      { id: 1, display_name: "Special Sweet Toast 1", sales_price: 10.0, qty: 2 },
      { id: 2, display_name: "ItSpecial Sweet Toastem 2", sales_price: 15.5, qty: 1 },
      { id: 3, display_name: "Special Sweet Toast 3", sales_price: 7.25, qty: 5 },
      { id: 4, display_name: "ItSpecial Sweet Toastem 4", sales_price: 20.0, qty: 3 },
    ],
    total: 4,
  });
  const handleIncrement = (id) => {
    setIndexData((prev) => ({
      ...prev,
      data: prev.data.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      ),
    }));
  };

  const handleDecrement = (id) => {
    setIndexData((prev) => ({
      ...prev,
      data: prev.data.map((item) =>
        item.id === id && item.qty > 0 ? { ...item, qty: item.qty - 1 } : item
      ),
    }));
  };

  return (
    <form
      onSubmit={additionalItemsForm.onSubmit((values) => {
        getAdditionalItem(indexData.data);
      })}
    >
      <Box mb={0}>
        <Grid columns={9} gutter={{ base: 6 }}>
          <Grid.Col span={9}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"4"}
                pb={"6"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid columns={12}>
                  <Grid.Col span={6}>
                    <Title order={6} pt={"6"}>
                      {t("AdditionalItems")}
                    </Title>
                  </Grid.Col>
                  <Grid.Col span={2} p={0}></Grid.Col>
                  <Grid.Col span={4}></Grid.Col>
                </Grid>
              </Box>
              <ScrollArea
                h={height + 18}
                scrollbarSize={2}
                scrollbars="y"
                type="never"
              >
                <Box className="borderRadiusAll">
                  <DataTable
                    classNames={{
                      root: tableCss.root,
                      table: tableCss.table,
                      header: tableCss.header,
                      footer: tableCss.footer,
                      pagination: tableCss.pagination,
                    }}
                    records={indexData.data}
                    columns={[
                      {
                        accessor: "id",
                        title: "S/N",
                        render: (data, index) => index + 1,
                      },
                      {
                        accessor: "display_name",
                        title: t("Product"),
                      },
                      {
                        accessor: "sales_price",
                        title: t("Price"),
                        textAlign: "center",
                        render: (data) => (
                          <>
                            {configData?.currency?.symbol} {data.sales_price}
                          </>
                        ),
                      },
                      {
                        accessor: "qty",
                        title: t("Qty"),
                        textAlign: "center",
                        backgroundColor: "blue",
                        render: (data) => (
                          <Group gap={8} justify="center" align="center">
                            <ActionIcon
                              size={"sm"}
                              bg={"gray.7"}
                              onClick={() => handleDecrement(data.id)}
                            >
                              <IconMinus height={"12"} width={"12"} />
                            </ActionIcon>
                            <Text
                              size="sm"
                              ta={"center"}
                              fw={600}
                              maw={30}
                              miw={30}
                            >
                              {data.qty}
                            </Text>
                            <ActionIcon
                              size={"sm"}
                              bg={"gray.7"}
                              onClick={() => handleIncrement(data.id)}
                            >
                              <IconPlus height={"12"} width={"12"} />
                            </ActionIcon>
                          </Group>
                        ),
                      },
                    ]}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height - 330}
                    // backgroundColor={"black"}
                    scrollAreaProps={{ type: "never" }}
                  />
                </Box>
                <Box>
                  <Box
                    pl={`xs`}
                    pr={8}
                    pt={"4"}
                    pb={"6"}
                    mb={"4"}
                    mt={4}
                    className={"boxBackground borderRadiusAll"}
                  >
                    <Grid columns={12}>
                      <Grid.Col span={6}>
                        <Title order={6} pt={"6"}>
                          {t("Attributes")}
                        </Title>
                      </Grid.Col>
                      <Grid.Col span={2} p={0}></Grid.Col>
                      <Grid.Col span={4}></Grid.Col>
                    </Grid>
                  </Box>
                  <Box className="borderRadiusAll" h={299}></Box>
                </Box>
              </ScrollArea>
              <Box
                pl={`xs`}
                pr={8}
                pt={"6"}
                pb={"6"}
                mb={"2"}
                mt={4}
                className={"boxBackground borderRadiusAll"}
              >
                <Group justify="space-between">
                  <Flex
                    gap="md"
                    justify="center"
                    align="center"
                    direction="row"
                    wrap="wrap"
                  >
                    <ActionIcon
                      variant="transparent"
                      size="sm"
                      color="red.6"
                      onClick={closeDrawer}
                      ml={"4"}
                    >
                      <IconX
                        style={{ width: "100%", height: "100%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Flex>

                  <Group gap={8}>
                    <Flex justify="flex-end" align="center" h="100%">
                      <Button
                        variant="transparent"
                        size="xs"
                        color="red.4"
                        type="reset"
                        id=""
                        p={0}
                        onClick={() => {
                          additionalItemsForm.reset();
                        }}
                        rightSection={
                          <IconRefreshDot
                            style={{ width: "100%", height: "60%" }}
                            stroke={1.5}
                          />
                        }
                      ></Button>
                    </Flex>
                    <Stack align="flex-start">
                      <>
                        {!saveCreateLoading && isOnline && (
                          <Button
                            disabled={disabled}
                            size="xs"
                            color={`green.8`}
                            type="submit"
                            id={"EntitySplitFormSubmit"}
                            leftSection={<IconDeviceFloppy size={16} />}
                          >
                            <Flex direction={`column`} gap={0}>
                              <Text fz={14} fw={400}>
                                {t("Save")}
                              </Text>
                            </Flex>
                          </Button>
                        )}
                      </>
                    </Stack>
                  </Group>
                </Group>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </form>
  );
}
