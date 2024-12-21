import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    createData,
    deleteData,
    editData,
    getDataWithoutParam,
    getDataWithParam, showData,
    updateData
} from "../../services/inventoryApiService.js";

export const getIndexEntityData = createAsyncThunk("index", async (value) => {
    try {
        const response = getDataWithParam(value);
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

export const getShowEntityData = createAsyncThunk("config/show", async (value) => {
    try {
        const response = showData(value);
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

export const updateEntityData = createAsyncThunk("update", async (value) => {
    try {
        const response = updateData(value);
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
        showEntityData : [],
        validation : false,
        validationMessage : [],
        entityNewData : [],
        dropdownLoad : false,
        searchKeyword : '',
        indexEntityData : [],
        entityEditData : [],
        insertType : 'create',
        entityDataDelete : null,
    },
    reducers : {
        setFetching : (state,action) => {
            state.fetching = action.payload
        },
        setDropdownLoad : (state,action) => {
            state.dropdownLoad = action.payload
        },
        setFormLoading : (state,action) => {
            state.formLoading = action.payload
        },
        setEntityNewData : (state,action) => {
            state.entityNewData = action.payload
        },
        setEditEntityData : (state,action)=>{
            state.entityEditData = action.payload
        },
        setInsertType : (state,action)=>{
            state.insertType = action.payload
        },
        setSearchKeyword : (state,action)=>{
            state.searchKeyword = action.payload
        },
        setDeleteMessage : (state,action)=>{
            state.entityDataDelete = action.payload
        },
        setValidationData : (state,action) => {
            state.validation = action.payload
        },
        setValidationMessage : (state,action)=>{
            state.validationMessage = action.payload
        },
    },

    extraReducers : (builder) => {

        builder.addCase(getIndexEntityData.fulfilled, (state, action) => {
            state.indexEntityData = action.payload
            state.fetching = false
        })

        builder.addCase(storeEntityData.fulfilled, (state, action) => {
            if ('success' === action.payload.data.message){
                state.entityNewData = action.payload.data
            }else{
                state.validationMessage = action.payload.data.data
                state.validation = true
            }
        })

        builder.addCase(editEntityData.fulfilled, (state, action) => {
            state.entityEditData = action.payload.data.data
        })

        builder.addCase(getShowEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })

        builder.addCase(showEntityData.fulfilled, (state, action) => {
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

        builder.addCase(deleteEntityData.fulfilled, (state, action) => {
            state.entityDataDelete = action.payload.data.message
        })

    }
})

export const { setFetching,setEntityNewData,setDropdownLoad,setEditEntityData,setFormLoading,setInsertType,setSearchKeyword,setDeleteMessage,setValidationData,setValidationMessage} = crudSlice.actions

export default crudSlice.reducer;