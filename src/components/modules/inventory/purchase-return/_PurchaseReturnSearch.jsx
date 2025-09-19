import React, { useEffect, useState } from "react";
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
  IconCalendar,
  IconFilter,
  IconInfoCircle,
  IconRestore,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import FilterModel from "../../filter/FilterModel.jsx";
import {
  setFetching,
  setPurchaseFilterData,
} from "../../../../store/inventory/crudSlice.js";
import { DateInput } from "@mantine/dates";
import __FilterPopover from "../sales/__FilterPopover.jsx";

function _PurchaseReturnSearch(props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
  const [vendorTooltip, setVendorTooltip] = useState(false);
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [endDateTooltip, setEndDateTooltip] = useState(false);
  const [filterModel, setFilterModel] = useState(false);

  const purchaseFilterData = useSelector(
    (state) => state.inventoryCrudSlice.purchaseFilterData
  );

  /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/
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
  /*END GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/

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
                color='var(--theme-primary-color-6)'
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
                      setPurchaseFilterData({
                        ...purchaseFilterData,
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
                  value={purchaseFilterData.searchKeyword}
                  id={"SearchKeyword"}
                  rightSection={
                    purchaseFilterData.searchKeyword ? (
                      <Tooltip label={t("Close")} withArrow bg={`red.5`}>
                        <IconX
                            color='var( --theme-remove-color)'
                            size={16}
                          opacity={0.5}
                          onClick={() => {
                            dispatch(
                              setPurchaseFilterData({
                                ...purchaseFilterData,
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
              <Tooltip
                label={t("ChooseVendor")}
                opened={vendorTooltip}
                px={16}
                py={2}
                position="top-end"
                color='var(--theme-primary-color-6)'
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
                  placeholder={t("ChooseVendor")}
                  size="sm"
                  data={vendorsDropdownData}
                  autoComplete="off"
                  clearable
                  searchable
                  value={purchaseFilterData.vendor_id}
                  onChange={(e) => {
                    dispatch(
                      setPurchaseFilterData({
                        ...purchaseFilterData,
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
            </Grid.Col>
            <Grid.Col span={6}>
              <Tooltip
                label={t("StartDate")}
                opened={startDateTooltip}
                px={16}
                py={2}
                position="top-end"
                color='var(--theme-primary-color-6)'
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
                      setPurchaseFilterData({
                        ...purchaseFilterData,
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
                  value={purchaseFilterData.start_date}
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
            </Grid.Col>
            <Grid.Col span={6}>
              <Tooltip
                label={t("EndDate")}
                opened={endDateTooltip}
                px={16}
                py={2}
                position="top-end"
                color='var(--theme-primary-color-6)'
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
                      setPurchaseFilterData({
                        ...purchaseFilterData,
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
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span="auto">
          <ActionIcon.Group mt={"1"}>
            <ActionIcon
              variant="default"
              c={"red.4"}
              size="lg"
              aria-label="Filter"
              onClick={() => {
                purchaseFilterData.searchKeyword.length > 0 ||
                purchaseFilterData.vendor_id ||
                purchaseFilterData.start_date
                  ? (dispatch(setFetching(true)),
                    setSearchKeywordTooltip(false))
                  : (setSearchKeywordTooltip(true),
                    setTimeout(() => {
                      setSearchKeywordTooltip(false);
                    }, 1500));
              }}
            >
              <Tooltip
                label={t("SearchButton")}
                px={16}
                py={2}
                withArrow
                position={"bottom"}
                c={"red"}
                bg={`red.1`}
                transitionProps={{
                  transition: "pop-bottom-left",
                  duration: 500,
                }}
              >
                <IconSearch style={{ width: rem(18) }} stroke={1.5} />
              </Tooltip>
            </ActionIcon>
            <__FilterPopover />
            <ActionIcon
              variant="default"
              c={"gray.6"}
              size="lg"
              aria-label="Settings"
            >
              <Tooltip
                label={t("ResetButton")}
                px={16}
                py={2}
                withArrow
                position={"bottom"}
                c={"red"}
                bg={`red.1`}
                transitionProps={{
                  transition: "pop-bottom-left",
                  duration: 500,
                }}
              >
                <IconRestore
                  style={{ width: rem(18) }}
                  stroke={1.5}
                  onClick={() => {
                    dispatch(setFetching(true));
                    setRefreshVendorDropdown(true);
                    resetDropDownState();

                    dispatch(
                      setPurchaseFilterData({
                        ...purchaseFilterData,
                        ["vendor_id"]: "",
                        ["start_date"]: "",
                        ["end_date"]: "",
                        ["searchKeyword"]: "",
                      })
                    );
                  }}
                />
              </Tooltip>
            </ActionIcon>
          </ActionIcon.Group>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default _PurchaseReturnSearch;
