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
  TextInput,
} from "@mantine/core";
import {
  IconX,
  IconInfoCircle,
  IconFilter,
  IconRefreshDot,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  setFetching,
  setPurchaseItemsFilterData,
} from "../../../../store/inventory/crudSlice.js";
import InputForm from "../../../form-builders/InputForm";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { DateInput } from "@mantine/dates";
export default function __FilterPopover(props) {
  const { setRefreshCustomerDropdown, focusField, fieldPrefix, module } = props;

  const { mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight;

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
  const [advanceSearchFormOpened, setAdvanceSearchFormOpened] = useState(false);
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [endDateTooltip, setEndDateTooltip] = useState(false);
  const purchaseItemsFilterData = useSelector(
    (state) => state.inventoryCrudSlice.purchaseItemsFilterData
  );
  let [resetKey, setResetKey] = useState(0);

  const resetDropDownState = () => setResetKey((prevKey) => prevKey + 1);

  return (
    <Box>
      <Popover
        width={"586"}
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
            offset={{ crossAxis: "-42", mainAxis: "5" }}
            position="top"
            ta={"center"}
            withArrow
            transitionProps={{ duration: 200 }}
            label={t("AdvanceSearch")}
          >
            <ActionIcon
              variant="transparent"
              size="lg"
              c="gray.6"
              mr={8}
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
            <Box mt={"4"}>
              <Box
                className="boxBackground border-bottom-none borderRadiusAll"
                pt={"6"}
                pb={"6"}
              >
                <Text ta={"center"} fw={600} fz={"sm"}>
                  {t("AdvanceSearch")}
                </Text>
              </Box>
              <Box
                className="borderRadiusAll border-bottom-none border-top-none"
                bg={"white"}
              >
                <ScrollArea
                  h={height / 3}
                  scrollbarSize={2}
                  scrollbars="y"
                  type="never"
                >
                  <Box p={"xs"}>
                    <Grid columns={18} gutter={{ base: 8 }}>
                      <Grid.Col span={4}>
                        <Text ta={"right"} fw={600} fz={"sm"} mt={"8"}>
                          {t("Name")}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={14}>
                        <Tooltip
                          label={t("EnterSearchAnyKeyword")}
                          opened={searchKeywordTooltip}
                          px={16}
                          py={2}
                          position="top-end"
                          color="red"
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
                            placeholder={t("SearchByName")}
                            onChange={(e) => {
                              dispatch(
                                setPurchaseItemsFilterData({
                                  ...purchaseItemsFilterData,
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
                            value={purchaseItemsFilterData.searchKeyword}
                            id={"SearchKeyword"}
                            rightSection={
                              purchaseItemsFilterData.searchKeyword ? (
                                <Tooltip
                                  label={t("Close")}
                                  withArrow
                                  bg={`red.5`}
                                >
                                  <IconX
                                    color={`red`}
                                    size={16}
                                    opacity={0.5}
                                    onClick={() => {
                                      dispatch(
                                        setPurchaseItemsFilterData({
                                          ...purchaseItemsFilterData,
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
                    </Grid>
                  </Box>
                  <Box p={"xs"}>
                    <Grid columns={18} gutter={{ base: 8 }}>
                      <Grid.Col span={4}>
                        <Text ta={"right"} fw={600} fz={"sm"} mt={"8"}>
                          {t("Date")}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={7}>
                        <Tooltip
                          label={t("StartDate")}
                          opened={startDateTooltip}
                          px={16}
                          py={2}
                          position="top-end"
                          color="red"
                          withArrow
                          offset={2}
                          zIndex={100}
                          transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 5000,
                          }}
                        >
                          <DateInput
                            key={resetKey}
                            clearable
                            onChange={(e) => {
                              dispatch(
                                setPurchaseItemsFilterData({
                                  ...purchaseItemsFilterData,
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
                            value={purchaseItemsFilterData.start_date}
                            placeholder={t("StartDate")}
                          />
                        </Tooltip>
                      </Grid.Col>
                      <Grid.Col span={7}>
                        <Tooltip
                          label={t("EndDate")}
                          opened={endDateTooltip}
                          px={16}
                          py={2}
                          position="top-end"
                          color="red"
                          withArrow
                          offset={2}
                          zIndex={100}
                          transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 5000,
                          }}
                        >
                          <DateInput
                            key={resetKey}
                            clearable
                            onChange={(e) => {
                              dispatch(
                                setPurchaseItemsFilterData({
                                  ...purchaseItemsFilterData,
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
                          />
                        </Tooltip>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </ScrollArea>
              </Box>
            </Box>
            <Box
              className="borderRadiusAll border-top-none boxBackground"
              pl={"xs"}
              pr={"xs"}
              pb={2}
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
                        dispatch(setFetching(true));
                        resetDropDownState();
                        dispatch(
                          setPurchaseItemsFilterData({
                            ...purchaseItemsFilterData,
                            ["start_date"]: "",
                            ["end_date"]: "",
                            ["searchKeyword"]: "",
                          })
                        );
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
                      name={"EntityFormSubmit"}
                      leftSection={<IconSearch size={16} />}
                      onClick={() => {
                        setAdvanceSearchFormOpened(false);
                        purchaseItemsFilterData.searchKeyword.length > 0 ||
                        purchaseItemsFilterData.start_date
                          ? (dispatch(setFetching(true)),
                            setSearchKeywordTooltip(false))
                          : (setSearchKeywordTooltip(true),
                            setTimeout(() => {
                              setSearchKeywordTooltip(false);
                            }, 1500));
                      }}
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
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
