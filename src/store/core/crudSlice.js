import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    createData,
    deleteData,
    editData,
    getDataWithoutParam,
    getDataWithParam,
    updateData
} from "../../services/apiService";

export const getIndexEntityData = createAsyncThunk("index", async (value) => {
    try {
        const response = getDataWithParam(value);
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
        entityEditData : [],
        updateEntityData : [],
        showEntityData : [],
        customerIndexData : [],
        entityDataDelete : [],
        formLoading : false,
        insertType : 'create',
        searchKeyword : '',
        entityUpdateId : null,
        entityIsUpdate : false,
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
        setFormLoading : (state,action) => {
            state.formLoading = action.payload
        },
        setInsertType : (state,action)=>{
            state.insertType = action.payload
        },
        setSearchKeyword : (state,action)=>{
            state.searchKeyword = action.payload
        },
        setEntityUpdateId : (state,action)=>{
            state.entityUpdateId = action.payload
        },
        setEntityIsUpdate : (state,action)=>{
            state.entityIsUpdate = action.payload
        },
        setEditEntityData : (state,action)=>{
            state.entityEditData = action.payload
        }
    },

    extraReducers : (builder) => {

        builder.addCase(getIndexEntityData.fulfilled, (state, action) => {
            state.indexEntityData = action.payload
            state.fetching = false
        })
        
        builder.addCase(storeEntityData.fulfilled, (state, action) => {
            state.storeEntityData = action.payload.data.data
        })

        builder.addCase(editEntityData.fulfilled, (state, action) => {
            state.entityEditData = action.payload.data.data
        })

        builder.addCase(updateEntityData.fulfilled, (state, action) => {
            state.updateEntityData = action.payload.data.data
        })

        builder.addCase(showEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })

        builder.addCase(deleteEntityData.fulfilled, (state, action) => {
            state.entityDataDelete = action.payload.data.data
        })


    }
})

export const { setFetching,setFormLoading ,setInsertType,setSearchKeyword,setEntityUpdateId,setEntityIsUpdate,setEditEntityData} = crudSlice.actions

export default crudSlice.reducer;