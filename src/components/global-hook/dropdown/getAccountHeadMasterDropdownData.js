import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";
import {getSettingWithoutParamDropdown} from "../../../store/utility/utilitySlice";

const getAccountHeadMasterDropdownData = (reloadTrigger = true) => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        dispatch(getSettingWithoutParamDropdown('accounting/select/head-master'))
    }, [dispatch,reloadTrigger]);

    const accountDropdownData = useSelector((state) => state.utilityUtilitySlice.settingWithoutParamDropdown);

    useEffect(() => {
        if (accountDropdownData && accountDropdownData?.length > 0) {
            const transformedData = accountDropdownData?.map(type => {
                return { 'label': type.name, 'value': String(type.id) }
            });
            setSettingDropdown(transformedData);
        }
    }, [accountDropdownData]);
    return settingDropdown;
};

export default getAccountHeadMasterDropdownData;
