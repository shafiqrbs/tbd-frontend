import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {buyerDropdownService, getIssueCustomerService, getUserEnableDisable} from "../../services/UserService";


export const buyerDropdown = createAsyncThunk("buyer/dropdown", async () => {
    try {
        const response = buyerDropdownService();
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});
const userSlice = createSlice({
    name : "vendor",
    initialState : {
        isLoading : true,
    },
    reducers : {
        setUserViewModel : (state,action) => {
            state.userViewModel = action.payload
        },
    },

    extraReducers : (builder) => {
        builder.addCase(buyerDropdown.fulfilled, (state, action) => {
            state.buyerDropdownData = action.payload
            state.message = 'buyerDropdownLoad'
            state.isLoading = false
        })
    }
})

export const { setUserViewID } = userSlice.actions

export default userSlice.reducer;