import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import VendorTable from "./VendorTable";
import VendorForm from "./VendorForm";
import VendorUpdateForm from "./VendorUpdateForm.jsx";
import {
  editEntityData,
  setEntityNewData,
  setFormLoading,
  setInsertType,
  setSearchKeyword,
  setVendorFilterData,
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import getCustomerDropdownData from "../../../global-hook/dropdown/getCustomerDropdownData.js";
import Navigation from "../common/Navigation.jsx";
import {coreSettingDropdown} from "../../../../store/core/utilitySlice";
import {setDropdownLoad} from "../../../../store/inventory/crudSlice";

function VendorIndex() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const insertType = useSelector((state) => state.crudSlice.insertType);
  const vendorFilterData = useSelector(
    (state) => state.crudSlice.vendorFilterData
  );
  const customerDropDownData = getCustomerDropdownData();

  const dropdownData = useSelector((state) => state.utilitySlice.vendorGroupDropdownData);
    let groupDropdownData = dropdownData && dropdownData.length > 0 ?
        dropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'core/select/setting',
            param: { 'dropdown-type': 'vendor-group' }
        }
        dispatch(coreSettingDropdown(value))
        dispatch(setDropdownLoad(false))
    }, [dropdownData]);
  const progress = getLoadingProgress();

  useEffect(() => {
    id
      ? (dispatch(setInsertType("update")),
        dispatch(editEntityData(`core/vendor/${id}`)),
        dispatch(setFormLoading(true)))
      : (dispatch(setInsertType("create")),
        dispatch(setSearchKeyword("")),
        dispatch(setEntityNewData([])),
        dispatch(
          setVendorFilterData({
            ...vendorFilterData,
            ["name"]: "",
            ["mobile"]: "",
            ["company"]: "",
          })
        ),
        navigate("/core/vendor", { replace: true }));
  }, [id, dispatch, navigate]);

  return (
    <>
      {progress !== 100 && (
        <Progress
          color='var(--theme-primary-color-6)'
          size={"sm"}
          striped
          animated
          value={progress}
          transitionDuration={200}
        />
      )}
      {progress === 100 && (
        <>
          <CoreHeaderNavbar
            pageTitle={t("ManageVendor")}
            roles={t("Roles")}
            allowZeroPercentage=""
            currencySymbol=""
          />
          <Box p={"8"}>
            <Grid columns={24} gutter={{ base: 8 }}>
              <Grid.Col span={1}>
                <Navigation module={"vendor"} />
              </Grid.Col>
              <Grid.Col span={14}>
                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                  <VendorTable />
                </Box>
              </Grid.Col>
              <Grid.Col span={9}>
                {insertType === "create" ? (
                  <VendorForm customerDropDownData={customerDropDownData} vendorGroupDropdownData={groupDropdownData} />
                ) : (
                  <VendorUpdateForm
                    customerDropDownData={customerDropDownData} vendorGroupDropdownData={groupDropdownData}
                  />
                )}
              </Grid.Col>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}

export default VendorIndex;
