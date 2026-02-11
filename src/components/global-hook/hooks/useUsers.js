import useApi from "./common/useApi.js";

export const useUsers = (options) =>
    useApi("core/user/local-storage", options);
