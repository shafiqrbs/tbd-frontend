import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getProItemsDropdownData} from "../../../store/production/utilitySlice.js";

const getProItemDropdownData = (batchId = null) => {
    const dispatch = useDispatch();

    const [productionItemDropdown, setProductionItemDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url : 'production/select/items-dropdown',
            param : {
                batch_id : batchId
            }
        }
        dispatch(getProItemsDropdownData(value))
    }, [dispatch]);

    const proItemDropdownData = useSelector((state) => state.productionUtilitySlice.proItemDropdownData);

    useEffect(() => {
        if (proItemDropdownData?.data && proItemDropdownData.data.length > 0) {
            const productionProcedureData = proItemDropdownData.data.map(type => ({
                label: type.product_name,
                value: String(type.id),
            }));
            setProductionItemDropdown(productionProcedureData);
        }
    }, [proItemDropdownData]);


    return productionItemDropdown;
};

export default getProItemDropdownData;