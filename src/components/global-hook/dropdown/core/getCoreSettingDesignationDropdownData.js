import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coreSettingDropdown } from '../../../../store/core/utilitySlice.js';

const getCoreSettingDesignationDropdownData = (reloadTrigger) => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    const dropdownData = useSelector(
        (state) => state.utilitySlice.coreDesignationDropdownData
    );

    // Fetch dropdown data on mount or when reloadTrigger changes
    useEffect(() => {
        const value = {
            url: 'core/select/setting',
            param: { 'dropdown-type': 'designation' }
        };
        dispatch(coreSettingDropdown(value));
    }, [dispatch, reloadTrigger]);

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

export default getCoreSettingDesignationDropdownData;
