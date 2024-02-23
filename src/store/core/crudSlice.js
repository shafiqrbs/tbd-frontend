import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createData, getDataWithoutParam, getDataWithParam} from "../../services/apiService";

export const getIndexEntityData = createAsyncThunk("index", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getCustomerIndexData = createAsyncThunk("customer-index", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const storeEntityData = createAsyncThunk("store", async (value) => {
    try {
        const response = createData(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const editEntityData = createAsyncThunk("edit", async (value) => {
    try {
        const response = editData(value);
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

export const showEntityData = createAsyncThunk("show", async (value) => {
    try {
        const response = showData(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const deleteEntityData = createAsyncThunk("delete", async (value) => {
    try {
        const response = deleteData(value);
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
        indexEntityData : [],
        storeEntityData : [],
        editEntityData : [],
        updateEntityData : [],
        showEntityData : [],
        customerIndexData : [],
        deleteEntityData : []
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
    },

    extraReducers : (builder) => {

        builder.addCase(getIndexEntityData.fulfilled, (state, action) => {
            state.indexEntityData = action.payload.data
            state.fetching = false
        })

        builder.addCase(getCustomerIndexData.fulfilled, (state, action) => {
            state.customerIndexData = action.payload.data
            state.fetching = false
        })

        builder.addCase(storeEntityData.fulfilled, (state, action) => {
            state.storeEntityData = action.payload.data.data
        })

        builder.addCase(editEntityData.fulfilled, (state, action) => {
            state.editEntityData = action.payload.data.data
        })

        builder.addCase(updateEntityData.fulfilled, (state, action) => {
            state.updateEntityData = action.payload.data.data
        })

        builder.addCase(showEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })

        builder.addCase(deleteEntityData.fulfilled, (state, action) => {
            state.deleteEntityData = action.payload.data.data
        })


    }
})

export const { setFetching } = crudSlice.actions

export default crudSlice.reducer;