import axios from "axios";

const orderProcessDropdownLocalDataStore = async (user_id) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${import.meta.env.VITE_API_GATEWAY_URL + 'utility/select/setting'}`,
            headers: {
                "Accept": `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": '*',
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": user_id
            },
            params : { 'dropdown-type': 'sales-process-type' }
        })
        if (response) {
            if (response.data.data) {
                if (response.data.data && (response.data.data).length > 0) {
                    const transformedData = (response.data.data).map(type => {
                        return { 'label': type.name, 'value': String(type.id) }
                    });
                    localStorage.setItem('order-process', JSON.stringify(transformedData));
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

};

export default orderProcessDropdownLocalDataStore;
