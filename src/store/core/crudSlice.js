import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    createData,
    deleteData,
    editData,
    getDataWithoutParam,
    getDataWithParam, showData,
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
        entityNewData : [],
        validation : false,
        validationMessage : [],
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
        customerFilterData : {name:'',mobile:''},
        vendorFilterData : {name:'',mobile:'',company_name:''},
        userFilterData : {name:'',mobile:'',email:''},
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
        },
        setCustomerFilterData : (state,action) => {
            state.customerFilterData.name = action.payload.name
            state.customerFilterData.mobile = action.payload.mobile
        },
        setVendorFilterData : (state,action) => {
            state.vendorFilterData.name = action.payload.name
            state.vendorFilterData.mobile = action.payload.mobile
            state.vendorFilterData.company_name = action.payload.company_name
        },
        setUserFilterData : (state,action) => {
            state.userFilterData.name = action.payload.name
            state.userFilterData.mobile = action.payload.mobile
            state.userFilterData.email = action.payload.email
        },
        setValidationData : (state,action) => {
            state.validation = action.payload
        },
        setEntityNewData : (state,action) => {
            state.entityNewData = action.payload
        }
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

export const { setFetching,setFormLoading ,setInsertType,setSearchKeyword,setEntityUpdateId,setEntityIsUpdate,setEditEntityData,setCustomerFilterData,setVendorFilterData,setUserFilterData,setValidationData,setEntityNewData} = crudSlice.actions

export default crudSlice.reducer;