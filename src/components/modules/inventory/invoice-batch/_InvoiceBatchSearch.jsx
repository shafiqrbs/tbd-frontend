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
            <Grid columns={40} justify="flex-start" align="flex-end" >
                <Grid.Col span={32}>
                    <Grid gutter={'2'}>
                        <Grid.Col span={3}>
                            <Box>
                                <SearchKeyword />
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={5}>
                            <Box>
                                <SearchChooseCustomer />
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Box>
                                <SearchStartDate />
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Box>
                                <SearchEndDate />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span="auto">
                    <Flex gap="xs"
                        justify="center"
                        align="center"
                        direction="row">
                        <SearchActionMenu />
                    </Flex>
                </Grid.Col>
            </Grid>

        </>
    );
}

export default _InvoiceBatchSearch;
