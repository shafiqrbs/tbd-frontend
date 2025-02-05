import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Grid, Box, Stack } from "@mantine/core";
import _UpdateProduct from "./_UpdateProduct.jsx";
import _ProductMeasurement from "./_ProductMeasurement.jsx";
import _ProductGallery from "./_ProductGallery.jsx";
import _VatManagement from "./_VatManagement.jsx";
import _SkuManagement from "./_SkuManagement.jsx";

function ProductUpdateForm(props) {
  const { id } = useParams();
  const { categoryDropdown } = props;

  // Sync `configData` with localStorage
  const [configData, setConfigData] = useState(() => {
    const storedConfigData = localStorage.getItem("config-data");
    return storedConfigData ? JSON.parse(storedConfigData) : [];
  });

  // Derived states based on `configData`
  const [isBrand, setBrand] = useState((configData?.is_brand === 1));
  const [vat_integration, setVat_integration] = useState(
      (configData?.vat_integration === 1)
  );
  const [is_measurement, setIs_measurement] = useState(
      (configData?.is_measurement === 1)
  );
  const [isColor, setColor] = useState((configData?.is_color === 1));
  const [isGrade, setGrade] = useState((configData?.is_grade === 1));
  const [isSize, setSize] = useState((configData?.is_size === 1));
  const [isModel, setModel] = useState((configData?.is_model === 1));
  const [isSku, setSku] = useState((configData?.is_sku === 1));
  const [vatEnable, setVatEnable] = useState((configData.vat_enable === 1));
  const [isMultiPrice, setIsMultiPrice] = useState(
      (configData?.is_multi_price === 1)
  );
  const [is_product_gallery, setIs_product_gallery] = useState(
      (configData?.is_product_gallery === 1)
  );

  // Update derived states whenever `configData` changes
  useEffect(() => {
    setBrand((configData?.is_brand === 1));
    setVat_integration((configData?.vat_integration === 1));
    setIs_measurement((configData?.is_measurement === 1));
    setColor((configData?.is_color === 1));
    setGrade((configData?.is_grade === 1));
    setSize((configData?.is_size === 1));
    setModel((configData?.is_model === 1));
    setSku((configData?.is_sku === 1));
    setVatEnable((configData?.vat_enable === 1));
    setIsMultiPrice((configData?.is_multi_price === 1));
    setIs_product_gallery((configData?.is_product_gallery === 1));
  }, [configData]);

  // Add `storage` event listener for cross-tab sync
  useEffect(() => {
    const storageListener = (event) => {
      if (event.storageArea === localStorage && event.key === "config-data") {
        const newConfigData = event.newValue
            ? JSON.parse(event.newValue)
            : [];
        setConfigData(newConfigData);
      }
    };

    window.addEventListener("storage", storageListener);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, []);

  return (
      <Box>
        <Stack gap={0}>
          <Grid columns={24} gutter={{ base: 4 }} mb={"4"}>
            <Grid.Col span={8}>
              {/* update product form */}
              <_UpdateProduct categoryDropdown={categoryDropdown} />
            </Grid.Col>

            <Grid.Col span={16}>
              {isSku && (
                  <_SkuManagement
                      id={id}
                      isBrand={isBrand}
                      isColor={isColor}
                      isGrade={isGrade}
                      isSize={isSize}
                      isModel={isModel}
                      isMultiPrice={isMultiPrice}
                  />
              )}
            </Grid.Col>
          </Grid>
          <Grid columns={24} gutter={4}>
            {/* Measurement form */}
            {is_measurement && (
                <Grid.Col span={8}>
                  <_ProductMeasurement id={id} />
                </Grid.Col>
            )}
            {/* Product Gallery */}
            {is_product_gallery && (
                <Grid.Col span={8}>
                  <_ProductGallery id={id} />
                </Grid.Col>
            )}
            <Grid.Col span={8}>
              {/* vat integration */}
              {
                vatEnable && (
                      <_VatManagement id={id} />
                  )
              }

            </Grid.Col>
          </Grid>
        </Stack>
      </Box>
  );
}

export default ProductUpdateForm;
