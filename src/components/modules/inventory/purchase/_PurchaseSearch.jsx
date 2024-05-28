import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    rem,
    Grid, Tooltip, TextInput, ActionIcon, Select, Button,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconBrandOkRu,
    IconFilter,
    IconInfoCircle,
    IconRestore,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {setSearchKeyword} from "../../../../store/core/crudSlice.js";
import FilterModel from "../../filter/FilterModel.jsx";
import {setFetching, setPurchaseFilterData} from "../../../../store/inventory/crudSlice.js";
import {DateInput} from "@mantine/dates";

function _PurchaseSearch(props) {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline} = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [vendorTooltip, setVendorTooltip] = useState(false)
    const [startDateTooltip, setStartDateTooltip] = useState(false)
    const [endDateTooltip, setEndDateTooltip] = useState(false)
    const [filterModel, setFilterModel] = useState(false)

    const purchaseFilterData = useSelector((state) => state.inventoryCrudSlice.purchaseFilterData)

    /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/
    const [vendorsDropdownData, setVendorsDropdownData] = useState([])
    const [refreshVendorDropdown, setRefreshVendorDropdown] = useState(false)

    useEffect(() => {
        let coreVendors = localStorage.getItem('core-vendors');
        coreVendors = coreVendors ? JSON.parse(coreVendors) : []
        if (coreVendors && coreVendors.length > 0) {
            const transformedData = coreVendors.map(type => {
                return ({'label': type.mobile + ' -- ' + type.name, 'value': String(type.id)})
            });
            setVendorsDropdownData(transformedData);
            setRefreshVendorDropdown(false)
        }
    }, [refreshVendorDropdown])
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
                        transitionProps={{transition: "pop-bottom-left", duration: 5000}}
                    >
                        <TextInput
                            leftSection={<IconSearch size={16} opacity={0.5}/>}
                            size="sm"
                            placeholder={t('EnterSearchAnyKeyword')}
                            onChange={(e) => {
                                dispatch(setPurchaseFilterData({...purchaseFilterData, ['searchKeyword']: e.currentTarget.value}))
                                e.target.value !== '' ?
                                    setSearchKeywordTooltip(false) :
                                    (setSearchKeywordTooltip(true),
                                        setTimeout(() => {
                                            setSearchKeywordTooltip(false)
                                        }, 1000))
                            }}
                            value={purchaseFilterData.searchKeyword}
                            id={'SearchKeyword'}
                            rightSection={
                                purchaseFilterData.searchKeyword ?
                                    <Tooltip
                                        label={t("Close")}
                                        withArrow
                                        bg={`red.5`}
                                    >
                                        <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
                                            dispatch(setPurchaseFilterData({...purchaseFilterData, ['searchKeyword']: ''}))
                                        }}/>
                                    </Tooltip>
                                    :
                                    <Tooltip
                                        label={t("FieldIsRequired")}
                                        withArrow
                                        position={"bottom"}
                                        c={'red'}
                                        bg={`red.1`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                            }
                        />
                    </Tooltip>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Tooltip
                        label={t('ChooseVendor')}
                        opened={vendorTooltip}
                        px={16}
                        py={2}
                        position="top-end"
                        color="red"
                        withArrow
                        offset={2}
                        zIndex={100}
                        transitionProps={{transition: "pop-bottom-left", duration: 5000}}
                    >
                        <Select
                            key={resetKey}
                            id={"Customer"}
                            placeholder={t('ChooseVendor')}
                            size="sm"
                            data={vendorsDropdownData}
                            autoComplete="off"
                            clearable
                            searchable
                            value={purchaseFilterData.vendor_id}
                            onChange={(e) => {
                                dispatch(setPurchaseFilterData({...purchaseFilterData, ['vendor_id']: e}))
                                e !== '' ?
                                    setVendorTooltip(false) :
                                    (setVendorTooltip(true),
                                        setTimeout(() => {
                                            setVendorTooltip(false)
                                        }, 1000))
                            }}
                            comboboxProps={true}
                        />
                    </Tooltip>
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
                        transitionProps={{transition: "pop-bottom-left", duration: 5000}}
                    >
                        <DateInput
                            clearable
                            onChange={(e) => {
                                dispatch(setPurchaseFilterData({...purchaseFilterData, ['start_date']: e}))
                                e !== '' ?
                                    setStartDateTooltip(false) :
                                    (setStartDateTooltip(true),
                                        setTimeout(() => {
                                            setStartDateTooltip(false)
                                        }, 1000))
                            }}
                            value={purchaseFilterData.start_date}
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
                        transitionProps={{transition: "pop-bottom-left", duration: 5000}}
                    >
                        <DateInput
                            clearable
                            onChange={(e) => {
                                dispatch(setPurchaseFilterData({...purchaseFilterData, ['end_date']: e}))
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
                                        (purchaseFilterData.searchKeyword.length > 0 || purchaseFilterData.vendor_id || purchaseFilterData.start_date) ?
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
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <IconSearch style={{width: rem(20)}} stroke={2.0}/>
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
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <IconFilter style={{width: rem(20)}} stroke={2.0}/>
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
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <IconRestore style={{width: rem(20)}} stroke={2.0} onClick={() => {
                                    dispatch(setFetching(true))
                                    setRefreshVendorDropdown(true)
                                    resetDropDownState();

                                    dispatch(setPurchaseFilterData({
                                        ...purchaseFilterData,
                                        ['vendor_id']: '',
                                        ['start_date']: '',
                                        ['end_date']: '',
                                        ['searchKeyword']: '',
                                    }));
                                }}/>
                            </Tooltip>
                        </ActionIcon>

                    </ActionIcon.Group>
                </Grid.Col>
            </Grid>

            {
                filterModel &&
                <FilterModel filterModel={filterModel} setFilterModel={setFilterModel} module={props.module}/>
            }
        </>
    );
}

export default _PurchaseSearch;
