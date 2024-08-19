import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getProConfigDropdown} from "../../../store/production/utilitySlice.js";

const getProConfigDropdownData = () => {
    const dispatch = useDispatch();

    const [productionProcedureDropdown, setProductionProcedureDropdown] = useState([]);
    const [consumptionMethodDropdown, setConsumptionMethodDropdown] = useState([]);

    useEffect(() => {
        dispatch(getProConfigDropdown('production/select/config-dropdown'))
    }, [dispatch]);

    const proConfigDropdownData = useSelector((state) => state.productionUtilitySlice.proConfigDropdownData);

    useEffect(() => {
        if (proConfigDropdownData && Object.keys(proConfigDropdownData).length > 0) {
            if(proConfigDropdownData.ProductionProcedure && proConfigDropdownData.ProductionProcedure.length > 0) {
                const productionProcedureData = proConfigDropdownData.ProductionProcedure.map(type => {
                    return { 'label': type.name, 'value': String(type.id) }
                });
                setProductionProcedureDropdown(productionProcedureData);
            }
            if(proConfigDropdownData.ConsumptionMethod && proConfigDropdownData.ConsumptionMethod.length > 0) {
                const consumptionMethodData = proConfigDropdownData.ConsumptionMethod.map(type => {
                    return { 'label': type.name, 'value': String(type.id) }
                });
                setConsumptionMethodDropdown(consumptionMethodData);
            }
        }
    }, [proConfigDropdownData]);

    return { productionProcedureDropdown, consumptionMethodDropdown };
};

export default getProConfigDropdownData;