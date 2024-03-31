import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLocationDropdown } from "../../../store/core/utilitySlice.js";
import {getShowEntityData} from "../../../store/inventory/crudSlice.js";

const getConfigData = () => {
    const dispatch = useDispatch();

    const configData = useSelector((state) => state.inventoryCrudSlice.showEntityData)
    useEffect(() => {
        dispatch(getShowEntityData('inventory/config'))
    }, []);

    return configData;
};

export default getConfigData;
