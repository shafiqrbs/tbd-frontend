import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDataWithParam} from "../../services/inventoryApiService.js";


export const getSettingDropdown = createAsyncThunk("setting/select", async (value) => {
    try {
        const response = getDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getBusinessModelDropdown = createAsyncThunk("business-model/select", async (value) => {
    try {
        const response = getDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getCategoryDropdown = createAsyncThunk("category/select", async (value) => {
    try {
        const response = getDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getGroupCategoryDropdown = createAsyncThunk("group-category/select", async (value) => {
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
        businessModelDropdownData : [],
        categoryDropdownData : [],
        groupCategoryDropdownData : [],
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

        builder.addCase(getBusinessModelDropdown.fulfilled, (state, action) => {
            state.businessModelDropdownData = action.payload.data
        })

        builder.addCase(getCategoryDropdown.fulfilled, (state, action) => {
            state.categoryDropdownData = action.payload.data
        })

        builder.addCase(getGroupCategoryDropdown.fulfilled, (state, action) => {
            state.groupCategoryDropdown = action.payload.data
        })

    }
})

export const { setFetching } = utilitySlice.actions

export default utilitySlice.reducer;