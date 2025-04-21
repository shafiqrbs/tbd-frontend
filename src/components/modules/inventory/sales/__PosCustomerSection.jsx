import { t } from "i18next";
import { useEffect, useState } from "react";
import genericClass from "../../../../assets/css/Generic.module.css";
import { Box, Grid, Tooltip, ActionIcon, Group, Text } from "@mantine/core";
import { IconMessage, IconEyeEdit, IconUserCircle } from "@tabler/icons-react";
import InputForm from "../../../form-builders/InputForm";
import PhoneNumber from "../../../form-builders/PhoneNumberInput";
import { useTranslation } from "react-i18next";
import SelectForm from "../../../form-builders/SelectForm";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage";

export default function __PosCustomerSection(props) {
  //common hooks
  const {
    form,
    isSMSActive,
    currencySymbol,
    setCustomerObject,
    customerObject,
    customerData,
    setCustomerData,
    customersDropdownData,
    setCustomersDropdownData,
    defaultCustomerId,
    setDefaultCustomerId,
  } = props;
  const { t, i18n } = useTranslation();

  //fetching customer dropdownData
  useEffect(() => {
    const fetchCustomers = async () => {
      await customerDataStoreIntoLocalStorage();
      let coreCustomers = localStorage.getItem("core-customers");
      coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : [];
      let defaultId = defaultCustomerId;
      if (coreCustomers && coreCustomers.length > 0) {
        const transformedData = coreCustomers.map((type) => {
          if (type.name === "Default") {
            defaultId = type.id;
          }
          return {
            label: type.mobile + " -- " + type.name,
            value: String(type.id),
          };
        });

        setCustomersDropdownData(transformedData);
        setDefaultCustomerId(defaultId);
      }
    };

    fetchCustomers();
  }, []);

  //setting customerObject based on customerData
  useEffect(() => {
    if (customerData && customerData != defaultCustomerId) {
      const coreCustomers = JSON.parse(
        localStorage.getItem("core-customers") || "[]"
      );
      const foundCustomer = coreCustomers.find(
        (type) => type.id == customerData
      );

      if (foundCustomer) {
        setCustomerObject(foundCustomer);
      }
    }
  }, [customerData]);

  return (
    <>
      <Box pl={`4`} pr={4} mb={"xs"} style={{ borderRadius:4}} className={genericClass.bodyBackground}>
        <Grid columns={24} gutter={{ base: 6 }}>
          <Grid.Col span={16} className={genericClass.genericSecondaryBg}>
            <Box pl={"4"} pr={"4"}>
              <Box style={{ borderRadius:4}} className={genericClass.genericHighlightedBox} >
                <Grid gutter={{ base: 6 }} mt={8} >
                  <Grid.Col span={10} pl={"8"}>
                    <SelectForm
                      tooltip={t("CustomerValidateMessage")}
                      label=""
                      placeholder={t("Jhon Dee")}
                      required={false}
                      nextField={""}
                      name={"customer_id"}
                      form={form}
                      dropdownValue={customersDropdownData}
                      id={"customer_id"}
                      searchable={true}
                      value={customerData}
                      changeValue={setCustomerData}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Box
                      mr={"12"}
                      mt={"4"}
                      style={{ textAlign: "right", float: "right" }}
                    >
                      <Group>
                        <Tooltip
                          multiline
                          bg={"orange.8"}
                          position="top"
                          ta={"center"}
                          withArrow
                          transitionProps={{ duration: 200 }}
                          label={
                            customerData && customerData != defaultCustomerId
                              ? isSMSActive
                                ? t("SendSms")
                                : t("PleasePurchaseAsmsPackage")
                              : t("ChooseCustomer")
                          }
                        >
                          <ActionIcon
                            bg={"white"}
                            variant="outline"
                            color={"red"}
                            disabled={
                              !customerData || customerData == defaultCustomerId
                            }
                            onClick={(e) => {
                              if (isSMSActive) {
                                notifications.show({
                                  withCloseButton: true,
                                  autoClose: 1000,
                                  title: t("smsSendSuccessfully"),
                                  message: t("smsSendSuccessfully"),
                                  icon: <IconTallymark1 />,
                                  className: "my-notification-class",
                                  style: {},
                                  loading: true,
                                });
                              } else {
                                setIsShowSMSPackageModel(true);
                              }
                            }}
                          >
                            <IconMessage size={18} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip
                          multiline
                          bg={"orange.8"}
                          position="top"
                          withArrow
                          offset={{ crossAxis: "-45", mainAxis: "5" }}
                          ta={"center"}
                          transitionProps={{ duration: 200 }}
                          label={
                            customerData && customerData != defaultCustomerId
                              ? t("CustomerDetails")
                              : t("ChooseCustomer")
                          }
                        >
                          <ActionIcon
                            variant="filled"
                            color={"red"}
                            disabled={
                              !customerData || customerData == defaultCustomerId
                            }
                            onClick={() => {
                              setViewDrawer(true);
                            }}
                          >
                            <IconEyeEdit size={18} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Box>
                  </Grid.Col>
                </Grid>
              </Box>
              <Box
                pl={"4"}
                pr={"4"}
                mt={"4"}
                pt={"8"}
                pb={"4"}
                style={{ borderRadius:4}}
              >
                <Grid columns={18} gutter={{ base: 2 }}>
                  <Grid.Col span={3}>
                    <Text
                      pl={"md"}
                      className={genericClass.genericPrimaryFontColor}
                      fz={"xs"}
                    >
                      {t("Outstanding")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fz={"sm"} order={1} fw={"800"}>
                      {currencySymbol + " "}
                      {customerData &&
                      customerObject &&
                      customerData != defaultCustomerId
                        ? Number(customerObject.balance).toFixed(2)
                        : "0.00"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text ta="left" size="xs" pl={"md"}>
                      {t("Sales")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta="left" size="sm">
                      {" "}
                      {currencySymbol} {customerObject?.sales}
                    </Text>
                  </Grid.Col>
                </Grid>
                <Grid columns={18} gutter={{ base: 2 }}>
                  <Grid.Col span={3}>
                    <Text ta="left" size="xs" pl={"md"}>
                      {t("Discount")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta="left" size="sm">
                      {" "}
                      {currencySymbol} {customerObject?.discount}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text ta="left" size="xs" pl={"md"}>
                      {t("Receive")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta="left" size="sm">
                      {" "}
                      {currencySymbol} {customerObject?.receive}
                    </Text>
                  </Grid.Col>
                </Grid>
                <Grid columns={18} gutter={{ base: 2 }}>
                  <Grid.Col span={3}>
                    <Text ta="left" size="xs" pl={"md"}>
                      {t("CreditLimit")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta="left" size="sm">
                      {" "}
                      {currencySymbol} {customerObject?.credit_limit}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text ta="left" size="xs" pl={"md"}>
                      {t("EarnPoint")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta="left" size="sm">
                      {" "}
                      {currencySymbol} {customerObject?.earn_point}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={8} style={{ borderRadius:4}} className={genericClass.genericSecondaryBg} >
            <Box pl={"4"} pr={"4"} >
              <Box mt={"4"}>
                <InputForm
                  tooltip={t("NameValidateMessage")}
                  label={t("")}
                  placeholder={t("CustomerName")}
                  required={true}
                  nextField={"mobile"}
                  form={form}
                  name={"name"}
                  id={"name"}
                  leftSection={<IconUserCircle size={16} opacity={0.5} />}
                  rightIcon={""}
                />
              </Box>
              <Box mt={"4"}>
                <PhoneNumber
                  tooltip={
                    form.errors.mobile
                      ? form.errors.mobile
                      : t("MobileValidateMessage")
                  }
                  label={t("")}
                  placeholder={t("Mobile")}
                  required={true}
                  nextField={"email"}
                  form={form}
                  name={"mobile"}
                  id={"mobile"}
                  rightIcon={""}
                />
              </Box>
              <Box mt={"4"} mb={4}>
                <InputForm
                  tooltip={t("InvalidEmail")}
                  label={t("")}
                  placeholder={t("Email")}
                  required={false}
                  nextField={""}
                  name={"email"}
                  form={form}
                  id={"email"}
                />
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
}
