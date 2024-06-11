import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createData,
    deleteData,
    editData,
    getDataWithoutParam,
    getDataWithParam, inlineUpdateData, showData,
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
    name: "crud",
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
        salesDetails: [],
        insertType: 'create',
        entityDataDelete: null,
        openingInlineUpdateStatus: null,
        productFilterData: { name: '', alternative_name: '', sku: '', sales_price: '' },
        categoryFilterData: { name: '', parentName: '' },
        salesFilterData: { customer_id: '',start_date:'',end_date:'',searchKeyword:''},
        purchaseItemsFilterData: { start_date:'',end_date:'',searchKeyword:''},
        purchaseFilterData: { vendor_id: '',start_date:'',end_date:'',searchKeyword:''}

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
        setProductFilterData: (state, action) => {
            state.productFilterData.name = action.payload.name
            state.productFilterData.alternative_name = action.payload.alternative_name
            state.productFilterData.sku = action.payload.sku
            state.productFilterData.sales_price = action.payload.sales_price
        },
        setCategoryFilterData: (state, action) => {
            state.categoryFilterData.name = action.payload.name
            state.categoryFilterData.parentName = action.payload.parentName
        },
        setSalesFilterData: (state, action) => {
            state.salesFilterData.customer_id = action.payload.customer_id
            state.salesFilterData.start_date = action.payload.start_date
            state.salesFilterData.end_date = action.payload.end_date
            state.salesFilterData.searchKeyword = action.payload.searchKeyword
        },
        setPurchaseItemsFilterData: (state, action) => {
            state.purchaseItemsFilterData.start_date = action.payload.start_date
            state.purchaseItemsFilterData.end_date = action.payload.end_date
            state.purchaseItemsFilterData.searchKeyword = action.payload.searchKeyword
        },
        setPurchaseFilterData: (state, action) => {
            state.purchaseFilterData.vendor_id = action.payload.vendor_id
            state.purchaseFilterData.start_date = action.payload.start_date
            state.purchaseFilterData.end_date = action.payload.end_date
            state.purchaseFilterData.searchKeyword = action.payload.searchKeyword
        }
    },

    extraReducers: (builder) => {

        builder.addCase(getIndexEntityData.fulfilled, (state, action) => {
            state.indexEntityData = action.payload
            state.fetching = false
        })

        builder.addCase(storeEntityData.fulfilled, (state, action) => {
            if ('success' === action.payload.data.message) {
                state.entityNewData = action.payload.data
            } else {
                state.validationMessage = action.payload.data.data
                state.validation = true
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
        })

    }
})

export const { setFetching, setEntityNewData, setDropdownLoad, setEditEntityData, setFormLoading, setInsertType, setSearchKeyword, setDeleteMessage, setValidationData, setValidationMessage, setCategoryFilterData ,setProductFilterData,setSalesFilterData,setPurchaseFilterData,setPurchaseItemsFilterData} = crudSlice.actions

export default crudSlice.reducer;