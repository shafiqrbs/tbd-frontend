import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountingDropdown } from "../../../store/core/utilitySlice.js";

const getAccountingLedgerDropdownData = () => {
  const dispatch = useDispatch();
  const [accountingDropdown, setAccountingDropdown] = useState([]);

  useEffect(() => {
    const valueForAccounting = {
      url: "accounting/select/head",
      param: {
        "dropdown-type": "ledger",
      },
    };
    dispatch(getAccountingDropdown(valueForAccounting));
  }, [dispatch]);

  const accountLedgerDropdownData = useSelector(
    (state) => state.utilitySlice.accountLedgerDropdownData
  );

  useEffect(() => {
    if (accountLedgerDropdownData && accountLedgerDropdownData?.data?.length > 0) {
      const transformedData = accountLedgerDropdownData?.data.map((type) => {
        return { label: type.name, value: String(type.id) };
      });
      setAccountingDropdown(transformedData);
    }
  }, [accountLedgerDropdownData]);

  return accountingDropdown;
};

export default getAccountingLedgerDropdownData;
