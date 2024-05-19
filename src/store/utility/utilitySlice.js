import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDataWithParam, getDataWithParamForSettingDropdown} from "../../services/utilityApiService.js";


export const getSettingDropdown = createAsyncThunk("setting/select", async (value) => {
    try {
        const response = getDataWithParamForSettingDropdown(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getProductUnitDropdown = createAsyncThunk("product-unit/select", async (value) => {
    try {
        const response = getDataWithParam(value);
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
        productDropdownData : [],
        accountDropdownData : [],
        authorizedDropdownData : [],
        businessModelDropdownData : [],
        salesProcessTypeDropdownData : [],
        productUnitDropdown : [],
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
    },

    extraReducers : (builder) => {

        builder.addCase(getSettingDropdown.fulfilled, (state, action) => {
            if (action.payload.type === 'product-type'){
                state.productDropdownData = action.payload.data.data
            }
            if (action.payload.type === 'account-type'){
                state.accountDropdownData = action.payload.data.data
            }
            if (action.payload.type === 'authorised-type'){
                state.authorizedDropdownData = action.payload.data.data
            }
            if (action.payload.type === 'business-model'){
                state.businessModelDropdownData = action.payload.data.data
            }
            if (action.payload.type === 'sales-process-type'){
                state.salesProcessTypeDropdownData = action.payload.data.data
            }
        })

        builder.addCase(getProductUnitDropdown.fulfilled, (state, action) => {
            state.productUnitDropdown = action.payload.data
        })


    }
})

export const { setFetching ,setSettingDropdownEmpty} = utilitySlice.actions

export default utilitySlice.reducer;