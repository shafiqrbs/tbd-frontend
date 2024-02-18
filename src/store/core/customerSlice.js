import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createData, getDataWithoutParam, getDataWithParam} from "../../services/apiService";


export const getUserDropdown = createAsyncThunk("user/dropdown", async (value) => {
    try {
        const response = getDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});
export const getLocationDropdown = createAsyncThunk("location/dropdown", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getMarketingExecutiveDropdown = createAsyncThunk("marketing-executive/dropdown", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const createCustomerData = createAsyncThunk("create-customer", async (value) => {
    try {
        const response = createData(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getCustomerIndexData = createAsyncThunk("customer-index", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});


const customerSlice = createSlice({
    name : "customer",
    initialState : {
        isLoading : true,
        fetching : true,
        userDropdownData : [],
        locationDropdownData : [],
        marketingExecutiveDropdownData : [],
        newCustomerData : [],
        customerIndexData : []
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
    },

    extraReducers : (builder) => {
        builder.addCase(getUserDropdown.fulfilled, (state, action) => {
            state.userDropdownData = action.payload
        })
        builder.addCase(getLocationDropdown.fulfilled, (state, action) => {
            state.locationDropdownData = action.payload
        })
        builder.addCase(getMarketingExecutiveDropdown.fulfilled, (state, action) => {
            state.marketingExecutiveDropdownData = action.payload
        })
        builder.addCase(createCustomerData.fulfilled, (state, action) => {
            state.newCustomerData = action.payload.data.data
        })
        builder.addCase(getCustomerIndexData.fulfilled, (state, action) => {
            state.customerIndexData = action.payload.data
            state.fetching = false
        })
    }
})

export const { setFetching } = customerSlice.actions

export default customerSlice.reducer;