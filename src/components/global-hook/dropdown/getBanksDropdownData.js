import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getBanksDropdown} from "../../../store/utility/utilitySlice.js";

const getBanksDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'utility/select/banks',
        }
        dispatch(getBanksDropdown(value))
    }, [dispatch]);

    const bankDropdown = useSelector((state) => state.utilityUtilitySlice.bankDropdown)

    useEffect(() => {
        if (bankDropdown && bankDropdown.length > 0) {
            const transformedData = bankDropdown.map(type => {
                return ({'label': type.name, 'value': String(type.id)})
            });
            setSettingDropdown(transformedData);
        }
    }, [bankDropdown]);

    return settingDropdown;
};

export default getBanksDropdownData;
