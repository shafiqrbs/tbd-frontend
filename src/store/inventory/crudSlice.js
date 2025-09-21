import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createData, createDataWithFile,
    deleteData,
    editData,
    getDataWithoutParam,
    getDataWithParam, inlineUpdateData, showData,
    updateData, updateDataWithFile
} from "../../services/inventoryApiService.js";

export const getIndexEntityData = createAsyncThunk(
    "index", // Unique action type
    async (value, { rejectWithValue }) => {
        try {
            const data = await getDataWithParam(value); // Wait for the API response
            return data; // Return data (will trigger `fulfilled` case)
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch data"); // Return error details to `rejected` case
        }
    }
);

export const getProductSkuItemIndexEntityData = createAsyncThunk("index-sku-item", async (value) => {
    try {
        const response = getDataWithParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const storeEntityData = createAsyncThunk('store', async (value, { rejectWithValue }) => {
    const response = await createData(value);

    if (response.success === false) {
        return rejectWithValue({
            message: response.message,
            errors: response.errors,
        });
    }

    return response;
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

export const getShowConfigEntityData = createAsyncThunk("config/all", async (value) => {
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

export const showInstantEntityData = createAsyncThunk(
    "show-instant", // Unique action type
    async (value, { rejectWithValue }) => {
        try {
            const data = await showData(value); // Wait for the API response
            return data; // Return data (will trigger `fulfilled` case)
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch data"); // Return error details to `rejected` case
        }
    }
);

/*export const updateEntityData = createAsyncThunk("update", async (value) => {
    try {
        const response = updateData(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});*/

// Thunk to update entity data
export const updateEntityData = createAsyncThunk("update", async (value, { rejectWithValue }) => {
    try {
        const response = await updateData(value);
        return response;
    } catch (error) {
        console.error('Error in updateEntityData:', error.message);
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateEntityDataWithFile = createAsyncThunk("update-file", async (value) => {
    try {
        const response = updateDataWithFile(value);
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

export const createEntityDataWithMedia = createAsyncThunk("create-with-media", async (value) => {
    try {
        const response = createDataWithFile(value);
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
        showConfigData: [],
        showInstantEntityData: [],
        validation: false,
        validationMessage: [],
        entityNewData: [],
        dropdownLoad: false,
        searchKeyword: '',
        indexEntityData: [],
        entityEditData: [],
        entityUpdateData: [],
        salesDetails: [],
        productSkuIndexEntityData: [],
        insertType: 'create',
        entityDataDelete: null,
        openingInlineUpdateStatus: null,
        productFilterData : {name:'',alternative_name:'',sku:'',sales_price:'',product_type_id:'',category_id:''},
        categoryFilterData: { name: '', parent_name: '' },
        salesFilterData: { customer_id: '',start_date:'',end_date:'',searchKeyword:''},
        invoiceBatchFilterData: { customer_id: '',start_date:'',end_date:'',searchKeyword:''},
        purchaseItemsFilterData: { start_date:'',end_date:'',searchKeyword:''},
        purchaseFilterData: { vendor_id: '',start_date:'',end_date:'',searchKeyword:''},
        purchaseReturnFilterData: { vendor_id: '',start_date:'',end_date:'',searchKeyword:''}

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
            state.productFilterData.product_type_id = action.payload.product_type_id
            state.productFilterData.category_id = action.payload.category_id
        },
        setCategoryFilterData: (state, action) => {
            state.categoryFilterData.name = action.payload.name
            state.categoryFilterData.parent_name = action.payload.parent_name
        },
        setSalesFilterData: (state, action) => {
            state.salesFilterData.customer_id = action.payload.customer_id
            state.salesFilterData.start_date = action.payload.start_date
            state.salesFilterData.end_date = action.payload.end_date
            state.salesFilterData.searchKeyword = action.payload.searchKeyword
        },
        setInvoiceBatchFilterData: (state, action) => {
            state.invoiceBatchFilterData.customer_id = action.payload.customer_id
            state.invoiceBatchFilterData.start_date = action.payload.start_date
            state.invoiceBatchFilterData.end_date = action.payload.end_date
            state.invoiceBatchFilterData.searchKeyword = action.payload.searchKeyword
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
        },
        setPurchaseReturnFilterData: (state, action) => {
            state.purchaseReturnFilterData.vendor_id = action.payload.vendor_id
            state.purchaseReturnFilterData.start_date = action.payload.start_date
            state.purchaseReturnFilterData.end_date = action.payload.end_date
            state.purchaseReturnFilterData.searchKeyword = action.payload.searchKeyword
        },
        setInventoryShowDataEmpty : (state,action) => {
            state.showEntityData = []
        },
        setConfigShowDataEmpty : (state,action) => {
            state.showConfigData = []
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getIndexEntityData.fulfilled, (state, action) => {
                state.indexEntityData = action.payload; // Store response data
                state.fetching = false; // Turn off fetching state
            })
            .addCase(getIndexEntityData.rejected, (state, action) => {
                // state.fetching = false; // Turn off fetching state
                state.error = action.payload; // Save error
            });

        /*builder.addCase(getIndexEntityData.fulfilled, (state, action) => {
            state.indexEntityData = action.payload
            state.fetching = false
        })*/

        builder.addCase(getProductSkuItemIndexEntityData.fulfilled, (state, action) => {
            state.productSkuIndexEntityData = action.payload
            state.fetching = false
        })

        builder.addCase(storeEntityData.fulfilled, (state, action) => {
            if ('success' === action.payload.data.message) {
                state.entityNewData = action.payload.data
                state.validationMessage = []
                state.validation = false
            }
        });

        builder.addCase(storeEntityData.rejected, (state, action) => {
            state.validationMessage = action.payload; // Save or log the error data
            state.validation = true
        });

        builder.addCase(createEntityDataWithMedia.fulfilled, (state, action) => {
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

        builder.addCase(getShowConfigEntityData.fulfilled, (state, action) => {
            // console.log("Reducer Payload:", action.payload.data); 
            state.showConfigData = action.payload.data.data;
        });

        builder.addCase(showEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })

        builder.addCase(showInstantEntityData.fulfilled, (state, action) => {
            state.showInstantEntityData = action.payload.data.data
        })

        /*builder.addCase(updateEntityData.fulfilled, (state, action) => {
            if ('success' === action.payload.data.message) {
                state.validationMessage = action.payload.data
                state.entityUpdateData = action.payload.data
            } else {
                state.validationMessage = action.payload.data.data
                state.validation = true
            }
        })*/

        // Handle the thunk response (fulfilled or otherwise) in your slice
        builder.addCase(updateEntityData.fulfilled, (state, action) => {
            if (action.payload.data && action.payload.data.message === 'success') {
                state.validationMessage = action.payload.data;
                state.entityUpdateData = action.payload.data;
            } else {
                state.validationMessage = action.payload.data?.data || 'Something went wrong';
                state.validation = true;
            }
        });

        builder.addCase(updateEntityData.rejected, (state, action) => {
            state.validationMessage = action.payload || 'Failed to update entity data';
            state.validation = true;
        });

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

        builder.addCase(updateEntityDataWithFile.fulfilled, (state, action) => {
            // state.entityDataDelete = action.payload.data.message
        })

    }
})

export const { setFetching, setEntityNewData, setDropdownLoad, setEditEntityData, setFormLoading, setInsertType, setSearchKeyword, setDeleteMessage, setValidationData, setValidationMessage, setCategoryFilterData ,setProductFilterData,setSalesFilterData,setPurchaseFilterData,setPurchaseItemsFilterData,setInvoiceBatchFilterData,setInventoryShowDataEmpty,setPurchaseReturnFilterData} = crudSlice.actions

export default crudSlice.reducer;