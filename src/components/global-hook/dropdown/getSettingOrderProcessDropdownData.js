import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getSettingOrderProcessDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'utility/select/setting',
            param: { 'dropdown-type': 'sales-process-type' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const salesProcessTypeDropdownData = useSelector((state) => state.utilityUtilitySlice.salesProcessTypeDropdownData);

    useEffect(() => {
        if (salesProcessTypeDropdownData && salesProcessTypeDropdownData.length > 0) {
            const transformedData = salesProcessTypeDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [salesProcessTypeDropdownData]);

    return settingDropdown;
};

export default getSettingOrderProcessDropdownData;
