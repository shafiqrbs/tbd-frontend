import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettingDropdown } from "../../../store/utility/utilitySlice.js";

const useSettingParticularDropdownData = (type) => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'inventory/select/particular',
            param: { 'dropdown-type': type },
        };
        dispatch(getSettingDropdown(value));
    }, [dispatch, type]);

    // Dropdown mappings based on type
    const dropdownKeyMap = {
        'product-unit': 'productUnitDropdown',
        'color': 'productColorDropdown',
        'product-grade': 'productGradeDropdown',
        'brand': 'productBrandDropdown',
        'size': 'productSizeDropdown',
        'model': 'productModelDropdown',
        'table': 'posTableData',
    };

    // Dynamically select dropdown data based on type
    const dropdownData = useSelector((state) => {
        const dynamicKey = dropdownKeyMap[type];
        return state.utilityUtilitySlice[dynamicKey] || [];
    });

    useEffect(() => {
        if (dropdownData.length > 0) {
            const transformedData = dropdownData.map(item => ({
                label: item.name,
                value: String(item.id),
            }));
            setSettingDropdown(transformedData);
        }
    }, [dropdownData]);

    return settingDropdown;
};

export default useSettingParticularDropdownData;
