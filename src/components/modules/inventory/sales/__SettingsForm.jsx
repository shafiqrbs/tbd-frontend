import React, { useEffect, useState } from "react";
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
  Radio,
  Center,
  Checkbox,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut";
import {
  setValidationData,
  showInstantEntityData,
  updateEntityData,
} from "../../../../store/inventory/crudSlice.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";

function __SettingsForm(props) {
  const { module, setSettingDrawer } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100; //TabList height 104
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const [formLoad, setFormLoad] = useState(true);
  const [setFormData, setFormDataForUpdate] = useState(false);

  const inventoryConfigData = localStorage.getItem("config-data")
    ? JSON.parse(localStorage.getItem("config-data"))
    : [];

  // console.log(inventoryConfigData)
  const form = useForm({
    initialValues: {
      is_brand: inventoryConfigData.is_brand || "",
      is_grade: inventoryConfigData.is_grade || "",
      is_color: inventoryConfigData.is_color || "",
      is_size: inventoryConfigData.is_size || "",
      is_model: inventoryConfigData.is_model || "",
      is_measurement: inventoryConfigData.is_measurement || "",
      is_product_gallery: inventoryConfigData.is_product_gallery || "",
      is_multi_price: inventoryConfigData.is_multi_price || "",
      zero_stock: inventoryConfigData.zero_stock || "",
      stock_item: inventoryConfigData.stock_item || "",
      is_stock_history: inventoryConfigData.is_stock_history || "",
      mrp_price: inventoryConfigData.mrp_price || "",
      total_price: inventoryConfigData.total_price || "",
      purchase_price: inventoryConfigData.purchase_price || "",
      is_batch_invoice: inventoryConfigData.is_batch_invoice || "",
      is_provision: inventoryConfigData.is_provision || "",
      is_sku: inventoryConfigData.is_sku || "",
      raw_materials: inventoryConfigData.raw_materials || "",
      stockable: inventoryConfigData.stockable || "",
      post_production: inventoryConfigData.post_production || "",
      mid_production: inventoryConfigData.mid_production || "",
      pre_production: inventoryConfigData.pre_production || "",
      pos_sales: inventoryConfigData.pos_sales || "",
      with_table: inventoryConfigData.with_table || "",
      pay_first: inventoryConfigData.pay_first || "",
      is_barcode_productName: inventoryConfigData.is_barcode_productName || "",
      is_barcode_sku: inventoryConfigData.is_barcode_sku || "",
      is_barcode_companyName: inventoryConfigData.is_barcode_companyName || "",
      is_barcode_price: inventoryConfigData.is_barcode_price || "",
    },
  });

  useEffect(() => {
    setFormLoad(true);
    setFormDataForUpdate(true);
  }, [dispatch]);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("is_brand").click();
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

  const handleFormSubmit = (values) => {
    // Dispatch to set validation state (if needed)
    dispatch(setValidationData(false));

    // Open confirmation modal
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => {
        console.log("Cancel");
      },
      onConfirm: () => handleConfirmSubmit(values), // Separate function for "onConfirm"
    });
  };

  const handleConfirmSubmit = async (values) => {
    const properties = [
      "is_brand",
      "is_grade",
      "is_color",
      "is_size",
      "is_model",
      "is_measurement",
      "is_product_gallery",
      "is_multi_price",
      "zero_stock",
      "stock_item",
      "is_stock_history",
      "mrp_price",
      "total_price",
      "purchase_price",
      "is_batch_invoice",
      "is_provision",
      "raw_materials",
      "stockable",
      "post_production",
      "mid_production",
      "pre_production",
      "is_sku",
      "pos_sales",
      "with_table",
      "pay_first",
      "is_barcode_productName",
      "is_barcode_sku",
      "is_barcode_companyName",
      "is_barcode_price",
    ];

    properties.forEach((property) => {
      form.values[property] =
        values[property] === true || values[property] == 1 ? 1 : 0;
    });
    try {
      const value = {
        url: `inventory/config-update/${inventoryConfigData.domain_id}`,
        data: values,
      };
      // Dispatch action
      await dispatch(updateEntityData(value));

      const resultAction = await dispatch(
        showInstantEntityData("inventory/config")
      );
      if (showInstantEntityData.fulfilled.match(resultAction)) {
        if (resultAction.payload.data.status === 200) {
          localStorage.setItem(
            "config-data",
            JSON.stringify(resultAction.payload.data.data)
          );
        }
      }

      // Show success notification
      notifications.show({
        color: "teal",
        title: t("UpdateSuccessfully"),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });

      // Reset loading state
      setTimeout(() => {
        setSettingDrawer(false);
        setSaveCreateLoading(false);
      }, 700);
    } catch (error) {
      console.error("Error updating entity:", error);

      // Error notification
      notifications.show({
        color: "red",
        title: t("UpdateFailed"),
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });
    }
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        {module === "sales" && (
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"} mb={"8"}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"8"}
                pb={"10"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid>
                  <Grid.Col span={6}>
                    <Title order={6} pt={"4"}>
                      {t("Sales")}
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
                                {t("UpdateAndSave")}
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
                  h={height + 40}
                  scrollbarSize={2}
                  scrollbars="y"
                  type="never"
                >
                  <Box pt={"xs"} pl={"xs"}>
                    <Box mt={"xs"}>
                      <Grid gutter={{ base: 1 }}>
                        <Grid.Col span={2}>
                          <SwitchForm
                            tooltip={t("ZeroStockAllowed")}
                            label=""
                            nextField={"stock_item"}
                            name={"zero_stock"}
                            form={form}
                            color="red"
                            id={"zero_stock"}
                            position={"left"}
                            defaultChecked={inventoryConfigData.zero_stock}
                          />
                        </Grid.Col>
                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                          {t("ZeroStockAllowed")}
                        </Grid.Col>
                      </Grid>
                    </Box>
                    <Box mt={"xs"}>
                      <Grid gutter={{ base: 1 }}>
                        <Grid.Col span={2}>
                          <SwitchForm
                            tooltip={t("StockItem")}
                            label=""
                            nextField={"is_stock_history"}
                            name={"stock_item"}
                            form={form}
                            color="red"
                            id={"stock_item"}
                            position={"left"}
                            defaultChecked={inventoryConfigData.stock_item}
                          />
                        </Grid.Col>
                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                          {t("StockItem")}
                        </Grid.Col>
                      </Grid>
                    </Box>
                    <Box mt={"xs"}>
                      <Grid gutter={{ base: 1 }}>
                        <Grid.Col span={2}>
                          <SwitchForm
                            tooltip={t("StockHistory")}
                            label=""
                            nextField={"pos_sales"}
                            name={"is_stock_history"}
                            form={form}
                            color="red"
                            id={"is_stock_history"}
                            position={"left"}
                            defaultChecked={
                              inventoryConfigData.is_stock_history
                            }
                          />
                        </Grid.Col>
                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                          {t("StockHistory")}
                        </Grid.Col>
                      </Grid>
                    </Box>
                    <Box mt={"xs"}>
                      <Grid gutter={{ base: 1 }}>
                        <Grid.Col span={2}>
                          <SwitchForm
                            tooltip={t("PosSales")}
                            label=""
                            nextField="pay_first"
                            name={"pos_sales"}
                            form={form}
                            color="red"
                            id={"pos_sales"}
                            position={"left"}
                            defaultChecked={inventoryConfigData.pos_sales}
                          />
                        </Grid.Col>
                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                          {t("PosSales")}
                        </Grid.Col>
                      </Grid>
                    </Box>
                    <Box mt={"xs"}>
                      <Grid gutter={{ base: 1 }}>
                        <Grid.Col span={2}>
                          <SwitchForm
                            tooltip={t("PayFirst")}
                            label=""
                            nextField={"mrp_price"}
                            name={"pay_first"}
                            form={form}
                            color="red"
                            id={"pay_first"}
                            position={"left"}
                            defaultChecked={inventoryConfigData.pos_sales}
                          />
                        </Grid.Col>
                        <Grid.Col span={6} fz={"sm"} pt={"1"}>
                          {t("PayFirst")}
                        </Grid.Col>
                      </Grid>
                    </Box>
                    {inventoryConfigData?.pos_sales && (
                      <Box mt={"sm"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={6}>
                            <Grid>
                              <Grid.Col span={2}>
                                <Checkbox
                                  {...form.getInputProps("with_table", {
                                    type: "checkbox",
                                  })}
                                  checked={form.values.with_table === 1}
                                  onChange={(event) =>
                                    form.setFieldValue(
                                      "with_table",
                                      event.currentTarget.checked ? 1 : 0
                                    )
                                  }
                                  ml="sm"
                                  color="red"
                                />
                              </Grid.Col>
                              <Grid.Col span={6} fz={"sm"}>
                                <Center ml={"sm"} pl={"md"}>
                                  {t("WithTable")}
                                </Center>
                              </Grid.Col>
                            </Grid>
                          </Grid.Col>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </ScrollArea>
              </Box>
            </Box>
          </Box>
        )}
        {module === "purchase" && (
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"8"}
                pb={"10"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid>
                  <Grid.Col span={6}>
                    <Title order={6} pt={"4"}>
                      {t("Purchase")}
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
                                {t("UpdateAndSave")}
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
                  h={height + 40}
                  scrollbarSize={2}
                  scrollbars="y"
                  type="never"
                >
                  <Box pl={"xs"} pt={"xs"}>
                    <Box mt={"xs"}>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={2}>
                            <SwitchForm
                              tooltip={t("MrpPrice")}
                              label=""
                              nextField={"total_price"}
                              name={"mrp_price"}
                              form={form}
                              color="red"
                              id={"mrp_price"}
                              position={"left"}
                              defaultChecked={inventoryConfigData.mrp_price}
                            />
                          </Grid.Col>
                          <Grid.Col span={6} fz={"sm"} pt={"1"}>
                            {t("MrpPrice")}
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={2}>
                            <SwitchForm
                              tooltip={t("TotalPrice")}
                              label=""
                              nextField={"purchase_price"}
                              name={"total_price"}
                              form={form}
                              color="red"
                              id={"total_price"}
                              position={"left"}
                              defaultChecked={inventoryConfigData.total_price}
                            />
                          </Grid.Col>
                          <Grid.Col span={6} fz={"sm"} pt={"1"}>
                            {t("TotalPrice")}
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={2}>
                            <SwitchForm
                              tooltip={t("PurchasePrice")}
                              label=""
                              nextField={"is_measurement"}
                              name={"purchase_price"}
                              form={form}
                              color="red"
                              id={"purchase_price"}
                              position={"left"}
                              defaultChecked={
                                inventoryConfigData.purchase_price
                              }
                            />
                          </Grid.Col>
                          <Grid.Col span={6} fz={"sm"} pt={"1"}>
                            {t("PurchasePrice")}
                          </Grid.Col>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                </ScrollArea>
              </Box>
            </Box>
          </Box>
        )}
      </form>
    </Box>
  );
}

export default __SettingsForm;
