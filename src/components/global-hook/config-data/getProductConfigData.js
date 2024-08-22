import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShowEntityData } from "../../../store/inventory/crudSlice.js";
const getProductConfigData = () => {
    const dispatch = useDispatch();
    const productConfigData = useSelector((state) => state.inventoryCrudSlice.showEntityData)
    useEffect(() => {
        dispatch(getShowEntityData('inventory/product-config'))
    }, []);

    return productConfigData;
};

export default getProductConfigData;
