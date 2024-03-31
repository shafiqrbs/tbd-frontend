import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getVendorDropdown} from "../../../store/core/utilitySlice.js";

const getVendorDropdownData = () => {
    const dispatch = useDispatch();
    const [vendorDropdown, setVendorDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'core/select/vendor',
            param: {
                term: ''
            }
        };
        dispatch(getVendorDropdown(value));
    }, [dispatch]);

    const vendorDropdownData = useSelector((state) => state.utilitySlice.vendorDropdownData.data)

    useEffect(() => {
        if (vendorDropdownData && vendorDropdownData.length > 0) {
            const transformedData = vendorDropdownData.map(type => {
                return ({'label': type.name, 'value': String(type.id)})
            });
            setVendorDropdown(transformedData);
        }
    }, [vendorDropdownData]);

    return vendorDropdown;
};

export default getVendorDropdownData;
