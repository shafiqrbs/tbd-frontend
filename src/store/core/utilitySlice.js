import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    createData,
    getDataWithoutParam,
    getSelectDataWithParam,
    getDataWithParam,
    getCoreSettingDropdown
} from "../../services/apiService";
import {getSettingDropdown} from "../utility/utilitySlice.js";



export const getSettingTypeDropdown = createAsyncThunk("select/setting-type", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getUserDropdown = createAsyncThunk("user/select", async (value) => {
    try {
        const response = getDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});


export const getCountryDropdown = createAsyncThunk("country/select", async (value) => {
    try {
        const response = getDataWithoutParam(value);
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

export const getLocationDropdown = createAsyncThunk("warehouse/select", async (value) => {
    try {
        const response = getSelectDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getLocationProDropdown = createAsyncThunk("warehouse/dropdown", async (value) => {
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
export const coreSettingDropdown = createAsyncThunk("setting/select", async (value) => {
    try {
        const response = getCoreSettingDropdown(value);
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
        countryDropdownData : [],
        userDropdownData : [],
        locationDropdownData : [],
        executiveDropdownData : [],
        customerGroupDropdownData : [],
        vendorGroupDropdownData : [],
        employeeGroupDropdownData : [],
        coreLocationDropdownData : [],
        coreDesignationDropdownData : [],
        coreDepartmentDropdownData : [],
        coreWarehouseDropdownData : [],
        accountHeadDropdownData : [],
        accountSubHeadDropdownData : [],
        accountLedgerDropdownData : [],
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
    },

    extraReducers : (builder) => {

        builder.addCase(getSettingTypeDropdown.fulfilled, (state, action) => {
            state.settingTypeDropdownData = action.payload
        })

        builder.addCase(getUserDropdown.fulfilled, (state, action) => {
            state.userDropdownData = action.payload
        })

        builder.addCase(getCustomerDropdown.fulfilled, (state, action) => {
            state.customerDropdownData = action.payload
        })

        builder.addCase(getCountryDropdown.fulfilled, (state, action) => {
            state.countryDropdownData = action.payload
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

        builder.addCase(coreSettingDropdown.fulfilled, (state, action) => {

            if (action.payload.type == 'customer-group'){
                state.customerGroupDropdownData = action.payload.data.data
            }

            if (action.payload.type == 'vendor-group'){
                state.vendorGroupDropdownData = action.payload.data.data
            }

            if (action.payload.type == 'employee-group'){
                state.employeeGroupDropdownData = action.payload.data.data
            }
            if (action.payload.type == 'location'){
                state.coreLocationDropdownData = action.payload.data.data
            }
            if (action.payload.type == 'designation'){
                state.coreDesignationDropdownData = action.payload.data.data
            }
            if (action.payload.type == 'department'){
                state.coreDepartmentDropdownData = action.payload.data.data
            }
            if (action.payload.type == 'warehouse'){
                state.coreWarehouseDropdownData = action.payload.data.data
            }
            if (action.payload.type == 'sub-head'){
                state.accountSubHeadDropdownData = action.payload.data.data
            }
            if (action.payload.type == 'ledger'){
                state.accountLedgerDropdownData = action.payload.data.data
            }
            if (action.payload.type == 'account-head'){
                state.accountHeadDropdownData = action.payload.data.data
            }
        })

    }
})

export const { setFetching } = utilitySlice.actions

export default utilitySlice.reducer;