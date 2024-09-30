import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Grid,
    Box,
    ScrollArea,
    Text,
    Title,
    LoadingOverlay,
    Card,
    Image,
    Center
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";

import {setFormLoading} from "../../../../store/core/crudSlice.js";
import {Dropzone} from "@mantine/dropzone";
import {createEntityDataWithMedia} from "../../../../store/inventory/crudSlice.js";

function _ProductGallery(props) {
    const {id} = props;
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight / 2; //TabList height 104
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData);

    const [featureImage, setFeatureImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState(Array(4).fill(null));

    const handleFeatureImage = () => {
        let image;
        if (featureImage) {
            image = URL.createObjectURL(featureImage);
        }
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
                                overlayProps={{radius: "sm", blur: 2}}
                            />
                        </Box>
                        <Card padding="xs">
                            <Card.Section p={"xs"}>
                                <Dropzone
                                    onDrop={(e) => {
                                        const value = {
                                            url: "inventory/product/gallery",
                                            data: {
                                                image: e[0],
                                                product_id:id,
                                                type:'feature_image'
                                            },
                                        };
                                        dispatch(createEntityDataWithMedia(value))
                                        setFeatureImage(e[0]);
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
                                        entityEditData.feature_image?
                                        <Image
                                            src={entityEditData.feature_image}
                                            height={178}
                                            fit="cover"
                                            alt="Feature image"
                                        /> :
                                            <Center h={178}>
                                                <Text>{t("SelectFeatureImage")}</Text>
                                            </Center>
                                    )}

                                </Dropzone>
                            </Card.Section>
                            <Grid columns={12} gutter={4}>
                                {additionalImages.map((image, index) => {
                                    const imageSource =
                                        index === 0 ? entityEditData?.path_one :
                                            index === 1 ? entityEditData?.path_two :
                                                index === 2 ? entityEditData?.path_three :
                                                    entityEditData?.path_four;

                                    return (
                                        <Grid.Col span={3} key={index} p={2}>
                                            <Dropzone
                                                onDrop={(e) => {
                                                    const value = {
                                                        url: "inventory/product/gallery",
                                                        data: {
                                                            image: e[0],
                                                            product_id: id,
                                                            type: index === 0 ? 'path_one' : (index === 1 ? 'path_two' : (index === 2 ? 'path_three' : 'path_four'))
                                                        },
                                                    };
                                                    dispatch(createEntityDataWithMedia(value));
                                                    handleAdditionalImageDrop(e, index);
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
                                                    imageSource ? (
                                                        <Image
                                                            src={imageSource}
                                                            height={96}
                                                            width="100%"
                                                            fit="cover"
                                                            alt="image"
                                                        />
                                                    ) : (
                                                        <Center h={100}>
                                                            <Text>{t("SelectImage")}</Text>
                                                        </Center>
                                                    )
                                                )}
                                            </Dropzone>
                                        </Grid.Col>
                                    );
                                })}

                            </Grid>
                        </Card>
                    </ScrollArea>
                </Box>
            </Box>
        </Box>
    );
}

export default _ProductGallery;
