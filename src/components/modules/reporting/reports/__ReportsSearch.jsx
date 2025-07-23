import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  rem,
  Grid,
  Tooltip,
  TextInput,
  ActionIcon,
  Select,
  Button,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconBrandOkRu,
  IconFileTypeXls,
  IconInfoCircle,
  IconPdf,
  IconRestore,
  IconSearch,
  IconX,
  IconCalendar,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  setFetching,
  setSalesFilterData,
  storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import { DateInput } from "@mantine/dates";

function __ReportsSearch(props) {
  const { activeReport } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
  const [customerTooltip, setCustomerTooltip] = useState(false);
  const [vendorTooltip, setVendorTooltip] = useState(false);
  const [categoryTooltip, setCategoryTooltip] = useState(false);
  const [productNameTooltip, setProductNameTooltip] = useState(false);
  const [displayNameTooltip, setDisplayNameTooltip] = useState(false);
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [endDateTooltip, setEndDateTooltip] = useState(false);

  const salesFilterData = useSelector(
    (state) => state.inventoryCrudSlice.salesFilterData
  );

  /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/
  const [customersDropdownData, setCustomersDropdownData] = useState([]);
  const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false);

  useEffect(() => {
    let coreCustomers = localStorage.getItem("core-customers");
    coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : [];
    if (coreCustomers && coreCustomers.length > 0) {
      const transformedData = coreCustomers.map((type) => {
        return {
          label: type.mobile + " -- " + type.name,
          value: String(type.id),
        };
      });
      setCustomersDropdownData(transformedData);
      setRefreshCustomerDropdown(false);
    }
  }, [refreshCustomerDropdown]);
  /*END GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/

  /*START GET VENDOR DROPDOWN FROM LOCAL STORAGE*/
  const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
  const [refreshVendorDropdown, setRefreshVendorDropdown] = useState(false);

  useEffect(() => {
    let coreVendors = localStorage.getItem("core-vendors");
    coreVendors = coreVendors ? JSON.parse(coreVendors) : [];
    if (coreVendors && coreVendors.length > 0) {
      const transformedData = coreVendors.map((type) => {
        return {
          label: type.mobile + " -- " + type.name,
          value: String(type.id),
        };
      });
      setVendorsDropdownData(transformedData);
      setRefreshVendorDropdown(false);
    }
  }, [refreshVendorDropdown]);
  /*END GET VENDOR DROPDOWN FROM LOCAL STORAGE*/

  /*START GET CATEGORY DROPDOWN FROM LOCAL STORAGE*/
  const [categoriesDropdownData, setCategoriesDropdownData] = useState([]);
  const [refreshCategoryDropdown, setRefreshCategoryDropdown] = useState(false);

  useEffect(() => {
    let coreCategories = localStorage.getItem("core-categories");
    coreCategories = coreCategories ? JSON.parse(coreCategories) : [];
    if (coreCategories && coreCategories.length > 0) {
      const transformedData = coreCategories.map((type) => {
        return {
          label: type.name,
          value: String(type.id),
        };
      });
      setCategoriesDropdownData(transformedData);
      setRefreshCategoryDropdown(false);
    }
  }, [refreshCategoryDropdown]);
  /*END GET CATEGORY DROPDOWN FROM LOCAL STORAGE*/

  let [resetKey, setResetKey] = useState(0);

  const resetDropDownState = () => setResetKey((prevKey) => prevKey + 1);

  useHotkeys(
    [
      [
        "alt+F",
        () => {
          document.getElementById("SearchKeyword").focus();
        },
      ],
    ],
    []
  );

  return (
    <>
      <Grid columns={24} justify="flex-start" align="flex-end">
        <Grid.Col span={15}>
          <Grid columns={24}>
            <Grid.Col span={6}>
              <Tooltip
                label={t("EnterSearchAnyKeyword")}
                opened={searchKeywordTooltip}
                px={16}
                py={2}
                position="top-end"
                color="var(--theme-primary-color-6)"
                withArrow
                offset={2}
                zIndex={100}
                transitionProps={{
                  transition: "pop-bottom-left",
                  duration: 5000,
                }}
              >
                <TextInput
                  leftSection={<IconSearch size={16} opacity={0.5} />}
                  size="sm"
                  placeholder={t("EnterSearchAnyKeyword")}
                  onChange={(e) => {
                    dispatch(
                      setSalesFilterData({
                        ...salesFilterData,
                        ["searchKeyword"]: e.currentTarget.value,
                      })
                    );
                    e.target.value !== ""
                      ? setSearchKeywordTooltip(false)
                      : (setSearchKeywordTooltip(true),
                        setTimeout(() => {
                          setSearchKeywordTooltip(false);
                        }, 1000));
                  }}
                  value={salesFilterData.searchKeyword}
                  id={"SearchKeyword"}
                  rightSection={
                    salesFilterData.searchKeyword ? (
                      <Tooltip label={t("Close")} withArrow bg={`red.5`}>
                        <IconX
                          color={`red`}
                          size={16}
                          opacity={0.5}
                          onClick={() => {
                            dispatch(
                              setSalesFilterData({
                                ...salesFilterData,
                                ["searchKeyword"]: "",
                              })
                            );
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        label={t("FieldIsRequired")}
                        withArrow
                        position={"bottom"}
                        c={"red"}
                        bg={`red.1`}
                      >
                        <IconInfoCircle size={16} opacity={0.5} />
                      </Tooltip>
                    )
                  }
                />
              </Tooltip>
            </Grid.Col>
            <Grid.Col span={6}>
              {activeReport && activeReport.includes("sales") ? (
                <Tooltip
                  label={t("ChooseCustomer")}
                  opened={customerTooltip}
                  px={16}
                  py={2}
                  position="top-end"
                  color="var(--theme-primary-color-6)"
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 5000,
                  }}
                >
                  <Select
                    key={resetKey}
                    id={"Customer"}
                    placeholder={t("ChooseCustomer")}
                    size="sm"
                    data={customersDropdownData}
                    autoComplete="off"
                    clearable
                    searchable
                    value={salesFilterData.customer_id}
                    onChange={(e) => {
                      dispatch(
                        setSalesFilterData({
                          ...salesFilterData,
                          ["customer_id"]: e,
                        })
                      );
                      e !== ""
                        ? setCustomerTooltip(false)
                        : (setCustomerTooltip(true),
                          setTimeout(() => {
                            setCustomerTooltip(false);
                          }, 1000));
                    }}
                    comboboxProps={true}
                  />
                </Tooltip>
              ) : activeReport && activeReport.includes("purchase") ? (
                <Tooltip
                  label={t("ChooseVendor")}
                  opened={vendorTooltip}
                  px={16}
                  py={2}
                  position="top-end"
                  color="var(--theme-primary-color-6)"
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 5000,
                  }}
                >
                  <Select
                    key={resetKey}
                    id={"Vendor"}
                    placeholder={t("ChooseVendor")}
                    size="sm"
                    data={vendorsDropdownData}
                    autoComplete="off"
                    clearable
                    searchable
                    value={salesFilterData.vendor_id}
                    onChange={(e) => {
                      dispatch(
                        setSalesFilterData({
                          ...salesFilterData,
                          ["vendor_id"]: e,
                        })
                      );
                      e !== ""
                        ? setVendorTooltip(false)
                        : (setVendorTooltip(true),
                          setTimeout(() => {
                            setVendorTooltip(false);
                          }, 1000));
                    }}
                    comboboxProps={true}
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  label={t("ChooseCategory")}
                  opened={categoryTooltip}
                  px={16}
                  py={2}
                  position="top-end"
                  color="var(--theme-primary-color-6)"
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 5000,
                  }}
                >
                  <Select
                    key={resetKey}
                    id={"Category"}
                    placeholder={t("ChooseCategory")}
                    size="sm"
                    data={categoriesDropdownData}
                    autoComplete="off"
                    clearable
                    searchable
                    value={salesFilterData.category_id}
                    onChange={(e) => {
                      dispatch(
                        setSalesFilterData({
                          ...salesFilterData,
                          ["category_id"]: e,
                        })
                      );
                      e !== ""
                        ? setCategoryTooltip(false)
                        : (setCategoryTooltip(true),
                          setTimeout(() => {
                            setCategoryTooltip(false);
                          }, 1000));
                    }}
                    comboboxProps={true}
                  />
                </Tooltip>
              )}
            </Grid.Col>
            <Grid.Col span={6}>
              {activeReport && activeReport.includes("stock") ? (
                <Tooltip
                  label={t("ProductName")}
                  opened={productNameTooltip}
                  px={16}
                  py={2}
                  position="top-end"
                  color="var(--theme-primary-color-6)"
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 5000,
                  }}
                >
                  <TextInput
                    size="sm"
                    placeholder={t("ProductName")}
                    onChange={(e) => {
                      dispatch(
                        setSalesFilterData({
                          ...salesFilterData,
                          ["product_name"]: e.currentTarget.value,
                        })
                      );
                      e.target.value !== ""
                        ? setProductNameTooltip(false)
                        : (setProductNameTooltip(true),
                          setTimeout(() => {
                            setProductNameTooltip(false);
                          }, 1000));
                    }}
                    value={salesFilterData.product_name}
                    id={"ProductName"}
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  label={t("StartDate")}
                  opened={startDateTooltip}
                  px={16}
                  py={2}
                  position="top-end"
                  color="var(--theme-primary-color-6)"
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 5000,
                  }}
                >
                  <DateInput
                    clearable
                    onChange={(e) => {
                      dispatch(
                        setSalesFilterData({
                          ...salesFilterData,
                          ["start_date"]: e,
                        })
                      );
                      e !== ""
                        ? setStartDateTooltip(false)
                        : (setStartDateTooltip(true),
                          setTimeout(() => {
                            setStartDateTooltip(false);
                          }, 1000));
                    }}
                    value={salesFilterData.start_date}
                    placeholder={t("StartDate")}
                    leftSection={<IconCalendar size={16} opacity={0.5} />}
                    rightSection={
                      <Tooltip
                        label={t("StartDate")}
                        px={16}
                        py={2}
                        withArrow
                        position={"left"}
                        c={"black"}
                        bg={`gray.1`}
                        transitionProps={{
                          transition: "pop-bottom-left",
                          duration: 500,
                        }}
                      >
                        <IconInfoCircle size={16} opacity={0.5} />
                      </Tooltip>
                    }
                  />
                </Tooltip>
              )}
            </Grid.Col>
            <Grid.Col span={6}>
              {activeReport && activeReport.includes("stock") ? (
                <Tooltip
                  label={t("DisplayName")}
                  opened={displayNameTooltip}
                  px={16}
                  py={2}
                  position="top-end"
                  color="var(--theme-primary-color-6)"
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 5000,
                  }}
                >
                  <TextInput
                    size="sm"
                    placeholder={t("DisplayName")}
                    onChange={(e) => {
                      dispatch(
                        setSalesFilterData({
                          ...salesFilterData,
                          ["display_name"]: e.currentTarget.value,
                        })
                      );
                      e.target.value !== ""
                        ? setDisplayNameTooltip(false)
                        : (setDisplayNameTooltip(true),
                          setTimeout(() => {
                            setDisplayNameTooltip(false);
                          }, 1000));
                    }}
                    value={salesFilterData.display_name}
                    id={"DisplayName"}
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  label={t("EndDate")}
                  opened={endDateTooltip}
                  px={16}
                  py={2}
                  position="top-end"
                  color="var(--theme-primary-color-6)"
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 5000,
                  }}
                >
                  <DateInput
                    clearable
                    onChange={(e) => {
                      dispatch(
                        setSalesFilterData({
                          ...salesFilterData,
                          ["end_date"]: e,
                        })
                      );
                      e !== ""
                        ? setEndDateTooltip(false)
                        : (setEndDateTooltip(true),
                          setTimeout(() => {
                            setEndDateTooltip(false);
                          }, 1000));
                    }}
                    placeholder={t("EndDate")}
                    leftSection={<IconCalendar size={16} opacity={0.5} />}
                    rightSection={
                      <Tooltip
                        label={t("EndDate")}
                        px={16}
                        py={2}
                        withArrow
                        position={"left"}
                        c={"black"}
                        bg={`gray.1`}
                        transitionProps={{
                          transition: "pop-bottom-left",
                          duration: 500,
                        }}
                      >
                        <IconInfoCircle size={16} opacity={0.5} />
                      </Tooltip>
                    }
                  />
                </Tooltip>
              )}
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default __ReportsSearch;
