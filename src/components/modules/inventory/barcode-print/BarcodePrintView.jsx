import { Box, Grid, Image, ScrollArea, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import tableCss from "../../../../assets/css/Table.module.css";
import { useState } from "react";
import { DataTable } from "mantine-datatable";
import KeywordSearch from "../../filter/KeywordSearch";
import BarcodeGenerator from "./barcode-generator/BarcodeGenerator";

export default function BarcodePrintView(props) {
  const { preview, setPreview, barcodeObjects, setBarcodeObjects } = props;
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 98;
  const [indexData, setIndexData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 50;

  // Filter only checked barcode objects
  const checkedBarcodes = barcodeObjects.filter((item) => item.is_checked);
  
  // Generate all barcodes based on quantities
  const barcodeArray = [];
  
  checkedBarcodes.forEach(item => {
    const quantity = parseInt(item.quantity) || 1;
    for (let i = 0; i < quantity; i++) {
      barcodeArray.push({
        ...item,
        index: i + 1
      });
    }
  });

  return (
    <>
      <Box mt={"4"} className={"borderRadiusAll"}>
        <ScrollArea
          h={height + 43}
          scrollbarSize={2}
          scrollbars="y"
          type="never"
          p={"xs"}
        >
          {preview &&
            barcodeArray.length > 0 &&
            Array.from({ length: Math.ceil(barcodeArray.length / 3) }).map(
              (_, rowIndex) => (
                <Grid
                  key={`row-${rowIndex}`}
                  columns={24}
                  gutter={{ base: 8 }}
                  align="center"
                  justify="flex-start"
                  mt={"sm"}
                >
                  {barcodeArray
                    .slice(rowIndex * 3, rowIndex * 3 + 3)
                    .map((item, index) => (
                      <Grid.Col key={index} span={8} p={8} align="center">
                        <BarcodeGenerator
                          value={`${item.product_id} ${item.barcode_type_id} `}
                        />
                      </Grid.Col>
                    ))}
                </Grid>
              )
            )}

          {preview && checkedBarcodes.length === 0 && (
            <Box p="md" ta="center">
              <Title order={4}>{t("No barcodes selected for printing")}</Title>
            </Box>
          )}
        </ScrollArea>
      </Box>
    </>
  );
}