import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountingDropdown } from "../../../store/core/utilitySlice.js";

const getAccountingSubHeadDropdownData = () => {
  const dispatch = useDispatch();
  const [accountingDropdown, setAccountingDropdown] = useState([]);

  useEffect(() => {
    const valueForAccounting = {
      url: "accounting/select/head",
      param: {
        "dropdown-type": "sub-head",
      },
    };
    dispatch(getAccountingDropdown(valueForAccounting));
  }, [dispatch]);

  const accountingDropdownData = useSelector(
    (state) => state.utilitySlice.accountingDropdownData
  );

  useEffect(() => {
    if (accountingDropdownData && accountingDropdownData.length > 0) {
      const transformedData = accountingDropdownData.map((type) => {
        return { label: type.name, value: String(type.id) };
      });
      setAccountingDropdown(transformedData);
    }
  }, [accountingDropdownData]);

  return accountingDropdown;
};

export default getAccountingSubHeadDropdownData;
