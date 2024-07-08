import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    rem,
    Grid, Tooltip, TextInput, ActionIcon, Select, Button, Flex, Box
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconBrandOkRu, IconFileTypeXls,
    IconFilter,
    IconInfoCircle, IconPdf,
    IconRestore,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword } from "../../../../store/core/crudSlice.js";
import FilterModel from "../../filter/FilterModel.jsx";
import { setFetching, setInvoiceBatchFilterData, storeEntityData } from "../../../../store/inventory/crudSlice.js";
import { DateInput } from "@mantine/dates";
import {
    setCategoryGroupFilterData,
    setCustomerFilterData,
    setUserFilterData,
    setVendorFilterData
} from "../../../../store/core/crudSlice";
import { setProductFilterData } from "../../../../store/inventory/crudSlice";
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
                        fullWidth
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
