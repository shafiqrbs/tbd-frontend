import React, { useEffect, useState } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import _InhouseTable from "./_InhouseTable.jsx";
import _InhouseForm from "./_InhouseForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { editEntityData } from "../../../../store/production/crudSlice.js";
import axios from "axios";
import ProductionNavigation from "../common/ProductionNavigation.jsx";

function InhouseIndex(props) {
  const params = useParams();
  const id = props.batchId ? props.batchId : params.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();
  const progress = getLoadingProgress();

  const editedData = useSelector(
    (state) => state.productionCrudSlice.entityEditData
  );
  const dataStatus = useSelector(
    (state) => state.productionCrudSlice.dataStatus
  );

  const [batchData, setBatchData] = useState({});
  const [reloadBatchItemTable, setReloadBatchItemTable] = useState(false);

  useEffect(() => {
    if (!id) {
      axios({
        method: "POST",
        url: `${import.meta.env.VITE_API_GATEWAY_URL + "production/batch"}`,
        headers: {
          Accept: `application/json`,
          "Content-Type": `application/json`,
          "Access-Control-Allow-Origin": "*",
          "X-Api-Key": import.meta.env.VITE_API_KEY,
          "X-Api-User": JSON.parse(localStorage.getItem("user")).id,
        },
        data: {
          mode: "in-house",
        },
      })
        .then((res) => {
          if (res.data.status === 200) {
            navigate("/production/batch/" + res.data.data.id);
            setReloadBatchItemTable(false);
          }
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
        });
    }
    if (id) {
      dispatch(editEntityData(`production/batch/${id}`));
      setReloadBatchItemTable(false);
    }
    if (dataStatus === 200) {
      setBatchData(editedData);
    }
  }, [id, dataStatus, reloadBatchItemTable]);

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
        <Box>
          <>
            {!props.batchId && (
              <ProductionHeaderNavbar
                pageTitle={t("ProductionBatch")}
                roles={t("Roles")}
              />
            )}

            <Box p={"8"}>
              <Grid columns={24} gutter={{ base: 8 }}>
                {!props.batchId && (
                  <Grid.Col span={1}>
                    <ProductionNavigation module={"new-batch"} />
                  </Grid.Col>
                )}
                {/*<Grid.Col span={props.batchId ? 15 : 14}>*/}
                <Grid.Col span={props.batchId ? 24 : 23}>
                  <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                    <_InhouseTable
                      setReloadBatchItemTable={setReloadBatchItemTable}
                    />
                  </Box>
                </Grid.Col>
                <Grid.Col span={9}>
                  {<_InhouseForm batchData={batchData} />}
                </Grid.Col>
              </Grid>
            </Box>
          </>
        </Box>
      )}
    </>
  );
}

export default InhouseIndex;
