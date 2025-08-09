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
import {setInventorySalesFilterData,setInventorySalesWarehouseFilterData} from "../../../../store/report/reportSlice.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import dayjs from 'dayjs';

function _InventoryReportSearch(props) {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline} = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [filterDrawer, setFilterDrawer] = useState(false)
    const [startDateTooltip, setStartDateTooltip] = useState(false);
    const [warehouseTooltip, setWarehouseTooltip] = useState(false);
    const [monthTooltip, setMonthTooltip] = useState(false);


    const searchKeyword = useSelector((state) => state.productionCrudSlice.searchKeyword)
    const inventorySalesFilterData = useSelector((state) => state.reportSlice.inventorySalesFilterData);
    const inventorySalesWarehouseFilterData = useSelector((state) => state.reportSlice.inventorySalesWarehouseFilterData);
    let warehouseDropdownData = getCoreWarehouseDropdownData();
    const [warehouseData, setWarehouseData] = useState(null);
    const [selectMonth, setSelectMonth] = useState(null);


    useEffect(() => {
        if (selectMonth) {
            if (props.isWarehouse===1){
                dispatch(
                    setInventorySalesWarehouseFilterData({
                        ...inventorySalesWarehouseFilterData,
                        month: String(selectMonth.getMonth() + 1).padStart(2, '0'),
                        year: selectMonth.getFullYear()
                    })
                );
            }else {
                dispatch(
                    setInventorySalesFilterData({
                        ...inventorySalesFilterData,
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
                    props.module == "inventory-sales" ?
                    <>
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
                                            setInventorySalesWarehouseFilterData({
                                                ...inventorySalesWarehouseFilterData,
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
                                    value={inventorySalesWarehouseFilterData.warehouse_id}

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
                    </>
                        :
                        <>
                            <Grid.Col span="4">
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
                                            if (props.isWarehouse===1) {
                                                dispatch(
                                                    setInventorySalesWarehouseFilterData({
                                                        ...inventorySalesWarehouseFilterData,
                                                        ["start_date"]: e,
                                                    })
                                                );
                                            }else {
                                                dispatch(
                                                    setInventorySalesFilterData({
                                                        ...inventorySalesFilterData,
                                                        ["start_date"]: e,
                                                    })
                                                );
                                            }
                                            e !== ""
                                                ? setStartDateTooltip(false)
                                                : (setStartDateTooltip(true),
                                                    setTimeout(() => {
                                                        setStartDateTooltip(false);
                                                    }, 1000));
                                        }}
                                        value={inventorySalesFilterData.start_date}
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
                            <Grid.Col span="4">
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
                                                setInventorySalesFilterData({
                                                    ...inventorySalesFilterData,
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
                                        value={inventorySalesFilterData.end_date}
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
                    if (props.module === 'inventory-sales' && props.isWarehouse === 1) {
                        if (inventorySalesWarehouseFilterData.year && inventorySalesWarehouseFilterData.month && inventorySalesWarehouseFilterData.warehouse_id) {
                            props.setSearchValue(true);
                            setWarehouseTooltip(false);
                            setMonthTooltip(false);
                        } else {
                            props.setSearchValue(false);
                            if (!inventorySalesWarehouseFilterData.warehouse_id) {
                                setWarehouseTooltip(true);
                            }
                            if (!inventorySalesWarehouseFilterData.year) {
                                setMonthTooltip(true);
                            }
                        }
                    } else if (props.module === 'inventory-sales' && props.isWarehouse === 0) {
                        if (inventorySalesFilterData.year && inventorySalesFilterData.month) {
                            props.setSearchValue(true);
                            setMonthTooltip(false);
                        } else {
                            props.setSearchValue(false);
                            setMonthTooltip(true);
                        }
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
                                        } else if (props.module === 'inventory-sales') {
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
                                        } else if (props.module === 'inventory-sales') {
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

export default _InventoryReportSearch;
