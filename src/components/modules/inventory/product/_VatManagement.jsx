import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
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
  ActionIcon,
  LoadingOverlay,
  Menu,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconCheck,
  IconDeviceFloppy,
  IconDotsVertical,
  IconTrashX,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import {
  setFetching,
  setFormLoading,
  setInsertType,
} from "../../../../store/core/crudSlice.js";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import {
  deleteEntityData,
  getIndexEntityData as getIndexEntityDataForInventory,
  storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import { modals } from "@mantine/modals";
import _UpdateProduct from "./_UpdateProduct.jsx";
import _ProductMeasurement from "./_ProductMeasurement.jsx";
import _ProductGallery from "./_ProductGallery.jsx";

function _VatManagement(props) {
  const { id } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight / 2; //TabList height 104
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

  const data = [
    {
      name: "Foysal Mahmud hasan Rafi Babul",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
    },
    {
      name: "shoe",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
    },
    {
      name: "shoe",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
    },
    {
      name: "shoe",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
    },
    {
      name: "shoe",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
    },
    {
      name: "shoe",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
    },
    {
      name: "shoe",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
    },
    {
      name: "shoe",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
    },
    {
      name: "shoe",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
    },
    {
      name: "shoe",
      color: "red",
      size: "xl",
      stock: "100",
      brand: "Apex",
      title: "title",
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
              <Grid.Col span={6}>
                <Title order={6} pt={"6"}>
                  {t("VatManagement")}
                </Title>
              </Grid.Col>
              <Grid.Col span={6}></Grid.Col>
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
                      pl={4}
                      pr={4}
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
                        accessor: "index",
                        title: t("S/N"),
                        textAlignment: "right   ",
                        render: (item) => data.indexOf(item) + 1,
                        width: 50,
                      },
                      {
                        accessor: "name",
                        title: t("Name"),
                        width: 100,
                      },
                      {
                        accessor: "customs_duty",
                        title: t("CustomsDuty"),
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
                                value={edited_customs}
                                onChange={handleCustomsChange}
                                // onKeyDown={getHotkeyHandler([
                                //     ['Enter', (e) => {
                                //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                                //     }],
                                // ])}
                              />
                            </>
                          ) : (
                            1000
                          );
                        },
                      },
                      {
                        accessor: "supplementary_duty",
                        title: t("SupplementaryDuty"),
                        textAlign: "center",
                        width: "60px",
                        render: (item) => {
                          const [supplementary_duty, setSupplementary_duty] =
                            useState(item.supplementary_duty);

                          const handleSupplementaryChange = (e) => {
                            const supplementary_duty = e.currentTarget.value;
                            setSupplementary_duty(supplementary_duty);
                            console.log(supplementary_duty);
                          };

                          return priceInput ? (
                            <>
                              <TextInput
                                type="number"
                                label=""
                                size="xs"
                                value={supplementary_duty}
                                onChange={handleSupplementaryChange}
                                // onKeyDown={getHotkeyHandler([
                                //     ['Enter', (e) => {
                                //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                                //     }],
                                // ])}
                              />
                            </>
                          ) : (
                            1000
                          );
                        },
                      },
                      {
                        accessor: "price",
                        title: t("Price"),
                        textAlign: "center",
                        render: (item) => {
                          const [editedPrice, setEditedPrice] = useState(
                            item.price
                          );

                          const handlPriceChange = (e) => {
                            const editedPrice = e.currentTarget.value;
                            setEditedPrice(editedPrice);
                            console.log(editedPrice);
                          };

                          return priceInput ? (
                            <>
                              <TextInput
                                type="number"
                                label=""
                                size="xs"
                                value={editedPrice}
                                onChange={handlPriceChange}
                                // onKeyDown={getHotkeyHandler([
                                //     ['Enter', (e) => {
                                //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                                //     }],
                                // ])}
                              />
                            </>
                          ) : (
                            1000
                          );
                        },
                      },
                      // more in form. havent added all .
                    ]}
                    // fetching={fetching}
                    // totalRecords={indexData.total}
                    // recordsPerPage={perPage}
                    // page={page}
                    // onPageChange={(p) => {
                    //     setPage(p)
                    //     dispatch(setFetching(true))
                    // }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height - 154}
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
