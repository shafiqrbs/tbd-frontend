import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getSettingProductTypeDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'inventory/select/setting',
            param: { 'dropdown-type': 'product-type' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const productTypeDropdown = useSelector((state) => state.utilityUtilitySlice.productDropdownData);


    useEffect(() => {
        if (productTypeDropdown && productTypeDropdown.length > 0) {
            const transformedData = productTypeDropdown.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [productTypeDropdown]);

    return settingDropdown;
};

export default getSettingProductTypeDropdownData;
