import React, { useEffect, useState } from "react";
import {Tooltip, Select,Box
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import {  setInvoiceBatchFilterData } from "../../store/inventory/crudSlice.js";


function SearchChooseCustomer(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const [customerTooltip, setCustomerTooltip] = useState(false)

    const invoiceBatchFilterData = useSelector((state) => state.inventoryCrudSlice.invoiceBatchFilterData)

    /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/

    const [customersDropdownData, setCustomersDropdownData] = useState([])
    const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false)

    useEffect(() => {
        let coreCustomers = localStorage.getItem('core-customers');
        coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : []
        if (coreCustomers && coreCustomers.length > 0) {
            const transformedData = coreCustomers.map(type => {
                return ({ 'label': type.mobile + ' -- ' + type.name, 'value': String(type.id) })
            });
            setCustomersDropdownData(transformedData);
            setRefreshCustomerDropdown(false)
        }
    }, [refreshCustomerDropdown])
    /*END GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/

    let [resetKey, setResetKey] = useState(0);

    const resetDropDownState = () => setResetKey(prevKey => prevKey + 1);

    useHotkeys(
        [['alt+F', () => {
            document.getElementById('SearchKeyword').focus();
        }]
        ], []
    );


    return (
        <>
            <Box>
                <Tooltip
                    label={t('ChooseCustomer')}
                    opened={customerTooltip}
                    px={16}
                    py={2}
                    position="top-end"
                    color="red"
                    withArrow
                    offset={2}
                    zIndex={100}
                    transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
                >
                    <Select
                        key={resetKey}
                        id={"Customer"}
                        placeholder={t('ChooseCustomer')}
                        size="sm"
                        data={customersDropdownData}
                        autoComplete="off"
                        clearable
                        searchable
                        value={invoiceBatchFilterData.customer_id}
                        onChange={(e) => {
                            dispatch(setInvoiceBatchFilterData({ ...invoiceBatchFilterData, ['customer_id']: e }))
                            e !== '' ?
                                setCustomerTooltip(false) :
                                (setCustomerTooltip(true),
                                    setTimeout(() => {
                                        setCustomerTooltip(false)
                                    }, 1000))
                        }}
                        comboboxProps={true}
                    />
                </Tooltip>
            </Box>
        </>
    );
}

export default SearchChooseCustomer;
