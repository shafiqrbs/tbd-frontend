import axios from "axios";

export const getSelectDataWithParam = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: import.meta.env.VITE_API_GATEWAY_URL+value.url,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
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

export const getDataWithParam = async (value) => {
    try {
        const response = await axios({
            method: "get",
            url: `${import.meta.env.VITE_API_GATEWAY_URL + value.url}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": JSON.parse(localStorage.getItem("user")).id,
            },
            params: value.param,
        });
        return response.data;
    } catch (error) {
        console.error("Axios Error:", error);
        throw error; // Throw the error to be caught by Thunk's `rejectWithValue`
    }
};


export const getDataWithoutParam = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        }
    })
        .then(res => {
            data = res.data.data
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const createData = async (value) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
            headers: {
                "Accept": `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": '*',
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": JSON.parse(localStorage.getItem('user')).id
            },
            data : value.data
        });
        return response;
    } catch (error) {
        // Return both the message and validation errors
        if (error.response) {
            return {
                success: false,
                message: error.response.data.message,
                errors: error.response.data.errors,
            };
        } else {
            return {
                success: false,
                message: error.message,
                errors: {},
            };
        }
    }
};

export const createDataWithFile = async (value) => {
    let data = []
    await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `multipart/form-data`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        data : value.data
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};


export const updateDataWithFile = async (value) => {
    let data = []
    await axios({
        method: 'PATCH',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `multipart/form-data`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        data : value.data
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const editData = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

/*export const updateData = async (value) => {
    let data = []
    const id = value.url.split('/').pop();
    await axios({
        method: value.url==='inventory/config-update/'+id?'POST':'PATCH',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": value.url==='inventory/config-update/'+id?`multipart/form-data`:`application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        data : value.data
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};*/

// API method to update data
export const updateData = async (value) => {
    const id = value.url.split('/').pop();
    const methodType = value.url === `inventory/config-update/${id}` ? 'POST' : 'PATCH';
    const contentType = methodType === 'POST' ? 'multipart/form-data' : 'application/json';

    try {
        const response = await axios({
            method: methodType,
            url: `${import.meta.env.VITE_API_GATEWAY_URL + value.url}`,
            headers: {
                "Accept": "application/json",
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": '*',
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": JSON.parse(localStorage.getItem('user')).id
            },
            data: value.data,
        });
        return response; // Return the response directly if successful
    } catch (error) {
        console.error('Error in updateData:', error.message);
        throw error; // Re-throw the error to be caught in the thunk
    }
};

export const inlineUpdateData = async (value) => {
    let data = []
    await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        data : value.data
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const showData = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const deleteData = async (value) => {
    let data = []
    await axios({
        method: 'delete',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};