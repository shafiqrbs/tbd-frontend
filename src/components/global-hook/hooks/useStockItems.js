import useApi from "./common/useApi.js";

export const useStockItems = (options) =>
    useApi("inventory/stock-item", options);
