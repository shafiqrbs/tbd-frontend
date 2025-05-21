import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVoucherDropdown } from "../../../store/core/utilitySlice.js";

const getVoucherDropdownData = () => {
  const dispatch = useDispatch();
  const [voucherDropdown, setVoucherDropdown] = useState([]);

  useEffect(() => {

    dispatch(getVoucherDropdown("accounting/select/voucher"));
  }, [dispatch]);

  const voucherAllDropdownData = useSelector(
    (state) => state.utilitySlice.voucherAllDropdownData
  );

  useEffect(() => {
    if (voucherAllDropdownData && voucherAllDropdownData.length > 0) {
      const transformedData = voucherAllDropdownData.map((type) => {
        return { label: type.name, value: String(type.id) };
      });
      setVoucherDropdown(transformedData);
    }
  }, [voucherAllDropdownData]);

  return voucherDropdown;
};

export default getVoucherDropdownData;
