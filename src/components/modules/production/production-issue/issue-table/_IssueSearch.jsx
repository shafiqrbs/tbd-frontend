import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { rem, Grid, Tooltip, TextInput, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconFilter,
  IconInfoCircle,
  IconRestore,
  IconSearch,
  IconX,
  IconPdf,
  IconFileTypeXls,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategoryGroupFilterData,
  setCustomerFilterData,
  setFetching,
  setSearchKeyword,
  setUserFilterData,
  setVendorFilterData,
  setWarehouseFilterData,
} from "../../../../../store/core/crudSlice.js";
import {
  setProductFilterData,
  setCategoryFilterData,
} from "../../../../../store/inventory/crudSlice.js";

function _IssueSearch(props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline } = useOutletContext();

  const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const productFilterData = useSelector(
    (state) => state.inventoryCrudSlice.productFilterData
  );

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

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchKeyword.length > 0) {
      dispatch(setFetching(true)), setSearchKeywordTooltip(false);
    } else {
      setSearchKeywordTooltip(true),
        setTimeout(() => {
          setSearchKeywordTooltip(false);
        }, 1500);
    }
  };

  return (
    <>
      <Grid justify="space-between" align="stretch" gutter={{ base: 2 }} grow>
        <Grid.Col span="8">
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
            transitionProps={{ transition: "pop-bottom-left", duration: 1000 }}
          >
            <TextInput
              leftSection={<IconSearch size={16} opacity={0.5} />}
              size="sm"
              placeholder={t("EnterSearchAnyKeyword")}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                dispatch(setSearchKeyword(e.currentTarget.value));
                e.target.value !== ""
                  ? setSearchKeywordTooltip(false)
                  : (setSearchKeywordTooltip(true),
                    setTimeout(() => {
                      setSearchKeywordTooltip(false);
                    }, 1000));
              }}
              value={searchKeyword}
              id={"SearchKeyword"}
              rightSection={
                searchKeyword ? (
                  <Tooltip label={t("Close")} withArrow bg={`red.5`}>
                    <IconX
                      color={`red`}
                      size={16}
                      opacity={0.5}
                      onClick={() => {
                        dispatch(setSearchKeyword(""));
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
        <Grid.Col span="auto">
          <ActionIcon.Group mt={"1"} justify="center">
            <ActionIcon
              variant="default"
              c={"red.4"}
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
            {/*<__FilterPopover categoryDropdown={categoryDropdown} />*/}
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
                    dispatch(setSearchKeyword(""));
                    dispatch(setFetching(true));
                    dispatch(
                      setProductFilterData({
                        ...productFilterData,
                        name: "",
                        alternative_name: "",
                        sales_price: "",
                        sku: "",
                      })
                    );
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
                if (props.module === "stock") {
                  props.setDownloadStockXls(true);
                }
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

export default _IssueSearch;
