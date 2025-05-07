import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coreSettingDropdown } from '../../../../store/core/utilitySlice.js';

export default function useAccountHeadDropdownData(reloadTrigger, dropdownType) {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    // Always declare your hooks unconditionally
    const accountHeadDropdownData = useSelector((state) => state.utilitySlice.accountHeadDropdownData);
    const accountSubHeadDropdownData = useSelector((state) => state.utilitySlice.accountSubHeadDropdownData);
    const accountLedgerDropdownData = useSelector((state) => state.utilitySlice.accountLedgerDropdownData);

    // Choose the appropriate data based on the dropdownType
    const dropdownData = useMemo(() => {
        switch (dropdownType) {
            case 'head':
                return accountHeadDropdownData;
            case 'sub-head':
                return accountSubHeadDropdownData;
            case 'ledger':
                return accountLedgerDropdownData;
            default:
                return [];
        }
    }, [dropdownType, accountHeadDropdownData, accountSubHeadDropdownData, accountLedgerDropdownData]);

    // Fetch data on mount or when reloadTrigger or dropdownType changes
    useEffect(() => {
        if (dropdownType) {
            const value = {
                url: 'accounting/select/head-dropdown',
                param: { 'dropdown-type': dropdownType }
            };
            dispatch(coreSettingDropdown(value));
        }
    }, [dispatch, dropdownType, reloadTrigger]);

    // Transform & store the correct dropdown data
    useEffect(() => {
        if (dropdownData && dropdownData.length > 0) {
            const transformedData = dropdownData.map(item => ({
                label: item.name,
                value: String(item.id)
            }));
            setSettingDropdown(transformedData);
        }
    }, [dropdownData]);

    return settingDropdown;
}
