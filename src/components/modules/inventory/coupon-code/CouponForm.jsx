import {
  ActionIcon,
  Tooltip,
  Grid,
  Box,
  Title,
  Stack,
  Button,
  Flex,
  ScrollArea,
  Text,
} from "@mantine/core";
import SelectForm from "../../../form-builders/SelectForm";
import { IconUsersGroup, IconDeviceFloppy } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";

export default function CouponForm() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100;

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const form = useForm({
    initialValues: {
      from_warehouse_id: "",
      to_warehouse_id: "",
      stock_item_id: "",
      quantity: "",
      bonus_quantity: "",
    },
    validate: {
      from_warehouse_id: isNotEmpty(),
    },
  });
  const warehouse = [
    { label: "Warehouse 1", value: "1" },
    { label: "Warehouse 2", value: "2" },
    { label: "Warehouse 3", value: "3" },
  ];
  const stockItem = [
    { label: "Stock Item 1", value: "1" },
    { label: "Stock Item 2", value: "2" },
    { label: "Stock Item 3", value: "3" },
  ];
  const [fromWarehouseId, setFromWarehouseId] = useState(null);
  const [toWarehouseId, setToWarehouseId] = useState(null);
  const [stockItemId, setStockItemId] = useState(null);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("from_warehouse_id").click();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+r",
        () => {
          form.reset();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("EntityFormSubmit").click();
        },
      ],
    ],
    []
  );
  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          modals.openConfirmModal({
            title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
            labels: { confirm: t("Submit"), cancel: t("Cancel") },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Cancel"),
            onConfirm: () => {
              console.log(values);
            },
          });
        })}
      >
        <Grid columns={9} gutter={{ base: 8 }}>
          <Grid.Col span={8}>
            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
              <Box bg={"white"}>
                <Box
                  pl={`xs`}
                  pr={8}
                  pt={"6"}
                  pb={"6"}
                  mb={"4"}
                  className={"boxBackground borderRadiusAll"}
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <Title order={6} pt={"6"}>
                        {t("CreateCouponCode")}
                      </Title>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack right align="flex-end">
                        <>
                          {!saveCreateLoading && isOnline && (
                            <Button
                              size="xs"
                              color={`green.8`}
                              type="submit"
                              id="EntityFormSubmit"
                              leftSection={<IconDeviceFloppy size={16} />}
                            >
                              <Flex direction={`column`} gap={0}>
                                <Text fz={14} fw={400}>
                                  {" "}
                                  {t("CreateAndSave")}
                                </Text>
                              </Flex>
                            </Button>
                          )}
                        </>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Box>
                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                  <ScrollArea
                    h={height}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                  >
                    <Box>
                      <Box mt={"8"}></Box>
                      <Box mt={"xs"}></Box>
                      <Box mt={"xs"}></Box>
                      <Box mt={"xs"} mb={"xs"}></Box>
                    </Box>
                  </ScrollArea>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={1}>
            <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
              <Shortcut
                form={form}
                FormSubmit={"EntityFormSubmit"}
                Name={"from_warehouse_id"}
                inputType="select"
              />
            </Box>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
}
