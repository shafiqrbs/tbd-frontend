import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getSettingBusinessModelDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'utility/select/setting',
            param: { 'dropdown-type': 'business-model' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const businessModelDropdownData = useSelector((state) => state.utilityUtilitySlice.businessModelDropdownData);

    useEffect(() => {
        if (businessModelDropdownData && businessModelDropdownData.length > 0) {
            const transformedData = businessModelDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [businessModelDropdownData]);

    return settingDropdown;
};

export default getSettingBusinessModelDropdownData;
