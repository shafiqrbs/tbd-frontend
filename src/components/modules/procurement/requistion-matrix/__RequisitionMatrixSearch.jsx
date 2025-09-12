import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
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
  IconCalendar,
  IconFileTypeXls,
  IconFilter,
  IconInfoCircle,
  IconPdf,
  IconRestore,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import { DateInput } from "@mantine/dates";
// import __FilterPopover from "./__FilterPopover.jsx";
import {setRequisitionFilterData} from "../../../../store/core/crudSlice.js";

function __RequisitionMatrixSearch(props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOnline } = useOutletContext();

  const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
  const [vendorTooltip, setVendorTooltip] = useState(false);
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [endDateTooltip, setEndDateTooltip] = useState(false);

  const requisitionFilterData = useSelector(
    (state) => state.coreCrudSlice.requisitionFilterData
  );

  /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/
  const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
  const [refreshVendorDropdown, setRefreshVendorDropdown] = useState(false);

  useEffect(() => {
    let coreVendors = localStorage.getItem("core-vendors");
    coreVendors = coreVendors ? JSON.parse(coreVendors) : [];
    const filteredVendors = coreVendors.filter(vendor => vendor.sub_domain_id != null);

      if (filteredVendors && filteredVendors.length > 0) {
      const transformedData = filteredVendors.map((type) => {
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
                              setRequisitionFilterData({
                                  ...requisitionFilterData,
                                  ["searchKeyword"]: e.currentTarget.value,
                              })
                          );
                          /*e.target.value !== ""
                            ? setSearchKeywordTooltip(false)
                            : (setSearchKeywordTooltip(true),
                              setTimeout(() => {
                                setSearchKeywordTooltip(false);
                              }, 1000));*/
                      }}
                      value={requisitionFilterData.searchKeyword}
                      id={"SearchKeyword"}
                      rightSection={
                          requisitionFilterData.searchKeyword && (
                              <Tooltip label={t("Close")} withArrow bg={`red.5`}>
                                  <IconX
                                      color={`red`}
                                      size={16}
                                      opacity={0.5}
                                      onClick={() => {
                                          dispatch(
                                              setRequisitionFilterData({
                                                  ...requisitionFilterData,
                                                  ["searchKeyword"]: "",
                                              })
                                          );
                                      }}
                                  />
                              </Tooltip>
                          )
                      }
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
                              setRequisitionFilterData({
                                  ...requisitionFilterData,
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
                      value={requisitionFilterData.start_date}
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
                              setRequisitionFilterData({
                                  ...requisitionFilterData,
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
          <Grid.Col span="auto">
              <ActionIcon.Group mt={"1"} justify="center">
                  <ActionIcon
                      variant="default"
                      c={"red.4"}
                      size="lg"
                      aria-label="Filter"
                      onClick={() => {
                          requisitionFilterData.searchKeyword.length > 0 ||
                          requisitionFilterData.customer_id ||
                          requisitionFilterData.start_date
                              ? (props.setFetching(true),
                                  setSearchKeywordTooltip(false))
                              :
                              setTimeout(() => {
                                  setSearchKeywordTooltip(false);
                              }, 1500);
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
                  {/*<__FilterPopover />*/}
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
                                  resetDropDownState();
                                  dispatch(
                                      setRequisitionFilterData({
                                          ...requisitionFilterData,
                                          ["vendor_id"]: "",
                                          ["start_date"]: "",
                                          ["end_date"]: "",
                                          ["searchKeyword"]: "",
                                      })
                                  );
                                  props.setFetching(true)
                              }}
                          />
                      </Tooltip>
                  </ActionIcon>
                  <ActionIcon
                      variant="default"
                      c={"green.8"}
                      size="lg"
                      aria-label="Filter"
                      onClick={() => {
                          searchKeyword.length > 0
                              ? (dispatch(setFetching(true)),
                                  setSearchKeywordTooltip(false))
                              : (setSearchKeywordTooltip(true),
                                  setTimeout(() => {
                                      setSearchKeywordTooltip(false);
                                  }, 1500));
                      }}
                  >
                      <Tooltip
                          label={t("DownloadPdfFile")}
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
                          <IconPdf style={{ width: rem(18) }} stroke={1.5} />
                      </Tooltip>
                  </ActionIcon>
                  <ActionIcon
                      variant="default"
                      c={"green.8"}
                      size="lg"
                      aria-label="Filter"
                      onClick={() => {
                          searchKeyword.length > 0
                              ? (dispatch(setFetching(true)),
                                  setSearchKeywordTooltip(false))
                              : (setSearchKeywordTooltip(true),
                                  setTimeout(() => {
                                      setSearchKeywordTooltip(false);
                                  }, 1500));
                      }}
                  >
                      <Tooltip
                          label={t("DownloadExcelFile")}
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
                          <IconFileTypeXls style={{ width: rem(18) }} stroke={1.5} />
                      </Tooltip>
                  </ActionIcon>
              </ActionIcon.Group>
          </Grid.Col>
      </Grid>
    </>
  );
}

export default __RequisitionMatrixSearch;
