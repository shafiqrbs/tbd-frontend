import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettingDropdown } from "../../../store/utility/utilitySlice.js";

const useUtilityDomainTypeDropdownData = (reloadTrigger) => {
    const dispatch = useDispatch();

    const dropdownData = useSelector(state => state.utilityUtilitySlice.utilityDomainTypeDropdownData);

    useEffect(() => {
        // trigger re-fetch each time the reloadTrigger changes
        dispatch(getSettingDropdown({
            url: 'utility/select/setting',
            param: { 'dropdown-type': 'domain-type' }
        }));
    }, [dispatch, reloadTrigger]);

    return useMemo(() => {
        return dropdownData?.map(type => ({
            label: type.name,
            value: String(type.id)
        })) || [];
    }, [dropdownData]);
};

export default useUtilityDomainTypeDropdownData;
