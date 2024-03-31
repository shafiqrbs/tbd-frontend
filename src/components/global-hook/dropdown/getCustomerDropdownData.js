import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getCustomerDropdown} from "../../../store/core/utilitySlice.js";

const getCustomerDropdownData = () => {
    const dispatch = useDispatch();
    const [customerDropdown, setCustomerDropdown] = useState([]);

    useEffect(() => {
        dispatch(getCustomerDropdown('core/select/customer'))
    }, [dispatch]);

    const customerDropdownData = useSelector((state) => state.utilitySlice.customerDropdownData)

    useEffect(() => {
        if (customerDropdownData && customerDropdownData.length > 0) {
            const transformedData = customerDropdownData.map(type => {
                return ({'label': type.name, 'value': String(type.id)})
            });
            setCustomerDropdown(transformedData);
        }
    }, [customerDropdownData]);

    return customerDropdown;
};

export default getCustomerDropdownData;
