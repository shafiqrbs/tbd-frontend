import React, { useEffect, useState } from "react";
import { Tooltip, Box
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import {  setInvoiceBatchFilterData,  } from "../../store/inventory/crudSlice.js";
import { DateInput } from "@mantine/dates";
import { IconCalendar, IconInfoCircle } from "@tabler/icons-react";


function SearchEndDate(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [endDateTooltip, setEndDateTooltip] = useState(false)

    const invoiceBatchFilterData = useSelector((state) => state.inventoryCrudSlice.invoiceBatchFilterData)

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
                    label={t('EndDate')}
                    opened={endDateTooltip}
                    px={16}
                    py={2}
                    position="top-end"
                    color='var(--theme-primary-color-6)'
                    withArrow
                    offset={2}
                    zIndex={100}
                    transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
                >
                    <DateInput
                        clearable
                        onChange={(e) => {
                            dispatch(setInvoiceBatchFilterData({ ...invoiceBatchFilterData, ['end_date']: e }))
                            e !== '' ?
                                setEndDateTooltip(false) :
                                (setEndDateTooltip(true),
                                    setTimeout(() => {
                                        setEndDateTooltip(false)
                                    }, 1000))
                        }}
                        placeholder={t('EndDate')}
                        leftSection={<IconCalendar size={16} opacity={0.5} />}
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
                                <IconInfoCircle size={16} opacity={0.5} />
                            </Tooltip>
                        }
                    />
                </Tooltip>
            </Box>
        </>
    );
}

export default SearchEndDate;
