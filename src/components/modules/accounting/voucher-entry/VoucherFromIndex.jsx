import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  rem,
  Grid,
  Box,
  Group,
  Text,
  ActionIcon,
  Stack,
  Button,
  Flex,
  NumberInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconCalendar,
  IconCheck,
  IconTrashX,
  IconDeviceFloppy,
  IconPlus,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { DataTable } from "mantine-datatable";
import {
  setFetching,
  setValidationData,
  storeEntityDataWithFile,
} from "../../../../store/accounting/crudSlice.js";
import tableCss from "../../../../assets/css/Table.module.css";

import ShortcutVoucher from "../../shortcut/ShortcutVoucher.jsx";
import VoucherNavigation from "./VoucherNavigation.jsx";
import CustomerVoucherForm from "./voucher-forms/CustomerVoucherForm.jsx";
import { DateInput } from "@mantine/dates";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import Navigation from "../common/Navigation.jsx";
import VendorVoucherForm from "./voucher-forms/VendorVoucherForm.jsx";
import ContraVoucherForm from "./voucher-forms/ContraVoucherForm.jsx";
import genericClass from "../../../../assets/css/Generic.module.css";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import BankDrawer from "../common/BankDrawer.jsx";

function VoucherFormIndex(props) {
  const { currencySymbol } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 196;

  const [activeTab, setActiveTab] = useState("Customer Voucher");
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const perPage = 50;
  const [page, setPage] = useState(1);
  const fetching = useSelector((state) => state.crudSlice.fetching);
  const indexData = useSelector((state) => state.crudSlice.indexEntityData);

  const [files, setFiles] = useState([]);
  const [records, setRecords] = useState([]);

  const [ledgerHead, setLedgerHead] = useState("");
  const [loadVoucher, setLoadVoucher] = useState(false);
  useEffect(() => {
    const vouchers = localStorage.getItem("vouchers-entry");
    setRecords(vouchers ? JSON.parse(vouchers) : []);
  }, []);
  useEffect(() => {
    const vouchers = localStorage.getItem("vouchers-entry");
    setRecords(vouchers ? JSON.parse(vouchers) : []);
    setLoadVoucher(false);
  }, [loadVoucher]);

  const categorizedOptions = [
    {
      group: t("BankAccount"),
      items: [
        {
          value: "bank_account_sonali",
          label: "Sonali Bank, Gulshan Branch (00115633005315)",
        },
        { value: "bank_account_agrani", label: "Agrani Bank" },
      ],
    },
  ];
  const [bankDetails, setBankDetails] = useState(null);
  const [bankDrawer, setBankDrawer] = useState(false);
  useEffect(() => {
    if (ledgerHead === "bank_account_sonali") {
      setBankDetails({
        account_number: "00115633005315",
        account_name: "Sonali Bank, Gulshan Branch",
        bank_name: "Sonali Bank",
        branch_name: "Gulshan Branch",
        opening_balance: 1002221,
      });

      // Get current vouchers from local storage
      const storedVouchers =
        JSON.parse(localStorage.getItem("vouchers-entry")) || [];

      // Remove any existing bank entries
      const filteredVouchers = storedVouchers.filter(
        (voucher) => !voucher.name.startsWith("bank_account_")
      );

      filteredVouchers.push({
        name: ledgerHead,
        debit: 0,
        credit: 0,
        mode: "CR",
        to: "Sonali Bank, Gulshan Branch",
        cheque_no: null,
      });

      // Save to local storage
      localStorage.setItem("vouchers-entry", JSON.stringify(filteredVouchers));
      setLoadVoucher(true);
      setBankDrawer(true);
    }
    if (ledgerHead === "bank_account_agrani") {
      setBankDetails({
        account_number: "00115633005315",
        account_name: "Agrani Bank",
        bank_name: "Agrani Bank",
        branch_name: "Gulshan Branch",
        opening_balance: 5000,
      });

      // Get current vouchers from local storage
      const storedVouchers =
        JSON.parse(localStorage.getItem("vouchers-entry")) || [];

      // Remove any existing bank entries
      const filteredVouchers = storedVouchers.filter(
        (voucher) => !voucher.name.startsWith("bank_account_")
      );

      filteredVouchers.push({
        name: ledgerHead,
        debit: 0,
        credit: 0,
        mode: "CR",
        to: null,
        cheque_no: null,
      });

      localStorage.setItem("vouchers-entry", JSON.stringify(filteredVouchers));
    }
    setBankDrawer(true);
  }, [ledgerHead]);

  const form = useForm({
    initialValues: {
      method_id: "",
      name: "",
      short_name: "",
      authorised_mode_id: "",
      account_mode_id: "",
      service_charge: "",
      account_owner: "",
      path: "",
    },
    validate: {
      method_id: isNotEmpty(),
      name: hasLength({ min: 2, max: 20 }),
      short_name: hasLength({ min: 2, max: 20 }),
      authorised_mode_id: isNotEmpty(),
      account_mode_id: isNotEmpty(),
      path: isNotEmpty(),
      service_charge: (value) => {
        if (value) {
          const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
          if (!isNumberOrFractional) {
            return true;
          }
        }
        return null;
      },
    },
  });

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("method_id").click();
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

  const handleInputChange = (index, field, value) => {
    const updatedRecords = records.map((record, i) =>
      i === index ? { ...record, [field]: value } : record
    );
    setRecords(updatedRecords);
  };

  const totalDebit = records.reduce(
    (acc, record) => acc + parseFloat(record.debit || 0),
    0
  );
  const totalCredit = records.reduce(
    (acc, record) => acc + parseFloat(record.credit || 0),
    0
  );
  useEffect(() => {
    dispatch(setFetching(false));
  });

  const [value, setValue] = useState(null);
  const renderForm = () => {
    switch (activeTab) {
      case "Customer Voucher":
        return <CustomerVoucherForm />;
      case "Vendor Voucher":
        return <VendorVoucherForm />;
      case "Contra Voucher":
        return <ContraVoucherForm />;
    }
  };
  return (
    <Box pt={6} bg={"#f0f1f9"}>
      <Box>
        <Grid columns={24} gutter={{ base: 6 }}>
          <Grid.Col span={1}>
            <Navigation module={"voucher-entry"} />
          </Grid.Col>
          <Grid.Col span={3}>
            <Box bg={"white"}>
              <VoucherNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={19}>
            <Box
              p={"xs"}
              style={{ borderRadius: 4 }}
              className={`borderRadiusAll ${genericClass.genericSecondaryBg}`}
              mb={"6"}
            >
              <Box p={"xs"} className={genericClass.genericHighlightedBox}>
                <Box
                  style={{ borderRadius: 4 }}
                  className={genericClass.genericHighlightedBox}
                >
                  <SelectForm
                    tooltip={t("Head")}
                    label={t("")}
                    placeholder={t("ChooseHead")}
                    required={true}
                    nextField={""}
                    name={"ledger_head"}
                    form={form}
                    dropdownValue={categorizedOptions}
                    id={"ledger_head"}
                    searchable={true}
                    value={ledgerHead}
                    changeValue={setLedgerHead}
                  />
                </Box>
              </Box>
              <Box
                pl={"4"}
                pr={"4"}
                mt={"4"}
                pt={"8"}
                pb={"4"}
                style={{ borderRadius: 4 }}
              >
                <Grid columns={18} gutter={{ base: 2 }}>
                  <Grid.Col span={3} mt={2}>
                    <Text ta="left" size="xs" pl={"md"}>
                      {t("Name")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta="left" size="sm">
                      {bankDetails?.account_name}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3} mt={2}>
                    <Text ta="left" size="xs" pl={"md"}>
                      {t("AccountNumber")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta="left" size="sm">
                      {" "}
                      {bankDetails?.account_number}
                    </Text>
                  </Grid.Col>
                </Grid>
                <Grid columns={18} gutter={{ base: 2 }}>
                  <Grid.Col span={3} mt={2}>
                    <Text ta="left" size="xs" pl={"md"}>
                      {t("OpeningBalance")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta="left" size="sm">
                      {" "}
                      {currencySymbol} {bankDetails?.opening_balance}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3} mt={2}>
                    <Text ta="left" size="xs" pl={"md"}>
                      {t("BranchName")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta="left" size="sm">
                      {" "}
                      {bankDetails?.branch_name}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Box>
            </Box>
            <Grid columns={24} gutter={{ base: 6 }}>
              <Grid.Col span={8}>
                <Box>
                  <Box bg={"white"}>{renderForm()}</Box>
                </Box>
              </Grid.Col>
              <Grid.Col span={16}>
                <form
                  id="indexForm"
                  onSubmit={form.onSubmit((values) => {
                    dispatch(setValidationData(false));
                    modals.openConfirmModal({
                      title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                      ),
                      children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                      ),
                      labels: { confirm: "Confirm", cancel: "Cancel" },
                      confirmProps: { color: "red" },
                      onCancel: () => console.log("Cancel"),
                      onConfirm: () => {
                        const formValue = { ...form.values };
                        formValue["path"] = files[0];

                        const data = {
                          url: "accounting/transaction-mode",
                          data: formValue,
                        };
                        dispatch(storeEntityDataWithFile(data));

                        notifications.show({
                          color: "teal",
                          title: t("CreateSuccessfully"),
                          icon: (
                            <IconCheck
                              style={{ width: rem(18), height: rem(18) }}
                            />
                          ),
                          loading: false,
                          autoClose: 700,
                          style: { backgroundColor: "lightgray" },
                        });

                        setTimeout(() => {
                          form.reset();
                          setFiles([]);
                          dispatch(setFetching(true));
                        }, 700);
                      },
                    });
                  })}
                >
                  <Box p={"xs"} className={"borderRadiusAll"} bg={"white"}>
                    <Box className="borderRadiusAll">
                      <DataTable
                        classNames={{
                          root: tableCss.root,
                          table: tableCss.table,
                          header: tableCss.header,
                          footer: tableCss.footer,
                          pagination: tableCss.pagination,
                        }}
                        records={records}
                        columns={[
                          {
                            accessor: "item_index",
                            title: t("S/N"),
                            width: 70,
                            render: (record) => (
                              <ActionIcon color="red.5" size={"sm"}>
                                <IconPlus height={18} width={18} stroke={1.5} />
                              </ActionIcon>
                            ),
                          },
                          {
                            accessor: "mode",
                            title: t("Mode"),
                            width: 100,
                          },
                          {
                            accessor: "name",
                            title: t("LedgerName"),
                          },
                          {
                            accessor: "debit",
                            title: t("Debit"),
                            width: 130,
                            render: (record, index) => (
                              <NumberInput
                                hideControls
                                ta={"right"}
                                value={record.debit}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "debit",
                                    e.target.value
                                  )
                                }
                              />
                            ),
                          },
                          {
                            accessor: "credit",
                            title: t("Credit"),
                            width: 130,
                            resizable: true,
                            render: (record, index) => (
                              <NumberInput
                                hideControls
                                value={record.credit}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "credit",
                                    e.target.value
                                  )
                                }
                              />
                            ),
                          },
                          {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (record) => (
                              <Group gap={8} justify="right" wrap="nowrap">
                                <ActionIcon
                                  size={"sm"}
                                  variant="transparent"
                                  color="red.5"
                                >
                                  <IconTrashX size="xs" stroke={1.5} />
                                </ActionIcon>
                              </Group>
                            ),
                          },
                        ]}
                        fetching={fetching}
                        totalRecords={indexData.total}
                        // useDataTableColumns
                        key={"item_index"}
                        recordsPerPage={perPage}
                        // resizableColumns
                        onPageChange={(p) => {
                          setPage(p);
                          dispatch(setFetching(true));
                        }}
                        loaderSize="xs"
                        loaderColor="grape"
                        height={height - 274}
                        scrollAreaProps={{ type: "never" }}
                      />
                    </Box>
                  </Box>
                  <Box mt={4}>
                    <Box p={"xs"} className="borderRadiusAll" bg={"white"}>
                      <Grid columns={12} gutter={{ base: 6 }}>
                        <Grid.Col span={6}>
                          <Box
                            className="borderRadiusAll"
                            p={"xs"}
                            bg={"white"}
                          >
                            <Box>
                              <InputNumberForm
                                tooltip={t("VoucherRefNo")}
                                label={t("VoucherRefNo")}
                                placeholder={t("VoucherRefNo")}
                                required={true}
                                nextField={"pay_mode"}
                                name={"cheque_no"}
                                form={form}
                                mt={0}
                                id={"cheque_no"}
                              />
                            </Box>
                            <Box mt={"xs"}>
                              <DateInput
                                rightSection={
                                  <IconCalendar size={16} opacity={0.5} />
                                }
                                clearable
                                onChange={setValue}
                                value={value}
                                label={t("ReceiveVoucherDate")}
                                placeholder={t("StartDate")}
                                nextField={"payment_mode"}
                              />
                            </Box>
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Box
                            className="borderRadiusAll"
                            pl={"xs"}
                            pr={"xs"}
                            h={154}
                            bg={"white"}
                          >
                            <Box mt={"md"}>
                              <TextAreaForm
                                autosize={true}
                                minRows={4}
                                maxRows={4}
                                tooltip={t("Narration")}
                                label={t("Narration")}
                                placeholder={t("Narration")}
                                required={false}
                                nextField={"EntityFormSubmits"}
                                name={"narration"}
                                form={form}
                                mt={8}
                                id={"narration"}
                              />
                            </Box>
                          </Box>
                        </Grid.Col>
                      </Grid>
                      <Box mt={"4"} bg={"white"}>
                        <Box
                          mt={4}
                          pl={`xs`}
                          pr={8}
                          pt={"xs"}
                          pb={"xs"}
                          mb={"4"}
                          className={"boxBackground borderRadiusAll"}
                        >
                          <Grid>
                            <Grid.Col span={9}></Grid.Col>
                            <Grid.Col span={3}>
                              <Stack right align="flex-end">
                                {!saveCreateLoading && isOnline && (
                                  <Button
                                    size="xs"
                                    color={"green.8"}
                                    type="submit"
                                    form={"indexForm"}
                                    id="EntityFormSubmits"
                                    leftSection={<IconDeviceFloppy size={16} />}
                                  >
                                    <Flex direction={"column"} gap={0}>
                                      <Text fz={14} fw={400}>
                                        {t("AddVoucher")}
                                      </Text>
                                    </Flex>
                                  </Button>
                                )}
                              </Stack>
                            </Grid.Col>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </form>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={1}>
            <Box className={"borderRadiusAll"} pt={"16"} bg={"white"}>
              <ShortcutVoucher
                form={form}
                FormSubmit={"EntityFormSubmit"}
                Name={"method_id"}
                inputType="select"
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
      {bankDrawer && (
        <BankDrawer
          bankDrawer={bankDrawer}
          setBankDrawer={setBankDrawer}
          module={"VoucherEntry"}
          setLoadVoucher={setLoadVoucher}
        />
      )}
    </Box>
  );
}

export default VoucherFormIndex;
