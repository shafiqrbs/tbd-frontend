import { useState, useEffect, useCallback } from "react";
import axiosInstance from "./axiosInstance.js";

const useApi = (endpoint, options = {}) => {
    const { enabled = true } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"))

    const fetchData = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get(endpoint, {
                headers: {
                    "X-Api-User": user?.id,
                },
            });

            const result =
                response.data?.data?.configData ||
                response.data?.data ||
                null;

            setData(result);
            return result;

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        if (enabled) {
            fetchData();
        }
    }, [fetchData, enabled]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
};

export default useApi;
