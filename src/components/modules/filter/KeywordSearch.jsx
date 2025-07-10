import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    rem,
    Grid, Tooltip, TextInput, ActionIcon, Button, Text, LoadingOverlay
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconFilter,
    IconInfoCircle,
    IconRestore,
    IconSearch,
    IconX, IconPdf, IconFileTypeXls,IconPhoto,IconArrowRight
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
    setCategoryGroupFilterData,
    setCustomerFilterData,
    setFetching,
    setSearchKeyword, setUserFilterData,
    setVendorFilterData, setWarehouseFilterData,setFileUploadFilterData
} from "../../../store/core/crudSlice.js";
import FilterModel from "./FilterModel.jsx";
import { setProductFilterData, setCategoryFilterData } from "../../../store/inventory/crudSlice.js";
import { setProductionSettingFilterData } from "../../../store/production/crudSlice.js";
import {modals} from "@mantine/modals";
import {editEntityData, storeEntityData} from "../../../store/accounting/crudSlice";
import {showNotificationComponent} from "../../core-component/showNotificationComponent";

function KeywordSearch(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline } = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [filterModel, setFilterModel] = useState(false)

    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const customerFilterData = useSelector((state) => state.crudSlice.customerFilterData)
    const categoryFilterData = useSelector((state) => state.inventoryCrudSlice.categoryFilterData)
    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)
    const userFilterData = useSelector((state) => state.crudSlice.userFilterData)
    const warehouseFilterData = useSelector((state) => state.crudSlice.warehouseFilterData)
    const categoryGroupFilterData = useSelector((state) => state.crudSlice.categoryGroupFilterData)
    const productFilterData = useSelector((state) => state.inventoryCrudSlice.productFilterData)
    const productionSettingFilterData = useSelector((state) => state.productionCrudSlice.productionSettingFilterData)
    const fileUploadFilterData = useSelector((state) => state.crudSlice.fileUploadFilterData)
    const [loading,setLoading] = useState(false)

    const handleSyncAllLedgerMaterdata = () => {
        modals.openConfirmModal({
            title: (
                <Text size="md"> {t("FormConfirmationTitle")}</Text>
            ),
            children: (
                <Text size="sm"> {t("FormConfirmationMessage")}</Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' }, confirmProps: { color: 'blue' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                setLoading(true)
                try {
                    const action = await dispatch(editEntityData('accounting/account-ledger-reset'));
                    const payload = action.payload;
                    if (payload?.status === 200) {
                        showNotificationComponent(t("Account head created successfully"), "green");
                    } else {
                        showNotificationComponent(t("Something went wrong"), "red");
                    }
                } catch (error) {
                    showNotificationComponent(t("Request failed"), "red");
                } finally {
                    setTimeout(()=>{
                        setLoading(false)
                    },1000)
                }
            },
        });

    }

    useHotkeys(
        [['alt+F', () => {
            document.getElementById('SearchKeyword').focus();
        }]
        ], []
    );

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && searchKeyword.length > 0) {
            (dispatch(setFetching(true)),
                setSearchKeywordTooltip(false))
        } else {
            (setSearchKeywordTooltip(true),
                setTimeout(() => {
                    setSearchKeywordTooltip(false)
                }, 1500))
        }
    }


    return (
        <>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

            <Grid justify="space-between" align="stretch" gutter={{ base: 2 }} grow>
                <Grid.Col span="8">
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
                        transitionProps={{ transition: "pop-bottom-left", duration: 1000 }}
                    >
                        <TextInput
                            leftSection={<IconSearch size={16} opacity={0.5} />}
                            size="sm"
                            placeholder={t('EnterSearchAnyKeyword')}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                                dispatch(setSearchKeyword(e.currentTarget.value))
                                e.target.value !== '' ?
                                    setSearchKeywordTooltip(false) :
                                    (setSearchKeywordTooltip(true),
                                        setTimeout(() => {
                                            setSearchKeywordTooltip(false)
                                        }, 1000))
                            }}
                            value={searchKeyword}
                            id={'SearchKeyword'}
                            rightSection={
                                searchKeyword ?
                                    <Tooltip
                                        label={t("Close")}
                                        withArrow
                                        bg={`red.5`}
                                    >
                                        <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
                                            dispatch(setSearchKeyword(''))
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
                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                            >
                                <IconSearch style={{ width: rem(18) }} stroke={1.5} />
                            </Tooltip>
                        </ActionIcon>
                        {props.module !== 'category' && props.module !== 'category-group' && props.module !== 'particular' &&(
                            <ActionIcon
                            variant="default"
                            size="lg"
                            c={'gray.6'}
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
                                <IconFilter style={{ width: rem(18) }} stroke={1.0} />
                            </Tooltip>
                        </ActionIcon>
                        )}
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
                                    dispatch(setSearchKeyword(''))
                                    dispatch(setFetching(true))

                                    if (props.module === 'customer') {
                                        dispatch(setCustomerFilterData({
                                            ...customerFilterData,
                                            name: '',
                                            mobile: ''
                                        }));
                                    } else if (props.module === 'vendor') {
                                        dispatch(setVendorFilterData({
                                            ...vendorFilterData,
                                            name: '',
                                            mobile: '',
                                            company_name: ''
                                        }));
                                    } else if (props.module === 'user') {
                                        dispatch(setUserFilterData({
                                            ...userFilterData,
                                            name: '',
                                            mobile: '',
                                            email: ''
                                        }));
                                    } else if (props.module === 'product') {
                                        dispatch(setProductFilterData({
                                            ...productFilterData,
                                            name: '',
                                            alternative_name: '',
                                            sales_price: '',
                                            sku: ''
                                        }));
                                    } else if (props.module === 'category-group') {
                                        dispatch(setCategoryGroupFilterData({
                                            ...categoryGroupFilterData,
                                            name: ''
                                        }));
                                    } else if (props.module === 'production-setting') {
                                        dispatch(setProductionSettingFilterData({
                                            ...productionSettingFilterData,
                                            name: '',
                                            setting_type_id: ''
                                        }));
                                    }else if (props.module === 'category') {
                                        dispatch(setCategoryFilterData({
                                            ...categoryFilterData,
                                            name: '',
                                            parent_name : ''
                                        }));
                                    }else if (props.module === 'warehouse') {
                                        dispatch(setWarehouseFilterData({
                                            ...warehouseFilterData,
                                            name: '',
                                            email : '',
                                            location : '',
                                            mobile : '',
                                        }));
                                    }else if (props.module === 'file-upload') {
                                        dispatch(setFileUploadFilterData({
                                            ...fileUploadFilterData,
                                            file_type: '',
                                            original_name : '',
                                            created: '',
                                        }));
                                    }
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
                                if (props.module === 'stock') {
                                    props.setDownloadStockXls(true)
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
                        <Tooltip
                            label={t('AllDataSync')}
                            px={16}
                            py={2}
                            withArrow
                            position={"bottom"}
                            c={'red'}
                            bg={`red.1`}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <ActionIcon.GroupSection
                                onClick={handleSyncAllLedgerMaterdata}
                                variant="default" c={'white'} fz={'16'}  size="lg" bg='var(--theme-primary-color-6)' miw={80}>
                                {t('Sync')}
                            </ActionIcon.GroupSection>
                        </Tooltip>
                    </ActionIcon.Group>
                </Grid.Col>
            </Grid>

            {
                filterModel && <FilterModel filterModel={filterModel} setFilterModel={setFilterModel} module={props.module} />
            }
        </>
    );
}

export default KeywordSearch;
