import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Grid,
  Popover,
  Text,
  Tooltip,
  ScrollArea,
} from "@mantine/core";
import {
  IconDeviceMobile,
  IconFileInvoice,
  IconFilter,
  IconRefreshDot,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons-react";
import InputForm from "../../../form-builders/InputForm";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { isNotEmpty, useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import SelectForm from "../../../form-builders/SelectForm";
export default function __FilterPopover(props) {
  const { setRefreshCustomerDropdown, focusField, fieldPrefix } = props;

  const { mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight;

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  /*START CUSTOMER ADDED FORM INITIAL*/
  const [advanceSearchFormOpened, setAdvanceSearchFormOpened] = useState(false);
  const [nameDropdown, setNameDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [invoiceDropdown, setInvoiceDropdown] = useState(null);
  const advanceSearchForm = useForm({
    initialValues: {
      name: "",
      mobile: "",
      invoice: "",
      name_dropdown: "",
      mobile_dropdown: "",
      invoice_dropdown: "",
    },
    validate: {
      name: (value, values) => {
        // First check if any main field is filled
        if (!value && !values.mobile && !values.invoice) {
          return "At least one main field is required";
        }
        return null;
      },
      name_dropdown: (value, values) => {
        // Validate dropdown when name has value
        if (values.name && !value) {
          return true;
        }
        return null;
      },
      mobile: (value, values) => {
        if (!value && !values.name && !values.invoice) {
          return true;
        }
        return null;
      },
      mobile_dropdown: (value, values) => {
        if (values.mobile && !value) {
          return true;
        }
        return null;
      },
      invoice: (value, values) => {
        if (!value && !values.name && !values.mobile) {
          return "At least one main field is required";
        }
        return null;
      },
      invoice_dropdown: (value, values) => {
        if (values.invoice && !value) {
          return "Please select an option for Invoice";
        }
        return null;
      },
    },
  });
  const mobile_drop_data = [
    { id: 1, value: "chiller" },
    { id: 2, value: "party" },
  ];
  const invoice_drop_data = [
    { id: 1, value: "chiller" },
    { id: 2, value: "party" },
  ];
  const name_drop_data = [
    { id: 1, value: "chiller" },
    { id: 2, value: "party" },
  ];
  /*END CUSTOMER ADDED FORM INITIAL*/

  return (
    <Box>
      <Popover
        width={"500"}
        trapFocus
        position="bottom"
        withArrow
        shadow="xl"
        opened={advanceSearchFormOpened}
      >
        <Popover.Target>
          <Tooltip
            multiline
            bg={"orange.8"}
            offset={{ crossAxis: "-52", mainAxis: "5" }}
            position="top"
            ta={"center"}
            withArrow
            transitionProps={{ duration: 200 }}
            label={t("AdvanceSearch")}
          >
            <ActionIcon
              variant="default"
              size="lg"
              c="gray.6"
              aria-label="Settings"
              onClick={() =>
                advanceSearchFormOpened
                  ? setAdvanceSearchFormOpened(false)
                  : setAdvanceSearchFormOpened(true)
              }
            >
              <IconFilter
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown>
          <Box>
            <form
              onSubmit={advanceSearchForm.onSubmit((values) => {
                console.log(advanceSearchForm.values);
              })}
            >
              <Box mt={"4"}>
                <Box
                  className="boxBackground borderRadiusAll"
                  pt={"6"}
                  mb={"4"}
                  pb={"6"}
                >
                  <Text ta={"center"} fw={600} fz={"sm"}>
                    {t("AdvanceSearch")}
                  </Text>
                </Box>
                <Box className="borderRadiusAll" bg={"white"}>
                  <ScrollArea
                    h={height / 3}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                  >
                    <Box p={"xs"}>
                      <Grid columns={15} gutter={{ base: 8 }}>
                        <Grid.Col span={3}>
                          <Text ta={"left"} fw={600} fz={"sm"} mt={"8"}>
                            {t("Name")}
                          </Text>
                        </Grid.Col>

                        <Grid.Col span={5}>
                          <SelectForm
                            tooltip={t("SelectSearchLikeValue")}
                            form={advanceSearchForm}
                            searchable
                            name="name_dropdown"
                            id="name_dropdown"
                            label=""
                            nextField="name"
                            placeholder="Search Like"
                            dropdownValue={name_drop_data}
                            changeValue={setNameDropdown}
                            data={["React", "Angular", "Vue", "Svelte"]}
                          />
                        </Grid.Col>
                        <Grid.Col span={7}>
                          <Box>
                            <InputForm
                              tooltip={t("NameValidateMessage")}
                              label=""
                              placeholder={t("Name")}
                              nextField={"mobile_dropdown"}
                              form={advanceSearchForm}
                              name={"name"}
                              id={"name"}
                              leftSection={
                                <IconUserCircle size={16} opacity={0.5} />
                              }
                              rightIcon={""}
                            />
                          </Box>
                        </Grid.Col>
                      </Grid>
                    </Box>
                    <Box p={"xs"}>
                      <Grid columns={15} gutter={{ base: 8 }}>
                        <Grid.Col span={3}>
                          <Text ta={"left"} fw={600} fz={"sm"} mt={"8"}>
                            {t("Mobile")}
                          </Text>
                        </Grid.Col>

                        <Grid.Col span={5}>
                          <SelectForm
                            tooltip={t("SelectSearchLikeValue")}
                            form={advanceSearchForm}
                            searchable
                            name="mobile_dropdown"
                            id="mobile_dropdown"
                            nextField="mobile"
                            label=""
                            placeholder="Search Like"
                            dropdownValue={mobile_drop_data}
                            value={mobileDropdown}
                            changeValue={setMobileDropdown}
                          />
                        </Grid.Col>
                        <Grid.Col span={7}>
                          <Box>
                            <InputForm
                              tooltip={t("MobileValidateMessage")}
                              label=""
                              placeholder={t("Mobile")}
                              nextField={"invoice_dropdown"}
                              form={advanceSearchForm}
                              name={"mobile"}
                              id={"mobile"}
                              leftSection={
                                <IconDeviceMobile size={16} opacity={0.5} />
                              }
                              rightIcon={""}
                            />
                          </Box>
                        </Grid.Col>
                      </Grid>
                    </Box>
                    <Box p={"xs"}>
                      <Grid columns={15} gutter={{ base: 8 }}>
                        <Grid.Col span={3}>
                          <Text ta={"left"} fw={600} fz={"sm"} mt={"8"}>
                            {t("Invoice")}
                          </Text>
                        </Grid.Col>

                        <Grid.Col span={5}>
                          <SelectForm
                            tooltip={t("SelectSearchLikeValue")}
                            form={advanceSearchForm}
                            searchable
                            name="invoice_dropdown"
                            id="invoice_dropdown"
                            nextField="invoice"
                            label=""
                            placeholder="Search Like"
                            dropdownValue={invoice_drop_data}
                            value={invoiceDropdown}
                            changeValue={setInvoiceDropdown}
                          />
                        </Grid.Col>
                        <Grid.Col span={7}>
                          <Box>
                            <InputForm
                              tooltip={t("InvoiceValidateMessage")}
                              label=""
                              placeholder={t("Invoice")}
                              nextField={"EntityFormSubmit"}
                              form={advanceSearchForm}
                              name={"invoice"}
                              id={"invoice"}
                              leftSection={
                                <IconFileInvoice size={16} opacity={0.5} />
                              }
                              rightIcon={""}
                            />
                          </Box>
                        </Grid.Col>
                      </Grid>
                    </Box>
                  </ScrollArea>
                </Box>
              </Box>
              <Box
                className="borderRadiusAll boxBackground"
                pl={"xs"}
                pr={"xs"}
                pb={2}
                mt={4}
              >
                <Box>
                  <Grid columns={12} gutter={{ base: 1 }}>
                    <Grid.Col span={6}>&nbsp;</Grid.Col>
                    <Grid.Col span={2}>
                      <Button
                        variant="transparent"
                        size="sm"
                        color={`red.4`}
                        mt={0}
                        mr={"4"}
                        pt={8}
                        fullWidth={true}
                        onClick={() => {
                          advanceSearchForm.reset();
                        }}
                      >
                        <IconRefreshDot
                          style={{ width: "100%", height: "80%" }}
                          stroke={1.5}
                        />
                      </Button>
                    </Grid.Col>
                    <Grid.Col span={4} pt={8} pb={6}>
                      <Button
                        size="xs"
                        color={`red.5`}
                        type="submit"
                        mt={0}
                        mr={"xs"}
                        fullWidth={true}
                        id={"EntityFormSubmit"}
                        leftSection={<IconSearch size={16} />}
                        // onClick={() => {
                        //   let validation = true;
                        //   if (!advanceSearchForm.values.name) {
                        //     validation = false;
                        //     advanceSearchForm.setFieldError("name", true);
                        //   }
                        //   if (!advanceSearchForm.values.mobile) {
                        //     validation = false;
                        //     advanceSearchForm.setFieldError("mobile", true);
                        //   }
                        //   if (!advanceSearchForm.values.invoice) {
                        //     validation = false;
                        //     advanceSearchForm.setFieldError("invoice", true);
                        //   }

                        //   if (validation) {
                        //     // const value = {
                        //     //   url: "core/customer",
                        //     //   data: advanceSearchForm.values,
                        //     // };
                        //     // dispatch(storeEntityData(value));
                        //     // advanceSearchForm.reset();
                        //     // setRefreshCustomerDropdown(true);
                        //     // advanceSearchFormOpened(false);
                        //     // document.getElementById(focusField).focus();
                        //   }
                        // }}
                      >
                        <Flex direction={`column`} gap={0}>
                          <Text fz={12} fw={400}>
                            {t("Search")}
                          </Text>
                        </Flex>
                      </Button>
                    </Grid.Col>
                  </Grid>
                </Box>
              </Box>
            </form>
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
