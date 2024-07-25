import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getSettingAccountTypeDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'accounting/select/setting',
            param: { 'dropdown-type': 'account-type' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const accountDropdownData = useSelector((state) => state.utilityUtilitySlice.accountDropdownData);

    useEffect(() => {
        if (accountDropdownData && accountDropdownData.length > 0) {
            const transformedData = accountDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [accountDropdownData]);

    return settingDropdown;
};

export default getSettingAccountTypeDropdownData;
