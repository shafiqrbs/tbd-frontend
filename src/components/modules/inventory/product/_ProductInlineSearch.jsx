import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {rem, Grid, Tooltip, TextInput, ActionIcon, Box} from "@mantine/core";
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
} from "../../../../store/core/crudSlice.js";
import {
  setProductFilterData,
  setCategoryFilterData,
} from "../../../../store/inventory/crudSlice.js";
import { setProductionSettingFilterData } from "../../../../store/production/crudSlice.js";
import __FilterPopover from "./__FilterPopover";

function _ProductInlineSearch(props) {
  const { categoryDropdown } = props;
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
      <Box>
          <Tooltip
              label={t("EnterSearchAnyKeyword")}
              opened={searchKeywordTooltip}
              position="top-end"
              color='var(--theme-primary-color-6)'
              withArrow
              offset={2}
              zIndex={100}
              transitionProps={{ transition: "pop-bottom-left", duration: 1000 }}
          >
              <TextInput
                  leftSection={<IconSearch size={12} opacity={0.5} />}
                  size="xs"
                  placeholder={t("EnterSearchAnyKeyword")}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                      dispatch(setSearchKeyword(e.currentTarget.value));
                      e.target.value !== ""
                          ? setSearchKeywordTooltip(false)
                          : (setSearchKeywordTooltip(true),
                              setTimeout(() => {
                                  setSearchKeywordTooltip(false);
                              }, 2000));
                  }}
                  value={searchKeyword}
                  id={"SearchKeyword"}
              />
          </Tooltip>
      </Box>
    </>
  );
}

export default _ProductInlineSearch;
