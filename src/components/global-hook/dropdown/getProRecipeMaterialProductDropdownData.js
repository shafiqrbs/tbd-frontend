import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getMaterialProductDropdown} from "../../../store/production/utilitySlice.js";

const getProRecipeMaterialProductDropdownData = () => {
    const dispatch = useDispatch();
    const [materialDropdown, setMaterialDropdown] = useState([]);

    useEffect(() => {
        dispatch(getMaterialProductDropdown('inventory/select/product-for-recipe'))
    }, [dispatch]);

    const materialProductDropdownData = useSelector((state) => state.productionUtilitySlice.materialProductDropdownData)

    useEffect(() => {
        if (materialProductDropdownData && materialProductDropdownData.length > 0) {
            const transformedData = materialProductDropdownData.map(type => {
                return ({'label': type.display_name, 'value': String(type.id)})
            });
            setMaterialDropdown(transformedData);
        }
    }, [materialProductDropdownData]);

    return materialDropdown;
};

export default getProRecipeMaterialProductDropdownData;
