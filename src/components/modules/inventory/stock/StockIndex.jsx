import React, {useEffect} from "react";
import {Box, Grid, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import {
    setDropdownLoad,
} from "../../../../store/inventory/crudSlice.js";
import StockTable from "./StockTable.jsx";
import {getCategoryDropdown} from "../../../../store/inventory/utilitySlice.js";
import NavigationGeneral from "../common/NavigationGeneral.jsx";
import WarehouseStockNav from "./WarehouseStockNav";
import {useParams} from "react-router";
import StockWarehouseTable from "./StockWarehouseTable";

function StockIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {warehouse} = useParams();
    const progress = getLoadingProgress();
    const {configData} = useConfigData();
    const dropdownLoad = useSelector(
        (state) => state.inventoryCrudSlice.dropdownLoad
    );
    const categoryDropdownData = useSelector(
        (state) => state.inventoryUtilitySlice.categoryDropdownData
    );

    let categoryDropdown =
        categoryDropdownData && categoryDropdownData.length > 0
            ? categoryDropdownData.map((type, index) => {
                return {label: type.name, value: String(type.id)};
            })
            : [];

    useEffect(() => {
        const value = {
            url: "inventory/select/category",
            param: {
                type: "all",
            },
        };
        dispatch(getCategoryDropdown(value));
        dispatch(setDropdownLoad(false));
    }, [dropdownLoad]);


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
                <>
                    {configData && (
                        <>
                            <InventoryHeaderNavbar
                                pageTitle={t("ManageProduct")}
                                roles={t("Roles")}
                                allowZeroPercentage={configData.zero_stock}
                                currencySymbol={configData?.currency?.symbol}
                            />
                            <Box p={"8"}>
                                <Grid columns={24} gutter={{base: 8}}>
                                    <Grid.Col span={1}>
                                        <NavigationGeneral module={"stock"}/>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <WarehouseStockNav active={warehouse ? warehouse : "stock"}/>
                                    </Grid.Col>
                                    <Grid.Col span={20}>
                                        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>

                                            <>
                                                {warehouse ? (
                                                    <StockWarehouseTable
                                                        categoryDropdown={categoryDropdown}
                                                        warehouse={warehouse}
                                                    />
                                                ) : (
                                                    <StockTable
                                                        categoryDropdown={categoryDropdown}
                                                    />
                                                )}
                                            </>
                                        </Box>
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

export default StockIndex;
