import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDataWithoutParam} from "../../services/productionApiService.js";

export const getSettingTypeDropdown = createAsyncThunk("setting-type-dropdown", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});
export const getProConfigDropdown = createAsyncThunk("pro-config-dropdown", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getMaterialProductDropdown = createAsyncThunk("material-product/select", async (value) => {
    try {
        const response = getDataWithoutParam(value);
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
        settingTypeDropdownData : [],
        materialProductDropdownData : [],
        proConfigDropdownData : [],
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
        builder.addCase(getProConfigDropdown.fulfilled, (state, action) => {
            state.proConfigDropdownData = action.payload
        })
        builder.addCase(getMaterialProductDropdown.fulfilled, (state, action) => {
            state.materialProductDropdownData = action.payload
        })

    }
})

export const { setFetching } = utilitySlice.actions

export default utilitySlice.reducer;