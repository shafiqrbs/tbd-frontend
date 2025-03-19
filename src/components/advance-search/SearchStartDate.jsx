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
  Flex,
  Box,
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
import { setSearchKeyword } from "../../store/core/crudSlice.js";
import FilterModel from "../modules/filter/FilterModel.jsx";
import {
  setFetching,
  setInvoiceBatchFilterData,
  storeEntityData,
} from "../../store/inventory/crudSlice.js";
import { DateInput } from "@mantine/dates";

function SearchStartDate(props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOnline } = useOutletContext();

  const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
  const [customerTooltip, setCustomerTooltip] = useState(false);
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [endDateTooltip, setEndDateTooltip] = useState(false);
  const [filterModel, setFilterModel] = useState(false);

  const invoiceBatchFilterData = useSelector(
    (state) => state.inventoryCrudSlice.invoiceBatchFilterData
  );
  const form = {
    initialValues: {
      search_keyword: "",
      start_date: "",
      end_date: "",
    },
  };

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
      <Box>
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
          transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
        >
          <DateInput
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
            clearable
            onChange={(e) => {
              dispatch(
                setInvoiceBatchFilterData({
                  ...invoiceBatchFilterData,
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
            value={invoiceBatchFilterData.start_date}
            placeholder={t("StartDate")}
          />
        </Tooltip>
      </Box>
    </>
  );
}

export default SearchStartDate;
