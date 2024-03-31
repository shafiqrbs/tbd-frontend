import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getTransactionModeData} from "../../../store/accounting/utilitySlice.js";

const getTransactionModeDropdownData = () => {
    const dispatch = useDispatch();
    const [transactionModeDropdown, setTransactionModeDropdown] = useState([]);

    useEffect(() => {
        dispatch(getTransactionModeData('accounting/transaction-mode-data'))
    }, [dispatch]);


    const transactionModelDropdownData = useSelector((state) => state.accountingUtilitySlice.transactionModeData)

    useEffect(() => {
        if (transactionModelDropdownData && transactionModelDropdownData.length > 0) {
            const transformedData = transactionModelDropdownData.map((type) => {
                return {'label': type.name, 'value': String(type.id)};
            });
            setTransactionModeDropdown(transformedData);
        }
    }, [transactionModelDropdownData]);

    return transactionModeDropdown;
}

export default getTransactionModeDropdownData;