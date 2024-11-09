import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getUtilityProductTypeDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'utility/select/setting',
            param: { 'dropdown-type': 'product-type' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const utilityProductTypeDropdownData = useSelector((state) => state.utilityUtilitySlice.utilityProductTypeDropdownData);

    useEffect(() => {
        if (utilityProductTypeDropdownData && utilityProductTypeDropdownData.length > 0) {
            const transformedData = utilityProductTypeDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [utilityProductTypeDropdownData]);

    return settingDropdown;
};

export default getUtilityProductTypeDropdownData;
