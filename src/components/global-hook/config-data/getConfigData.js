import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShowEntityData } from "../../../store/inventory/crudSlice.js";

const getConfigData = () => {
    const dispatch = useDispatch();
    const configData = useSelector((state) => state.inventoryCrudSlice.showEntityData);

    const fetchData = () => {
        dispatch(getShowEntityData("inventory/config")); // Trigger the Redux action to fetch the data
    };

    useEffect(() => {
        fetchData(); // Fetch config data on mount
    }, [dispatch]); // Only triggers once on mount since the dependency is `dispatch`

    return { configData, fetchData }; // Return both data and the function to manually re-fetch
};

export default getConfigData;
