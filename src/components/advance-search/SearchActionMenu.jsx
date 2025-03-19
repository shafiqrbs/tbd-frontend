import React, {  useState } from "react";
import {
    rem, Tooltip, ActionIcon,  Box
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconFileTypeXls,
    IconFilter, IconPdf,
    IconRestore,
    IconSearch,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setFetching, setInvoiceBatchFilterData } from "../../store/inventory/crudSlice.js";
import _FilterSearch from '../../components/modules/inventory/invoice-batch/drawer/_FilterSearch.jsx'
import __FilterPopover from "../modules/inventory/product/__FilterPopover.jsx";

function SearchActionMenu(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [filterModel, setFilterModel] = useState(false)

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
                <ActionIcon.Group justify="center">
                    <ActionIcon variant="default"
                        c={'red.4'}
                        size="lg" aria-label="Filter"
                        onClick={() => {
                            invoiceBatchFilterData.searchKeyword.length > 0 || invoiceBatchFilterData.customer_id || invoiceBatchFilterData.start_date ?
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
                            <IconSearch style={{ width: rem(18) }} stroke={1.5} />
                        </Tooltip>
                    </ActionIcon>
                    <__FilterPopover />
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
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <IconRestore style={{ width: rem(18) }} stroke={1.5} onClick={() => {
                                dispatch(setFetching(true))
                                setRefreshCustomerDropdown(true)
                                resetDropDownState();
                                dispatch(setInvoiceBatchFilterData({
                                    ...invoiceBatchFilterData,
                                    ['customer_id']: '',
                                    ['start_date']: '',
                                    ['end_date']: '',
                                    ['searchKeyword']: '',
                                }));
                            }} />
                        </Tooltip>
                    </ActionIcon>
                    <ActionIcon variant="default"
                        c={'green.8'}
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
                            label={t('DownloadPdfFile')}
                            px={16}
                            py={2}
                            withArrow
                            position={"bottom"}
                            c={'red'}
                            bg={`red.1`}
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <IconPdf style={{ width: rem(18) }} stroke={1.5} />
                        </Tooltip>
                    </ActionIcon>
                    <ActionIcon variant="default"
                        c={'green.8'}
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
                            label={t('DownloadExcelFile')}
                            px={16}
                            py={2}
                            withArrow
                            position={"bottom"}
                            c={'red'}
                            bg={`red.1`}
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <IconFileTypeXls style={{ width: rem(18) }} stroke={1.5} />
                        </Tooltip>
                    </ActionIcon>

                </ActionIcon.Group>
            </Box>

            {
                filterModel &&
                <_FilterSearch filterModel={filterModel} setFilterModel={setFilterModel} module={props.module} />
            }
        </>
    );
}

export default SearchActionMenu;
