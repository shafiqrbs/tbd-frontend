import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getAccountHeadDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'accounting/select/head',
            param: { 'dropdown-type': 'account-head' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const accountDropdownData = useSelector((state) => state.utilityUtilitySlice.accountHeadDropdownData);
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

export default getAccountHeadDropdownData;
