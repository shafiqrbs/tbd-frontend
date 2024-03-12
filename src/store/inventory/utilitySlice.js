import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDataWithParam} from "../../services/inventoryApiService.js";


export const getBusinessModelDropdown = createAsyncThunk("business-model/select", async (value) => {
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
        businessModelDropdownData : [],
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
    },

    extraReducers : (builder) => {

        builder.addCase(getBusinessModelDropdown.fulfilled, (state, action) => {
            state.businessModelDropdownData = action.payload.data
        })

    }
})

export const { setFetching } = utilitySlice.actions

export default utilitySlice.reducer;