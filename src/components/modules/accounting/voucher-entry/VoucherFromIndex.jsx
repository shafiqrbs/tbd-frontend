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
  IconPlus, IconSum,
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

  const [loadVoucher, setLoadVoucher] = useState(false);
  const [currentEntryType, setCurrentEntryType] = useState("");





  const [allVoucherList, setAllVoucherList] = useState([]);
  const [mainLedgerDropdownData, setMainLedgerDropdownData] = useState([]);
  const [mainLedgerHeadData, setMainLedgerHeadData] = useState(null);
  const [mainLedgerHeadObject, setMainLedgerHeadObject] = useState(null);
  const [ledgerHeadDropdownData, setLedgerHeadDropdownData] = useState([]);
  const [myItems,setMyItems] = useState([])

  // Sum debit and credit
  const totals = myItems.reduce(
      (acc, item) => {
        acc.debit += Number(item.debit) || 0;
        acc.credit += Number(item.credit) || 0;
        return acc;
      },
      { debit: 0, credit: 0 }
  );

  const loadMyItemsFromStorage = () => {
    const saved = localStorage.getItem("temp-voucher-entry");
    const parsed = saved ? JSON.parse(saved) : [];
    setMyItems(parsed);
  };


  useEffect(() => {
    loadMyItemsFromStorage();
  }, []);

  useEffect(() => {
    const cardProducts = localStorage.getItem("temp-voucher-entry");
    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
    setMyItems(myCardProducts)
  }, [mainLedgerHeadData]);


  // 1. Load main ledger dropdown data when activeVoucher changes
  useEffect(() => {
    if (activeVoucher?.id) {
      const transformedData = activeVoucher?.ledger_account_head.map(item => ({
        label: item.name,
        value: String(item.id)
      }));
      setMainLedgerDropdownData(transformedData);
    }
  }, [activeVoucher]);

  // 2. Filter ledgerHeadEntryForm whenever ledgerHead or dropdown data changes
  useEffect(() => {
    if (mainLedgerHeadData && mainLedgerDropdownData.length > 0) {
      const updatedData = mainLedgerDropdownData.filter(item => item.value !== mainLedgerHeadData);
      const mainLedgerObject = activeVoucher?.ledger_account_head.filter(item => item.id == mainLedgerHeadData);
      setLedgerHeadDropdownData(updatedData);
      setMainLedgerHeadObject(mainLedgerObject[0])
    }
  }, [mainLedgerHeadData, mainLedgerDropdownData]);

 /* useEffect(() => {
    if (mainLedgerHeadData){
       handleAddProductByProductId('main-ledger');
    }
  }, [mainLedgerHeadData]);*/

  useEffect(() => {
    if (mainLedgerHeadObject && mainLedgerHeadData) {
      handleAddProductByProductId('main-ledger');
    }
  }, [mainLedgerHeadObject]);

  function handleAddProductByProductId(addedType) {
    const cardProducts = localStorage.getItem("temp-voucher-entry");
    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];

    const alreadyExists = myCardProducts.some(p => p.id === mainLedgerHeadObject?.id);

    if (alreadyExists) return;

    let updatedProducts = [
      ...myCardProducts,
      {
        id: mainLedgerHeadObject?.id,
        mode: activeVoucher?.mode,
        ledger_name: mainLedgerHeadObject?.display_name,
        account_head: mainLedgerHeadObject?.display_name,
        debit: 0,
        credit: 0,
        type: addedType
      }
    ];

    updateLocalStorageAndResetForm(updatedProducts, addedType);
  }

  //update local storage and reset form values
  function updateLocalStorageAndResetForm(addProducts, addedType) {
    localStorage.setItem("temp-voucher-entry", JSON.stringify(addProducts));
    loadMyItemsFromStorage();
  }

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...myItems];

    // Parse the number safely
    const parsedValue = parseFloat(value) || 0;

    // Update the specific field
    if (field === "debit") {
      updatedItems[index].debit = parsedValue;
      updatedItems[index].credit = 0;
    } else {
      updatedItems[index].credit = parsedValue;
      updatedItems[index].debit = 0;
    }

    // Recalculate totals (excluding first row)
    const restItems = updatedItems.slice(1); // Exclude index 0
    const totals = restItems.reduce(
        (acc, item) => {
          acc.debit += Number(item.debit) || 0;
          acc.credit += Number(item.credit) || 0;
          return acc;
        },
        { debit: 0, credit: 0 }
    );

    // Adjust the first row to balance the table
    if (updatedItems.length > 0) {
      const firstRow = updatedItems[0];
      const diff = totals.debit - totals.credit;

      if (diff > 0) {
        // Add to credit side
        firstRow.credit = diff;
        firstRow.debit = 0;
      } else if (diff < 0) {
        // Add to debit side
        firstRow.debit = Math.abs(diff);
        firstRow.credit = 0;
      } else {
        // Balanced
        firstRow.debit = 0;
        firstRow.credit = 0;
      }
    }

    // Save and update state
    setMyItems(updatedItems); // Update React state
    localStorage.setItem("temp-voucher-entry", JSON.stringify(updatedItems)); // Sync with storage
  };

  const handleDeleteVoucher = (indexToDelete) => {
    const updatedItems = [...myItems];

    // Remove the item
    updatedItems.splice(indexToDelete, 1);

    // 🔁 Optional: rebalance the first row
    const restItems = updatedItems.slice(1); // Exclude index 0
    const totals = restItems.reduce(
        (acc, item) => {
          acc.debit += Number(item.debit) || 0;
          acc.credit += Number(item.credit) || 0;
          return acc;
        },
        { debit: 0, credit: 0 }
    );

    if (updatedItems.length > 0) {
      const firstRow = updatedItems[0];
      const diff = totals.debit - totals.credit;

      if (diff > 0) {
        firstRow.credit = diff;
        firstRow.debit = 0;
      } else if (diff < 0) {
        firstRow.debit = Math.abs(diff);
        firstRow.credit = 0;
      } else {
        firstRow.debit = 0;
        firstRow.credit = 0;
      }
    }

    // Update state/storage
    setMyItems(updatedItems);
    localStorage.setItem("temp-voucher-entry", JSON.stringify(updatedItems));
  };




  // render entry ledger form
  const renderForm = () => {
        return <CustomerVoucherForm
            ledgerHeadDropdownData={ledgerHeadDropdownData}
            loadMyItemsFromStorage={loadMyItemsFromStorage}
            mainLedgerHeadObject={mainLedgerHeadObject}
            activeVoucher={activeVoucher}
        />;
  };




  const [bankDetails, setBankDetails] = useState(null);
  const [bankDrawer, setBankDrawer] = useState(false);

  // Delete voucher entry handler

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

  const [value, setValue] = useState(null);


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
                allVoucherList={allVoucherList}
                setAllVoucherList={setAllVoucherList}
                setMainLedgerHeadData={setMainLedgerHeadData}
                loadMyItemsFromStorage={loadMyItemsFromStorage}
                setMainLedgerHeadObject={setMainLedgerHeadObject}
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
                    name={"main_ledger_head"}
                    form={form}
                    dropdownValue={mainLedgerDropdownData}
                    id={"main_ledger_head"}
                    searchable={true}
                    value={mainLedgerHeadData}
                    changeValue={setMainLedgerHeadData}
                    disabled={mainLedgerHeadObject && mainLedgerHeadData}
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
                      {mainLedgerHeadObject?.name}
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
                      {mainLedgerHeadObject?.name}
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
                      {currencySymbol} {mainLedgerHeadObject?.opening_balance}
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
                      {mainLedgerHeadObject?.credit_limit}
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
                        records={myItems}
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
                            accessor: "ledger_name",
                            title: t("LedgerName"),
                          },
                          {
                            accessor: "account_head",
                            title: t("AccountHead"),
                          },
                          {
                            accessor: "debit",
                            title: t("Debit"),
                            width: 120,
                            render: (record, index) => (
                                <NumberInput
                                    disabled={record.mode === "credit"}
                                    hideControls
                                    ta={"right"}
                                    value={record.debit}
                                    onChange={(val) => handleInputChange(index, "debit", val)}
                                />
                            ),
                            footer: (
                                <Group gap="xs">
                                  <Box mb={-4}>
                                    <IconSum size={16} />
                                  </Box>
                                  <div>{totals.debit}</div>
                                </Group>
                            ),
                          },
                          {
                            accessor: "credit",
                            title: t("Credit"),
                            width: 120,
                            resizable: true,
                            render: (record, index) => (
                                <NumberInput
                                    disabled={record.mode === "debit"}
                                    hideControls
                                    ta={"right"}
                                    value={record.credit}
                                    onChange={(val) => handleInputChange(index, "credit", val)}
                                />
                            ),
                            footer: (
                                <Group gap="xs">
                                  <Box mb={-4}>
                                    <IconSum size={16} />
                                  </Box>
                                  <div>{totals.credit}</div>
                                </Group>
                            ),
                          },
                          {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (record, index) => (
                              <Group gap={8} justify="right" wrap="nowrap">
                                {
                                  record.type === 'ledger' &&
                                    <ActionIcon
                                        size={"sm"}
                                        variant="transparent"
                                        color="red.5"
                                        onClick={() => handleDeleteVoucher(index)}
                                    >
                                      <IconTrashX size="xs" stroke={1.5} />
                                    </ActionIcon>
                                }
                              </Group>
                            ),
                          },
                        ]}
                        fetching={fetching}
                        totalRecords={indexData.total}
                        key={"item_index"}
                        recordsPerPage={perPage}
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
