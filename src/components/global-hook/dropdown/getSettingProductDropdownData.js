import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getSettingProductDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'utility/select/setting',
            param: { 'dropdown-type': 'product-type' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const productTypeDropdownData = useSelector((state) => state.utilityUtilitySlice.productDropdownData);

    useEffect(() => {
        if (productTypeDropdownData && productTypeDropdownData.length > 0) {
            const transformedData = productTypeDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [productTypeDropdownData]);

    return settingDropdown;
};

export default getSettingProductDropdownData;
