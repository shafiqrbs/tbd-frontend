import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {Tooltip, TextInput, Box
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconInfoCircle,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import {  setInvoiceBatchFilterData } from "../../store/inventory/crudSlice.js";


function SearchKeyword(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)

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
                    label={t('EnterSearchAnyKeyword')}
                    opened={searchKeywordTooltip}
                    px={16}
                    py={2}
                    position="top-end"
                    color='var(--theme-primary-color-6)'
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
                                    <IconX color='var( --theme-remove-color)'  size={16} opacity={0.5} onClick={() => {
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
