import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Grid,
  Box,
  ScrollArea,
  Text,
  Title,
  LoadingOverlay,
  Card,
  Image,
  Center,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";

import { setFormLoading } from "../../../../store/core/crudSlice.js";
import { Dropzone } from "@mantine/dropzone";
import _UpdateProduct from "./_UpdateProduct.jsx";
import _ProductMeasurement from "./_ProductMeasurement.jsx";

function _ProductGallery(props) {
  const { id } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight / 2; //TabList height 104
  const configData = localStorage.getItem("config-data")
    ? JSON.parse(localStorage.getItem("config-data"))
    : [];
  const [setFormData, setFormDataForUpdate] = useState(false);
  const [formLoad, setFormLoad] = useState(true);

  const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
  // const [loadGallery, setLoadGallery] = useState(
  //   !!(configData?.is_product_gallery === 1)
  // );

  const [loadGallery, setLoadGallery] = useState(true);

  const [featureImage, setFeatureImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState(Array(4).fill(null));

  const handleFeatureImage = () => {
    let image;
    if (featureImage) {
      image = URL.createObjectURL(featureImage);
    }
    console.log(featureImage);
    return image;
  };

  const handleAdditionalImageDrop = (e, index) => {
    if (e[0]) {
      const newAdditionalImages = [...additionalImages];
      newAdditionalImages[index] = e[0];
      setAdditionalImages(newAdditionalImages);
    }
  };

  useEffect(() => {
    setFormLoad(true);
    setFormDataForUpdate(true);
  }, [dispatch]);
  //console.log(entityEditData);
  useEffect(() => {
    dispatch(setFormLoading(false));
    setTimeout(() => {
      setFormLoad(false);
      setFormDataForUpdate(false);
    }, 500);
  }, [entityEditData, dispatch]);

  return (
    <Box>
      <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
        <Box
          pl={`xs`}
          pb={"6"}
          pr={8}
          pt={"6"}
          mb={"4"}
          className={"boxBackground borderRadiusAll"}
        >
          <Grid>
            <Grid.Col span={6}>
              <Title order={6} pt={"4"} pb={4}>
                {t("Gallery")}
              </Title>
            </Grid.Col>
            <Grid.Col span={6}></Grid.Col>
          </Grid>
        </Box>
        <Box className={"borderRadiusAll"}>
          <ScrollArea
            h={height - 105}
            scrollbarSize={2}
            scrollbars="y"
            type="never"
          >
            <Box>
              <LoadingOverlay
                visible={formLoad}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
            </Box>
            <Card padding="xs">
              <Card.Section p={"xs"}>
                <Dropzone
                  onDrop={(e) => {
                    /* dummy code for submission api */

                    const value = {
                      // url: "core/user/image-inline/" + entityEditData.id,
                      // data: {
                      //   profile_image: e[0],
                      // },
                    };
                    // dispatch(updateEntityDataWithFile(value))
                    setFeatureImage(e[0]);
                    //   console.log("event data", e);
                  }}
                  accept={["image/*"]}
                  h={178}
                  p={0}
                  styles={(theme) => ({
                    root: {
                      border: featureImage ? "none" : undefined,
                    },
                  })}
                >
                  {featureImage ? (
                    <Image
                      src={handleFeatureImage()}
                      height={178}
                      fit="cover"
                      alt="Feature image"
                    />
                  ) : (
                    <Center h={178}>
                      <Text>{t("SelectFeatureImage")}</Text>
                    </Center>
                  )}
                </Dropzone>
              </Card.Section>
              <Grid columns={12} gutter={4}>
                {additionalImages.map((image, index) => (
                  <Grid.Col span={3} key={index} p={2}>
                    <Dropzone
                      onDrop={(e) => {
                        handleAdditionalImageDrop(e, index);
                        //   console.log(e);
                      }}
                      accept={["image/*"]}
                      h={100}
                      p={0}
                      styles={(theme) => ({
                        root: {
                          border: image ? "none" : undefined,
                        },
                      })}
                    >
                      {image ? (
                        <Image
                          src={URL.createObjectURL(image)}
                          height={96}
                          width="100%"
                          alt={`Additional image ${index + 1}`}
                          fit="cover"
                        />
                      ) : (
                        <Center h={100}>
                          <Text p={"xs"}>{t("SelectImage")}</Text>
                        </Center>
                      )}
                    </Dropzone>
                  </Grid.Col>
                ))}
              </Grid>
            </Card>
          </ScrollArea>
        </Box>
      </Box>
    </Box>
  );
}

export default _ProductGallery;
