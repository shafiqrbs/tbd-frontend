import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getSettingDropdown } from "../../../store/utility/utilitySlice.js";

const useSettingParticularDropdownData = (type) => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    const dropdownKeyMap = useMemo(() => ({
        'product-unit': 'productUnitDropdown',
        'color': 'productColorDropdown',
        'product-grade': 'productGradeDropdown',
        'brand': 'productBrandDropdown',
        'size': 'productSizeDropdown',
        'model': 'productModelDropdown',
        'table': 'posTableData',
        'location': 'ProductLocationDropdown',
        'warehouse': 'warehouseDropdown',
    }), []);

    const validKey = dropdownKeyMap[type];

    const dropdownSelector = useMemo(() => {
        if (!validKey) return () => [];
        return createSelector(
            (state) => state?.utilityUtilitySlice ?? {},
            (utilityState) => utilityState[validKey] ?? []
        );
    }, [validKey]);

    const dropdownData = useSelector(dropdownSelector);

    useEffect(() => {
        if (!validKey) return;

        const value = {
            url: 'inventory/select/particular',
            param: { 'dropdown-type': type },
        };
        dispatch(getSettingDropdown(value));
    }, [dispatch, type, validKey]);

    useEffect(() => {
        if (dropdownData?.length > 0) {
            const transformed = dropdownData.map(item => ({
                label: item.name,
                value: String(item.id),
            }));
            setSettingDropdown(transformed);
        } else {
            setSettingDropdown([]);
        }
    }, [dropdownData]);

    return settingDropdown;
};

export default useSettingParticularDropdownData;
