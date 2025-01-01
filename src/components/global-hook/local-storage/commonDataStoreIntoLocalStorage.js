import axios from "axios";

const commonDataStoreIntoLocalStorage = async (user_id) => {
    const apiBackendRoutes = [
        'inventory/config',
        'inventory/stock-item',
        'core/customer/local-storage',
        'core/vendor/local-storage',
        'core/user/local-storage',
        'accounting/transaction-mode/local-storage',
    ];
    const localStorageKeys = [
        'config-data',
        'core-products',
        'core-customers',
        'core-vendors',
        'core-users',
        'accounting-transaction-mode',
    ];

    for (let i = 0; i < apiBackendRoutes.length; i++) {
        try {
            const response = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_API_GATEWAY_URL + apiBackendRoutes[i]}`,
                headers: {
                    "Accept": `application/json`,
                    "Content-Type": `application/json`,
                    "Access-Control-Allow-Origin": '*',
                    "X-Api-Key": import.meta.env.VITE_API_KEY,
                    "X-Api-User": user_id
                }
            })
            if (response.data.data) {
                if ('inventory/config' == apiBackendRoutes[i]){
                    localStorage.setItem(localStorageKeys[i], JSON.stringify(response.data.data.configData));
                }
                localStorage.setItem(localStorageKeys[i], JSON.stringify(response.data.data));
            }
        } catch (error) {
            console.log(error);
        }
    }
};

export default commonDataStoreIntoLocalStorage;
