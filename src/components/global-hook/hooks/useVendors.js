import useApi from "./common/useApi.js";

export const useVendors = ( options) =>
    useApi("core/vendor/local-storage", options);
