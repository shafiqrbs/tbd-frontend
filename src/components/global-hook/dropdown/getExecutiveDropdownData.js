import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getExecutiveDropdown} from "../../../store/core/utilitySlice.js";

const useExecutiveDropdownData = () => {
    const dispatch = useDispatch();
    const [executiveDropdown, setExecutiveDropdown] = useState([]);

    useEffect(() => {
        const value = {
            url: 'core/select/executive',
            param: {
                term: ''
            }
        };
        dispatch(getExecutiveDropdown(value));
    }, [dispatch]);

    const executiveDropdownData = useSelector(state => state.utilitySlice.executiveDropdownData);

    useEffect(() => {
        if (executiveDropdownData && executiveDropdownData.length > 0) {
            const transformedData = executiveDropdownData.map((type) => {
                return {'label': type.name, 'value': String(type.id)};
            });
            setExecutiveDropdown(transformedData);
        }
    }, [executiveDropdownData]);

    return executiveDropdown;
}

export default useExecutiveDropdownData;