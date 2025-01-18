import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createData,
    deleteData,
    editData,
    getDataWithoutParam,
    getDataWithParam, inlineStatusUpdateData, showData,
    updateData, updateDataWithFile
} from "../../services/apiService";

// Thunk for fetching data
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

export const getCustomerIndexData = createAsyncThunk("customer-index", async (value) => {
    try {
        const response = getDataWithoutParam(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});

export const getStatusInlineUpdateData = createAsyncThunk("status-update", async (value) => {
    try {
        const response = inlineStatusUpdateData(value);
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


export const updateEntityData = createAsyncThunk('update', async (value, { rejectWithValue }) => {
    const response = await updateData(value);

    if (response.success === false) {
        return rejectWithValue({
            message: response.message,
            errors: response.errors,
        });
    }

    return response;
});

export const updateEntityDataWithFile = createAsyncThunk("update-with-file", async (value) => {
    try {
        const response = updateDataWithFile(value);
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
    name: "crud",
    initialState: {
        isLoading: true,
        fetching: true,
        indexEntityData: [],
        entityNewData: [],
        validation: false,
        validationMessage: [],
        entityEditData: [],
        updateEntityData: [],
        showEntityData: [],
        customerIndexData: [],
        entityDataDelete: [],
        updateUserError: [],
        formLoading: false,
        insertType: 'create',
        searchKeyword: '',
        entityUpdateId: null,
        entityIsUpdate: false,
        customerFilterData: { name: '', mobile: '' },
        vendorFilterData: { name: '', mobile: '', company_name: '' },
        userFilterData: { name: '', mobile: '', email: '' },
        warehouseFilterData: { name: '', mobile: '', email: '',location:'' },
        categoryGroupFilterData: { name: '' },
        statusInlineUpdateData:null
    },
    reducers: {
        setFetching: (state, action) => {
            state.fetching = action.payload
        },
        setFormLoading: (state, action) => {
            state.formLoading = action.payload
        },
        setInsertType: (state, action) => {
            state.insertType = action.payload
        },
        setSearchKeyword: (state, action) => {
            state.searchKeyword = action.payload
        },
        setEntityUpdateId: (state, action) => {
            state.entityUpdateId = action.payload
        },
        setEntityIsUpdate: (state, action) => {
            state.entityIsUpdate = action.payload
        },
        setEditEntityData: (state, action) => {
            state.entityEditData = action.payload
        },
        setCustomerFilterData: (state, action) => {
            state.customerFilterData.name = action.payload.name
            state.customerFilterData.mobile = action.payload.mobile
        },
        setCategoryGroupFilterData: (state, action) => {
            state.categoryGroupFilterData.name = action.payload.name
        },
        setVendorFilterData: (state, action) => {
            state.vendorFilterData.name = action.payload.name
            state.vendorFilterData.mobile = action.payload.mobile
            state.vendorFilterData.company_name = action.payload.company_name
        },
        setUserFilterData: (state, action) => {
            state.userFilterData.name = action.payload.name
            state.userFilterData.mobile = action.payload.mobile
            state.userFilterData.email = action.payload.email
        },
        setDeleteMessage: (state, action) => {
            state.entityDataDelete = action.payload
        },
        setValidationData : (state,action) => {
            state.validation = action.payload
        },
        setEntityNewData: (state, action) => {
            state.entityNewData = action.payload
        },
        setWarehouseFilterData: (state, action) => {
            state.warehouseFilterData.name = action.payload.name
            state.warehouseFilterData.mobile = action.payload.mobile
            state.warehouseFilterData.location = action.payload.location
            state.warehouseFilterData.email = action.payload.email
        },

    },

    extraReducers: (builder) => {

        builder.addCase(getIndexEntityData.fulfilled, (state, action) => {
                state.indexEntityData = action.payload; // Store response data
                state.fetching = false; // Turn off fetching state
            })
            .addCase(getIndexEntityData.rejected, (state, action) => {
                state.error = action.payload; // Save error
            });

        builder.addCase(storeEntityData.fulfilled, (state, action) => {
            if ('success' === action.payload.data.message) {
                state.entityNewData = action.payload.data
                state.fetching = true;
            } else {
                state.validationMessage = action.payload.data.data
                state.validation = true
            }
        });

        builder.addCase(storeEntityData.rejected, (state, action) => {
            state.updateEntityDataForUser = action.payload; // Save or log the error data
        });

        builder.addCase(editEntityData.fulfilled, (state, action) => {
            state.entityEditData = action.payload.data.data
        })

        builder.addCase(updateEntityData.fulfilled, (state, action) => {
            state.updateEntityDataForUser = action.payload.data.data;
        });

        builder.addCase(updateEntityData.rejected, (state, action) => {
            state.updateEntityDataForUser = action.payload; // Save or log the error data
        });

        builder.addCase(updateEntityDataWithFile.fulfilled, (state, action) => {
            state.updateEntityData = action.payload.data.data
        })

        builder.addCase(showEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })

        builder.addCase(deleteEntityData.fulfilled, (state, action) => {
            state.entityDataDelete = action.payload.data.data
            state.fetching = true
        })

        builder.addCase(getStatusInlineUpdateData.fulfilled, (state, action) => {
            state.statusInlineUpdateData = action.payload.data.data
        })


    }
})

export const { setFetching, setFormLoading, setInsertType, setSearchKeyword, setEntityUpdateId, setEntityIsUpdate, setEditEntityData, setCustomerFilterData, setVendorFilterData, setUserFilterData, setValidationData, setEntityNewData, setCategoryGroupFilterData, setDeleteMessage,setWarehouseFilterData } = crudSlice.actions

export default crudSlice.reducer;