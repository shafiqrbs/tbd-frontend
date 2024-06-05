import React, {useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    rem, Grid, Tooltip, TextInput, ActionIcon, Button,Flex
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconArrowRight,
    IconFilter,
    IconInfoCircle,
    IconRestore,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import FilterModel from "../../filter/FilterModel.jsx";
import {setFetching, setPurchaseItemsFilterData} from "../../../../store/inventory/crudSlice.js";
import {DateInput} from "@mantine/dates";

function _OpeningSearch(props) {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isOnline} = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [startDateTooltip, setStartDateTooltip] = useState(false)
    const [endDateTooltip, setEndDateTooltip] = useState(false)
    const [filterModel, setFilterModel] = useState(false)

    const purchaseItemsFilterData = useSelector((state) => state.inventoryCrudSlice.purchaseItemsFilterData)
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
            <Grid columns={14} justify="flex-end" align="flex-end">
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
                                dispatch(setPurchaseItemsFilterData({...purchaseItemsFilterData, ['searchKeyword']: e.currentTarget.value}))
                                e.target.value !== '' ?
                                    setSearchKeywordTooltip(false) :
                                    (setSearchKeywordTooltip(true),
                                        setTimeout(() => {
                                            setSearchKeywordTooltip(false)
                                        }, 1000))
                            }}
                            value={purchaseItemsFilterData.searchKeyword}
                            id={'SearchKeyword'}
                            rightSection={
                                purchaseItemsFilterData.searchKeyword ?
                                    <Tooltip
                                        label={t("Close")}
                                        withArrow
                                        bg={`red.5`}
                                    >
                                        <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
                                            dispatch(setPurchaseItemsFilterData({...purchaseItemsFilterData, ['searchKeyword']: ''}))
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
                            key={resetKey}
                            clearable
                            onChange={(e) => {
                                dispatch(setPurchaseItemsFilterData({...purchaseItemsFilterData, ['start_date']: e}))
                                e !== '' ?
                                    setStartDateTooltip(false) :
                                    (setStartDateTooltip(true),
                                        setTimeout(() => {
                                            setStartDateTooltip(false)
                                        }, 1000))
                            }}
                            value={purchaseItemsFilterData.start_date}
                            placeholder={t('StartDate')}
                        />
                    </Tooltip>
                </Grid.Col>
                <Grid.Col span={3}>
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
                            key={resetKey}
                            clearable
                            onChange={(e) => {
                                dispatch(setPurchaseItemsFilterData({...purchaseItemsFilterData, ['end_date']: e}))
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
                <Grid.Col span={3}>
                    <ActionIcon.Group mt={'1'}>
                        <ActionIcon variant="transparent"
                                    c={'red.4'}
                                    size="lg" mr={16} aria-label="Filter"
                                    onClick={() => {
                                        (purchaseItemsFilterData.searchKeyword.length > 0 ||  purchaseItemsFilterData.start_date) ?
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
                                    resetDropDownState();

                                    dispatch(setPurchaseItemsFilterData({
                                        ...purchaseItemsFilterData,
                                        ['start_date']: '',
                                        ['end_date']: '',
                                        ['searchKeyword']: '',
                                    }));
                                }}/>
                            </Tooltip>
                        </ActionIcon>

                    </ActionIcon.Group>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Flex
                        justify="flex-end"
                        align="center"
                    >

                    <Button onClick={(e) => { navigate('/inventory/opening-stock') }}
                            size="sm"
                            color={`red.8`}
                            variant="outline"
                            mt={0}
                            rightSection={<IconArrowRight size={16} />}
                    >
                        {t("OpeningStock")}
                    </Button>
                    </Flex>
                </Grid.Col>
            </Grid>

            {
                filterModel &&
                <FilterModel filterModel={filterModel} setFilterModel={setFilterModel} module={props.module}/>
            }
        </>
    );
}

export default _OpeningSearch;
