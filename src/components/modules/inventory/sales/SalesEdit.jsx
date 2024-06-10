import React, {useEffect, useState} from "react";
import {Box, Progress, rem} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesPurchaseHeaderNavbar from "../configuraton/_SalesPurchaseHeaderNavbar.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {editEntityData} from "../../../../store/inventory/crudSlice.js";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";
import _UpdateInvoice from "./_UpdateInvoice.jsx";

function SalesEdit() {
    let { id } = useParams();
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const progress = getLoadingProgress()
    const configData = getConfigData()


    const dataStatus = useSelector((state) => state.inventoryCrudSlice.dataStatus);
    const editedData = useSelector((state) => state.inventoryCrudSlice.entityEditData);
    const [entityEditData,setEntityEditData] = useState({});
    const [hasNotified, setHasNotified] = useState(false);

    useEffect(() => {
        if(!entityEditData.id){
            dispatch(editEntityData(`inventory/sales/edit/${id}`))
        }

        if(dataStatus === 200){
            setEntityEditData(editedData);
        }
        if (dataStatus === 404 && !hasNotified){
            notifications.show({
                color: 'teal',
                title: t('InvalidRequest'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 1000,
                style: { backgroundColor: 'lightgray' },
            });
            setTimeout(()=>{
                navigate('/inventory/sales')
            },1000)
            setHasNotified(true);
        }
    },[dataStatus, entityEditData.id]);


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {
                        configData &&
                        <>
                            <_SalesPurchaseHeaderNavbar
                                pageTitle={t('SalesInvoice')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData?.zero_stock}
                                currencySymbol={configData?.currency.symbol}
                            />
                            <Box p={'8'}>
                                {
                                    configData.business_model.slug === 'general' &&
                                    <_UpdateInvoice
                                        allowZeroPercentage={configData?.zero_stock}
                                        currencySymbol={configData?.currency?.symbol}
                                        domainId={configData.domain_id}
                                        isSMSActive={configData.is_active_sms}
                                        isZeroReceiveAllow={configData.is_zero_receive_allow}
                                        entityEditData={entityEditData}
                                    />
                                }
                            </Box>
                        </>
                    }
                </Box>
            }
        </>
    );
}

export default SalesEdit;
