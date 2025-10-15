import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    rem,
    Grid, Tooltip, ActionIcon, Select
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconFilter,
    IconInfoCircle,
    IconRestore,
    IconSearch, IconPdf, IconFileTypeXls, IconCalendar
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {
    setFetching,
} from "../../../../store/production/crudSlice.js";
import {DateInput, MonthPicker, MonthPickerInput} from "@mantine/dates";
import {setProductionIssueFilterData,setProductionIssueWarehouseFilterData} from "../../../../store/report/reportSlice.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import dayjs from 'dayjs';

function _ProductionReportSearch(props) {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline} = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [filterDrawer, setFilterDrawer] = useState(false)
    const [startDateTooltip, setStartDateTooltip] = useState(false);
    const [warehouseTooltip, setWarehouseTooltip] = useState(false);
    const [monthTooltip, setMonthTooltip] = useState(false);


    const searchKeyword = useSelector((state) => state.productionCrudSlice.searchKeyword)
    const productionIssueFilterData = useSelector((state) => state.reportSlice.productionIssueFilterData);
    const productionIssueWarehouseFilterData = useSelector((state) => state.reportSlice.productionIssueWarehouseFilterData);
    let warehouseDropdownData = getCoreWarehouseDropdownData();
    const [warehouseData, setWarehouseData] = useState(null);
    const [selectMonth, setSelectMonth] = useState(null);


    useEffect(() => {
        if (selectMonth) {
            if (props.isWarehouse){
                dispatch(
                    setProductionIssueWarehouseFilterData({
                        ...productionIssueWarehouseFilterData,
                        month: String(selectMonth.getMonth() + 1).padStart(2, '0'),
                        year: selectMonth.getFullYear()
                    })
                );
            }else {
                dispatch(
                    setProductionIssueFilterData({
                        ...productionIssueFilterData,
                        month: String(selectMonth.getMonth() + 1).padStart(2, '0'),
                        year: selectMonth.getFullYear()
                    })
                );
            }
        }
    }, [selectMonth]);


    useHotkeys(
        [['alt+F', () => {
            document.getElementById('SearchKeyword').focus();
        }]
        ], []
    );


    return (
        <>
            <Grid justify="space-between" align="stretch" gutter={{base: 2}} grow>

                {
                    props.module == "production-matrix" ?
                    <>
                        {/*<Grid.Col span="3">
                            <Tooltip
                                label={t("StartDate")}
                                opened={startDateTooltip}
                                px={16}
                                py={2}
                                position="top-end"
                                color="var(--theme-primary-color-6)"
                                withArrow
                                offset={2}
                                zIndex={100}
                                transitionProps={{
                                    transition: "pop-bottom-left",
                                    duration: 5000,
                                }}
                            >
                                <DateInput
                                    clearable
                                    onChange={(e) => {
                                        dispatch(
                                            setProductionIssueFilterData({
                                                ...productionIssueFilterData,
                                                ["start_date"]: e,
                                            })
                                        );
                                        e !== ""
                                            ? setStartDateTooltip(false)
                                            : (setStartDateTooltip(true),
                                                setTimeout(() => {
                                                    setStartDateTooltip(false);
                                                }, 1000));
                                    }}
                                    value={productionIssueFilterData.start_date}
                                    placeholder={t("StartDate")}
                                    leftSection={<IconCalendar size={16} opacity={0.5}/>}
                                    rightSection={
                                        <Tooltip
                                            label={t("StartDate")}
                                            px={16}
                                            py={2}
                                            withArrow
                                            position={"left"}
                                            c={"black"}
                                            bg={`gray.1`}
                                            transitionProps={{
                                                transition: "pop-bottom-left",
                                                duration: 500,
                                            }}
                                        >
                                            <IconInfoCircle size={16} opacity={0.5}/>
                                        </Tooltip>
                                    }
                                />
                            </Tooltip>
                        </Grid.Col>*/}
                        {props.isWarehouse === 1 &&
                            <Grid.Col span="6">

                            <Tooltip
                                label={t("ChooseWarehouse")}
                                opened={warehouseTooltip}
                                px={16}
                                py={2}
                                position="top-end"
                                color="var(--theme-primary-color-6)"
                                withArrow
                                offset={2}
                                zIndex={100}
                                transitionProps={{
                                    transition: "pop-bottom-left",
                                    duration: 5000,
                                }}
                            >
                                <Select
                                    placeholder={t("ChooseWarehouse")}
                                    data={warehouseDropdownData}
                                    onChange={(e) => {
                                        dispatch(
                                            setProductionIssueWarehouseFilterData({
                                                ...productionIssueWarehouseFilterData,
                                                ["warehouse_id"]: e,
                                            })
                                        );
                                        e !== ""
                                            ? setWarehouseTooltip(false)
                                            : (setWarehouseTooltip(true),
                                                setTimeout(() => {
                                                    setWarehouseTooltip(false);
                                                }, 1000));
                                    }}
                                    value={productionIssueWarehouseFilterData.warehouse_id}

                                />

                            </Tooltip>

                        </Grid.Col>
                        }
                        <Grid.Col span={props.isWarehouse === 1?"3":"9"}>
                            <Tooltip
                                label={t("ChooseMonth")}
                                opened={monthTooltip}
                                px={16}
                                py={2}
                                position="top-end"
                                color="var(--theme-primary-color-6)"
                                withArrow
                                offset={2}
                                zIndex={100}
                                transitionProps={{
                                    transition: "pop-bottom-left",
                                    duration: 5000,
                                }}
                            >
                                <MonthPickerInput
                                    placeholder={t("ChooseMonth")}
                                    value={selectMonth}
                                    onChange={setSelectMonth}
                                />
                            </Tooltip>
                        </Grid.Col>
                        {/*<Grid.Col span="3">
                            <Tooltip
                                label={t("EndDate")}
                                opened={startDateTooltip}
                                px={16}
                                py={2}
                                position="top-end"
                                color="var(--theme-primary-color-6)"
                                withArrow
                                offset={2}
                                zIndex={100}
                                transitionProps={{
                                    transition: "pop-bottom-left",
                                    duration: 5000,
                                }}
                            >
                                <DateInput
                                    clearable
                                    onChange={(e) => {
                                        dispatch(
                                            setProductionIssueFilterData({
                                                ...productionIssueFilterData,
                                                ["end_date"]: e,
                                            })
                                        );
                                        e !== ""
                                            ? setStartDateTooltip(false)
                                            : (setStartDateTooltip(true),
                                                setTimeout(() => {
                                                    setStartDateTooltip(false);
                                                }, 1000));
                                    }}
                                    value={productionIssueFilterData.end_date}
                                    placeholder={t("EndDate")}
                                    leftSection={<IconCalendar size={16} opacity={0.5}/>}
                                    rightSection={
                                        <Tooltip
                                            label={t("EndDate")}
                                            px={16}
                                            py={2}
                                            withArrow
                                            position={"left"}
                                            c={"black"}
                                            bg={`gray.1`}
                                            transitionProps={{
                                                transition: "pop-bottom-left",
                                                duration: 500,
                                            }}
                                        >
                                            <IconInfoCircle size={16} opacity={0.5}/>
                                        </Tooltip>
                                    }
                                />
                            </Tooltip>
                        </Grid.Col>*/}
                    </>
                        :
                        <>
                            {props.isWarehouse === 1 &&
                                <Grid.Col span="3">

                                    <Tooltip
                                        label={t("ChooseWarehouse")}
                                        opened={warehouseTooltip}
                                        px={16}
                                        py={2}
                                        position="top-end"
                                        color="var(--theme-primary-color-6)"
                                        withArrow
                                        offset={2}
                                        zIndex={100}
                                        transitionProps={{
                                            transition: "pop-bottom-left",
                                            duration: 5000,
                                        }}
                                    >
                                        <Select
                                            placeholder={t("ChooseWarehouse")}
                                            data={warehouseDropdownData}
                                            required={true}
                                            withAsterisk
                                            onChange={(e) => {
                                                dispatch(
                                                    setProductionIssueFilterData({
                                                        ...productionIssueFilterData,
                                                        ["warehouse_id"]: e,
                                                    })
                                                );
                                                e !== ""
                                                    ? setWarehouseTooltip(false)
                                                    : (setWarehouseTooltip(true),
                                                        setTimeout(() => {
                                                            setWarehouseTooltip(false);
                                                        }, 1000));
                                            }}
                                            value={productionIssueFilterData.warehouse_id}

                                        />

                                    </Tooltip>

                                </Grid.Col>
                            }
                            <Grid.Col span="3">
                                <Tooltip
                                    label={t("StartDate")}
                                    opened={startDateTooltip}
                                    px={16}
                                    py={2}
                                    position="top-end"
                                    color="var(--theme-primary-color-6)"
                                    withArrow
                                    offset={2}
                                    zIndex={100}
                                    transitionProps={{
                                        transition: "pop-bottom-left",
                                        duration: 5000,
                                    }}
                                >
                                    <DateInput
                                        clearable
                                        onChange={(e) => {
                                            dispatch(
                                                setProductionIssueFilterData({
                                                    ...productionIssueFilterData,
                                                    ["start_date"]: e,
                                                })
                                            );
                                            e !== ""
                                                ? setStartDateTooltip(false)
                                                : (setStartDateTooltip(true),
                                                    setTimeout(() => {
                                                        setStartDateTooltip(false);
                                                    }, 1000));
                                        }}
                                        value={productionIssueFilterData.start_date}
                                        placeholder={t("StartDate")}
                                        leftSection={<IconCalendar size={16} opacity={0.5}/>}
                                        rightSection={
                                            <Tooltip
                                                label={t("StartDate")}
                                                px={16}
                                                py={2}
                                                withArrow
                                                position={"left"}
                                                c={"black"}
                                                bg={`gray.1`}
                                                transitionProps={{
                                                    transition: "pop-bottom-left",
                                                    duration: 500,
                                                }}
                                            >
                                                <IconInfoCircle size={16} opacity={0.5}/>
                                            </Tooltip>
                                        }
                                    />
                                </Tooltip>
                            </Grid.Col>
                            <Grid.Col span="3">
                                <Tooltip
                                    label={t("EndDate")}
                                    opened={startDateTooltip}
                                    px={16}
                                    py={2}
                                    position="top-end"
                                    color="var(--theme-primary-color-6)"
                                    withArrow
                                    offset={2}
                                    zIndex={100}
                                    transitionProps={{
                                        transition: "pop-bottom-left",
                                        duration: 5000,
                                    }}
                                >
                                    <DateInput
                                        clearable
                                        onChange={(e) => {
                                            dispatch(
                                                setProductionIssueFilterData({
                                                    ...productionIssueFilterData,
                                                    ["end_date"]: e,
                                                })
                                            );
                                            e !== ""
                                                ? setStartDateTooltip(false)
                                                : (setStartDateTooltip(true),
                                                    setTimeout(() => {
                                                        setStartDateTooltip(false);
                                                    }, 1000));
                                        }}
                                        value={productionIssueFilterData.end_date}
                                        placeholder={t("EndDate")}
                                        leftSection={<IconCalendar size={16} opacity={0.5}/>}
                                        rightSection={
                                            <Tooltip
                                                label={t("EndDate")}
                                                px={16}
                                                py={2}
                                                withArrow
                                                position={"left"}
                                                c={"black"}
                                                bg={`gray.1`}
                                                transitionProps={{
                                                    transition: "pop-bottom-left",
                                                    duration: 500,
                                                }}
                                            >
                                                <IconInfoCircle size={16} opacity={0.5}/>
                                            </Tooltip>
                                        }
                                    />
                                </Tooltip>
                            </Grid.Col>
                        </>
                }


                <Grid.Col span="auto">
                    <ActionIcon.Group mt={'1'} justify="center">
                        <ActionIcon variant="default"
                                    c={'red.4'}
                                    size="lg" aria-label="Filter"
                                    onClick={() => {
                                        searchKeyword.length > 0 ?
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
                                <IconSearch style={{width: rem(18)}} stroke={1.5}
                onClick={(e)=>{
                    if (props.module === 'production-matrix' && props.isWarehouse === 1) {
                        if (productionIssueWarehouseFilterData.year && productionIssueWarehouseFilterData.month && productionIssueWarehouseFilterData.warehouse_id) {
                            props.setSearchValue(true);
                            setWarehouseTooltip(false);
                            setMonthTooltip(false);
                        } else {
                            props.setSearchValue(false);
                            if (!productionIssueWarehouseFilterData.warehouse_id) {
                                setWarehouseTooltip(true);
                            }
                            if (!productionIssueWarehouseFilterData.year) {
                                setMonthTooltip(true);
                            }
                        }
                    } else if (props.module === 'production-matrix' && props.isWarehouse === 0) {
                        if (productionIssueFilterData.year && productionIssueFilterData.month) {
                            props.setSearchValue(true);
                            setMonthTooltip(false);
                        } else {
                            props.setSearchValue(false);
                            setMonthTooltip(true);
                        }
                    } else if (props.module === 'production-issue'){
                        if (props.isWarehouse){
                            if (!productionIssueFilterData.warehouse_id) {
                                setWarehouseTooltip(true);
                            }else {
                                setWarehouseTooltip(false);
                            }
                        }
                        if (!productionIssueFilterData.start_date) {
                            setStartDateTooltip(true);
                        }else {
                            setStartDateTooltip(false);
                            props.setSearchValue(true);
                        }
                        console.log(productionIssueFilterData.start_date)
                    }
                }}
                                />
                            </Tooltip>
                        </ActionIcon>

                        <ActionIcon
                            variant="default"
                            size="lg"
                            c={'gray.6'}
                            aria-label="Settings"
                            onClick={(e) => {
                                setFilterDrawer(true)
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
                                <IconFilter style={{width: rem(18)}} stroke={1.0}/>
                            </Tooltip>
                        </ActionIcon>

                        <ActionIcon variant="default" c={'gray.6'}
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
                                <IconRestore style={{width: rem(18)}} stroke={1.5} onClick={() => {
                                    /*dispatch(setSearchKeyword(''))
                                    dispatch(setFetching(true))

                                    if (props.module === 'production-setting') {
                                        dispatch(setProductionSettingFilterData({
                                            ...productionSettingFilterData,
                                            name: '',
                                            setting_type_id: ''
                                        }));
                                    } else if (props.module === 'production-batch') {
                                        dispatch(setProductionBatchFilterData({
                                            ...productionBatchFilterData,
                                            invoice: '',
                                        }));
                                    } else if (props.module === 'recipe-item') {
                                        dispatch(setRecipeItemFilterData({
                                            ...recipeItemFilterData,
                                            product_name: '',
                                            setting_type_id: ''
                                        }));
                                    }*/
                                }}/>
                            </Tooltip>
                        </ActionIcon>

                        <ActionIcon variant="default"
                                    c={'green.8'}
                                    size="lg" aria-label="Filter"
                                    onClick={() => {
                                        if (props.module === 'production-issue') {
                                            props.setDownloadFile(true)
                                            props.setDownloadType('pdf')
                                        } else if (props.module === 'production-matrix') {
                                            props.setDownloadFile(true)
                                            props.setDownloadType('pdf')
                                        }
                                    }}
                        >
                            <Tooltip
                                label={t('DownloadPdfFile')}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={'red'}
                                bg={`red.1`}
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <IconPdf style={{width: rem(18)}} stroke={1.5}/>
                            </Tooltip>
                        </ActionIcon>

                        <ActionIcon variant="default"
                                    c={'green.8'}
                                    size="lg" aria-label="Filter"
                                    onClick={() => {
                                        if (props.module === 'production-issue') {
                                            props.setDownloadFile(true)
                                            props.setDownloadType('xlsx')
                                        } else if (props.module === 'production-matrix') {
                                            props.setDownloadFile(true)
                                            props.setDownloadType('xlsx')
                                        }
                                    }}
                        >
                            <Tooltip
                                label={t('DownloadExcelFile')}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={'red'}
                                bg={`red.1`}
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <IconFileTypeXls style={{width: rem(18)}} stroke={1.5}/>
                            </Tooltip>
                        </ActionIcon>

                    </ActionIcon.Group>
                </Grid.Col>
            </Grid>
        </>
    );
}

export default _ProductionReportSearch;
