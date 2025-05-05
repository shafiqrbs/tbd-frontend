import React, {useEffect, useState} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {Grid, Box} from "@mantine/core";
import __Warehouse from "../../common/__Warehouse.jsx";
import _Search from "../../../b2b/common/_Search.jsx";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../../assets/css/Table.module.css";
import classes from "../../../../../assets/css/FeaturesCards.module.css";
import {useTranslation} from "react-i18next";

export default function _UserWarehouse() {
    const {id} = useParams();
    const {t, i18n} = useTranslation();
    const {mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 120;
    const perPage = 50;

    const [page, setPage] = useState(1);
    const [reloadList, setReloadList] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [selectWarehouseId, setWarehouseId] = useState(id);
    const [productionItems, setProductionItems] = useState([]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        let items = userData?.production_item || [];

        if (id != null) {
            items = items.filter(item => item.user_warehouse_id == id);
        }

        setProductionItems(items);
        setTimeout(() => {
            setFetching(false);
        }, 700);
    }, [id]);

    return (
        <Box style={{position: "relative"}}>

            <Grid columns={24} gutter={{base: 8}}>
                <Grid.Col span={4}>
                    <__Warehouse
                        classes={classes}
                        setWarehouseId={setWarehouseId}
                        selectWarehouseId={selectWarehouseId}
                        setReloadList={setReloadList}
                        id={id}
                        module={"user-warehouse"}
                        setFetching={setFetching}
                    />
                </Grid.Col>

                <Grid.Col span={20}>
                    <Box p="xs" bg="white" className="borderRadiusAll">
                        <Box pl="xs" pb="xs" pr={8} pt="xs" mb="xs" className="boxBackground borderRadiusAll">
                            <_Search module="product"/>
                        </Box>

                        <Box className="borderRadiusAll">
                            <DataTable
                                classNames={tableCss}
                                records={productionItems || []}
                                columns={[
                                    {
                                        accessor: "index",
                                        title: t("S/N"),
                                        textAlignment: "right",
                                        render: (item) =>
                                            productionItems.indexOf(item) +
                                            1 +
                                            (page - 1) * perPage,
                                    },
                                    {accessor: "item_name", title: t("Item")},
                                    {accessor: "uom", title: t("Unit")},
                                    {accessor: "closing_quantity", title: t("Stock")},
                                    {accessor: "warehouse_name", title: t("Warehouse")},
                                ]}
                                fetching={fetching}
                                loaderSize="xs"
                                loaderColor="grape"
                                height={height}
                                scrollAreaProps={{type: "never"}}
                            />
                        </Box>
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>
    );
}
