import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    rem,
    Grid, Tooltip, TextInput, ActionIcon, Select, Button, Input
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconBrandOkRu,
    IconCalendar,
    IconFilter,
    IconInfoCircle,
    IconRestore,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword } from "../../../../store/core/crudSlice.js";
import FilterModel from "../../filter/FilterModel.jsx";
import { setFetching, setSalesFilterData } from "../../../../store/inventory/crudSlice.js";
import { DateInput } from "@mantine/dates";

function VoucherSearch(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline } = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [customerTooltip, setCustomerTooltip] = useState(false)
    const [startDateTooltip, setStartDateTooltip] = useState(false)
    const [endDateTooltip, setEndDateTooltip] = useState(false)
    const [filterModel, setFilterModel] = useState(false)

    const salesFilterData = useSelector((state) => state.inventoryCrudSlice.salesFilterData)

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

    let [resetKey, setResetKey] = useState(0);

    const resetDropDownState = () => setResetKey(prevKey => prevKey + 1);

    useHotkeys(
        [['alt+F', () => {
            document.getElementById('SearchKeyword').focus();
        }]
        ], []
    );


    return (
        <>
            <Grid justify="flex-end" align="flex-end">
                <Grid.Col span={3}>
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
                            placeholder={t('ChooseVoucherType')}
                            onChange={(e) => {
                                dispatch(setSalesFilterData({ ...salesFilterData, ['searchKeyword']: e.currentTarget.value }))
                                e.target.value !== '' ?
                                    setSearchKeywordTooltip(false) :
                                    (setSearchKeywordTooltip(true),
                                        setTimeout(() => {
                                            setSearchKeywordTooltip(false)
                                        }, 1000))
                            }}
                            value={salesFilterData.searchKeyword}
                            id={'SearchKeyword'}
                            rightSection={
                                salesFilterData.searchKeyword ?
                                    <Tooltip
                                        label={t("Close")}
                                        withArrow
                                        bg={`red.5`}
                                    >
                                        <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
                                            dispatch(setSalesFilterData({ ...salesFilterData, ['searchKeyword']: '' }))
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
                </Grid.Col>
                <Grid.Col span={3}>
                    <TextInput

                        size="sm"
                        placeholder={t('EnterVoucherNo')}
                        onChange={(e) => {
                            dispatch(setSalesFilterData({ ...salesFilterData, ['searchKeyword']: e.currentTarget.value }))
                            e.target.value !== '' ?
                                setSearchKeywordTooltip(false) :
                                (setSearchKeywordTooltip(true),
                                    setTimeout(() => {
                                        setSearchKeywordTooltip(false)
                                    }, 1000))
                        }}
                        value={salesFilterData.searchKeyword}
                        id={'SearchKeyword'}
                        rightSection={
                            salesFilterData.searchKeyword ?
                                <Tooltip
                                    label={t("Close")}
                                    withArrow
                                    bg={`red.5`}
                                >
                                    <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
                                        dispatch(setSalesFilterData({ ...salesFilterData, ['searchKeyword']: '' }))
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
                </Grid.Col>
                <Grid.Col span={2}>
                    <Tooltip
                        label={t('StartDate')}
                        opened={startDateTooltip}
                        px={16}
                        py={2}
                        position="top-end"
                        color="red"
                        withArrow
                        offset={2}
                        zIndex={100}
                        transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
                    >
                        <DateInput
                            rightSection={<IconCalendar size={16} opacity={0.5} />}
                            clearable
                            onChange={(e) => {
                                dispatch(setSalesFilterData({ ...salesFilterData, ['start_date']: e }))
                                e !== '' ?
                                    setStartDateTooltip(false) :
                                    (setStartDateTooltip(true),
                                        setTimeout(() => {
                                            setStartDateTooltip(false)
                                        }, 1000))
                            }}
                            value={salesFilterData.start_date}
                            placeholder={t('StartDate')}
                        />
                    </Tooltip>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Tooltip
                        label={t('EndDate')}
                        opened={endDateTooltip}
                        px={16}
                        py={2}
                        position="top-end"
                        color="red"
                        withArrow
                        offset={2}
                        zIndex={100}
                        transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
                    >
                        <DateInput
                            rightSection={<IconCalendar size={16} opacity={0.5} />}
                            clearable
                            onChange={(e) => {
                                dispatch(setSalesFilterData({ ...salesFilterData, ['end_date']: e }))
                                e !== '' ?
                                    setEndDateTooltip(false) :
                                    (setEndDateTooltip(true),
                                        setTimeout(() => {
                                            setEndDateTooltip(false)
                                        }, 1000))
                            }}
                            placeholder={t('EndDate')}
                        />
                    </Tooltip>
                </Grid.Col>
                <Grid.Col span={2}>
                    <ActionIcon.Group mt={'1'}>
                        <ActionIcon variant="transparent"
                            c={'red.4'}
                            size="lg" mr={16} aria-label="Filter"
                            onClick={() => {
                                (salesFilterData.searchKeyword.length > 0 || salesFilterData.customer_id || salesFilterData.start_date) ?
                                    (dispatch(setFetching(true)),
                                        setSearchKeywordTooltip(false))
                                    :
                                    (setSearchKeywordTooltip(true),
                                        setTimeout(() => {
                                            setSearchKeywordTooltip(false)
                                        }, 1500))
                            }}
                        >
                            <Tooltip
                                label={t('SearchButton')}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={'red'}
                                bg={`red.1`}
                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                            >
                                <IconSearch style={{ width: rem(20) }} stroke={2.0} />
                            </Tooltip>
                        </ActionIcon>


                        <ActionIcon
                            variant="transparent"
                            size="lg"
                            c={'gray.6'}
                            mr={16}
                            aria-label="Settings"
                            onClick={(e) => {
                                setFilterModel(true)
                            }}
                        >
                            <Tooltip
                                label={t("FilterButton")}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={'red'}
                                bg={`red.1`}
                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                            >
                                <IconFilter style={{ width: rem(20) }} stroke={2.0} />
                            </Tooltip>
                        </ActionIcon>


                        <ActionIcon variant="transparent" c={'gray.6'}
                            size="lg" aria-label="Settings">
                            <Tooltip
                                label={t("ResetButton")}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={'red'}
                                bg={`red.1`}
                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                            >
                                <IconRestore style={{ width: rem(20) }} stroke={2.0} onClick={() => {
                                    dispatch(setFetching(true))
                                    setRefreshCustomerDropdown(true)
                                    resetDropDownState();

                                    dispatch(setSalesFilterData({
                                        ...salesFilterData,
                                        ['customer_id']: '',
                                        ['start_date']: '',
                                        ['end_date']: '',
                                        ['searchKeyword']: '',
                                    }));
                                }} />
                            </Tooltip>
                        </ActionIcon>

                        {/* {
                            // Object.keys(props.checkList).length > 1 &&
                            <ActionIcon variant="transparent" c={'gray.6'} size="lg" aria-label="Settings">
                                <Tooltip
                                    label={t("GenerateInvoice")}
                                    px={16}
                                    py={2}
                                    withArrow
                                    position={"bottom"}
                                    c={'red'}
                                    bg={`red.1`}
                                    transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                >
                                    <Button
                                        fullWidth
                                        variant="filled"
                                        color="cyan.5"
                                        onClick={(e) => {
                                            console.log(props.checkList)
                                        }}
                                    ><IconBrandOkRu size={14} /></Button>
                                </Tooltip>
                            </ActionIcon>

                        } */}

                    </ActionIcon.Group>
                </Grid.Col>
            </Grid>

            {
                filterModel &&
                <FilterModel filterModel={filterModel} setFilterModel={setFilterModel} module={props.module} />
            }
        </>
    );
}

export default VoucherSearch;
