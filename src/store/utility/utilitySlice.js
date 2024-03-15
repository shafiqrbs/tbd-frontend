import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDataWithParam} from "../../services/utilityApiService.js";


export const getSettingDropdown = createAsyncThunk("setting/select", async (value) => {
    try {
        const response = getDataWithParam(value);
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
        settingDropdownData : [],
        productUnitDropdown : [],
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
    },

    extraReducers : (builder) => {

        builder.addCase(getSettingDropdown.fulfilled, (state, action) => {
            state.settingDropdown = action.payload.data
        })

        builder.addCase(getProductUnitDropdown.fulfilled, (state, action) => {
            state.productUnitDropdown = action.payload.data
        })


    }
})

export const { setFetching } = utilitySlice.actions

export default utilitySlice.reducer;