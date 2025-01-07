import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getNbrDropdown} from "../../../../store/nbr/utilitySlice.js";

const getNbrTariffDropdownData = (type) => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'nbr/select/tariff',
            param: { 'dropdown-type': type },
        };
        dispatch(getNbrDropdown(value));
    }, [dispatch, type]);

    // Dropdown mappings based on type
    const dropdownKeyMap = {
        'tariff': 'tariffDropdown',
    };

    // Dynamically select dropdown data based on type
    const dropdownData = useSelector((state) => {
        const dynamicKey = dropdownKeyMap[type];
        return state.nbrUtilitySlice[dynamicKey] || [];
    });

    useEffect(() => {
        if (dropdownData.length > 0) {
            const transformedData = dropdownData.map(item => ({
                label: item.name+' - '+item.label,
                value: String(item.id),
            }));
            setSettingDropdown(transformedData);
        }
    }, [dropdownData]);

    return settingDropdown;
};

export default getNbrTariffDropdownData;
