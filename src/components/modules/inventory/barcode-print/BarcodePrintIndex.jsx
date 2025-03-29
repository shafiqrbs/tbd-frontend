import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import BarcodePrintForm from "./BarcodePrintForm";
import BarcodePrintView from "./BarcodePrintView";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import { Progress, Box, Grid } from "@mantine/core";
import { useState } from "react";

export default function BarcodePrintIndex() {
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  const { configData } = getConfigData();
  const [preview, setPreview] = useState(false);
  const [barcodeObjects, setBarcodeObjects] = useState([]);
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
          {configData && (
            <>
              <InventoryHeaderNavbar
                pageTitle={t("ManageBarcodePrint")}
                roles={t("Roles")}
                allowZeroPercentage={configData.zero_stock}
                currencySymbol={configData?.currency?.symbol}
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={15}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <BarcodePrintView
                        barcodeObjects={barcodeObjects}
                        setBarcodeObjects={setBarcodeObjects}
                        preview={preview}
                        setPreview={setPreview}
                      />
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    <BarcodePrintForm
                      barcodeObjects={barcodeObjects}
                      setBarcodeObjects={setBarcodeObjects}
                      preview={preview}
                      setPreview={setPreview}
                    />
                  </Grid.Col>
                </Grid>
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
}
