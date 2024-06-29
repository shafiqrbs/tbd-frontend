import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getCountryDropdown} from "../../../store/core/utilitySlice.js";

const getCountryDropdownData = () => {
    const dispatch = useDispatch();
    const [countryDropdown, setCountryDropdown] = useState([]);

    useEffect(() => {
        dispatch(getCountryDropdown('core/select/countries'))
    }, [dispatch]);

    const countryDropdownData = useSelector((state) => state.utilitySlice.countryDropdownData)

    useEffect(() => {
        if (countryDropdownData && countryDropdownData.length > 0) {
            const transformedData = countryDropdownData.map(type => {
                return ({'label': type.name+' ('+type.code+'-'+type.phonecode+')', 'value': String(type.id)})
            });
            setCountryDropdown(transformedData);
        }
    }, [countryDropdownData]);

    return countryDropdown;
};

export default getCountryDropdownData;
