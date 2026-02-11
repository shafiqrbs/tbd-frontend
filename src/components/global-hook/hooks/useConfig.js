import useApi from "./common/useApi.js";

export const useConfig = ( options) =>
    useApi("inventory/config", options);
