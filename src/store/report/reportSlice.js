import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getDataWithoutParam,
    getDataWithParam, showData,
} from "../../services/apiService";

// Thunk for fetching data
export const getIndexEntityData = createAsyncThunk(
    "index", // Unique action type
    async (value, { rejectWithValue }) => {
        try {
            const data = await getDataWithParam(value); // Wait for the API response
            return data; // Return data (will trigger `fulfilled` case)
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch data"); // Return error details to `rejected` case
        }
    }
);

export const showEntityData = createAsyncThunk("show", async (value) => {
    try {
        const response = showData(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});


const reportSlice = createSlice({
    name: "report",
    initialState: {
        productionIssueFilterData: { start_date:new Date(),end_date:new Date(),warehouse_id:''},
    },
    reducers: {
        setProductionIssueFilterData: (state, action) => {
            state.productionIssueFilterData.start_date = action.payload.start_date
            state.productionIssueFilterData.end_date = action.payload.end_date
            state.productionIssueFilterData.warehouse_id = action.payload.warehouse_id
        }

    },

    extraReducers: (builder) => {

        builder.addCase(getIndexEntityData.fulfilled, (state, action) => {
                state.indexEntityData = action.payload; // Store response data
                state.fetching = false; // Turn off fetching state
            })
            .addCase(getIndexEntityData.rejected, (state, action) => {
                state.error = action.payload; // Save error
            });

        builder.addCase(showEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })
    }
})

export const { setProductionIssueFilterData} = reportSlice.actions

export default reportSlice.reducer;