import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createData, getDataWithoutParam,getSelectDataWithParam, getDataWithParam} from "../../services/apiService";


export const getUserDropdown = createAsyncThunk("user/select", async (value) => {
    try {
        const response = getDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});


export const getCustomerDropdown = createAsyncThunk("customer/select", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getVendorDropdown = createAsyncThunk("vendor/select", async (value) => {
    try {
        const response = getDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getLocationDropdown = createAsyncThunk("location/select", async (value) => {
    try {
        const response = getSelectDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getLocationProDropdown = createAsyncThunk("location/dropdown", async (value) => {
    try {
        const response = getSelectDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getExecutiveDropdown = createAsyncThunk("executive/select", async (value) => {
    try {
        const response = getSelectDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});


const utilitySlice = createSlice({
    name : "utility",
    initialState : {
        isLoading : true,
        fetching : true,
        customerDropdownData : [],
        vendorDropdownData : [],
        userDropdownData : [],
        locationDropdownData : [],
        executiveDropdownData : [],
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

        builder.addCase(getCustomerDropdown.fulfilled, (state, action) => {
            state.customerDropdownData = action.payload
        })

         builder.addCase(getVendorDropdown.fulfilled, (state, action) => {
            state.vendorDropdownData = action.payload
        })

        builder.addCase(getLocationDropdown.fulfilled, (state, action) => {
            state.locationDropdownData = action.payload
        })

        builder.addCase(getLocationProDropdown.fulfilled, (state, action) => {
            state.locationProDropdownData = action.payload
        })

        builder.addCase(getExecutiveDropdown.fulfilled, (state, action) => {
            state.executiveDropdownData = action.payload
        })

    }
})

export const { setFetching } = utilitySlice.actions

export default utilitySlice.reducer;