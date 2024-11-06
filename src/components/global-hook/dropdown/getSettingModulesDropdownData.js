import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getSettingDropdown,} from "../../../store/utility/utilitySlice.js";

const getSettingModulesDropdownData = () => {
    const dispatch = useDispatch();
    // const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'utility/select/setting',
            param: { 'dropdown-type': 'module' }
        }
        dispatch(getSettingDropdown(value))
    }, [dispatch]);

    const moduleDropdownData = useSelector((state) => state.utilityUtilitySlice.moduleDropdownData);

    /*console.log(moduleDropdownData)

    useEffect(() => {
        if (moduleDropdownData && moduleDropdownData.length > 0) {
            const transformedData = moduleDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id), 'slug' :  }
            });
            setSettingDropdown(transformedData);
        }
    }, [moduleDropdownData]);*/

    return moduleDropdownData;
};

export default getSettingModulesDropdownData;
