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
import { setSearchKeyword } from "../../../../../store/core/crudSlice.js";
import FilterModel from "../../../filter/FilterModel.jsx";
import { setFetching, setInvoiceBatchFilterData, storeEntityData } from "../../../../../store/inventory/crudSlice.js";


function SearchKeyword(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { isOnline } = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [customerTooltip, setCustomerTooltip] = useState(false)
    const [startDateTooltip, setStartDateTooltip] = useState(false)
    const [endDateTooltip, setEndDateTooltip] = useState(false)
    const [filterModel, setFilterModel] = useState(false)

    const invoiceBatchFilterData = useSelector((state) => state.inventoryCrudSlice.invoiceBatchFilterData)

    /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/
    const [customersDropdownData, setCustomersDropdownData] = useState([])
    const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false)

    useEffect(() => {
        let coreCustomers = localStorage.getItem('core-customers');
        coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : []
        if (coreCustomers && coreCustomers.length > 0) {
            const transformedData = coreCustomers.map(type => {
                return ({ 'label': type.mobile + ' -- ' + type.name, 'value': String(type.id) })
            });
            setCustomersDropdownData(transformedData);
            setRefreshCustomerDropdown(false)
        }
    }, [refreshCustomerDropdown])
    /*END GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/


    useHotkeys(
        [['alt+F', () => {
            document.getElementById('SearchKeyword').focus();
        }]
        ], []
    );


    return (
        <>
            <Box>
                <Tooltip
                    label={t('EnterSearchAnyKeyword')}
                    opened={searchKeywordTooltip}
                    px={16}
                    py={2}
                    position="top-end"
                    color="red"
                    withArrow
                    offset={2}
                    zIndex={100}
                    transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
                >
                    <TextInput
                        leftSection={<IconSearch size={16} opacity={0.5} />}
                        size="sm"
                        placeholder={t('EnterSearchAnyKeyword')}
                        onChange={(e) => {
                            dispatch(setInvoiceBatchFilterData({ ...invoiceBatchFilterData, ['searchKeyword']: e.currentTarget.value }))
                            e.target.value !== '' ?
                                setSearchKeywordTooltip(false) :
                                (setSearchKeywordTooltip(true),
                                    setTimeout(() => {
                                        setSearchKeywordTooltip(false)
                                    }, 1000))
                        }}
                        value={invoiceBatchFilterData.searchKeyword}
                        id={'SearchKeyword'}
                        rightSection={
                            invoiceBatchFilterData.searchKeyword ?
                                <Tooltip
                                    label={t("Close")}
                                    withArrow
                                    bg={`red.5`}
                                >
                                    <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
                                        dispatch(setInvoiceBatchFilterData({ ...invoiceBatchFilterData, ['searchKeyword']: '' }))
                                    }} />
                                </Tooltip>
                                :
                                <Tooltip
                                    label={t("FieldIsRequired")}
                                    withArrow
                                    position={"bottom"}
                                    c={'red'}
                                    bg={`red.1`}
                                >
                                    <IconInfoCircle size={16} opacity={0.5} />
                                </Tooltip>
                        }
                    />
                </Tooltip>
            </Box>


        </>
    );
}

export default SearchKeyword;
