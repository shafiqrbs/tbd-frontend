import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getCurrencyDropdown} from "../../../store/utility/utilitySlice.js";

const getCurrencyDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'utility/select/currencies',
        }
        dispatch(getCurrencyDropdown(value))
    }, [dispatch]);

    const currencyDropdown = useSelector((state) => state.utilityUtilitySlice.currencyDropdown)

    useEffect(() => {
        if (currencyDropdown && currencyDropdown.length > 0) {
            const transformedData = currencyDropdown.map(type => {
                return ({ 'label': type.name+' ('+type.code+'-'+type.symbol+')', 'value': String(type.id) })
            });
            setSettingDropdown(transformedData);
        }
    }, [currencyDropdown]);

    return settingDropdown;
};

export default getCurrencyDropdownData;
