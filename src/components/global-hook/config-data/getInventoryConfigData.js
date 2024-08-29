import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShowEntityData } from "../../../store/inventory/crudSlice.js";
const getInventoryConfigData = () => {
    const dispatch = useDispatch();
    const inventoryConfigData = useSelector((state) => state.inventoryCrudSlice.showEntityData)
    useEffect(() => {
        dispatch(getShowEntityData('inventory/product-config'))
    }, []);

    return inventoryConfigData;
};

export default getInventoryConfigData;
