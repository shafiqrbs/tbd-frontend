
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coreSettingDropdown } from '../../../../store/core/utilitySlice.js';

const getCoreSettingEmployeeGroupDropdownData = (refetchTrigger) => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    const dropdownData = useSelector(
        (state) => state.utilitySlice.employeeGroupDropdownData
    );

    // Dispatch fetching action when hook mounts or refetchTrigger changes
    useEffect(() => {
        const value = {
            url: 'core/select/setting',
            param: { 'dropdown-type': 'employee-group' },
        };
        dispatch(coreSettingDropdown(value));
    }, [dispatch, refetchTrigger]); // <--- trigger re-fetch if this value changes

    // Map and store the transformed dropdown data
    useEffect(() => {
        if (dropdownData && dropdownData.length > 0) {
            const transformedData = dropdownData.map((type) => ({
                label: type.name,
                value: String(type.id),
            }));
            setSettingDropdown(transformedData);
        }
    }, [dropdownData]);

    return settingDropdown;
};

export default getCoreSettingEmployeeGroupDropdownData;

