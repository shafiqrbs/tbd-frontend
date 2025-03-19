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
import { useState, useEffect } from "react";
import { useHotkeys } from "@mantine/hooks";
import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";

export default function ReconciliationForm() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100;

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const form = useForm({
    initialValues: {
      product_id: "",
      warehouse_id: "",
      mode_quantity_id: "",
      mode_quantity: "",
      mode_bonus_id: "",
      mode_bonus: "",
    },
    validate: {
      product_id: isNotEmpty(),
    },
  });

  const [productId, setProductId] = useState(null);
  const [warehouseId, setWarehouseId] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [modeQuantity, setModeQuantity] = useState(null);
  const [modeBonus, setModeBonus] = useState(null);

  const products = [
    { value: "1", label: "Product 1" },
    { value: "2", label: "Product 2" },
    { value: "3", label: "Product 3" },
  ];
  const mode = [
    { value: "1", label: "Plus" },
    { value: "2", label: "Minus" },
    { value: "3", label: "Damage" },
  ];
  useEffect(() => {
    if (productId === "1") {
      setWarehouses([
        { value: "warehouseM", label: "Warehouse M" },
        { value: "warehouseN", label: "Warehouse N" },
      ]);
    } else if (productId === "2") {
      setWarehouses([
        { value: "warehouseP", label: "Warehouse P" },
        { value: "warehouseQ", label: "Warehouse Q" },
      ]);
    } else if (productId === "3") {
      setWarehouses([
        { value: "warehouseR", label: "Warehouse R" },
        { value: "warehouseS", label: "Warehouse S" },
      ]);
    } else {
      setWarehouses([]);
    }
    setWarehouseId(null);
    form.setFieldValue("warehouse_id", "");
  }, [productId]);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("product_id").click();
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
                        {t("CreateStockReconciliation")}
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
                                {t("Product")}
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={9}>
                              <SelectForm
                                tooltip={t("Product")}
                                label={t("")}
                                placeholder={t("ChooseProduct")}
                                required={false}
                                nextField={"warehouse_id"}
                                name={"product_id"}
                                form={form}
                                dropdownValue={products}
                                mt={8}
                                id={"product_id"}
                                searchable={false}
                                value={productId}
                                changeValue={setProductId}
                              />
                            </Grid.Col>
                          </Grid>
                        </Box>
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
                              {t("Warehouse")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <SelectForm
                              tooltip={t("Warehouse")}
                              label={t("")}
                              placeholder={t("ChooseWarehouse")}
                              required={false}
                              nextField={"mode_quantity_id"}
                              name={"warehouse_id"}
                              form={form}
                              dropdownValue={warehouses}
                              mt={8}
                              id={"warehouse_id"}
                              searchable={false}
                              value={warehouseId}
                              changeValue={setWarehouseId}
                              disabled={!productId}
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
                              {t("QuantityMode")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <SelectForm
                              tooltip={t("ChooseQuantityMode")}
                              label={t("")}
                              placeholder={t("ChooseQuantityMode")}
                              required={false}
                              nextField={"mode_quantity"}
                              name={"mode_quantity_id"}
                              form={form}
                              dropdownValue={mode}
                              mt={8}
                              id={"mode_quantity_id"}
                              searchable={false}
                              value={modeQuantity}
                              changeValue={setModeQuantity}
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
                              {t("ModeQuantity")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <InputForm
                              tooltip={t("ModeQuantity")}
                              label={t("")}
                              placeholder={t("ModeQuantity")}
                              required={false}
                              nextField={"mode_bonus_id"}
                              name={"mode_quantity"}
                              form={form}
                              mt={8}
                              id={"mode_quantity"}
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
                              {t("BonusMode")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <SelectForm
                              tooltip={t("ChooseBonusMode")}
                              label={t("")}
                              placeholder={t("ChooseBonusMode")}
                              required={false}
                              nextField={"mode_bonus"}
                              name={"mode_bonus_id"}
                              form={form}
                              dropdownValue={mode}
                              mt={8}
                              id={"mode_bonus_id"}
                              searchable={false}
                              value={modeBonus}
                              changeValue={setModeBonus}
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
                              {t("ModeBonus")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <InputForm
                              tooltip={t("ModeBonus")}
                              label={t("")}
                              placeholder={t("ModeBonus")}
                              required={false}
                              nextField={"EntityFormSubmit"}
                              name={"mode_bonus"}
                              form={form}
                              mt={8}
                              id={"mode_bonus"}
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
                Name={"product_id"}
                inputType="select"
              />
            </Box>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
}
