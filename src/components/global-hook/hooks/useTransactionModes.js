import useApi from "./common/useApi.js";

export const useTransactionModes = (options) =>
    useApi("accounting/transaction-mode/local-storage", options);
