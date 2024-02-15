import axios from "axios";

export const buyerDropdownService = async () => {
    let data = [];
    await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_GATEWAY_URL}/users/buyer/dropdown`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "Authorization": `Bearer ${localStorage.getItem('user_token')}`
        }
    })
        .then(res => {
            if (res.status === 200){
                data =
                    res.data.data.map((item, index) => {
                        return ({
                            'value': Number(item.id), 'label': item.email
                        })
                    })
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};


export const vendorShowService = async (id) => {
    let data = [];
    await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_GATEWAY_URL}/vendor/show/${id}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "Authorization": `Bearer ${localStorage.getItem('user_token')}`
        }
    })
        .then(res => {
            if (res.status === 200){
                data = res.data.data
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};


export const getIssueCustomerService = async () => {
    let data = [];
    await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_GATEWAY_URL}/delivery-issue/get-customer`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "Authorization": `Bearer ${localStorage.getItem('user_token')}`
        }
    })
        .then(res => {
            if (res.status === 200){
                data =
                    res.data.data.map((item, index) => {
                        return ({
                            'value': Number(item.id), 'label': item.username
                        })
                    })
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};


export const getUserEnableDisable = async (data) => {
    let returnData = [];
    await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_GATEWAY_URL}/users/enable-disable`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "Authorization": `Bearer ${localStorage.getItem('user_token')}`
        },
        data : data
    })
        .then(res => {
            console.log(res.data)
            if (res.status === 200){
                returnData = res.data.message
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    return returnData
};
