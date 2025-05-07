import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Progress,
  Title,
  Group,
  Burger,
  Menu,
  rem,
  ActionIcon,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormLoading,
  setSearchKeyword,
} from "../../../../store/core/crudSlice.js";
import { setInsertType } from "../../../../store/generic/crudSlice.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar.jsx";
import VoucherForm from "./VoucherForm.jsx";
import VoucherCreateTable from "./VoucherCreateTable.jsx";
import { useNavigate, useParams } from "react-router-dom";
import {
  editEntityData,
  setEntityNewData,
} from "../../../../store/accounting/crudSlice.js";
import VoucherUpdateFrom from "./VoucherUpdateFrom.jsx";
import getSettingMotherAccountDropdownData from "../../../global-hook/dropdown/getSettingMotherAccountDropdownData.js";
import getVoucherTypeDropdownData from "../../../global-hook/dropdown/getVoucherTypeDropdownData.js";
import Navigation from "../common/Navigation.jsx";

function VoucherCreateIndex() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const insertType = useSelector((state) => state.crudSlice.insertType);
  const progress = getLoadingProgress();

  const voucherDropdown = getVoucherTypeDropdownData();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    id
      ? (dispatch(setInsertType("update")),
        dispatch(editEntityData(`accounting/voucher/${id}`)),
        dispatch(setFormLoading(true)))
      : (dispatch(setInsertType("create")),
        dispatch(setSearchKeyword("")),
        dispatch(
          setEntityNewData({
            ["name"]: "",
            ["short_code"]: "",
          })
        ),
        navigate("/accounting/voucher-create"));
  }, [id, dispatch, navigate]);
//  console.log(insertType);
  return (
    <>
      {progress !== 100 && (
        <Progress
          color="red"
          size={"sm"}
          striped
          animated
          value={progress}
          transitionDuration={200}
        />
      )}
      {progress === 100 && (
        <>
          <Box>
            <AccountingHeaderNavbar
              pageTitle={t("VoucherCreate")}
              roles={t("Roles")}
              allowZeroPercentage=""
              currencySymbol=""
            />
            <Box p={"8"}>
              <Grid columns={24} gutter={{ base: 8 }}>
                <Grid.Col span={1}>
                    <Navigation module="voucher-create"/>
                </Grid.Col>
                <Grid.Col span={14}>
                  <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                    <VoucherCreateTable />
                  </Box>
                </Grid.Col>
                <Grid.Col span={9}>
                  {insertType === "create" ? (
                    <VoucherForm voucherDropdown={voucherDropdown} />
                  ) : (
                    <VoucherUpdateFrom voucherDropdown={voucherDropdown} />
                  )}
                </Grid.Col>
              </Grid>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default VoucherCreateIndex;
