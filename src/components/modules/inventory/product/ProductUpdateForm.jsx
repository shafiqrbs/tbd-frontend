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

  const configData = localStorage.getItem("config-data")
    ? JSON.parse(localStorage.getItem("config-data"))
    : [];
  console.log(configData);
  const [vat_integration, setVat_integration] = useState(
    !!(configData?.vat_integration === 1)
  );
  const [is_measurement, setIs_measurement] = useState(
    !!(configData?.is_measurement === 1)
  );
  const [is_brand, setIs_brand] = useState(!!(configData?.is_brand === 1));
  const [is_color, setIs_color] = useState(!!(configData?.is_color === 1));
  const [is_grade, setIs_grade] = useState(!!(configData?.is_grade === 1));
  const [is_size, setIs_size] = useState(!!(configData?.is_size === 1));
  const [is_sku, setIs_sku] = useState(!!(configData?.is_sku === 1));
  const [is_product_gallery, setIs_product_gallery] = useState(
    !!(configData?.is_product_gallery === 1)
  );

  return (
    <Box>
      <Stack gap={0}>
        <Grid columns={24} gutter={{ base: 8 }} mb={"6"}>
          <Grid.Col
            span={
              is_measurement && is_product_gallery
                ? 8
                : is_measurement || is_product_gallery
                ? 16
                : 24
            }
          >
            {/* update product form  */}
            <_UpdateProduct categoryDropdown={categoryDropdown} />
          </Grid.Col>


          {/*masurement form*/}
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

        <Grid columns={24} gutter={8}>
          {vat_integration && (
            <Grid.Col span={8}>
              {/* vat integration  */}
              <_VatManagement id={id} />
            </Grid.Col>
          )}

          <Grid.Col span={vat_integration ? 16 : 24}>
            {/*{is_sku && (*/}
              <_SkuManagement
                id={id}
                is_brand={is_brand}
                is_color={is_color}
                is_grade={is_grade}
                is_size={is_size}
              />
            {/*)}*/}
          </Grid.Col>
        </Grid>
      </Stack>
    </Box>
  );
}

export default ProductUpdateForm;
