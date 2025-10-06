import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {coreSettingDropdown} from "../../../../store/core/utilitySlice.js";

const getCoreWarehouseData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'core/select/warehouse',
            param: { 'dropdown-type': 'warehouse' }
        }
        dispatch(coreSettingDropdown(value))
    }, [dispatch]);

    const dropdownData = useSelector((state) => state.utilitySlice.coreWarehouseDropdownData);

    useEffect(() => {
        if (dropdownData && dropdownData.length > 0) {
            const transformedData = dropdownData.map(type => {
                return { 'name': type.name, 'id': String(type?.unique_id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [dropdownData]);

    return settingDropdown;
};

export default getCoreWarehouseData;
