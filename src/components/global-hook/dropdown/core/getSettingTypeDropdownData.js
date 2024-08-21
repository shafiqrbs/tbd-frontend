import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingTypeDropdown} from "../../../../store/core/utilitySlice.js";

const  getSettingTypeDropdownData= () => {
    const dispatch = useDispatch();
    const [settingTypeDropdown, setSettingTypeDropdown] = useState([]);

    useEffect(() => {
        dispatch(getSettingTypeDropdown('core/select/setting-type'))
    }, [dispatch]);

    const settingTypeDropdownData = useSelector((state) => state.utilitySlice.settingTypeDropdownData);

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

export default getSettingTypeDropdownData;
