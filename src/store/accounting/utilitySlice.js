import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDataWithoutParam} from "../../services/accountingApiService.js";


export const getTransactionModeData = createAsyncThunk("transaction-mode/data", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});


export const getTransactionMethodDropdown = createAsyncThunk("transaction-method/select", async (value) => {
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
        transactionModeData : [],
        transactionMethodData : [],
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
    },

    extraReducers : (builder) => {

        builder.addCase(getTransactionModeData.fulfilled, (state, action) => {
            state.transactionModeData = action.payload
        })

        builder.addCase(getTransactionMethodDropdown.fulfilled, (state, action) => {
            state.transactionMethodData = action.payload
        })

    }
})

export const { setFetching } = utilitySlice.actions

export default utilitySlice.reducer;