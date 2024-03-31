import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getTransactionMethodDropdown} from "../../../store/accounting/utilitySlice.js";

const getTransactionMethodDropdownData = () => {
    const dispatch = useDispatch();
    const [transactionMethodDropdown, setTransactionMethodDropdown] = useState([]);

    useEffect(() => {
        dispatch(getTransactionMethodDropdown('accounting/select/transaction-method'));
    }, [dispatch]);

    const transactionMethodDropdownData = useSelector(state => state.accountingUtilitySlice.transactionMethodData);

    useEffect(() => {
        if (transactionMethodDropdownData && transactionMethodDropdownData.length > 0) {
            const transformedData = transactionMethodDropdownData.map(type => {
                return { 'label': type.name, 'value': String(type.id) };
            });
            setTransactionMethodDropdown(transformedData);
        }
    }, [transactionMethodDropdownData]);

    return transactionMethodDropdown;
};

export default getTransactionMethodDropdownData;
