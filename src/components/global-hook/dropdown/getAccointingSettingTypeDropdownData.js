import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingTypeDropdown} from "../../../store/accounting/utilitySlice.js";

const getProSettingTypeDropdownData = () => {
    const dispatch = useDispatch();
    const [settingTypeDropdown, setSettingTypeDropdown] = useState([]);

    useEffect(() => {
        dispatch(getSettingTypeDropdown('accounting/select/setting-type'))
    }, [dispatch]);

    const settingTypeDropdownData = useSelector((state) => state.accountingUtilitySlice.settingTypeDropdownData);

    useEffect(() => {
        if (settingTypeDropdownData && settingTypeDropdownData.length > 0) {
            const transformedData = settingTypeDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingTypeDropdown(transformedData);
        }
    }, [settingTypeDropdownData]);

    return settingTypeDropdown;
};

export default getProSettingTypeDropdownData;
