import axios from "axios";

const useCommonDataStoreIntoLocalStorage = async (user_id) => {
    const apiBackendRoutes = [
        'inventory/config',  // this is old implementation , remove this after new domain config final implementation
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

    let configData = null;

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
                if (apiBackendRoutes[i] === 'inventory/config') {
                    // Store the main config data
                    configData = response.data.data.configData || response.data.data;
                    localStorage.setItem('config-data', JSON.stringify(configData));
                } else {
                    localStorage.setItem(localStorageKeys[i], JSON.stringify(response.data.data));
                }
            }
        } catch (error) {
            console.log("Error fetching data for", apiBackendRoutes[i], error);
        }
    }

    return configData; // Return the main config data
};

export default useCommonDataStoreIntoLocalStorage;