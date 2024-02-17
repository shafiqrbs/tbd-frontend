import axios from "axios";

export const getDataWithParam = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            // "Authorization": `Bearer ${localStorage.getItem('user_token')}`
        },
        params : value.param
    })
        .then(res => {
            data = res.data.data
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};