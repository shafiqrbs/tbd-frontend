import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import ProductTable from "./ProductTable.jsx";
import ProductForm from "./ProductForm.jsx";
import ProductUpdateForm from "./ProductUpdateForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import {
    editEntityData,
    setDropdownLoad,
    setEntityNewData,
    setFormLoading,
    setInsertType,
    setSearchKeyword,
} from "../../../../store/inventory/crudSlice.js";
import { getCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";
import NavigationGeneral from "../common/NavigationGeneral.jsx";

function ProductIndex() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { id } = useParams();

    const insertType = useSelector((state) => state.crudSlice.insertType);
    const dropdownLoad = useSelector(
        (state) => state.inventoryCrudSlice.dropdownLoad
    );
    const categoryDropdownData = useSelector(
        (state) => state.inventoryUtilitySlice.categoryDropdownData
    );

    const progress = getLoadingProgress();
    const domainConfigData = JSON.parse(
        localStorage.getItem("domain-config-data")
    );

    // Determine if we are in edit mode
    const isEditMode = typeof id != "undefined" && id != null;

    // Load entity data if edit mode
    useEffect(() => {
        if (isEditMode) {
            dispatch(setInsertType("update"));
            dispatch(editEntityData(`inventory/product/${id}`));
            dispatch(setFormLoading(true));
        } else {
            dispatch(setInsertType("create"));
            dispatch(setSearchKeyword(""));
            dispatch(setEntityNewData([]));
        }
    }, [id, dispatch, isEditMode]);

    // Load dropdown data
    useEffect(() => {
        const value = {
            url: "inventory/select/category",
            param: { type: "all" },
        };
        dispatch(getCategoryDropdown(value));
        dispatch(setDropdownLoad(false));
    }, [dropdownLoad, dispatch]);

    // Map category dropdown
    const categoryDropdown =
        categoryDropdownData && categoryDropdownData.length > 0
            ? categoryDropdownData.map((type) => ({
                label: type.name,
                value: String(type.id),
            }))
            : [];

    return (
        <>
            {progress !== 100 && (
                <Progress
                    color="var(--theme-primary-color-6)"
                    size="sm"
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
                            <InventoryHeaderNavbar
                                pageTitle={t("ManageProduct")}
                                roles={t("Roles")}
                                allowZeroPercentage={
                                    domainConfigData?.inventory_config?.zero_stock
                                }
                                currencySymbol={
                                    domainConfigData?.inventory_config?.currency?.symbol
                                }
                            />

                            <Box p="8">
                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={1}>
                                        <NavigationGeneral module="product" />
                                    </Grid.Col>

                                    {isEditMode ? (
                                        <Grid.Col span={23}>
                                            <Box>
                                                <ProductUpdateForm
                                                    domainConfigData={domainConfigData}
                                                    categoryDropdown={categoryDropdown}
                                                />
                                            </Box>
                                        </Grid.Col>
                                    ) : (
                                        <>
                                            <Grid.Col span={14}>
                                                <Box
                                                    bg="white"
                                                    p="xs"
                                                    className="borderRadiusAll"
                                                >
                                                    <ProductTable categoryDropdown={categoryDropdown} />
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={9}>
                                                <ProductForm categoryDropdown={categoryDropdown} />
                                            </Grid.Col>
                                        </>
                                    )}
                                </Grid>
                            </Box>
                        </>
                    )}
                </Box>
            )}
        </>
    );
}

export default ProductIndex;
