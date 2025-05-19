import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Grid,
  Box,
  ScrollArea,
  Text,
  LoadingOverlay,
  Card,
  Image,
  Center,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getIndexEntityData, setFormLoading } from "../../../../store/core/crudSlice.js";
import { Dropzone } from "@mantine/dropzone";
import { createEntityDataWithMedia } from "../../../../store/inventory/crudSlice.js";

function _ProductGallery(props) {
  const { id } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 104; // TabList height

  const [formLoad, setFormLoad] = useState(true);
  const [featureImage, setFeatureImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState(Array(4).fill(null));
  const [deletedImages, setDeletedImages] = useState({
    feature_image: false,
    path_one: false,
    path_two: false,
    path_three: false,
    path_four: false,
  });

  const entityEditData = useSelector((state) => state.crudSlice.entityEditData);

  const handleFeatureImage = () => {
    return featureImage ? URL.createObjectURL(featureImage) : null;
  };

  const handleAdditionalImageDrop = (e, index) => {
    if (e[0]) {
      const newAdditionalImages = [...additionalImages];
      newAdditionalImages[index] = e[0];
      setAdditionalImages(newAdditionalImages);
      // Reset deleted status when new image is added
      const type = getTypeFromIndex(index);
      setDeletedImages(prev => ({...prev, [type]: false}));
    }
  };

  const getTypeFromIndex = (index) => {
    return index === 0
        ? "path_one"
        : index === 1
            ? "path_two"
            : index === 2
                ? "path_three"
                : "path_four";
  };

  const reloadEntityData = async () => {
    const value = {
      url: `inventory/product/${id}`,
      data: null,
    };
    await dispatch(getIndexEntityData(value));
  };

  const handleDeleteImage = async (type, index = null) => {
    // Immediately update UI
    if (type === "feature_image") {
      setFeatureImage(null);
      setDeletedImages(prev => ({...prev, feature_image: true}));
    } else if (index !== null) {
      const updatedImages = [...additionalImages];
      updatedImages[index] = null;
      setAdditionalImages(updatedImages);
      setDeletedImages(prev => ({...prev, [type]: true}));
    }

    // Then call API
    await dispatch(
        createEntityDataWithMedia({
          url: "inventory/product/gallery/delete",
          data: { product_id: id, type },
        })
    );

    await reloadEntityData();
  };

  useEffect(() => {
    setFormLoad(true);
    dispatch(setFormLoading(false));
    setTimeout(() => {
      setFormLoad(false);
    }, 500);
  }, [dispatch]);

  // Helper function to determine if we should show delete button
  const shouldShowDeleteButton = (type, image, imageSource) => {
    if (type === "feature_image") {
      return featureImage || (entityEditData.feature_image && !deletedImages.feature_image);
    }
    return image || (imageSource && !deletedImages[type]);
  };

  return (
      <Box>
        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
          <Box>
            <LoadingOverlay
                visible={formLoad}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
          </Box>
          <Card padding="xs">
            <Card.Section p="xs">
              <Dropzone
                  onDrop={(e) => {
                    const value = {
                      url: "inventory/product/gallery",
                      data: {
                        image: e[0],
                        product_id: id,
                        type: "feature_image",
                      },
                    };
                    dispatch(createEntityDataWithMedia(value)).then(() => {
                      reloadEntityData();
                      setFeatureImage(e[0]);
                      setDeletedImages(prev => ({...prev, feature_image: false}));
                    });
                  }}
                  accept={["image/*"]}
                  h={210}
                  p={0}
                  styles={{
                    root: {
                      border: featureImage ? "none" : undefined,
                      position: "relative",
                    },
                  }}
              >
                {(featureImage || (entityEditData.feature_image && !deletedImages.feature_image)) ? (
                    <>
                      <Image
                          src={
                            featureImage
                                ? handleFeatureImage()
                                : `${import.meta.env.VITE_IMAGE_GATEWAY_URL}/storage/${entityEditData.feature_image}`
                          }
                          height={190}
                          fit="cover"
                          alt="Feature image"
                          style={{ pointerEvents: "none" }}
                      />
                      {shouldShowDeleteButton("feature_image", featureImage, entityEditData.feature_image) && (
                          <div
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleDeleteImage("feature_image");
                              }}
                              style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                background: "rgba(0,0,0,0.6)",
                                color: "white",
                                borderRadius: "50%",
                                width: 30,
                                height: 30,
                                cursor: "pointer",
                                zIndex: 20,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1rem",
                                pointerEvents: "auto",
                              }}
                          >
                            ✕
                          </div>
                      )}
                    </>
                ) : (
                    <Center h={190}>
                      <Text>{t("SelectFeatureImage")}</Text>
                    </Center>
                )}
              </Dropzone>
            </Card.Section>

            <Grid columns={12} gutter={4}>
              {additionalImages.map((image, index) => {
                const type = getTypeFromIndex(index);
                const imageSource = entityEditData?.[type];
                const showDeleteButton = shouldShowDeleteButton(type, image, imageSource);

                return (
                    <Grid.Col span={3} key={index} p={2}>
                      <Dropzone
                          onDrop={(e) => {
                            const value = {
                              url: "inventory/product/gallery",
                              data: {
                                image: e[0],
                                product_id: id,
                                type,
                              },
                            };
                            dispatch(createEntityDataWithMedia(value)).then(() => {
                              reloadEntityData();
                              handleAdditionalImageDrop(e, index);
                            });
                          }}
                          accept={["image/*"]}
                          h={100}
                          p={0}
                          styles={{
                            root: {
                              border: image ? "none" : undefined,
                              position: "relative",
                            },
                          }}
                      >
                        {image ? (
                            <>
                              <Image
                                  src={URL.createObjectURL(image)}
                                  height={96}
                                  width="100%"
                                  fit="cover"
                                  alt={`Additional image ${index + 1}`}
                              />
                              {showDeleteButton && (
                                  <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleDeleteImage(type, index);
                                      }}
                                      style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        background: "rgba(0,0,0,0.6)",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: 30,
                                        height: 30,
                                        cursor: "pointer",
                                        zIndex: 20,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1rem",
                                        pointerEvents: "auto",
                                      }}
                                  >
                                    ✕
                                  </div>
                              )}
                            </>
                        ) : (imageSource && !deletedImages[type]) ? (
                            <>
                              <Image
                                  src={`${import.meta.env.VITE_IMAGE_GATEWAY_URL}/storage/${imageSource}`}
                                  height={96}
                                  width="100%"
                                  fit="cover"
                                  alt={`image ${index + 1}`}
                              />
                              {showDeleteButton && (
                                  <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleDeleteImage(type, index);
                                      }}
                                      style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        background: "rgba(0,0,0,0.6)",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: 30,
                                        height: 30,
                                        cursor: "pointer",
                                        zIndex: 20,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1rem",
                                        pointerEvents: "auto",
                                      }}
                                  >
                                    ✕
                                  </div>
                              )}
                            </>
                        ) : (
                            <Center h={100}>
                              <Text>{t("SelectImage")}</Text>
                            </Center>
                        )}
                      </Dropzone>
                    </Grid.Col>
                );
              })}
            </Grid>

            <button
                id="ProductGalleryFormSubmit"
                type="button"
                style={{ display: "none" }}
            ></button>
          </Card>
        </ScrollArea>
      </Box>
  );
}

export default _ProductGallery;