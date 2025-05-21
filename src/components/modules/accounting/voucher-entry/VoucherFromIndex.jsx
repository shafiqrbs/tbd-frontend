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
  NumberInput, TextInput,
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
import { notifications, showNotification } from "@mantine/notifications";
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
import inputCss from "../../../../assets/css/InlineInputField.module.css";

function VoucherFormIndex(props) {
  const { currencySymbol } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 196;

  const [activeVoucher, setActiveVoucher] = useState(null);
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const perPage = 50;
  const [page, setPage] = useState(1);
  const fetching = useSelector((state) => state.crudSlice.fetching);
  const indexData = useSelector((state) => state.crudSlice.indexEntityData);
  const [reloadList, setReloadList] = useState(true)

  const [files, setFiles] = useState([]);
  const [records, setRecords] = useState([]);

  const [ledgerHead, setLedgerHead] = useState("");
  const [loadVoucher, setLoadVoucher] = useState(false);
  const [currentEntryType, setCurrentEntryType] = useState("");

  // Load vouchers from both local storage keys and merge them
  useEffect(() => {
    const mainVouchers =
      JSON.parse(localStorage.getItem("vouchers-entry")) || [];
    const formVouchers =
      JSON.parse(localStorage.getItem("vouchers-entry-form")) || [];

    // Combine both voucher sets
    const combinedVouchers = [...mainVouchers, ...formVouchers];

    // Sort vouchers: CR entries first, then DR entries
    const sortedVouchers = combinedVouchers.sort((a, b) => {
      // First prioritize CR entries
      if (a.mode === "CR" && b.mode !== "CR") return -1;
      if (a.mode !== "CR" && b.mode === "CR") return 1;
      return 0;
    });

    setRecords(sortedVouchers);
  }, []);

  // Reload vouchers when loadVoucher changes
  useEffect(() => {
    if (loadVoucher) {
      const mainVouchers =
        JSON.parse(localStorage.getItem("vouchers-entry")) || [];
      const formVouchers =
        JSON.parse(localStorage.getItem("vouchers-entry-form")) || [];

      // Combine both voucher sets
      const combinedVouchers = [...mainVouchers, ...formVouchers];

      // Sort vouchers: CR entries first, then DR entries
      const sortedVouchers = combinedVouchers.sort((a, b) => {
        // First prioritize CR entries
        if (a.mode === "CR" && b.mode !== "CR") return -1;
        if (a.mode !== "CR" && b.mode === "CR") return 1;
        return 0;
      });

      setRecords(sortedVouchers);
      setLoadVoucher(false);
    }
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

  // Fix the null check in hasCREntry
  const hasCREntry = () => {
    const mainVouchers =
      JSON.parse(localStorage.getItem("vouchers-entry")) || [];
    const formVouchers =
      JSON.parse(localStorage.getItem("vouchers-entry-form")) || [];

    // Check both storage locations for CR entries with proper null checking
    return (
      mainVouchers.some((voucher) => voucher && voucher.mode === "CR") ||
      formVouchers.some((voucher) => voucher && voucher.mode === "CR")
    );
  };

  const showNotificationComponent = (message, color) => {
    showNotification({
      title: message,
      color: color,
    });
  };

  useEffect(() => {
    if (ledgerHead) {
      setCurrentEntryType(ledgerHead);

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
          (voucher) =>
            !voucher.name || !voucher.name.startsWith("bank_account_")
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
        localStorage.setItem(
          "vouchers-entry",
          JSON.stringify(filteredVouchers)
        );
        setLoadVoucher(true);
        setBankDrawer(true);
      } else if (ledgerHead === "bank_account_agrani") {
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
          (voucher) =>
            !voucher.name || !voucher.name.startsWith("bank_account_")
        );

        filteredVouchers.push({
          name: ledgerHead,
          debit: 0,
          credit: 0,
          mode: "CR",
          to: "Agrani Bank",
          cheque_no: null,
        });

        localStorage.setItem(
          "vouchers-entry",
          JSON.stringify(filteredVouchers)
        );
        setLoadVoucher(true);
        setBankDrawer(true);
      }
    }
  }, [ledgerHead]);

  // Delete voucher entry handler
  const handleDeleteVoucher = (index) => {
    const updatedRecords = [...records];
    const deletedVoucher = updatedRecords[index];
    updatedRecords.splice(index, 1);

    // Check if it's from the main vouchers or form vouchers
    const mainVouchers =
      JSON.parse(localStorage.getItem("vouchers-entry")) || [];
    const formVouchers =
      JSON.parse(localStorage.getItem("vouchers-entry-form")) || [];

    // Update the appropriate storage
    const isInMainVouchers = mainVouchers.some(
      (v) => v.name === deletedVoucher.name && v.mode === deletedVoucher.mode
    );

    if (isInMainVouchers) {
      const updatedMainVouchers = mainVouchers.filter(
        (v, i) =>
          !(v.name === deletedVoucher.name && v.mode === deletedVoucher.mode)
      );
      localStorage.setItem(
        "vouchers-entry",
        JSON.stringify(updatedMainVouchers)
      );
    } else {
      const updatedFormVouchers = formVouchers.filter(
        (v, i) =>
          !(v.name === deletedVoucher.name && v.mode === deletedVoucher.mode)
      );
      localStorage.setItem(
        "vouchers-entry-form",
        JSON.stringify(updatedFormVouchers)
      );
    }

    setRecords(updatedRecords);
  };

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

  // Update to safely handle potentially null values
  const totalDebit = records.reduce(
    (acc, record) =>
      acc +
      (record && !isNaN(parseFloat(record.debit || 0))
        ? parseFloat(record.debit || 0)
        : 0),
    0
  );
  const totalCredit = records.reduce(
    (acc, record) =>
      acc +
      (record && !isNaN(parseFloat(record.credit || 0))
        ? parseFloat(record.credit || 0)
        : 0),
    0
  );

  // Fix isBalanced calculation to handle floating point precision issues
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  useEffect(() => {
    dispatch(setFetching(false));
  });

  const EditableNumberInput = ({ item, field, placeholder, value, onChange }) => {
    const [inputValue, setInputValue] = useState(value || "");

    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    const handleChange = (e) => {
      const val = e.currentTarget.value;
      setInputValue(val);
      if (onChange) {
        onChange(item.id, field, val);
      }
    };

    return (
        <TextInput
            type="number"
            classNames={inputCss}
            size="xs"
            id={`inline-update-${field}-${item.id}`}
            value={inputValue}
            placeholder={placeholder}
            onChange={handleChange}
            style={{ width: "80px" }}
        />
    );
  };

  const [value, setValue] = useState(null);
  const renderForm = () => {
    switch (activeVoucher) {
      case "Customer Voucher":
        return <CustomerVoucherForm />;
      case "Vendor Voucher":
        return <VendorVoucherForm />;
      case "Contra Voucher":
        return <ContraVoucherForm />;
    }
  };

  console.log(activeVoucher)
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
                activeVoucher={activeVoucher}
                setActiveVoucher={setActiveVoucher}
                setReloadList={setReloadList}
                reloadList={reloadList}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={19}>
            {activeVoucher &&
                <>
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
                    placeholder={t("ChooseLedgerHead")}
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
                            accessor: "name",
                            title: t("AccountHead"),
                          },
                          {
                            accessor: "debit",
                            title: t("Debit"),
                            width: 120,
                            render: (record, index) => (

                              <NumberInput
                                disabled={record.mode === "CR"}
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
                            width: 120,
                            resizable: true,
                            render: (record, index) => (
                              <NumberInput
                                disabled={record.mode === "DR"}
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
                            render: (record, index) => (
                              <Group gap={8} justify="right" wrap="nowrap">
                                <ActionIcon
                                  size={"sm"}
                                  variant="transparent"
                                  color="red.5"
                                  onClick={() => handleDeleteVoucher(index)}
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
                            <Grid.Col span={9}>
                              <Text size="sm" weight={500}>
                                {t("TotalDebit")}: {totalDebit.toFixed(2)} |{" "}
                                {t("TotalCredit")}: {totalCredit.toFixed(2)}
                              </Text>
                              <Text
                                size="sm"
                                color={isBalanced ? "green" : "red"}
                                weight={600}
                              >
                                {isBalanced
                                  ? t("VoucherBalanced")
                                  : t("VoucherNotBalanced")}
                              </Text>
                            </Grid.Col>
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
                                    disabled={!isBalanced || records.length < 2}
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
                </>
        }
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
          sourceForm="main"
          entryType={currentEntryType}
        />
      )}
    </Box>
  );
}

export default VoucherFormIndex;
