import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, ScrollArea, Button, Text, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconCalendar } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
  setValidationData,
  storeEntityData,
} from "../../../../store/core/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm";
import { setFormLoading } from "../../../../store/inventory/crudSlice";
import DatePickerForm from "../../../form-builders/DatePicker.jsx";

function AccountingForm(props) {
  const {
    accountDropdownData,
    voucherDropdownData,
    height,
    account_config,
    id,
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  // State variables for each dropdown
  const [accountBankData, setAccountBankData] = useState(null);
  const [accountCashData, setAccountCashData] = useState(null);
  const [accountCategoryData, setAccountCategoryData] = useState(null);
  const [accountCustomerData, setAccountCustomerData] = useState(null);
  const [accountMobileData, setAccountMobileData] = useState(null);
  const [accountProductGroupData, setAccountProductGroupData] = useState(null);
  const [accountUserData, setAccountUserData] = useState(null);
  const [accountVendorData, setAccountVendorData] = useState(null);
  const [voucherPurchaseData, setVoucherPurchaseData] = useState(null);
  const [voucherPurchaseReturnData, setVoucherPurchaseReturnData] =
    useState(null);
  const [voucherSalesData, setVoucherSalesData] = useState(null);
  const [voucherSalesReturnData, setVoucherSalesReturnData] = useState(null);
  const [voucherStockOpeningData, setVoucherStockOpeningData] = useState(null);
  const [voucherStockReconciliationData, setVoucherStockReconciliationData] =
    useState(null);

  // Helper function to parse dates properly
  const parseDateValue = (dateString) => {
    if (!dateString) return "";

    // If the value is already a Date object, return it
    if (dateString instanceof Date && !isNaN(dateString)) {
      return dateString;
    }

    try {
      // Try to parse the date string into a Date object
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "" : date;
    } catch (e) {
      return "";
    }
  };
  
  // Helper function to format dates for MySQL
  const formatDateForMySQL = (date) => {
    if (!date) return null;
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return null;
      
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return null;
    }
  };
  
  console.log(account_config)
  const form = useForm({
    initialValues: {
      financial_start_date:
        parseDateValue(account_config?.financial_start_date) || "",
      financial_end_date:
        parseDateValue(account_config?.financial_end_date) || "",
      account_bank_id: account_config?.account_bank_id || "",
      account_cash_id: account_config?.account_cash_id || "",
      account_category_id: account_config?.account_category_id || "",
      account_customer_id: account_config?.account_customer_id || "",
      account_mobile_id: account_config?.account_mobile_id || "",
      account_product_group_id: account_config?.account_product_group_id || "",
      account_user_id: account_config?.account_user_id || "",
      account_vendor_id: account_config?.account_vendor_id || "",
      voucher_purchase_id: account_config?.voucher_purchase_id || "",
      voucher_purchase_return_id:
        account_config?.voucher_purchase_return_id || "",
      voucher_sales_id: account_config?.voucher_sales_id || "",
      voucher_sales_return_id: account_config?.voucher_sales_return_id || "",
      voucher_stock_opening_id: account_config?.voucher_stock_opening_id || "",
      voucher_stock_reconciliation_id:
        account_config?.voucher_stock_reconciliation_id || "",
    },
  });

  useEffect(() => {
    if (account_config) {
      form.setValues({
        financial_start_date:
          parseDateValue(account_config?.financial_start_date) || "",
        financial_end_date:
          parseDateValue(account_config?.financial_end_date) || "",
        account_bank_id: account_config?.account_bank_id || "",
        account_cash_id: account_config?.account_cash_id || "",
        account_category_id: account_config?.account_category_id || "",
        account_customer_id: account_config?.account_customer_id || "",
        account_mobile_id: account_config?.account_mobile_id || "",
        account_product_group_id:
          account_config?.account_product_group_id || "",
        account_user_id: account_config?.account_user_id || "",
        account_vendor_id: account_config?.account_vendor_id || "",
        voucher_purchase_id: account_config?.voucher_purchase_id || "",
        voucher_purchase_return_id:
          account_config?.voucher_purchase_return_id || "",
        voucher_sales_id: account_config?.voucher_sales_id || "",
        voucher_sales_return_id: account_config?.voucher_sales_return_id || "",
        voucher_stock_opening_id:
          account_config?.voucher_stock_opening_id || "",
        voucher_stock_reconciliation_id:
          account_config?.voucher_stock_reconciliation_id || "",
      });
    }
  }, [dispatch, account_config]);

  const handleAccountingFormSubmit = (values) => {
    dispatch(setValidationData(false));
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleAccountingConfirmSubmit(values),
    });
  };

  const handleAccountingConfirmSubmit = async (values) => {
    try {
      setSaveCreateLoading(true);
      
      // Format dates properly for MySQL
      const formattedValues = {
        ...values,
        financial_start_date: formatDateForMySQL(values.financial_start_date),
        financial_end_date: formatDateForMySQL(values.financial_end_date)
      };
      
      const value = {
        url: `domain/config/accounting/${id}`,
        data: formattedValues,
      };
      await dispatch(storeEntityData(value));

      notifications.show({
        color: "teal",
        title: t("UpdateSuccessfully"),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });

      setTimeout(() => {
        setSaveCreateLoading(false);
      }, 700);
    } catch (error) {
      console.error("Error updating accounting config:", error);

      notifications.show({
        color: "red",
        title: t("UpdateFailed"),
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });

      setSaveCreateLoading(false);
    }
  };

  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("AccountingFormSubmit").click();
        },
      ],
    ],
    []
  );

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handleAccountingFormSubmit)}>
        <Box pt={"xs"} pl={"xs"}>
          <Box>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("FinancialStartDate")}
              </Grid.Col>
              <Grid.Col span={12}>
                <DatePickerForm
                  tooltip={t("FinancialStartDateTooltip")}
                  label=""
                  placeholder={t("FinancialStartDate")}
                  required={false}
                  nextField={"financial_end_date"}
                  form={form}
                  name={"financial_start_date"}
                  id={"financial_start_date"}
                  leftSection={<IconCalendar size={16} opacity={0.5} />}
                  rightSectionWidth={30}
                  closeIcon={true}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("FinancialEndDate")}
              </Grid.Col>
              <Grid.Col span={12}>
                <DatePickerForm
                  tooltip={t("FinancialEndDateTooltip")}
                  label=""
                  placeholder={t("FinancialEndDate")}
                  required={false}
                  nextField={"account_bank_id"}
                  form={form}
                  name={"financial_end_date"}
                  id={"financial_end_date"}
                  leftSection={<IconCalendar size={16} opacity={0.5} />}
                  rightSectionWidth={30}
                  closeIcon={true}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("AccountBank")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseAccountBank")}
                  label={""}
                  placeholder={t("ChooseAccountBank")}
                  required={false}
                  nextField={"account_cash_id"}
                  name={"account_bank_id"}
                  form={form}
                  dropdownValue={accountDropdownData}
                  id={"account_bank_id"}
                  searchable={true}
                  value={
                    accountBankData
                      ? String(accountBankData)
                      : account_config?.account_bank_id
                      ? String(account_config.account_bank_id)
                      : null
                  }
                  changeValue={setAccountBankData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("AccountCash")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseAccountCash")}
                  label={""}
                  placeholder={t("ChooseAccountCash")}
                  required={false}
                  nextField={"account_category_id"}
                  name={"account_cash_id"}
                  form={form}
                  dropdownValue={accountDropdownData}
                  id={"account_cash_id"}
                  searchable={true}
                  value={
                    accountCashData
                      ? String(accountCashData)
                      : account_config?.account_cash_id
                      ? String(account_config.account_cash_id)
                      : null
                  }
                  changeValue={setAccountCashData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("AccountCategory")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseAccountCategory")}
                  label={""}
                  placeholder={t("ChooseAccountCategory")}
                  required={false}
                  nextField={"account_customer_id"}
                  name={"account_category_id"}
                  form={form}
                  dropdownValue={accountDropdownData}
                  id={"account_category_id"}
                  searchable={true}
                  value={
                    accountCategoryData
                      ? String(accountCategoryData)
                      : account_config?.account_category_id
                      ? String(account_config.account_category_id)
                      : null
                  }
                  changeValue={setAccountCategoryData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("AccountCustomer")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseAccountCustomer")}
                  label={""}
                  placeholder={t("ChooseAccountCustomer")}
                  required={false}
                  nextField={"account_mobile_id"}
                  name={"account_customer_id"}
                  form={form}
                  dropdownValue={accountDropdownData}
                  id={"account_customer_id"}
                  searchable={true}
                  value={
                    accountCustomerData
                      ? String(accountCustomerData)
                      : account_config?.account_customer_id
                      ? String(account_config.account_customer_id)
                      : null
                  }
                  changeValue={setAccountCustomerData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("AccountMobile")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseAccountMobile")}
                  label={""}
                  placeholder={t("ChooseAccountMobile")}
                  required={false}
                  nextField={"account_product_group_id"}
                  name={"account_mobile_id"}
                  form={form}
                  dropdownValue={accountDropdownData}
                  id={"account_mobile_id"}
                  searchable={true}
                  value={
                    accountMobileData
                      ? String(accountMobileData)
                      : account_config?.account_mobile_id
                      ? String(account_config.account_mobile_id)
                      : null
                  }
                  changeValue={setAccountMobileData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("AccountProductGroup")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseAccountProductGroup")}
                  label={""}
                  placeholder={t("ChooseAccountProductGroup")}
                  required={false}
                  nextField={"account_user_id"}
                  name={"account_product_group_id"}
                  form={form}
                  dropdownValue={accountDropdownData}
                  id={"account_product_group_id"}
                  searchable={true}
                  value={
                    accountProductGroupData
                      ? String(accountProductGroupData)
                      : account_config?.account_product_group_id
                      ? String(account_config.account_product_group_id)
                      : null
                  }
                  changeValue={setAccountProductGroupData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("AccountUser")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseAccountUser")}
                  label={""}
                  placeholder={t("ChooseAccountUser")}
                  required={false}
                  nextField={"account_vendor_id"}
                  name={"account_user_id"}
                  form={form}
                  dropdownValue={accountDropdownData}
                  id={"account_user_id"}
                  searchable={true}
                  value={
                    accountUserData
                      ? String(accountUserData)
                      : account_config?.account_user_id
                      ? String(account_config.account_user_id)
                      : null
                  }
                  changeValue={setAccountUserData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("AccountVendor")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseAccountVendor")}
                  label={""}
                  placeholder={t("ChooseAccountVendor")}
                  required={false}
                  nextField={"voucher_purchase_id"}
                  name={"account_vendor_id"}
                  form={form}
                  dropdownValue={accountDropdownData}
                  id={"account_vendor_id"}
                  searchable={true}
                  value={
                    accountVendorData
                      ? String(accountVendorData)
                      : account_config?.account_vendor_id
                      ? String(account_config.account_vendor_id)
                      : null
                  }
                  changeValue={setAccountVendorData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("VoucherPurchase")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseVoucherPurchase")}
                  label={""}
                  placeholder={t("ChooseVoucherPurchase")}
                  required={false}
                  nextField={"voucher_purchase_return_id"}
                  name={"voucher_purchase_id"}
                  form={form}
                  dropdownValue={voucherDropdownData}
                  id={"voucher_purchase_id"}
                  searchable={true}
                  value={
                    voucherPurchaseData
                      ? String(voucherPurchaseData)
                      : account_config?.voucher_purchase_id
                      ? String(account_config.voucher_purchase_id)
                      : null
                  }
                  changeValue={setVoucherPurchaseData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("VoucherPurchaseReturn")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseVoucherPurchaseReturn")}
                  label={""}
                  placeholder={t("ChooseVoucherPurchaseReturn")}
                  required={false}
                  nextField={"voucher_sales_id"}
                  name={"voucher_purchase_return_id"}
                  form={form}
                  dropdownValue={voucherDropdownData}
                  id={"voucher_purchase_return_id"}
                  searchable={true}
                  value={
                    voucherPurchaseReturnData
                      ? String(voucherPurchaseReturnData)
                      : account_config?.voucher_purchase_return_id
                      ? String(account_config.voucher_purchase_return_id)
                      : null
                  }
                  changeValue={setVoucherPurchaseReturnData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("VoucherSales")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseVoucherSales")}
                  label={""}
                  placeholder={t("ChooseVoucherSales")}
                  required={false}
                  nextField={"voucher_sales_return_id"}
                  name={"voucher_sales_id"}
                  form={form}
                  dropdownValue={voucherDropdownData}
                  id={"voucher_sales_id"}
                  searchable={true}
                  value={
                    voucherSalesData
                      ? String(voucherSalesData)
                      : account_config?.voucher_sales_id
                      ? String(account_config.voucher_sales_id)
                      : null
                  }
                  changeValue={setVoucherSalesData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("VoucherSalesReturn")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseVoucherSalesReturn")}
                  label={""}
                  placeholder={t("ChooseVoucherSalesReturn")}
                  required={false}
                  nextField={"voucher_stock_opening_id"}
                  name={"voucher_sales_return_id"}
                  form={form}
                  dropdownValue={voucherDropdownData}
                  id={"voucher_sales_return_id"}
                  searchable={true}
                  value={
                    voucherSalesReturnData
                      ? String(voucherSalesReturnData)
                      : account_config?.voucher_sales_return_id
                      ? String(account_config.voucher_sales_return_id)
                      : null
                  }
                  changeValue={setVoucherSalesReturnData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("VoucherStockOpening")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseVoucherStockOpening")}
                  label={""}
                  placeholder={t("ChooseVoucherStockOpening")}
                  required={false}
                  nextField={"voucher_stock_reconciliation_id"}
                  name={"voucher_stock_opening_id"}
                  form={form}
                  dropdownValue={voucherDropdownData}
                  id={"voucher_stock_opening_id"}
                  searchable={true}
                  value={
                    voucherStockOpeningData
                      ? String(voucherStockOpeningData)
                      : account_config?.voucher_stock_opening_id
                      ? String(account_config.voucher_stock_opening_id)
                      : null
                  }
                  changeValue={setVoucherStockOpeningData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("VoucherStockReconciliation")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t("ChooseVoucherStockReconciliation")}
                  label={""}
                  placeholder={t("ChooseVoucherStockReconciliation")}
                  required={false}
                  nextField={"AccountingFormSubmit"}
                  name={"voucher_stock_reconciliation_id"}
                  form={form}
                  dropdownValue={voucherDropdownData}
                  id={"voucher_stock_reconciliation_id"}
                  searchable={true}
                  value={
                    voucherStockReconciliationData
                      ? String(voucherStockReconciliationData)
                      : account_config?.voucher_stock_reconciliation_id
                      ? String(account_config.voucher_stock_reconciliation_id)
                      : null
                  }
                  changeValue={setVoucherStockReconciliationData}
                />
              </Grid.Col>
            </Grid>
          </Box>
        </Box>
        <Button
          id="AccountingFormSubmit"
          type="submit"
          style={{ display: "none" }}
        >
          {t("Submit")}
        </Button>
      </form>
    </ScrollArea>
  );
}

export default AccountingForm;
