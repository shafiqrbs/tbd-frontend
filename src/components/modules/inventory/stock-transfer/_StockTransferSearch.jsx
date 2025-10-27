import React, {useState} from "react";
import {
    rem,
    Grid,
    Tooltip,
    TextInput,
    ActionIcon,
    Select,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconCalendar,
    IconInfoCircle,
    IconRestore,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {
    setFetching,
    setStockTransferFilterData
} from "../../../../store/inventory/crudSlice.js";
import {DateInput} from "@mantine/dates";
import __FilterPopover from "../sales/__FilterPopover.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";

function _StockTransferSearch(props) {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
    const [fromWarehouseTooltip, setFromWarehouseTooltip] = useState(false);
    const [toWarehouseTooltip, setToWarehouseTooltip] = useState(false);
    const [startDateTooltip, setStartDateTooltip] = useState(false);
    const [endDateTooltip, setEndDateTooltip] = useState(false);

    const stockTransferFilterData = useSelector((state) => state.inventoryCrudSlice.stockTransferFilterData);
    let fromWarehouseDropdownData = getCoreWarehouseDropdownData();
    let toWarehouseDropdownData = getCoreWarehouseDropdownData();
    toWarehouseDropdownData = toWarehouseDropdownData.filter(store => store.value !== stockTransferFilterData.from_warehouse_id);

    let [resetKey, setResetKey] = useState(0);

    const resetDropDownState = () => setResetKey((prevKey) => prevKey + 1);

    useHotkeys(
        [
            [
                "alt+F",
                () => {
                    document.getElementById("SearchKeyword").focus();
                },
            ],
        ],
        []
    );

    return (
        <>
            <Grid columns={24} justify="flex-start" align="flex-end">
                <Grid.Col span={4}>
                    <Tooltip
                        label={t("EnterSearchAnyKeyword")}
                        opened={searchKeywordTooltip}
                        px={16}
                        py={2}
                        position="top-end"
                        color='var(--theme-red-color-6)'
                        withArrow
                        offset={2}
                        zIndex={100}
                        transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 5000,
                        }}
                    >
                        <TextInput
                            leftSection={<IconSearch size={16} opacity={0.5}/>}
                            size="sm"
                            placeholder={t("EnterSearchAnyKeyword")}
                            onChange={(e) => {
                                dispatch(
                                    setStockTransferFilterData({
                                        ...stockTransferFilterData,
                                        ["searchKeyword"]: e.currentTarget.value,
                                    })
                                );
                                e.target.value !== ""
                                    ? setSearchKeywordTooltip(false)
                                    : (setSearchKeywordTooltip(true),
                                        setTimeout(() => {
                                            setSearchKeywordTooltip(false);
                                        }, 1000));
                            }}
                            value={stockTransferFilterData.searchKeyword}
                            id={"SearchKeyword"}
                            rightSection={
                                stockTransferFilterData.searchKeyword ? (
                                    <Tooltip label={t("Close")} withArrow bg={`red.5`}>
                                        <IconX
                                            color='var( --theme-remove-color)'
                                            size={16}
                                            opacity={0.5}
                                            onClick={() => {
                                                dispatch(
                                                    setStockTransferFilterData({
                                                        ...stockTransferFilterData,
                                                        ["searchKeyword"]: "",
                                                    })
                                                );
                                            }}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip
                                        label={t("FieldIsRequired")}
                                        withArrow
                                        position={"bottom"}
                                        c={"red"}
                                        bg={`red.1`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                                )
                            }
                        />
                    </Tooltip>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Tooltip
                        label={t("fromWarehouse")}
                        opened={fromWarehouseTooltip}
                        px={16}
                        py={2}
                        position="top-end"
                        color='var(--theme-red-color-6)'
                        withArrow
                        offset={2}
                        zIndex={100}
                        transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 5000,
                        }}
                    >
                        <Select
                            key={resetKey}
                            id={"Customer"}
                            placeholder={t("fromWarehouse")}
                            size="sm"
                            data={fromWarehouseDropdownData}
                            autoComplete="off"
                            clearable
                            searchable
                            value={stockTransferFilterData.vendor_id}
                            onChange={(e) => {
                                dispatch(
                                    setStockTransferFilterData({
                                        ...stockTransferFilterData,
                                        ["from_warehouse_id"]: e,
                                    })
                                );
                                e !== ""
                                    ? setFromWarehouseTooltip(false)
                                    : (setFromWarehouseTooltip(true),
                                        setTimeout(() => {
                                            setFromWarehouseTooltip(false);
                                        }, 1000));
                            }}
                            comboboxProps={true}
                        />
                    </Tooltip>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Tooltip
                        label={t("toWarehouse")}
                        opened={toWarehouseTooltip}
                        px={16}
                        py={2}
                        position="top-end"
                        color='var(--theme-red-color-6)'
                        withArrow
                        offset={2}
                        zIndex={100}
                        transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 5000,
                        }}
                    >
                        <Select
                            key={resetKey}
                            id={"Customer"}
                            placeholder={t("toWarehouse")}
                            size="sm"
                            data={toWarehouseDropdownData}
                            autoComplete="off"
                            clearable
                            searchable
                            value={stockTransferFilterData.vendor_id}
                            onChange={(e) => {
                                dispatch(
                                    setStockTransferFilterData({
                                        ...stockTransferFilterData,
                                        ["to_warehouse_id"]: e,
                                    })
                                );
                                e !== ""
                                    ? setToWarehouseTooltip(false)
                                    : (setToWarehouseTooltip(true),
                                        setTimeout(() => {
                                            setToWarehouseTooltip(false);
                                        }, 1000));
                            }}
                            comboboxProps={true}
                        />
                    </Tooltip>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Tooltip
                        label={t("StartDate")}
                        opened={startDateTooltip}
                        px={16}
                        py={2}
                        position="top-end"
                        color='var(--theme-red-color-6)'
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
                                    setStockTransferFilterData({
                                        ...stockTransferFilterData,
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
                            value={stockTransferFilterData.start_date}
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
                <Grid.Col span={4}>
                    <Tooltip
                        label={t("EndDate")}
                        opened={endDateTooltip}
                        px={16}
                        py={2}
                        position="top-end"
                        color='var(--theme-red-color-6)'
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
                                    setStockTransferFilterData({
                                        ...stockTransferFilterData,
                                        ["end_date"]: e,
                                    })
                                );
                                e !== ""
                                    ? setEndDateTooltip(false)
                                    : (setEndDateTooltip(true),
                                        setTimeout(() => {
                                            setEndDateTooltip(false);
                                        }, 1000));
                            }}
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
                <Grid.Col span={4}>
                    <ActionIcon.Group mt={"1"}>
                        <ActionIcon
                            variant="default"
                            c={"red.4"}
                            size="lg"
                            aria-label="Filter"
                            onClick={() => {
                                stockTransferFilterData.searchKeyword.length > 0 ||
                                stockTransferFilterData.from_warehouse_id ||
                                stockTransferFilterData.to_warehouse_id ||
                                stockTransferFilterData.start_date
                                    ? (dispatch(setFetching(true)),
                                        setSearchKeywordTooltip(false))
                                    : (setSearchKeywordTooltip(true),
                                        setTimeout(() => {
                                            setSearchKeywordTooltip(false);
                                        }, 1500));
                            }}
                        >
                            <Tooltip
                                label={t("SearchButton")}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={"red"}
                                bg={`red.1`}
                                transitionProps={{
                                    transition: "pop-bottom-left",
                                    duration: 500,
                                }}
                            >
                                <IconSearch style={{width: rem(18)}} stroke={1.5}/>
                            </Tooltip>
                        </ActionIcon>
                        <__FilterPopover/>
                        <ActionIcon
                            variant="default"
                            c={"gray.6"}
                            size="lg"
                            aria-label="Settings"
                        >
                            <Tooltip
                                label={t("ResetButton")}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={"red"}
                                bg={`red.1`}
                                transitionProps={{
                                    transition: "pop-bottom-left",
                                    duration: 500,
                                }}
                            >
                                <IconRestore
                                    style={{width: rem(18)}}
                                    stroke={1.5}
                                    onClick={() => {
                                        dispatch(setFetching(true));
                                        resetDropDownState();

                                        dispatch(
                                            setStockTransferFilterData({
                                                ...stockTransferFilterData,
                                                ["from_warehouse_id"]: "",
                                                ["to_warehouse_id"]: "",
                                                ["start_date"]: "",
                                                ["end_date"]: "",
                                                ["searchKeyword"]: "",
                                            })
                                        );
                                    }}
                                />
                            </Tooltip>
                        </ActionIcon>
                    </ActionIcon.Group>
                </Grid.Col>
            </Grid>
        </>
    );
}

export default _StockTransferSearch;
