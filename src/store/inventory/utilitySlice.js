
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDataWithParam } from "../../services/inventoryApiService.js";
import { getDataWithoutParam } from "../../services/productionApiService";


export const getSettingTypeDropdown = createAsyncThunk("setting-type-dropdown", async (value) => {
    try {
        const response = getDataWithoutParam(value);
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

export const getBrandDropdown = createAsyncThunk("brand/select", async (value) => {
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

    name: "utility",
    initialState: {
        isLoading: true,
        fetching: true,
        settingTypeDropdownData: [],
        brandDropdownData: [],
        categoryDropdownData: [],
        groupCategoryDropdown: [],
    },
    reducers: {
        setFetching: (state, action) => {
            state.fetching = action.payload
        },
    },

    extraReducers: (builder) => {

        builder.addCase(getSettingTypeDropdown.fulfilled, (state, action) => {
            state.settingTypeDropdownData = action.payload
        })

        builder.addCase(getBrandDropdown.fulfilled, (state, action) => {
            state.brandDropdownData = action.payload.data
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