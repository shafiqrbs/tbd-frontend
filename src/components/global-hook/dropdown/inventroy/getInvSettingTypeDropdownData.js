import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingTypeDropdown} from "../../../../store/inventory/utilitySlice.js";

const  getInvSettingTypeDropdownData= () => {
    const dispatch = useDispatch();
    const [settingTypeDropdown, setSettingTypeDropdown] = useState([]);

    useEffect(() => {
        dispatch(getSettingTypeDropdown('inventory/select/particular-type'))
    }, [dispatch]);

    const settingTypeDropdownData = useSelector((state) => state.productionUtilitySlice.settingTypeDropdownData);

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

export default getInvSettingTypeDropdownData;
