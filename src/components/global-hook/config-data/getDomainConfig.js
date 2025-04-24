import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShowConfigEntityData } from "../../../store/inventory/crudSlice.js";

const getDomainConfig = () => {
    const dispatch = useDispatch();
    const domainConfig = useSelector((state) => state.inventoryCrudSlice.showConfigData);
    
    const fetchEntity = () => {
        dispatch(getShowConfigEntityData("domain/config")); 
    };
    useEffect(() => {
        fetchEntity(); 
    }, [dispatch]); 
    return { domainConfig };
};

export default getDomainConfig;
