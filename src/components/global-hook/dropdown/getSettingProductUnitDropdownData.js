import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getProductUnitDropdown} from "../../../store/utility/utilitySlice.js";

const getSettingProductUnitDropdownData = () => {
    const dispatch = useDispatch();
    const [settingDropdown, setSettingDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'utility/select/product-unit',
        }
        dispatch(getProductUnitDropdown(value))
    }, [dispatch]);

    const productUnitDropdownData = useSelector((state) => state.utilityUtilitySlice.productUnitDropdown)

    useEffect(() => {
        if (productUnitDropdownData && productUnitDropdownData.length > 0) {
            const transformedData = productUnitDropdownData.map(type => {
                return ({ 'label': type.name, 'value': String(type.id) })
            });
            setSettingDropdown(transformedData);
        }
    }, [productUnitDropdownData]);

    return settingDropdown;
};

export default getSettingProductUnitDropdownData;
