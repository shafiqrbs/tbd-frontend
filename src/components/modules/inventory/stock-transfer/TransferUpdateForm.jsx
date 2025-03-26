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
import {
  IconUsersGroup,
  IconDeviceFloppy,
  IconSortAscendingNumbers,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import useSettingParticularDropdownData from "../../../global-hook/dropdown/getSettingParticularDropdownData.js";

export default function TransferUpdateForm() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100;

  const entityEditData = useSelector((state) => state.crudSlice.entityEditData);

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const form = useForm({
    initialValues: {
      from_warehouse_id: entityEditData?.from_warehouse_id || "",
      toWarehouseId: entityEditData?.to_warehouse_id || "",
      stockItemId: entityEditData?.stock_item_id || "",
      quantity: entityEditData?.quantity || "",
      bonusQuantity: entityEditData?.bonus_quantity || "",
    },
    validate: {
      from_warehouse_id: isNotEmpty(),
    },
  });

  const [fromWarehouseId, setFromWarehouseId] = useState(null);
  const [toWarehouseId, setToWarehouseId] = useState(null);
  const [stockItemId, setStockItemId] = useState(null);
  const [stockItemDropdown, setStockItemDropdown] = useState([]);
  const warehouseOptions = useSettingParticularDropdownData("wearhouse");
  const [filteredFromWarehouseOptions, setFilteredFromWarehouseOptions] =
    useState([]);
  const [filteredToWarehouseOptions, setFilteredToWarehouseOptions] = useState(
    []
  );
  const warehouses = useSettingParticularDropdownData("wearhouse");

  useEffect(() => {
    setFilteredFromWarehouseOptions(warehouses);
    setFilteredToWarehouseOptions(warehouses);

    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

    const formattedProductData = localProducts.map((type) => ({
      label: type.product_name,
      value: String(type.id),
    }));
    setStockItemDropdown(formattedProductData);
  }, [warehouseOptions]);

  useEffect(() => {
    if (fromWarehouseId) {
      const filtered = warehouseOptions.filter(
        (option) => option.value !== fromWarehouseId
      );
      setFilteredToWarehouseOptions(filtered);

      if (toWarehouseId === fromWarehouseId) {
        setToWarehouseId(null);
        form.setFieldValue("to_warehouse_id", "");
      }
    } else {
      setFilteredToWarehouseOptions(warehouseOptions);
    }
  }, [fromWarehouseId, warehouseOptions]);

  useEffect(() => {
    if (toWarehouseId) {
      const filtered = warehouseOptions.filter(
        (option) => option.value !== toWarehouseId
      );
      setFilteredFromWarehouseOptions(filtered);

      if (fromWarehouseId === toWarehouseId) {
        setFromWarehouseId(null);
        form.setFieldValue("from_warehouse_id", "");
      }
    } else {
      setFilteredFromWarehouseOptions(warehouseOptions);
    }
  }, [toWarehouseId, warehouseOptions]);

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
                        {t("CreateTransferStock")}
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
                      <Box mt={"8"}>
                        <Grid
                          columns={12}
                          gutter={{ base: 6 }}
                          align="center"
                          justify="start"
                        >
                          <Grid.Col span={3} mt={8}>
                            <Text fw={400} fz={14}>
                              {t("FromWarehouse")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <SelectForm
                              label={t("")}
                              placeholder={t("FromWarehouse")}
                              required={false}
                              nextField={"to_warehouse_id"}
                              name={"from_warehouse_id"}
                              form={form}
                              dropdownValue={filteredFromWarehouseOptions}
                              mt={8}
                              id={"from_warehouse_id"}
                              searchable={false}
                              value={fromWarehouseId}
                              changeValue={setFromWarehouseId}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid
                          columns={12}
                          gutter={{ base: 6 }}
                          align="center"
                          justify="start"
                        >
                          <Grid.Col span={3} mt={8}>
                            <Text fw={400} fz={14}>
                              {t("ToWarehouse")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <SelectForm
                              tooltip={t("ToWarehouse")}
                              label={t("")}
                              placeholder={t("ToWarehouse")}
                              required={false}
                              nextField={"stock_item_id"}
                              name={"to_warehouse_id"}
                              form={form}
                              dropdownValue={filteredToWarehouseOptions}
                              mt={8}
                              id={"to_warehouse_id"}
                              searchable={false}
                              value={toWarehouseId}
                              changeValue={setToWarehouseId}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid
                          columns={12}
                          gutter={{ base: 6 }}
                          align="center"
                          justify="start"
                        >
                          <Grid.Col span={3} mt={8}>
                            <Text fw={400} fz={14}>
                              {t("StockItem")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <SelectForm
                              tooltip={t("StockItem")}
                              label={t("")}
                              placeholder={t("StockItem")}
                              required={false}
                              nextField={"quantity"}
                              name={"stock_item_id"}
                              form={form}
                              dropdownValue={stockItemDropdown}
                              mt={8}
                              id={"stock_item_id"}
                              searchable={false}
                              value={stockItemId}
                              changeValue={setStockItemId}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid
                          columns={12}
                          gutter={{ base: 6 }}
                          align="center"
                          justify="start"
                        >
                          <Grid.Col span={3} mt={8}>
                            <Text fw={400} fz={14}>
                              {t("Quantity")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <InputForm
                              tooltip={t("Quantity")}
                              label={t("")}
                              placeholder={t("Quantity")}
                              required={false}
                              nextField={"bonus_quantity"}
                              name={"quantity"}
                              form={form}
                              mt={8}
                              id={"quantity"}
                              type="number"
                              leftSection={
                                <IconSortAscendingNumbers
                                  size={16}
                                  opacity={0.5}
                                />
                              }
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"} mb={"xs"}>
                        <Grid
                          columns={12}
                          gutter={{ base: 6 }}
                          align="center"
                          justify="start"
                        >
                          <Grid.Col span={3} mt={8}>
                            <Text fw={400} fz={14}>
                              {t("BonusQuantity")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <InputForm
                              tooltip={t("BonusQuantity")}
                              label={t("")}
                              placeholder={t("BonusQuantity")}
                              required={false}
                              nextField={"EntityFormSubmit"}
                              name={"bonus_quantity"}
                              form={form}
                              mt={8}
                              id={"bonus_quantity"}
                              type="number"
                              leftSection={
                                <IconSortAscendingNumbers
                                  size={16}
                                  opacity={0.5}
                                />
                              }
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
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
