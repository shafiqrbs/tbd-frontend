import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coreSettingDropdown } from '../../../../store/core/utilitySlice.js';

const useProductionBatchDropdownData = (reloadTrigger) => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    // Get data from Redux store
    const dropdownData = useSelector(
        (state) => state.utilitySlice.productionBatchDropdownData
    );

    // Fetch on mount or when reloadTrigger changes
    useEffect(() => {
        const value = {
            url: 'production/select/batch-dropdown',
            param: { 'dropdown-type': 'production-batch' },
        };
        dispatch(coreSettingDropdown(value));
    }, [dispatch, reloadTrigger]);

    // Transform and store
    useEffect(() => {
        if (dropdownData && dropdownData.length > 0) {
            const transformedData = dropdownData.map((type) => ({
                label: type.invoice+' ('+type.created_date+')',
                value: String(type.id),
            }));
            setSettingDropdown(transformedData);
        }
    }, [dropdownData]);

    return settingDropdown;
};

export default useProductionBatchDropdownData;
