import {
  Box,
  Grid,
  ScrollArea,
  Tooltip,
  Center,
  Stack,
  TextInput,
  ActionIcon,
  Button,
  Group,
  Text,
  Flex, SimpleGrid, Card,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import DatePickerForm from "../../../form-builders/DatePicker";
import genericClass from "../../../../assets/css/Generic.module.css";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import {
  IconCalendar,
  IconRefresh,
  IconStackPush,
  IconPrinter,
  IconReceipt,
  IconDeviceFloppy,
  IconMessage,
  IconEyeEdit,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import inputCss from "../../../../assets/css/InputField.module.css";

export default function __RequistionInvoiceSection(props) {
  const {
    form,
    currencySymbol,
    defaultVendorId,
    handleClick,
    isSMSActive,
    setDefaultVendorId,
    vendorData,
    setVendorData,
    vendorObject,
    setVendorObject
  } = props;
  const { t } = useTranslation();

  const [vendorsDropdownData, setVendorsDropdownData] = useState([]);

  useEffect(() => {
    if (vendorData) {
      const coreVendors = JSON.parse(
        localStorage.getItem("core-vendors") || "[]"
      );
      let defaultId = defaultVendorId;
      if (coreVendors && coreVendors.length > 0) {
        const transformedData = coreVendors.map((type) => {
          if (type.name === "Default") {
            defaultId = type.id;
          }
          return {
            label: type.mobile + " -- " + type.name,
            value: String(type.id),
          };
        });
        setVendorsDropdownData(transformedData);
        setDefaultVendorId(defaultId);
      }
    }
  }, [vendorData]);

  useEffect(() => {
    if (vendorData) {
      const coreVendors = JSON.parse(
        localStorage.getItem("core-vendors") || "[]"
      );
      const foundVendors = coreVendors.find((type) => type.id == vendorData);

      if (foundVendors) {
        setVendorObject(foundVendors);
      }
    }
  }, [vendorData]);

  const fetchVendors = async () => {
    await vendorDataStoreIntoLocalStorage();
    let coreVendors = localStorage.getItem("core-vendors");
    coreVendors = coreVendors ? JSON.parse(coreVendors) : [];

    // Filter vendor for domain vendor
    // const filteredVendors = coreVendors.filter(vendor => vendor.sub_domain_id != null);
    // if (filteredVendors && filteredVendors.length > 0) {
    //     const transformedData = filteredVendors.map((type) => {
    //         return {
    //             label: type.mobile + " -- " + type.name,
    //             value: String(type.id),
    //         };
    //     });
    //     setVendorsDropdownData(transformedData);
    // }

    // all vendors opened
    const transformedData = coreVendors.map((type) => {
      return {
        label: type.mobile + " -- " + type.name,
        value: String(type.id),
      };
    });
    setVendorsDropdownData(transformedData);
  };
  useEffect(() => {
    fetchVendors();
  }, []);
  return (
    <>
      <Box>
        <SimpleGrid cols={{base: 1, md: 3}}  mt={'2'} spacing="xs" mb={"xs"}>
          <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                padding="xs">
            <Box>
              <Grid gutter={{ base: 6 }} mt={8}>
                <Grid.Col span={12}>
                  <SelectForm
                      tooltip={t("ChooseVendor")}
                      label=""
                      placeholder={t("ChooseVendor")}
                      required={false}
                      nextField="invoice_date"
                      name="vendor_id"
                      form={form}
                      dropdownValue={vendorsDropdownData}
                      id="vendor_id"
                      mt={1}
                      searchable={true}
                      value={vendorData}
                      changeValue={setVendorData}
                  />
                </Grid.Col>
              </Grid>
            </Box>
            <Box className={"borderRadiusAll"}>
              <Grid columns={18} gutter={{ base: 2 }} pt={"xs"}>
                <Grid.Col span={8}>
                  <Text
                      pl={"xs"}
                      className={genericClass.genericPrimaryFontColor}
                      fz={"xs"}
                  >
                    {t("Outstanding")}
                  </Text>
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text fz={"sm"} order={1} fw={"800"}>
                    {currencySymbol + " "}
                    {vendorData &&
                    vendorObject &&
                    vendorData != defaultVendorId
                        ? Number(vendorObject.balance).toFixed(2)
                        : "0.00"}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid columns={18} gutter={{ base: 2 }} pt={"xs"}>
                <Grid.Col span={8}>
                  <Text ta="left" size="xs" pl={"xs"}>
                    {t("Discount")}
                  </Text>
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text ta="left" size="sm">
                    {" "}
                    {currencySymbol} {vendorObject?.discount}
                  </Text>
                </Grid.Col>

              </Grid>

            </Box>
          </Card>
          <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`} padding="xs">
            <Box className={"borderRadiusAll"}>
              <Grid columns={18} gutter={{ base: 2 }} pt={"xs"}>
                <Grid.Col span={8} pt={2}>
                  <Text ta="left" size="xs" pl={"xs"}>
                    {t("Purchase")}
                  </Text>
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text ta="left" size="sm">
                    {" "}
                    {currencySymbol} {vendorObject?.sales}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid columns={18} gutter={{ base: 2 }} pt={"xs"}>
                <Grid.Col span={8}>
                  <Text ta="left" size="xs" pl={"xs"}>
                    {t("Payment")}
                  </Text>
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text ta="left" size="sm">
                    {" "}
                    {currencySymbol} {vendorObject?.receive}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid columns={18} gutter={{ base: 2 }} pt={"xs"}>
                <Grid.Col span={8}>
                  <Text ta="left" size="xs" pl={"xs"}>
                    {t("CreditLimit")}
                  </Text>
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text ta="left" size="sm">
                    {" "}
                    {currencySymbol} {vendorObject?.credit_limit}
                  </Text>
                </Grid.Col>
              </Grid>
            </Box>
          </Card>
          <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                padding="xs">
            <Box>
              <Box>
                <DatePickerForm
                    tooltip={t("SelectInvoiceDate")}
                    label=""
                    placeholder={t("InvoiceDate")}
                    required={true}
                    nextField={"expected_date"}
                    form={form}
                    name={"invoice_date"}
                    id={"invoice_date"}
                    leftSection={<IconCalendar size={16} opacity={0.5} />}
                    closeIcon={true}
                />
              </Box>
              <Box mt={4}>
                <DatePickerForm
                    tooltip={t("SelectExpectedDate")}
                    label=""
                    placeholder={t("ExpectedDate")}
                    required={true}
                    nextField={"narration"}
                    form={form}
                    name={"expected_date"}
                    id={"expected_date"}
                    disable={true}
                    leftSection={<IconCalendar size={16} opacity={0.5} />}
                    closeIcon={true}
                />
              </Box>
              <Box pt={4}>
                <TextAreaForm
                    size="xs"
                    tooltip={t("NarrationValidateMessage")}
                    label=""
                    placeholder={t("Narration")}
                    required={false}
                    nextField={"save"}
                    name={"narration"}
                    form={form}
                    id={"narration"}
                />
              </Box>
            </Box>

          </Card>
        </SimpleGrid>
        <Box mt={"8"} pb={"xs"} pr={"xs"}>
          <Button.Group>
            <Button
              fullWidth={true}
              variant="filled"
              leftSection={<IconRefresh size={14} />}
              className={genericClass.invoiceReset}
            >
              {t("Reset")}
            </Button>
            <Button
              fullWidth={true}
              variant="filled"
              leftSection={<IconStackPush size={14} />}
              className={genericClass.invoiceHold}
            >
              {t("Hold")}
            </Button>
            <Button
              fullWidth={true}
              variant="filled"
              type={"submit"}
              onClick={handleClick}
              name="print"
              leftSection={<IconPrinter size={14} />}
              className={genericClass.invoicePrint}
              style={{
                transition: "all 0.3s ease",
              }}
            >
              {t("Print")}
            </Button>
            <Button
              fullWidth={true}
              type={"submit"}
              onClick={handleClick}
              name="pos"
              variant="filled"
              leftSection={<IconReceipt size={14} />}
              className={genericClass.invoicePos}
              style={{
                transition: "all 0.3s ease",
              }}
            >
              {t("Pos")}
            </Button>
            <Button
              fullWidth={true}
              className={genericClass.invoiceSave}
              type={"submit"}
              onClick={handleClick}
              name="save"
              variant="filled"
              leftSection={<IconDeviceFloppy size={14} />}
              style={{
                transition: "all 0.3s ease",
              }}
            >
              {t("Save")}
            </Button>
          </Button.Group>
        </Box>
      </Box>
    </>
  );
}
