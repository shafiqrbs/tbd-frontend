import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  rem,
  Grid,
  Box,
  ScrollArea,
  Text,
  Flex,
  Stack,
  ActionIcon,
  LoadingOverlay,
  Table,
  Title,
  Checkbox, Card,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconDeviceFloppy,
  IconX,
  IconSortAscendingNumbers,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";

import {
  setFetching,
  setFormLoading,
} from "../../../../store/core/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getSettingParticularDropdownData from "../../../global-hook/dropdown/getSettingParticularDropdownData.js";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import {
  deleteEntityData,
  getIndexEntityData as getIndexEntityDataForInventory,
  storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import { modals } from "@mantine/modals";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";

function _ProductMeasurement(props) {
  const { id } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 98; //TabList height 104

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [setFormData, setFormDataForUpdate] = useState(false);
  const [formLoad, setFormLoad] = useState(true);

  const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
  const formLoading = useSelector((state) => state.crudSlice.formLoading);
  const [measurementUnitData, setMeasurementUnitData] = useState(null);

  const form = useForm({
    initialValues: {
      product_id: id,
      unit_id: "",
      quantity: "",
    },
    validate: {
      product_id: isNotEmpty(),
      unit_id: isNotEmpty(),
      quantity: isNotEmpty(),
    },
  });

  /*product measurement data handle*/
  const [measurementData, setMeasurementData] = useState([]);
  const [reloadMeasurementData, setReloadMeasurementData] = useState(false);

  useEffect(() => {
    // Define an async function inside the effect
    const fetchData = async () => {
      const value = {
        url: "inventory/product/measurement/" + id,
        param: {
          test: 1,
        },
      };

      try {
        const resultAction = await dispatch(
          getIndexEntityDataForInventory(value)
        );

        // Handle rejected state
        if (getIndexEntityDataForInventory.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        }
        // Handle fulfilled state
        else if (getIndexEntityDataForInventory.fulfilled.match(resultAction)) {
          setMeasurementData(resultAction.payload.data);
        }
        setReloadMeasurementData(false);
      } catch (error) {
        console.error("Unexpected error in fetchData:", error);
      }
    };

    // Call the async function
    fetchData();
  }, [dispatch, id, reloadMeasurementData]);

  useEffect(() => {
    setFormLoad(true);
    setFormDataForUpdate(true);
  }, [dispatch, formLoading]);

  useEffect(() => {
    form.setValues({});
    dispatch(setFormLoading(false));
    setTimeout(() => {
      setFormLoad(false);
      setFormDataForUpdate(false);
    }, 500);
  }, [entityEditData, dispatch, setFormData]);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          !groupDrawer && document.getElementById("product_type_id").focus();
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
          !groupDrawer &&
            document.getElementById("ProductMeasurementFormSubmit").click();
        },
      ],
    ],
    []
  );

  const HandleSalesPurchaseUnitCheck = async (isChecked, unitId, type) => {
    const value = {
      url: `inventory/product/measurement/sales-purchase/${id}`,
      data: {
        check: isChecked,
        unit_id: unitId,
        type: type,
      },
    };

    const resultAction = await dispatch(storeEntityData(value));

    if (storeEntityData.rejected.match(resultAction)) {
      showNotificationComponent(resultAction.payload?.message || t("ErrorOccurred"), "red");
      setReloadMeasurementData(true);
    } else if (storeEntityData.fulfilled.match(resultAction)) {
      showNotificationComponent(t("Update"), "teal");
      setReloadMeasurementData(true);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        modals.openConfirmModal({
          title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
          children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
          labels: { confirm: t("Submit"), cancel: t("Cancel") },
          confirmProps: { color: "red" },
          onCancel: () => console.log("Cancel"),
          onConfirm: () => {
            const isUnitIdExists = measurementData.some(
              (unit) => unit.unit_id == values.unit_id
            );

            if (isUnitIdExists) {
              showNotificationComponent("Unit already exists", "red", "Data will be loaded in 3 seconds, you cannot close this yet", true, 1000, true);
              return;
            }

            form.values.product_id = id;
            const value = {
              url: "inventory/product/measurement",
              data: values,
            };
            dispatch(storeEntityData(value));

            setReloadMeasurementData(true);
            setMeasurementUnitData(null);
            form.reset();
            setSaveCreateLoading(true);

            showNotificationComponent(t("UpdateSuccessfully"), "teal", "Data will be loaded in 3 seconds, you cannot close this yet", true, 1000, true);

            setTimeout(() => {
              setReloadMeasurementData(true);
              setMeasurementUnitData(null);
              form.reset();
              dispatch(setFetching(true));
              setSaveCreateLoading(false);
            }, 500);
          },
        });
      })}
    >
      <Box >
        <Grid columns={32} gutter={{ base: 8 }}>
          <Grid.Col span={10}>
            <Box>
              <Box className={"boxBackground"} h={height-48}>
                <Box p={'xs'}>
                  <InputButtonForm
                      tooltip={t("EnterQuantity")}
                      label=""
                      placeholder={t("QTY")}
                      required={true}
                      nextField={"ProductMeasurementFormSubmit"}
                      form={form}
                      name={"quantity"}
                      id={"quantity"}
                      leftSection={
                        <IconSortAscendingNumbers size={16} opacity={0.5} />
                      }
                      rightSection={
                        entityEditData.unit_name
                            ? String(entityEditData.unit_name)
                            : ""
                      }
                      closeIcon={false}
                  />
                </Box>
                <Box p={'xs'}>
                  <SelectForm
                      tooltip={t("ChooseProductUnit")}
                      label=""
                      placeholder={t("ChooseProductUnit")}
                      required={true}
                      name={"unit_id"}
                      form={form}
                      dropdownValue={getSettingParticularDropdownData("product-unit")}
                      id={"unit_id"}
                      nextField={"quantity"}
                      searchable={true}
                      value={measurementUnitData}
                      changeValue={setMeasurementUnitData}
                  />
                </Box>
              </Box>
              <Box
                  p={`xs`}
                  className={"titleBackground"}
              >
                <>
                  {!saveCreateLoading && isOnline && (
                      <Button
                          size="md"
                          className={'btnPrimaryBg'}
                          type="submit"
                          fullWidth={'true'}
                          id="SkuManagementFormSubmit"
                          leftSection={<IconDeviceFloppy size={16} />}
                      >
                        <Flex direction={`column`} gap={0}>
                          <Text fz={18} fw={400}>
                            {t("AddMeasurement")}
                          </Text>
                        </Flex>
                      </Button>

                  )}
                </>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={22}>
            <Box className={"borderRadiusAll"}>
          <ScrollArea
            h={height}
            scrollbarSize={2}
            scrollbars="y"
            type="never"
          >
            <Box>
              <LoadingOverlay
                visible={formLoad}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
            </Box>
            <Box>
              <Table stickyHeader>
                <Table.Thead className={"boxBackground"}>
                  <Table.Tr>
                    <Table.Th fz="xs" w={"20"}>
                      {t("S/N")}
                    </Table.Th>
                    <Table.Th fz="xs" ta="center" w={"300"}>
                      {t("QTY")}
                    </Table.Th>
                    <Table.Th fz="xs" ta="left" w={"300"}>
                      {t("Unit")}
                    </Table.Th>
                    <Table.Th fz="xs" ta="left" w={"300"}>
                      {t("Sales")}
                    </Table.Th>
                    <Table.Th fz="xs" ta="left" w={"300"}>
                      {t("Purchase")}
                    </Table.Th>
                    <Table.Th ta="center" fz="xs" w={"80"}></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {measurementData.length > 0 ? (
                    measurementData.map((unit, index) => (
                      <Table.Tr key={unit.id}>
                        <Table.Th fz="xs" w={"20"}>
                          {index + 1}
                        </Table.Th>
                        <Table.Th fz="xs" ta="center" w={"300"}>
                          {unit.quantity + " " + entityEditData?.unit_name}
                        </Table.Th>
                        <Table.Th fz="xs" ta="left" w={"300"}>
                          {unit.unit_name}
                        </Table.Th>
                        <Table.Th fz="xs" ta="center" w={"60"}>
                          <Checkbox
                            id={`sales_${unit.id}`}
                            checked={unit.is_sales}
                            onChange={(e) => {
                              HandleSalesPurchaseUnitCheck(
                                e.currentTarget.checked,
                                unit.id,
                                "is_sales"
                              );
                            }}
                            color='var(--theme-primary-color-6)'
                            variant="outline"
                            radius="xl"
                            size="md"
                            label=""
                          />
                        </Table.Th>
                        <Table.Th fz="xs" ta="center" w={"60"}>
                          <Checkbox
                            id={`purchase_${unit.id}`}
                            checked={unit.is_purchase}
                            onChange={(e) => {
                              HandleSalesPurchaseUnitCheck(
                                e.currentTarget.checked,
                                unit.id,
                                "is_purchase"
                              );
                            }}
                            color='var(--theme-primary-color-6)'
                            variant="outline"
                            radius="xl"
                            size="md"
                            label=""
                          />
                        </Table.Th>
                        <Table.Th ta="right" fz="xs" w={"80"}>
                          <ActionIcon
                            size="sm"
                            variant="transparent"
                            color='var( --theme-remove-color)'
                            onClick={() => {
                              dispatch(
                                deleteEntityData(
                                  "inventory/product/measurement/" + unit.id
                                )
                              );
                              setReloadMeasurementData(true);
                            }}
                          >
                            <IconX height={"18"} width={"18"} stroke={1.5} />
                          </ActionIcon>
                        </Table.Th>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Th colSpan="4" fz="xs" ta="center">
                        {t("NoDataAvailable")}
                      </Table.Th>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Box>
          </ScrollArea>
        </Box>
          </Grid.Col>
        </Grid>
      </Box>

    </form>
  );
}

export default _ProductMeasurement;
