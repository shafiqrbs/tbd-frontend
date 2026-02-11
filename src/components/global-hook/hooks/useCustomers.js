import useApi from "./common/useApi.js";

export const useCustomers = (options) =>
    useApi("core/customer/local-storage", options);
