import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getProItemsDropdownData} from "../../../store/production/utilitySlice.js";

const getProItemDropdownData = () => {
    const dispatch = useDispatch();

    const [productionItemDropdown, setProductionItemDropdown] = useState([]);

    useEffect(() => {
        dispatch(getProItemsDropdownData('production/select/items-dropdown'))
    }, [dispatch]);

    const proItemDropdownData = useSelector((state) => state.productionUtilitySlice.proItemDropdownData);

    useEffect(() => {
        if (proItemDropdownData && Object.keys(proItemDropdownData).length > 0) {
            const productionProcedureData = proItemDropdownData.map(type => {
                return { 'label': type.product_name, 'value': String(type.id) }
            });
            setProductionItemDropdown(productionProcedureData);
        }
    }, [proItemDropdownData]);

    return productionItemDropdown;
};

export default getProItemDropdownData;