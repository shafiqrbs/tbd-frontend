import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coreSettingDropdown } from '../../../../store/core/utilitySlice.js';

const getCoreSettingDepartmentDropdownData = (reloadTrigger) => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    // Get department dropdown data from Redux store
    const dropdownData = useSelector(
        (state) => state.utilitySlice.coreDepartmentDropdownData
    );

    // Fetch data on mount or when reloadTrigger changes
    useEffect(() => {
        const value = {
            url: 'core/select/setting',
            param: { 'dropdown-type': 'department' }
        };
        dispatch(coreSettingDropdown(value));
    }, [dispatch, reloadTrigger]);

    // Transform and store dropdown data
    useEffect(() => {
        if (dropdownData && dropdownData.length > 0) {
            const transformedData = dropdownData.map(type => ({
                label: type.name,
                value: String(type.id)
            }));
            setSettingDropdown(transformedData);
        }
    }, [dropdownData]);

    return settingDropdown;
};

export default getCoreSettingDepartmentDropdownData;
