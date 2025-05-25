import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
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
  IconTrashX,
  IconDeviceFloppy,
  IconPlus,
  IconSum,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { DataTable } from "mantine-datatable";

// Redux Actions
import {
  setFetching,
  setValidationData,
} from "../../../../store/accounting/crudSlice";
import { storeEntityData } from "../../../../store/core/crudSlice";

// Notifications
import { showNotificationComponent } from "../../../core-component/showNotificationComponent";

// Styles
import tableCss from "../../../../assets/css/Table.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";

// Components
import ShortcutVoucher from "../../shortcut/ShortcutVoucher";
import VoucherNavigation from "./VoucherNavigation";
import CustomerVoucherForm from "./voucher-forms/CustomerVoucherForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SelectForm from "../../../form-builders/SelectForm";
import BankDrawer from "../common/BankDrawer";
import Navigation from "../common/Navigation";
import DatePickerForm from "../../../form-builders/DatePicker";

function VoucherFormIndex({ currencySymbol }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 196;

  const [activeVoucher, setActiveVoucher] = useState(null);
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 50;
  const fetching = useSelector((state) => state.crudSlice.fetching);
  const indexData = useSelector((state) => state.crudSlice.indexEntityData);

  const [reloadList, setReloadList] = useState(true);
  const [loadVoucher, setLoadVoucher] = useState(false);
  const [currentEntryType, setCurrentEntryType] = useState("");

  const [allVoucherList, setAllVoucherList] = useState([]);
  const [mainLedgerDropdownData, setMainLedgerDropdownData] = useState([]);
  const [mainLedgerHeadData, setMainLedgerHeadData] = useState(null);
  const [mainLedgerHeadObject, setMainLedgerHeadObject] = useState(null);

  const [ledgerHeadDropdownData, setLedgerHeadDropdownData] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [ledgerHead, setLedgerHead] = useState("");
  const [primaryLedgerDropdownEnable, setPrimaryLedgerDropdownEnable] =
      useState(false);
  const [bankDrawer, setBankDrawer] = useState(false);

  // Load ledger items from localStorage
  const loadMyItemsFromStorage = () => {
    const saved = localStorage.getItem("temp-voucher-entry");
    const parsed = saved ? JSON.parse(saved) : [];
    setMyItems(parsed);
  };

  // on mount: Load saved ledger items
  useEffect(() => {
    loadMyItemsFromStorage();
  }, []);

  // update when main ledger changes
  useEffect(() => {
    const cardProducts = localStorage.getItem("temp-voucher-entry");
    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
    setMyItems(myCardProducts);
  }, [mainLedgerHeadData]);

  useEffect(() => {
    if (mainLedgerHeadData && mainLedgerDropdownData.length > 0) {
      const mainLedgerObject = activeVoucher?.ledger_account_head_primary
          ?.reduce((acc, group) => {
            if (Array.isArray(group?.child_account_heads)) {
              return [...acc, ...group.child_account_heads];
            }
            return acc;
          }, [])
          ?.filter((item) => item.id == mainLedgerHeadData);
      setMainLedgerHeadObject(mainLedgerObject[0]);
    }
  }, [mainLedgerHeadData, mainLedgerDropdownData]);

  useEffect(() => {
    if (mainLedgerHeadObject && mainLedgerHeadData) {
      handleAddProductByProductId("main-ledger");
    }
  }, [mainLedgerHeadObject, mainLedgerHeadData]);

  // Add main ledger entry
  const handleAddProductByProductId = (addedType) => {
    const cardProducts = localStorage.getItem("temp-voucher-entry");
    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];

    const alreadyExists = myCardProducts.some(
        (p) => p.id === mainLedgerHeadObject?.id
    );

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
        type: addedType,
      },
    ];

    updateLocalStorageAndResetForm(updatedProducts, addedType);
  };

  const updateLocalStorageAndResetForm = (products, type) => {
    localStorage.setItem("temp-voucher-entry", JSON.stringify(products));
    loadMyItemsFromStorage();
    setPrimaryLedgerDropdownEnable(true);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...myItems];
    const parsedValue = parseFloat(value) || 0;

    if (field === "debit") {
      updatedItems[index].debit = parsedValue;
      updatedItems[index].credit = 0;
    } else {
      updatedItems[index].credit = parsedValue;
      updatedItems[index].debit = 0;
    }

    const restItems = updatedItems.slice(1);
    const totals = restItems.reduce(
        (acc, item) => {
          acc.debit += Number(item.debit) || 0;
          acc.credit += Number(item.credit) || 0;
          return acc;
        },
        { debit: 0, credit: 0 }
    );

    const diff = totals.debit - totals.credit;

    if (updatedItems.length > 0) {
      updatedItems[0].credit = diff > 0 ? diff : 0;
      updatedItems[0].debit = diff < 0 ? Math.abs(diff) : 0;
    }

    setMyItems(updatedItems);
    localStorage.setItem("temp-voucher-entry", JSON.stringify(updatedItems));
  };

  const handleDeleteVoucher = (index, type) => {
    if (type === "main-ledger") {
      setMainLedgerHeadObject(null);
      localStorage.removeItem("temp-voucher-entry");
      setMainLedgerHeadData(null);
      setLedgerHead(null);
      setPrimaryLedgerDropdownEnable(false);
      loadMyItemsFromStorage();
    } else {
      const updatedItems = [...myItems];
      updatedItems.splice(index, 1);

      const restItems = updatedItems.slice(1);
      const totals = restItems.reduce(
          (acc, item) => {
            acc.debit += Number(item.debit) || 0;
            acc.credit += Number(item.credit) || 0;
            return acc;
          },
          { debit: 0, credit: 0 }
      );

      if (updatedItems.length > 0) {
        const diff = totals.debit - totals.credit;
        updatedItems[0].credit = diff > 0 ? diff : 0;
        updatedItems[0].debit = diff < 0 ? Math.abs(diff) : 0;
      }

      setMyItems(updatedItems);
      localStorage.setItem("temp-voucher-entry", JSON.stringify(updatedItems));
    }
  };

  const renderForm = () => {
    return (
        <CustomerVoucherForm
            ledgerHeadDropdownData={ledgerHeadDropdownData}
            loadMyItemsFromStorage={loadMyItemsFromStorage}
            mainLedgerHeadObject={mainLedgerHeadObject}
            activeVoucher={activeVoucher}
            setLedgerHead={setLedgerHead}
            ledgerHead={ledgerHead}
        />
    );
  };

  const form = useForm({
    initialValues: {
      ref_no: "",
      issue_date: "",
      description: "",
    },
    validate: {
      ref_no: isNotEmpty(),
      issue_date: isNotEmpty(),
    },
  });

  const totals = myItems.reduce(
      (acc, item) => {
        acc.debit += Number(item.debit) || 0;
        acc.credit += Number(item.credit) || 0;
        return acc;
      },
      { debit: 0, credit: 0 }
  );

  const handleFormSubmit = (values) => {
    dispatch(setValidationData(false));

    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };

        const formValue = {
          ...form.values,
          issue_date: values.issue_date
              ? new Date(values.issue_date).toLocaleDateString("en-CA", options)
              : new Date().toLocaleDateString("en-CA"),
          debit: totals.debit,
          credit: totals.credit,
          voucher_id: activeVoucher?.id,
          items: myItems,
        };

        const value = {
          url: "accounting/voucher-entry",
          data: formValue,
        };

        const resultAction = await dispatch(storeEntityData(value));

        if (storeEntityData.rejected.match(resultAction)) {
          const fieldErrors = resultAction.payload.errors;
          if (fieldErrors) {
            const errorObject = {};
            Object.keys(fieldErrors).forEach((key) => {
              errorObject[key] = fieldErrors[key][0];
            });
            form.setErrors(errorObject);
          }
        } else if (storeEntityData.fulfilled.match(resultAction)) {
          showNotificationComponent(t("CreateSuccessfully"), "teal");
          setTimeout(() => {
            localStorage.removeItem("temp-voucher-entry");
            setPrimaryLedgerDropdownEnable(false);
            setMainLedgerHeadObject(null)
            setMainLedgerHeadData(null);
            setLedgerHead(null);
            setActiveVoucher(null);
            loadMyItemsFromStorage();
            form.reset();
          }, 700);
        }
      },
    });
  };

  useHotkeys(
      [
        ["alt+n", () => document.getElementById("main_ledger_head").click()],
        ["alt+r", () => form.reset()],
        ["alt+s", () => document.getElementById("EntityFormSubmit")?.click()],
      ],
      []
  );

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
                    setLedgerHeadDropdownData={setLedgerHeadDropdownData}
                    setMainLedgerDropdownData={setMainLedgerDropdownData}
                    mainLedgerHeadData={mainLedgerHeadData}
                    setLedgerHead={setLedgerHead}
                    setPrimaryLedgerDropdownEnable={setPrimaryLedgerDropdownEnable}
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
                        disabled={primaryLedgerDropdownEnable}
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
                      onSubmit={form.onSubmit(handleFormSubmit)}
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
                                render:(record) =>{
                                  return record.mode==='debit'?'Debit':'Credit'
                                }
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
                                        <ActionIcon
                                            size={"sm"}
                                            variant="transparent"
                                            color="red.5"
                                            onClick={() => handleDeleteVoucher(index,record.type)}
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
                                    nextField={"issue_date"}
                                    name={"ref_no"}
                                    form={form}
                                    mt={0}
                                    id={"ref_no"}
                                />
                              </Box>
                              <Box mt={"xs"}>
                                <DatePickerForm
                                    tooltip={t("InvoiceDateValidateMessage")}
                                    label={t("IssueDate")}
                                    placeholder={t("IssueDate")}
                                    required={true}
                                    nextField={"discount"}
                                    form={form}
                                    name={"issue_date"}
                                    id={"issue_date"}
                                    leftSection={<IconCalendar size={16} opacity={0.5}/>}
                                    rightSectionWidth={30}
                                    closeIcon={true}
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
                                    name={"description"}
                                    form={form}
                                    mt={8}
                                    id={"description"}
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
                                          disabled={totals.debit !== totals.credit}
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
                sourceForm="main"
                entryType={currentEntryType}
            />
        )}
      </Box>
  );
}

export default VoucherFormIndex;
