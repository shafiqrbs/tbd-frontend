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
import _VatManagement from "./_VatManagement.jsx";

function _SkuManagement(props) {
  const { id, is_brand, is_color, is_grade, is_size } = props;
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

  const [loadSku, setLoadSku] = useState(true);

  // const [loadSku, setLoadSku] = useState(
  //   !!(configData?.vat_integration === 1)
  // );

  const form = useForm({
    initialValues: {
      product_id: "",
      color: "",
      brand: "",
      size: "",
      grade_id: "",
    },
    validate: {
      color: isNotEmpty(),
      brand: isNotEmpty(),
      size: isNotEmpty(),
      grade_id: isNotEmpty(),
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
  const brand = ["apex", "bata", "pegasus"];
  const color = ["black", "white", "yellow"];
  const size = ["small", "medium", "large"];
  const title = ["title1", "title2", "title3"];

  const [brandData, setBrandData] = useState(null);
  const [colorData, setColorData] = useState(null);
  const [sizeData, setSizeData] = useState(null);
  const [titleData, setTitleData] = useState(null);

  return (
    <Box>
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
                {t("SKUItem")}
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
              <form
                onSubmit={form.onSubmit((values) => {
                  form.values.product_id = id;
                  modals.openConfirmModal({
                    title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                    children: (
                      <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: t("Submit"), cancel: t("Cancel") },
                    confirmProps: { color: "red" },
                    onCancel: () => console.log("Cancel"),
                    onConfirm: () => {
                      console.log(values);
                    },
                  });
                })}
              >
                <>
                  <Box
                    pl={4}
                    pr={4}
                    pt={"4"}
                    pb={2}
                    className={"boxBackground  border-bottom-none"}
                  >
                    <Grid columns={11}>
                      <Grid.Col span={10}>
                        <Grid gutter={{ base: 2 }}>
                          {is_color && (
                            <Grid.Col span={"auto"}>
                              <SelectForm
                                tooltip={t("ChooseProdcutColor")}
                                placeholder={t("ChooseColor")}
                                // required={true}
                                name={"color"}
                                form={form}
                                dropdownValue={color}
                                mt={0}
                                id={"color"}
                                nextField={"size"}
                                searchable={true}
                                value={colorData}
                                changeValue={setColorData}
                              />
                            </Grid.Col>
                          )}
                          {is_size && (
                            <Grid.Col span={"auto"}>
                              <SelectForm
                                tooltip={t("ChooseProductUpdateFormize")}
                                placeholder={t("ChooseSize")}
                                // required={true}
                                name={"size"}
                                form={form}
                                dropdownValue={size}
                                mt={0}
                                id={"size"}
                                nextField={"brand"}
                                searchable={true}
                                value={sizeData}
                                changeValue={setSizeData}
                              />
                            </Grid.Col>
                          )}
                          {is_brand && (
                            <Grid.Col span={"auto"}>
                              <SelectForm
                                tooltip={t("ChooseProductBrand")}
                                placeholder={t("ChooseBrand")}
                                // required={true}
                                name={"brand"}
                                form={form}
                                dropdownValue={brand}
                                mt={0}
                                id={"brand"}
                                nextField={"grade_id"}
                                searchable={true}
                                value={brandData}
                                changeValue={setBrandData}
                              />
                            </Grid.Col>
                          )}
                          {is_grade && (
                            <Grid.Col span={"auto"}>
                              <SelectForm
                                tooltip={t("ChooseProductGrade")}
                                placeholder={t("ChooseProductGrade")}
                                // required={true}
                                name={"grade_id"}
                                form={form}
                                dropdownValue={title}
                                mt={0}
                                id={"grade_id"}
                                nextField={"EntityFormSubmit"}
                                searchable={true}
                                value={titleData}
                                changeValue={setTitleData}
                              />
                            </Grid.Col>
                          )}
                        </Grid>
                      </Grid.Col>
                      <Grid.Col span={1}>
                        <Stack right align="flex-end" pt={"3"}>
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
                      width: 120,
                    },
                    ...(is_size
                      ? [
                          {
                            accessor: "size",
                            title: t("Size"),
                            width: 60,
                          },
                        ]
                      : []),
                    ...(is_color
                      ? [
                          {
                            accessor: "color",
                            title: t("Color"),
                            width: 80,
                          },
                        ]
                      : []),
                    ...(is_brand
                      ? [
                          {
                            accessor: "brand",
                            title: t("Brand"),
                            width: 80,
                          },
                        ]
                      : []),
                    ...(is_grade
                      ? [
                          {
                            accessor: "title",
                            title: t("Title"),
                            width: 80,
                          },
                        ]
                      : []),
                    {
                      accessor: "price",
                      title: t("Price"),
                      textAlign: "center",
                      width: "100px",
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
                    //   {
                    //     accessor: "vat",
                    //     title: t("Vat"),
                    //     textAlign: "center",
                    //     width: "100px",
                    //     render: (item) => {
                    //       const [editedVat, setEditedVat] = useState(
                    //         item.vat
                    //       );

                    //       const handlVatChange = (e) => {
                    //         const editedVat = e.currentTarget.value;
                    //         setEditedVat(editedVat);
                    //         console.log(editedVat);
                    //       };

                    //       return !vatInput ? (
                    //         <>
                    //           <TextInput
                    //             type="number"
                    //             label=""
                    //             size="xs"
                    //             value={editedVat}
                    //             onChange={handlVatChange}
                    //             // onKeyDown={getHotkeyHandler([
                    //             //     ['Enter', (e) => {
                    //             //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                    //             //     }],
                    //             // ])}
                    //           />
                    //         </>
                    //       ) : (
                    //         "10%"
                    //       );
                    //     },
                    //   },
                    //   {
                    //     accessor: "att",
                    //     title: t("ATT"),
                    //     textAlign: "center",
                    //     width: "100px",
                    //     render: (item) => {
                    //       const [editedAtt, setEditedAtt] = useState(
                    //         item.att
                    //       );

                    //       const handlAttChange = (e) => {
                    //         const editedAtt = e.currentTarget.value;
                    //         setEditedAtt(editedAtt);
                    //         console.log(editedAtt);
                    //       };

                    //       return attInput ? (
                    //         <>
                    //           <TextInput
                    //             type="number"
                    //             label=""
                    //             size="xs"
                    //             value={editedAtt}
                    //             onChange={handlAttChange}
                    //             // onKeyDown={getHotkeyHandler([
                    //             //     ['Enter', (e) => {
                    //             //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                    //             //     }],
                    //             // ])}
                    //           />
                    //         </>
                    //       ) : (
                    //         10
                    //       );
                    //     },
                    //   },
                    {
                      accessor: "wholesale_price",
                      title: t("Wholesale Price"),
                      textAlign: "center",
                      width: "120px",
                      render: (item) => {
                        const [editedAtt, setEditedAtt] = useState(
                          item.wholesale_price
                        );

                        const handlAttChange = (e) => {
                          const editedAtt = e.currentTarget.value;
                          setEditedAtt(editedAtt);
                          console.log(editedAtt);
                        };

                        return attInput ? (
                          <>
                            <TextInput
                              type="number"
                              label=""
                              size="xs"
                              value={editedAtt}
                              onChange={handlAttChange}
                              // onKeyDown={getHotkeyHandler([
                              //     ['Enter', (e) => {
                              //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                              //     }],
                              // ])}
                            />
                          </>
                        ) : (
                          10
                        );
                      },
                    },
                    {
                      accessor: "branch_price",
                      title: t("Branch Price"),
                      textAlign: "center",
                      width: "120px",
                      render: (item) => {
                        const [editedAtt, setEditedAtt] = useState(
                          item.branch_price
                        );

                        const handlAttChange = (e) => {
                          const editedAtt = e.currentTarget.value;
                          setEditedAtt(editedAtt);
                          console.log(editedAtt);
                        };

                        return attInput ? (
                          <>
                            <TextInput
                              type="number"
                              label=""
                              size="xs"
                              value={editedAtt}
                              onChange={handlAttChange}
                              // onKeyDown={getHotkeyHandler([
                              //     ['Enter', (e) => {
                              //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                              //     }],
                              // ])}
                            />
                          </>
                        ) : (
                          10
                        );
                      },
                    },
                    ...(is_grade
                      ? [
                          {
                            accessor: "retail_price",
                            title: t("Retail Price"),
                            textAlign: "center",
                            width: "120px",
                            render: (item) => {
                              const [editedPrice, setEditedPrice] = useState(
                                item.retail_price
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
                        ]
                      : []),
                    ...(is_grade
                      ? [
                          {
                            accessor: "promo_price",
                            title: t("Promo Price"),
                            textAlign: "center",
                            width: "120px",
                            render: (item) => {
                              const [editedPrice, setEditedPrice] = useState(
                                item.promo_price
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
                        ]
                      : []),
                    {
                      accessor: "action",
                      title: t("Action"),
                      textAlign: "right",
                      render: (data) => (
                        <Group gap={4} justify="right" wrap="nowrap">
                          <Menu
                            position="bottom-end"
                            offset={3}
                            withArrow
                            trigger="hover"
                            openDelay={100}
                            closeDelay={400}
                          >
                            <Menu.Target>
                              <ActionIcon
                                size="sm"
                                variant="outline"
                                color="red"
                                radius="xl"
                                aria-label="Settings"
                              >
                                <IconDotsVertical
                                  height={"18"}
                                  width={"18"}
                                  stroke={1.5}
                                />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                // href={`/inventory/sales/edit/${data.id}`}
                                onClick={() => {
                                  dispatch(setInsertType("update"));
                                  dispatch(
                                    editEntityData(
                                      "inventory/product/" + data.id
                                    )
                                  );
                                  dispatch(setFormLoading(true));
                                  navigate(`/inventory/product/${data.id}`);
                                }}
                              >
                                {t("Edit")}
                              </Menu.Item>

                              <Menu.Item
                                onClick={() => {
                                  setViewDrawer(true);
                                  dispatch(
                                    showEntityData(
                                      "inventory/product/" + data.id
                                    )
                                  );
                                }}
                                target="_blank"
                                component="a"
                                w={"200"}
                              >
                                {t("Show")}
                              </Menu.Item>
                              <Menu.Item
                                // href={``}
                                target="_blank"
                                component="a"
                                w={"200"}
                                mt={"2"}
                                bg={"red.1"}
                                c={"red.6"}
                                onClick={() => {
                                  modals.openConfirmModal({
                                    title: (
                                      <Text size="md">
                                        {" "}
                                        {t("FormConfirmationTitle")}
                                      </Text>
                                    ),
                                    children: (
                                      <Text size="sm">
                                        {" "}
                                        {t("FormConfirmationMessage")}
                                      </Text>
                                    ),
                                    labels: {
                                      confirm: "Confirm",
                                      cancel: "Cancel",
                                    },
                                    confirmProps: { color: "red.6" },
                                    onCancel: () => console.log("Cancel"),
                                    onConfirm: () => {
                                      dispatch(
                                        deleteEntityData(
                                          "inventory/product/" + data.id
                                        )
                                      );
                                      dispatch(setFetching(true));
                                    },
                                  });
                                }}
                                rightSection={
                                  <IconTrashX
                                    style={{
                                      width: rem(14),
                                      height: rem(14),
                                    }}
                                  />
                                }
                              >
                                {t("Delete")}
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      ),
                    },
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
                        // type="submit"
                        // id="EntityFormSubmit"
                        leftSection={<IconDeviceFloppy size={16} />}
                      >
                        <Flex direction={`column`} gap={0}>
                          <Text fz={14} fw={400}>
                            {t("Preview")}
                          </Text>
                        </Flex>
                      </Button>
                    )}
                  </>
                </Stack>
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
              </Group>
            </Box>
          </ScrollArea>
        </Box>
      </Box>
    </Box>
  );
}

export default _SkuManagement;
