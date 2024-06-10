import React, {useEffect, useState} from "react";
import {
    Box, Progress, rem
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesPurchaseHeaderNavbar from "../configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _GenericInvoiceForm from "./_GenericInvoiceForm.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {editEntityData} from "../../../../store/inventory/crudSlice.js";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";
import _UpdateInvoice from "./_UpdateInvoice.jsx";

function PurchaseEdit() {
    let { id } = useParams();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const progress = getLoadingProgress()
    const configData = getConfigData()

    const dataStatus = useSelector((state) => state.inventoryCrudSlice.dataStatus);
    const editedData = useSelector((state) => state.inventoryCrudSlice.entityEditData);
    const [entityEditData,setEntityEditData] = useState({});
    const [hasNotified, setHasNotified] = useState(false);

    useEffect(() => {
        if(!entityEditData.id){
            dispatch(editEntityData(`inventory/purchase/edit/${id}`))
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
                navigate('/inventory/purchase')
            },1000)
            setHasNotified(true);
        }
    },[dataStatus, entityEditData.id]);


    console.log(editedData,id)

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
                                pageTitle={t('PurchaseInvoice')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData.zero_stock}
                                currencySymbol={configData.currency.symbol}
                            />
                            <Box p={'8'}>
                                {
                                    configData.business_model.slug === 'general' &&
                                    <_UpdateInvoice
                                        allowZeroPercentage={configData.zero_stock}
                                        currencySymbol={configData.currency.symbol}
                                        isPurchaseByPurchasePrice={configData.is_purchase_by_purchase_price}
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

export default PurchaseEdit;
