import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getSettingModulesDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'utility/select/setting',
            param: { 'dropdown-type': 'pos-invoice-mode' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const invoiceModeDropdownData = useSelector((state) => state.utilityUtilitySlice.posInvoiceModeDropdownData);

    useEffect(() => {
        if (invoiceModeDropdownData && invoiceModeDropdownData.length > 0) {
            const transformedData = invoiceModeDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id)  }
            });
            setSettingDropdown(transformedData);
        }
    }, [invoiceModeDropdownData]);

    return settingDropdown;
};

export default getSettingModulesDropdownData;
