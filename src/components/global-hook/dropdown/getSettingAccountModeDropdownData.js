import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getSettingAccountModeDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'accounting/select/setting',
            param: { 'dropdown-type': 'account-mode' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const accountModeDropdownData = useSelector((state) => state.utilityUtilitySlice.accountModeDropdownData);

    useEffect(() => {
        if (accountModeDropdownData && accountModeDropdownData.length > 0) {
            const transformedData = accountModeDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [accountModeDropdownData]);

    return settingDropdown;
};

export default getSettingAccountModeDropdownData;
