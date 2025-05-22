import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  rem,
  Grid,
  Box,
  ScrollArea,
  Text,
  Title,
  Flex,
  Stack,
  LoadingOverlay,
  TextInput,
  Table,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconCheck,
  IconDeviceFloppy,
  IconTrashX,
  IconX,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import {
  deleteEntityData,
  setFormLoading,
} from "../../../../store/core/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import {
  getProductSkuItemIndexEntityData,
  inlineUpdateEntityData,
  storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import { modals } from "@mantine/modals";
import getSettingParticularDropdownData from "../../../global-hook/dropdown/getSettingParticularDropdownData.js";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import InputForm from "../../../form-builders/InputForm.jsx";
import EditableNumberInput from "../../../form-builders/InputForm.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";

function _SkuManagement(props) {
  const { id,productConfig, isBrand, isColor, isGrade, isSize, isMultiPrice, isModel } =
    props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 104; //TabList height 104

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [setFormData, setFormDataForUpdate] = useState(false);
  const [formLoad, setFormLoad] = useState(true);

  const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
  const formLoading = useSelector((state) => state.crudSlice.formLoading);

  const colorDropDown = getSettingParticularDropdownData("color");
  const sizeDropDown = getSettingParticularDropdownData("size");
  const brandDropDown = getSettingParticularDropdownData("brand");
  const gradeDropDown = getSettingParticularDropdownData("product-grade");
  const modelDropDown = getSettingParticularDropdownData("model");

  const form = useForm({
    initialValues: {
      product_id: "",
      color_id: "",
      brand_id: "",
      size_id: "",
      grade_id: "",
      model_id: "",
      barcode: "",
    },
  });

  useEffect(() => {
    setFormLoad(true);
    setFormDataForUpdate(true);
  }, [dispatch, formLoading]);

  const productSkuIndexEntityData = useSelector(
    (state) => state.inventoryCrudSlice.productSkuIndexEntityData
  );

  useEffect(() => {
    form.setValues({});

    dispatch(setFormLoading(false));
    setTimeout(() => {
      setFormLoad(false);
      setFormDataForUpdate(false);
    }, 500);
  }, [entityEditData, dispatch, setFormData, productSkuIndexEntityData]);

  const [reloadSkuItemData, setReloadSkuItemData] = useState(false);

  useEffect(() => {
    const value = {
      url: "inventory/product/stock/sku/" + id,
      param: {
        term: null,
      },
    };
    dispatch(getProductSkuItemIndexEntityData(value));
    setReloadSkuItemData(false);
  }, [reloadSkuItemData]);

  const [brandData, setBrandData] = useState(null);
  const [colorData, setColorData] = useState(null);
  const [sizeData, setSizeData] = useState(null);
  const [gradeData, setGradeData] = useState(null);

  const [priceData, setPriceData] = useState([]);
  const [purchasePriceData, setPurchasePriceData] = useState([]);
  const [barcodeData, setBarcodeData] = useState([]);
  const [multiplePriceFieldName, setMultiplePriceFieldName] = useState([]);

  useEffect(() => {
    if (productSkuIndexEntityData?.data) {
      setPriceData(
        productSkuIndexEntityData?.data.map((sku) => sku?.price || "")
      );
      setPurchasePriceData(
        productSkuIndexEntityData?.data.map((sku) => sku?.purchase_price || "")
      );
      setBarcodeData(
        productSkuIndexEntityData?.data.map((sku) => sku?.barcode || "")
      );
      isMultiPrice &&
        setMultiplePriceFieldName(
          productSkuIndexEntityData?.data[0]?.price_field_array
        );
    }
  }, [productSkuIndexEntityData]);

  const [wholesalePriceData, setWholesalePriceData] = useState([]);
  // useEffect(() => {
  //     if (productSkuIndexEntityData?.data?.length > 0 && isMultiPrice) {
  //         const initialPriceData = productSkuIndexEntityData?.data.map((sku) => {
  //             return sku?.price_field.map((field) => ({
  //                 id: field?.id,
  //                 slug: field?.price_field_slug,
  //                 price: field.price !== null ? field.price : ''
  //             }));
  //         });
  //         setWholesalePriceData(initialPriceData);
  //     }
  // }, [productSkuIndexEntityData]);

  const handleSkuData = (
    value,
    stockId,
    priceFieldSlug,
    skuIndex,
    fieldIndex,
    settingId
  ) => {
    if (
      priceFieldSlug != "sales_price" &&
      priceFieldSlug != "purchase_price" &&
      priceFieldSlug != "barcode"
    ) {
      const updatedPriceData = [...wholesalePriceData];
      updatedPriceData[skuIndex][fieldIndex].price = value;
      setWholesalePriceData(updatedPriceData);

      const updateData = {
        url: "inventory/product/stock/sku/inline-update/" + stockId,
        data: {
          value: value,
          field: priceFieldSlug,
          setting_id: settingId,
        },
      };
      setTimeout(() => {
        dispatch(inlineUpdateEntityData(updateData));
        productsDataStoreIntoLocalStorage();
      }, 500);
    }

    if (priceFieldSlug === "sales_price") {
      const newPriceData = [...priceData];
      newPriceData[skuIndex] = value;
      setPriceData(newPriceData);
      const updateData = {
        url: "inventory/product/stock/sku/inline-update/" + stockId,
        data: {
          value: value,
          field: priceFieldSlug,
        },
      };
      setTimeout(() => {
        dispatch(inlineUpdateEntityData(updateData));
        productsDataStoreIntoLocalStorage();
      }, 500);
    }

    if (priceFieldSlug === "purchase_price") {
      const newPurchasePriceData = [...purchasePriceData];
      newPurchasePriceData[skuIndex] = value;
      setPurchasePriceData(newPurchasePriceData);
      const updateData = {
        url: "inventory/product/stock/sku/inline-update/" + stockId,
        data: {
          value: value,
          field: priceFieldSlug,
        },
      };
      setTimeout(() => {
        dispatch(inlineUpdateEntityData(updateData));
        productsDataStoreIntoLocalStorage();
      }, 500);
    }
    if (priceFieldSlug === "barcode") {
      const newBarcodeData = [...barcodeData];
      newBarcodeData[skuIndex] = value;
      setBarcodeData(newBarcodeData);
      const updateData = {
        url: "inventory/product/stock/sku/inline-update/" + stockId,
        data: {
          value: value,
          field: priceFieldSlug,
        },
      };
      setTimeout(() => {
        dispatch(inlineUpdateEntityData(updateData));
        productsDataStoreIntoLocalStorage();
      }, 500);
    }
  };

  return (
        <form
            onSubmit={form.onSubmit((values) => {
              form.values.product_id = id;

              if (
                  !values.grade_id &&
                  !values.model_id &&
                  !values.color_id &&
                  !values.brand_id &&
                  !values.size_id
              ) {
                notifications.show({
                  loading: true,
                  color: "red",
                  title: "At least one value required",
                  message:
                      "Data will be loaded in 3 seconds, you cannot close this yet",
                  autoClose: 2000,
                  withCloseButton: true,
                });
                return;
              }

              const existingProductItem = productSkuIndexEntityData?.data.find(
                  (item) =>
                      Number(item.color_id) === Number(values.color_id) &&
                      Number(item.brand_id) === Number(values.brand_id) &&
                      Number(item.size_id) === Number(values.size_id) &&
                      Number(item.grade_id) === Number(values.grade_id) &&
                      Number(item.model_id) === Number(values.model_id)
              );

              if (existingProductItem) {
                showNotificationComponent('Already exists','red')
                return;
              }
              modals.openConfirmModal({
                title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                children: (
                    <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                ),
                labels: { confirm: t("Submit"), cancel: t("Cancel") },
                confirmProps: { color: "red" },
                onCancel: () => console.log("Cancel"),
                onConfirm: async () => {
                  const value = {
                    url: "inventory/product/stock/sku",
                    data: values,
                  };

                  const resultAction = await dispatch(storeEntityData(value));

                  if (storeEntityData.rejected.match(resultAction)) {
                    showNotificationComponent(resultAction.payload.message,'red')
                  } else if (storeEntityData.fulfilled.match(resultAction)) {
                    await productsDataStoreIntoLocalStorage();

                    showNotificationComponent(resultAction.message,'teal')

                    setTimeout(() => {
                      form.reset();
                      setColorData(null);
                      setBrandData(null);
                      setSizeData(null);
                      setGradeData(null);
                      setReloadSkuItemData(true);
                      setSaveCreateLoading(false);
                    }, 500);
                  }
                },
              });
            })}
        >
          <>
            <Box>
              <Box className={"borderRadiusAll"}>
                <ScrollArea
                    h={height-300}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                >
                  <Box>
                    <Table stickyHeader>
                      <Table.Thead className={"boxBackground"}>
                        <Table.Tr>
                          <Table.Th fz="xs">{t("S/N")}</Table.Th>
                          <Table.Th fz="xs">{t("Name")}</Table.Th>
                          <Table.Th fz="xs">{t("Barcode")}</Table.Th>
                          {productConfig?.sku_color === 1 && (
                              <Table.Th fz="xs" ta="center">
                                {t("Color")}
                              </Table.Th>
                          )}

                          {productConfig?.sku_size === 1 && (
                              <Table.Th fz="xs" ta="center">
                                {t("Size")}
                              </Table.Th>
                          )}

                          {productConfig?.sku_brand === 1 && (
                              <Table.Th fz="xs" ta="center">
                                {t("Brand")}
                              </Table.Th>
                          )}

                          {productConfig?.sku_grade === 1 && (
                              <Table.Th fz="xs" ta="center">
                                {t("Grade")}
                              </Table.Th>
                          )}

                          {productConfig?.sku_model === 1 && (
                              <Table.Th fz="xs" ta="center">
                                {t("Model")}
                              </Table.Th>
                          )}

                          <Table.Th fz="xs" ta="center">
                            {t("PurchasePrice")}
                          </Table.Th>

                          <Table.Th fz="xs" ta="center">
                            {t("SalesPrice")}
                          </Table.Th>
                          {isMultiPrice &&
                          multiplePriceFieldName?.length > 0 &&
                          multiplePriceFieldName.map((priceFieldName, index) => (
                              <Table.Th fz="xs" ta="center" key={index}>
                                {priceFieldName}
                              </Table.Th>
                          ))}
                          <Table.Th fz="xs" ta="center"></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {productSkuIndexEntityData?.data?.length > 0 ? (
                            productSkuIndexEntityData.data.map((sku, index) => {
                              return (
                                  <Table.Tr key={sku.id}>
                                    <Table.Th fz="xs">{index + 1}</Table.Th>
                                    <Table.Th fz="xs">{sku.name}</Table.Th>
                                    <Table.Th fz="xs">
                                      <TextInput
                                          type="number"
                                          label=""
                                          size="xs"
                                          id={"inline-update-barcode-" + sku.stock_id}
                                          value={barcodeData[index]}
                                          onChange={(e) => {
                                            handleSkuData(
                                                e.target.value,
                                                sku.stock_id,
                                                "barcode",
                                                index,
                                                null,
                                                null
                                            );
                                          }}
                                      />
                                    </Table.Th>
                                    {productConfig?.sku_color === 1 && (
                                        <Table.Th fz="xs" ta="center">
                                          {sku.color_name}
                                        </Table.Th>
                                    )}
                                    {productConfig?.sku_size === 1 && (
                                        <Table.Th fz="xs" ta="center">
                                          {sku.size_name}
                                        </Table.Th>
                                    )}
                                    {productConfig?.sku_brand === 1 && (
                                        <Table.Th fz="xs" ta="center">
                                          {sku.brand_name}
                                        </Table.Th>
                                    )}
                                    {productConfig?.sku_grade === 1 && (
                                        <Table.Th fz="xs" ta="center">
                                          {sku.grade_name}
                                        </Table.Th>
                                    )}
                                    {productConfig?.sku_model === 1 && (
                                        <Table.Th fz="xs" ta="center">
                                          {sku.model_name}
                                        </Table.Th>
                                    )}

                                    <Table.Th fz="xs" ta="center">
                                      <TextInput
                                          type="number"
                                          label=""
                                          size="xs"
                                          id={"inline-update-price-" + sku.stock_id}
                                          value={purchasePriceData[index]}
                                          onChange={(e) => {
                                            handleSkuData(
                                                e.target.value,
                                                sku.stock_id,
                                                "purchase_price",
                                                index,
                                                null,
                                                null
                                            );
                                          }}
                                      />
                                    </Table.Th>

                                    <Table.Th fz="xs" ta="center">
                                      <TextInput
                                          type="number"
                                          label=""
                                          size="xs"
                                          id={"inline-update-price-" + sku.stock_id}
                                          value={priceData[index]}
                                          onChange={(e) => {
                                            handleSkuData(
                                                e.target.value,
                                                sku.stock_id,
                                                "sales_price",
                                                index,
                                                null,
                                                null
                                            );
                                          }}
                                      />
                                    </Table.Th>

                                    {sku.price_field?.map((field, fieldIndex) => (
                                        <Table.Th fz="xs" ta="center" key={field.id}>
                                          <TextInput
                                              type="number"
                                              label=""
                                              size="xs"
                                              id={`inline-update-${field.price_field_slug}-${sku.stock_id}`}
                                              value={
                                                wholesalePriceData[index]?.[fieldIndex]
                                                    ?.price || ""
                                              }
                                              onChange={(e) =>
                                                  handleSkuData(
                                                      e.target.value,
                                                      sku.stock_id,
                                                      field.price_field_slug,
                                                      index,
                                                      fieldIndex,
                                                      field.id
                                                  )
                                              }
                                          />
                                        </Table.Th>
                                    ))}
                                    <Table.Th fz="xs" ta="center">
                                      {!sku.is_master && (
                                          <ActionIcon
                                              size="sm"
                                              variant="transparent"
                                              color="red"
                                              onMouseEnter={(e) =>
                                                  (e.currentTarget.style.color = "red")
                                              }
                                              onMouseLeave={(e) =>
                                                  (e.currentTarget.style.color = "red.6")
                                              }
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
                                                            "inventory/product/stock/sku/" +
                                                            sku.stock_id
                                                        )
                                                    );
                                                    setTimeout(() => {
                                                      setReloadSkuItemData(true);
                                                    }, 500);
                                                  },
                                                });
                                              }}
                                          >
                                            <IconX
                                                height={"18"}
                                                width={"18"}
                                                stroke={1.5}
                                            />
                                          </ActionIcon>
                                      )}
                                    </Table.Th>
                                  </Table.Tr>
                              );
                            })
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
              <Box
                  className={"borderRadiusAll"}
              >
                <ScrollArea
                    h={height-400}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                >
                  <Box p={'xs'}>
                    <EditableNumberInput
                        tooltip={t("BarcodeValidateMessage")}
                        placeholder={t("Barcode")}
                        required={false}
                        nextField={"sales_price"}
                        form={form}
                        name={"barcode"}
                        id={"barcode"}
                    />
                  </Box>
                  {productConfig?.sku_color === 1 && colorDropDown?.length > 0 && (
                      <Box p={'xs'}>
                        <SelectForm
                            tooltip={t("ChooseColor")}
                            placeholder={t("ChooseColor")}
                            name={"color_id"}
                            form={form}
                            dropdownValue={colorDropDown}
                            mt={0}
                            id={"color_id"}
                            nextField={"size_id"}
                            searchable={true}
                            value={colorData}
                            changeValue={setColorData}
                        />
                      </Box>
                  )}
                  {productConfig?.sku_size === 1 &&  sizeDropDown?.length > 0 && (
                      <Box p={'xs'}>
                        <SelectForm
                            tooltip={t("ChooseSize")}
                            placeholder={t("ChooseSize")}
                            name={"size_id"}
                            form={form}
                            dropdownValue={sizeDropDown}
                            mt={0}
                            id={"size_id"}
                            nextField={"brand_id"}
                            searchable={true}
                            value={sizeData}
                            changeValue={setSizeData}
                        />

                      </Box>
                  )}
                  {productConfig?.sku_brand === 1 && brandDropDown?.length > 0 && (
                      <Box p={'xs'}>
                        <SelectForm
                            tooltip={t("ChooseBrand")}
                            placeholder={t("ChooseBrand")}
                            name={"brand_id"}
                            form={form}
                            dropdownValue={brandDropDown}
                            mt={0}
                            id={"brand_id"}
                            nextField={"grade_id"}
                            searchable={true}
                            value={brandData}
                            changeValue={setBrandData}
                        />
                      </Box>
                  )}
                  {productConfig?.sku_grade === 1 && gradeDropDown?.length > 0 && (
                      <Box p={'xs'}>
                        <SelectForm
                            tooltip={t("ChooseProductGrade")}
                            placeholder={t("ChooseProductGrade")}
                            name={"grade_id"}
                            form={form}
                            dropdownValue={gradeDropDown}
                            mt={0}
                            id={"grade_id"}
                            nextField={"model_id"}
                            searchable={true}
                            value={gradeData}
                            changeValue={setGradeData}
                        />

                      </Box>
                  )}
                  {productConfig?.sku_model === 1 && modelDropDown?.length > 0 && (
                      <Box p={'xs'}>
                        <SelectForm
                            tooltip={t("ChooseModel")}
                            placeholder={t("ChooseModel")}
                            name={"model_id"}
                            form={form}
                            dropdownValue={modelDropDown}
                            mt={0}
                            id={"model_id"}
                            nextField={"EntityFormSubmitSkuItem"}
                            searchable={true}
                            value={gradeData}
                            changeValue={setGradeData}
                        />

                      </Box>
                  )}
                </ScrollArea>
                <Box
                    p={`xs`}
                    className={"titleBackground"}
                >
                  {!saveCreateLoading && isOnline && (
                      <>
                        {isOnline && (
                            <Button
                                size="xs"
                                className={'btnPrimaryBg'}
                                type="submit"
                                fullWidth={'true'}
                                id="SkuManagementFormSubmit"
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
                  )}
                </Box>
              </Box>
            </Box>
          </>
        </form>


  );
}

export default _SkuManagement;
