import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showEntityData } from "../../../store/inventory/crudSlice.js";

const getDomainConfig = () => {
    const dispatch = useDispatch();
    const domainConfig = useSelector((state) => state.inventoryCrudSlice.showEntityData);
    // console.log(domainConfig)

    const fetchEntity = () => {
        dispatch(showEntityData("domain/config")); // Trigger the Redux action to fetch the data
    };
    useEffect(() => {
        fetchEntity(); // Fetch config data on mount
    }, [dispatch]); // Only triggers once on mount since the dependency is `dispatch`
    return { domainConfig, fetchEntity }; // Return both data and the function to manually re-fetch
};

export default getDomainConfig;
