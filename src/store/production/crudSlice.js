import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createData,
    deleteData,
    editData,
    getDataWithoutParam,
    getDataWithParam, inlineUpdateData, showData,
    updateData
} from "../../services/productionApiService.js";

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

export const getSalesDetails = createAsyncThunk("sales/details", async (value) => {
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

export const inlineUpdateEntityData = createAsyncThunk("inline-update", async (value) => {
    try {
        const response = inlineUpdateData(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

const crudSlice = createSlice({
    name: "production",
    initialState: {
        isLoading: true,
        fetching: true,
        dataStatus: null,
        showEntityData: [],
        validation: false,
        validationMessage: [],
        entityNewData: [],
        dropdownLoad: false,
        searchKeyword: '',
        indexEntityData: [],
        entityEditData: [],
        entityUpdateData: [],
        salesDetails: [],
        insertType: 'create',
        entityDataDelete: null,
        openingInlineUpdateStatus: null,
        productionSettingFilterData: { setting_type_id: '',name:''},
        recipeItemFilterData: { setting_type_id: '',product_name:''},
    },
    reducers: {
        setFetching: (state, action) => {
            state.fetching = action.payload
        },
        setDropdownLoad: (state, action) => {
            state.dropdownLoad = action.payload
        },
        setFormLoading: (state, action) => {
            state.formLoading = action.payload
        },
        setEntityNewData: (state, action) => {
            state.entityNewData = action.payload
        },
        setEditEntityData: (state, action) => {
            state.entityEditData = action.payload
        },
        setInsertType: (state, action) => {
            state.insertType = action.payload
        },
        setSearchKeyword: (state, action) => {
            state.searchKeyword = action.payload
        },
        setDeleteMessage: (state, action) => {
            state.entityDataDelete = action.payload
        },
        setValidationData: (state, action) => {
            state.validation = action.payload
        },
        setValidationMessage: (state, action) => {
            state.validationMessage = action.payload
        },
        setProductionSettingFilterData: (state, action) => {
            state.productionSettingFilterData.setting_type_id = action.payload.setting_type_id
            state.productionSettingFilterData.name = action.payload.name
        },
        setRecipeItemFilterData: (state, action) => {
            state.recipeItemFilterData.setting_type_id = action.payload.setting_type_id
            state.recipeItemFilterData.product_name = action.payload.product_name
        },
    },

    extraReducers: (builder) => {

        builder.addCase(getIndexEntityData.fulfilled, (state, action) => {
            state.indexEntityData = action.payload
            state.fetching = false
        })

        builder.addCase(storeEntityData.fulfilled, (state, action) => {
            if ('success' === action.payload.data.message) {
                state.entityNewData = action.payload.data
                state.validationMessage = []
                state.validation = false
            } else {
                state.validationMessage = action.payload.data.data
                state.validation = true
                state.entityNewData = []
            }
        })

        builder.addCase(editEntityData.fulfilled, (state, action) => {
            state.dataStatus = action.payload.data.status
            state.entityEditData = action.payload.data.data
        })

        builder.addCase(getSalesDetails.fulfilled, (state, action) => {
            state.dataStatus = action.payload.data.status
            state.salesDetails = action.payload.data.data
        })

        builder.addCase(getShowEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })

        builder.addCase(showEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })

        builder.addCase(updateEntityData.fulfilled, (state, action) => {
            if ('success' === action.payload.data.message) {
                state.validationMessage = action.payload.data
                state.entityUpdateData = action.payload.data
            } else {
                state.validationMessage = action.payload.data.data
                state.validation = true
            }
        })

        builder.addCase(inlineUpdateEntityData.fulfilled,(state,action) => {
            /*if ( 404 === action.payload.data.status) {
            } else {
                state.validationMessage = action.payload.data.data
                state.validation = true
            }*/
            state.openingInlineUpdateStatus = action.payload.data.status
        })

        builder.addCase(deleteEntityData.fulfilled, (state, action) => {
            state.entityDataDelete = action.payload.data.message
            state.fetching = true
        })

    }
})

export const { setFetching, setEntityNewData, setDropdownLoad, setEditEntityData, setFormLoading, setInsertType, setSearchKeyword, setDeleteMessage, setValidationData ,setProductFilterData,setProductionSettingFilterData,setValidationMessage,setRecipeItemFilterData} = crudSlice.actions

export default crudSlice.reducer;