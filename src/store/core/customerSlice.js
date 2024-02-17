import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDataWithParam} from "../../services/apiService";


export const userDropdown = createAsyncThunk("user/dropdown", async (value) => {
    try {
        const response = getDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});
const customerSlice = createSlice({
    name : "customer",
    initialState : {
        isLoading : true,
        userDropdownData : []
    },
    reducers : {
        setUserViewModel : (state,action) => {
            state.userViewModel = action.payload
        },
    },

    extraReducers : (builder) => {
        builder.addCase(userDropdown.fulfilled, (state, action) => {
            state.userDropdownData = action.payload
        })
    }
})

export const { setUserViewModel } = customerSlice.actions

export default customerSlice.reducer;