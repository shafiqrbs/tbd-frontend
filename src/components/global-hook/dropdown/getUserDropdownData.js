import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getUserDropdown} from "../../../store/core/utilitySlice.js";

const getUserDropdownData = () => {
    const dispatch = useDispatch();
    const [userDropdown, setUserDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'core/select/user',
            param: {
                term: ''
            }
        };
        dispatch(getUserDropdown(value));
    }, [dispatch]);

    const userDropdownData = useSelector((state) => state.utilitySlice.userDropdownData.data)

    useEffect(() => {
        if (userDropdownData && userDropdownData.length > 0) {
            const transformedData = userDropdownData.map(type => {
                return ({'label': type.name, 'value': String(type.id)})
            });
            setUserDropdown(transformedData);
        }
    }, [userDropdownData]);

    return userDropdown;
};

export default getUserDropdownData;
