import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLocationDropdown } from "../../../store/core/utilitySlice.js";

const getLocationDropdownData = () => {
    const dispatch = useDispatch();
    const [locationDropdown, setLocationDropdown] = useState([]);

    useEffect(() => {
        const valueForLocation = {
            url: 'core/select/location',
            param: {
                term: ''
            }
        };
        dispatch(getLocationDropdown(valueForLocation));
    }, [dispatch]);

    const locationDropdownData = useSelector(state => state.utilitySlice.locationDropdownData);

    useEffect(() => {
        if (locationDropdownData && locationDropdownData.length > 0) {
            const transformedData = locationDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) };
            });
            setLocationDropdown(transformedData);
        }
    }, [locationDropdownData]);

    return locationDropdown;
};

export default getLocationDropdownData;
