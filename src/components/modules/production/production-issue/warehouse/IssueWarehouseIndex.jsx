import React from "react";
import {Box, Grid, Progress} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../../global-hook/loading-progress/getLoadingProgress.js";
import ProductionHeaderNavbar from "../../common/ProductionHeaderNavbar.jsx";
import GeneralIssueForm from "../general-issue/GeneralIssueForm.jsx";
import _UserWarehouse from "./_UserWarehouse.jsx";
import B2BHeaderNavbar from "../../../b2b/B2BHeaderNavbar.jsx";
import _Shortcut from "../../../b2b/common/_Shortcut.jsx";
import CategoryTable from "../../../b2b/category/CategoryTable.jsx";
import ProductionNavigation from "../../common/ProductionNavigation.jsx";
export default function IssueWarehouseIndex() {
  const { t, i18n } = useTranslation();
  const progress = getLoadingProgress();

  const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))

  return (
    /*<>
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
        <Box>
          {domainConfigData && (
            <>
              <ProductionHeaderNavbar
                pageTitle={t("UserWarehouse")}
                roles={t("Roles")}
              />
              <Box p={"8"}>
                <_UserWarehouse domainConfigData={domainConfigData} />
              </Box>
            </>
          )}
        </Box>
      )}
    </>*/

      <>
        {progress !== 100 && (
            <Progress color="red" size={"sm"} striped animated value={progress}/>
        )}
        {progress === 100 && (
            <>
              <ProductionHeaderNavbar
                  pageTitle={t("UserWarehouse")}
                  roles={t("Roles")}
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{base: 8}}>
                  <Grid.Col span={1}>
                    {/*<_Shortcut id={id}/>*/}
                    <ProductionNavigation module={"production-issue"} type={"production-issue"} />
                  </Grid.Col>
                  <Grid.Col span={23}>
                    <_UserWarehouse id={null}/>
                  </Grid.Col>
                </Grid>
              </Box>
            </>
        )}
      </>
  );
}
