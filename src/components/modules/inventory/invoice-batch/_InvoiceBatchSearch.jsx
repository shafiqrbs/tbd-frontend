import React from "react";
import {
    Grid, Flex, Box
} from "@mantine/core";
import SearchKeyword from "../../../advance-search/SearchKeyword.jsx";
import SearchChooseCustomer from "../../../../components/advance-search/SearchChooseCustomer.jsx";
import SearchStartDate from "../../../advance-search/SearchStartDate.jsx";
import SearchEndDate from "../../../advance-search/SearchEndDate.jsx";
import SearchActionMenu from "../../../advance-search/SearchActionMenu.jsx";

function _InvoiceBatchSearch(props) {


    return (
        <>
            <Grid columns={24} justify="flex-start" align="flex-end">
                <Grid.Col span={15}>
                    <Grid columns={24}>
                        <Grid.Col span={6}>
                            <Box mt={"1"}>
                                <SearchKeyword />
                            </Box >
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Box mt={"1"}>
                                <SearchChooseCustomer />
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Box mt={"1"}>
                                <SearchStartDate />
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Box mt={"1"}>
                                <SearchEndDate />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={'auto'}>
                    <SearchActionMenu />
                </Grid.Col>
            </Grid>

        </>
    );
}

export default _InvoiceBatchSearch;
