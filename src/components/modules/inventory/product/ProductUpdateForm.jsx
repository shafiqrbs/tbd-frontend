import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Grid, Box, Stack } from "@mantine/core";
import _UpdateProduct from "./_UpdateProduct.jsx";
import _ProductMeasurement from "./_ProductMeasurement.jsx";
import _ProductGallery from "./_ProductGallery.jsx";
import _VatManagement from "./_VatManagement.jsx";
import _SkuManagement from "./_SkuManagement.jsx";
import getConfigData from "../../../global-hook/config-data/getConfigData";

function  ProductUpdateForm(props) {
  const { id } = useParams();
  const { categoryDropdown } = props;

  localStorage.setItem('config-data', JSON.stringify(getConfigData()));
  const configData = localStorage.getItem("config-data")
    ? JSON.parse(localStorage.getItem("config-data"))
    : [];

  const [vat_integration, setVat_integration] = useState(
    !!(configData?.vat_integration === 1)
  );
  const [is_measurement, setIs_measurement] = useState(
    !!(configData?.is_measurement === 1)
  );
  const [isBrand, setIsBrand] = useState(!!(configData?.is_brand === 1));
  const [isColor, setIsColor] = useState(!!(configData?.is_color === 1));
  const [isGrade, setIsGrade] = useState(!!(configData?.is_grade === 1));
  const [isSize, setIsSize] = useState(!!(configData?.is_size === 1));
  const [isSku, setIsSku] = useState(!!(configData?.is_sku === 1));
  const [isMultiPrice, setIsMultiPrice] = useState(!!(configData?.is_multi_price === 1));
  const [is_product_gallery, setIs_product_gallery] = useState(
    !!(configData?.is_product_gallery === 1)
  );

  return (
    <Box>
      <Stack gap={0}>
        <Grid columns={24} gutter={{ base: 8 }} mb={"6"}>
          <Grid.Col span={8}>
            {/* update product form  */}
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
              isMultiPrice={isMultiPrice}
            />
            )}
          </Grid.Col>
        </Grid>
        <Grid columns={24} gutter={8}>
          {1 && (
            <Grid.Col span={8}>
              {/* vat integration  */}
              <_VatManagement id={id} />
            </Grid.Col>
          )}
          {/*measurement form*/}
          {is_measurement && (
            <Grid.Col span={8}>
              <_ProductMeasurement id={id} />
            </Grid.Col>
          )}

          {/* gallery */}
          {is_product_gallery && (
            <Grid.Col span={8}>
              <_ProductGallery id={id} />
            </Grid.Col>
          )}
        </Grid>
      </Stack>
    </Box>
  );
}

export default ProductUpdateForm;
