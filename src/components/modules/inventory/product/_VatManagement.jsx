import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  rem,
  Grid,
  Box,
  ScrollArea,
  Group,
  Text,
  Title,
  Flex,
  Stack,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import {  useForm } from "@mantine/form";

import {
  setFormLoading,
} from "../../../../store/core/crudSlice.js";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import { modals } from "@mantine/modals";
import _UpdateProduct from "./_UpdateProduct.jsx";
import _ProductMeasurement from "./_ProductMeasurement.jsx";
import _ProductGallery from "./_ProductGallery.jsx";

function _VatManagement(props) {
  const { id } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight / 2 + 1; //TabList height 104
  const configData = localStorage.getItem("config-data")
    ? JSON.parse(localStorage.getItem("config-data"))
    : [];

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [setFormData, setFormDataForUpdate] = useState(false);
  const [formLoad, setFormLoad] = useState(true);

  const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
  const formLoading = useSelector((state) => state.crudSlice.formLoading);
  // Table input fields edit enable disable comes from config

  const [priceInput, setPriceInput] = useState(true);
  const [vatInput, setVatInput] = useState(true);
  const [attInput, setAttInput] = useState(true);

  // forms enable disable comes from config

  const [vat_integration, setVat_integration] = useState(true);

  // const [vat_integration, setVat_integration] = useState(
  //   !!(configData?.vat_integration === 1)
  // );

  const form = useForm({
    initialValues: {
      product_id: "",
      customs_duty: "asd",
      supplementary_duty: "",
      value_added_tax: "",
      advance_tax: "",
      advance_income_tax: "",
      recurring_deposit: "",
      advance_trade_vat: "",
      rebate: "",
      total_tax_incidence: "",
    },
    validate: {
      // customs_duty: isNotEmpty(),
      // supplementary_duty: isNotEmpty(),
      // value_added_tax: isNotEmpty(),
      // advance_tax: isNotEmpty(),
      // advance_income_tax: isNotEmpty(),
      // recurring_deposit: isNotEmpty(),
      // advance_trade_vat: isNotEmpty(),
      // rebate: isNotEmpty(),
      // total_tax_incidence: isNotEmpty(),
    },
  });

  useEffect(() => {
    setFormLoad(true);
    setFormDataForUpdate(true);
  }, [dispatch, formLoading]);
  //console.log(entityEditData);
  useEffect(() => {
    form.setValues({});

    dispatch(setFormLoading(false));
    setTimeout(() => {
      setFormLoad(false);
      setFormDataForUpdate(false);
    }, 500);
  }, [entityEditData, dispatch, setFormData]);

  // customs_duty: isNotEmpty(),
  // supplementary_duty: isNotEmpty(),
  // value_added_tax: isNotEmpty(),
  // advance_tax: isNotEmpty(),
  // advance_income_tax: isNotEmpty(),
  // recurring_deposit: isNotEmpty(),
  // advance_trade_vat: isNotEmpty(),
  // rebate: isNotEmpty(),
  // total_tax_incidence: isNotEmpty(),

  const data = [
    {
      id : 1,
      name: "Customs Duty",
      field_name: "customs_duty",
      field_value: "customs_duty",
    },
    {
      id : 2,
      name: "SupplementaryDuty",
      field_name: "supplementary_duty",
      field_value: "customs_duty",
    },
    {
      id : 3,
      name: "ValueAddedTax",
      field_name: "value_added_tax",
      field_value: "customs_duty",
    },
    {
      id : 4,
      name: "AdvanceTax",
      field_name: "advance_tax",
      field_value: "customs_duty",
    },
    {
      id : 5,
      name: "AdvanceIncomeTax",
      field_name: "advance_income_tax",
      field_value: "customs_duty",
    },

  ];

  return (
    <Box>
      <form
        onSubmit={form.onSubmit((values) => {
          form.values.product_id = id;
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
        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
          <Box
            pl={`xs`}
            pb={"6"}
            pr={8}
            pt={"6"}
            mb={"4"}
            className={"boxBackground borderRadiusAll"}
          >
            <Grid>
              <Grid.Col span={12}>
                <Title order={6} pt={"6"}>
                  {t("VatManagement")}
                </Title>
              </Grid.Col>
            </Grid>
          </Box>
          <Box className={"borderRadiusAll"}>
            <ScrollArea scrollbars="y" type="never">
              <Box>
                <LoadingOverlay
                  visible={formLoad}
                  zIndex={1000}
                  overlayProps={{ radius: "sm", blur: 2 }}
                />
              </Box>
              <Box>
                <form>
                  <>
                    <Box
                      pl={8}
                      pr={8}
                      pt={"4"}
                      pb={2}
                      className={"boxBackground  border-bottom-none"}
                    >
                      {/* not sure about the language file naming for hs */}
                      <Grid columns={12}>
                        <Grid.Col span={12}>
                          <SelectForm
                            tooltip={t("ChooseHS")}
                            placeholder={t("ChooseHS")}
                            // required={true}
                            name={"hs_id"}
                            form={form}
                            dropdownValue={""}
                            mt={0}
                            id={"color"}
                            nextField={""}
                            searchable={true}
                            value={""}
                            changeValue={""}
                          />
                        </Grid.Col>
                      </Grid>
                    </Box>
                  </>
                </form>

                <Box className={"border-top-none"}>
                  <DataTable
                    classNames={{
                      root: tableCss.root,
                      table: tableCss.table,
                      header: tableCss.header,
                      footer: tableCss.footer,
                      pagination: tableCss.pagination,
                    }}
                    records={data}
                    columns={[

                      {
                        accessor: "name",
                        title: t("Name"),
                        width: 100,
                      },
                      {
                        accessor: "percent",
                        title: t("Percent(%)"),
                        textAlign: "center",
                        width: "40px",
                        render: (item) => {
                          const [edited_customs, setEdited_customs] = useState(
                            item.customs_duty
                          );
                          const handleCustomsChange = (e) => {
                            const edited_customs = e.currentTarget.value;
                            setEdited_customs(edited_customs);
                            console.log(edited_customs);
                          };

                          return priceInput ? (
                            <>
                              <TextInput
                                type="number"
                                label=""
                                size="xs"
                                name={item.field_name}
                                id={item.field_name}
                                value={item.customs_duty}
                                onChange={handleCustomsChange}
                              />
                            </>
                          ) : (
                            1000
                          );
                        },
                      },
                    ]}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height - 160}
                    scrollAreaProps={{ type: "never" }}
                  />
                </Box>
              </Box>
              <Box
                pl={`xs`}
                pb={"6"}
                pr={8}
                pt={"6"}
                className={
                  "boxBackground borderRadiusAll border-left-none border-right-none border-bottom-none"
                }
              >
                <Group justify="flex-end">
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
                              {t("Add")}
                            </Text>
                          </Flex>
                        </Button>
                      )}
                    </>
                  </Stack>
                </Group>
              </Box>
            </ScrollArea>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default _VatManagement;
