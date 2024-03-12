import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    createData,
    deleteData,
    editData,
    getDataWithoutParam,
    getDataWithParam, showData,
    updateData
} from "../../services/inventoryApiService.js";


export const getShowEntityData = createAsyncThunk("show", async (value) => {
    try {
        const response = showData(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});


export const updateEntityData = createAsyncThunk("update", async (value) => {
    try {
        const response = updateData(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

const crudSlice = createSlice({
    name : "crud",
    initialState : {
        isLoading : true,
        fetching : true,
        showEntityData : [],
        validation : false,
        validationMessage : [],
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
        setFormLoading : (state,action) => {
            state.formLoading = action.payload
        }
    },

    extraReducers : (builder) => {

        builder.addCase(getShowEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })

        builder.addCase(updateEntityData.fulfilled, (state, action) => {
            if ('success' === action.payload.data.message){
                state.validationMessage = action.payload.data
            }else{
                state.validationMessage = action.payload.data.data
                state.validation = true
            }
        })

    }
})

export const { setFetching} = crudSlice.actions

export default crudSlice.reducer;