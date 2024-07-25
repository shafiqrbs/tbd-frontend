import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getCategoryDropdown} from "../../../store/inventory/utilitySlice.js";

const getSettingCategoryDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'inventory/select/category',
            param: {
                type: 'parent'
            }
        }
        dispatch(getCategoryDropdown(value))
    }, [dispatch]);

    const categoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.categoryDropdownData)


    useEffect(() => {
        if (categoryDropdownData && categoryDropdownData.length > 0) {
            const transformedData = categoryDropdownData.map(type => {
                return ({ 'label': type.name, 'value': String(type.id) })
            });
            setSettingDropdown(transformedData);
        }
    }, [categoryDropdownData]);

    return settingDropdown;
};

export default getSettingCategoryDropdownData;
