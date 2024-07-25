import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getSettingAuthorizedTypeDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'accounting/select/setting',
            param: { 'dropdown-type': 'authorised-type' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const authorizedDropdownData = useSelector((state) => state.utilityUtilitySlice.authorizedDropdownData);

    useEffect(() => {
        if (authorizedDropdownData && authorizedDropdownData.length > 0) {
            const transformedData = authorizedDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [authorizedDropdownData]);

    return settingDropdown;
};

export default getSettingAuthorizedTypeDropdownData;
