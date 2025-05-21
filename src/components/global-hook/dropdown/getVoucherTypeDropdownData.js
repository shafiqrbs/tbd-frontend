import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  getVoucherTypeDropdown } from "../../../store/core/utilitySlice.js";

const getVoucherTypeDropdownData = () => {
    const dispatch = useDispatch();
    const [voucherDropdown, setVoucherDropdown] = useState([]);

    useEffect(() => {
        const valueForVoucherType = {
            url: 'accounting/select/setting',
            param: {
                "dropdown-type" : "account-voucher"
            }
        };
        dispatch(getVoucherTypeDropdown(valueForVoucherType));
    }, [dispatch]);

    const voucherDropdownData = useSelector(state => state.utilitySlice.voucherDropdownData);


    useEffect(() => {
        if (voucherDropdownData && voucherDropdownData?.data?.length > 0) {
            const transformedData = voucherDropdownData?.data?.map(item => ({
                label: item.name,
                value: String(item.id)
            }));
            setVoucherDropdown(transformedData);
        }
    }, [voucherDropdownData]);

    return voucherDropdown;
};

export default getVoucherTypeDropdownData;
