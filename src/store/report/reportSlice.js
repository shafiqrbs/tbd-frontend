import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getDataWithoutParam,
    getDataWithParam, showData,
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

export const showEntityData = createAsyncThunk("show", async (value) => {
    try {
        const response = showData(value);
        return response;
    } catch (error) {
        console.log('error', error.message);
        throw error;
    }
});


const reportSlice = createSlice({
    name: "report",
    initialState: {
        productionIssueFilterData: { month:'',year:'',start_date:'',end_date:''},
        productionIssueWarehouseFilterData: { warehouse_id:'',month:'',year:'',start_date:'',end_date:''},
        inventoryStockItemHistoryFilterData: { warehouse_id:'',start_date:'',end_date:'',stock_item_id:''},
        inventorySalesFilterData: { month:'',year:''},
        inventorySalesWarehouseFilterData: { warehouse_id:'',month:'',year:''},
    },
    reducers: {
        setInventorySalesFilterData: (state, action) => {
            state.inventorySalesFilterData.month = action.payload.month
            state.inventorySalesFilterData.year = action.payload.year
        },
        setInventorySalesWarehouseFilterData: (state, action) => {
            state.inventorySalesWarehouseFilterData.month = action.payload.month
            state.inventorySalesWarehouseFilterData.year = action.payload.year
            state.inventorySalesWarehouseFilterData.warehouse_id = action.payload.warehouse_id
        },
        setInventoryStockItemHistoryFilterData: (state, action) => {
            state.inventoryStockItemHistoryFilterData.start_date = action.payload.start_date
            state.inventoryStockItemHistoryFilterData.end_date = action.payload.end_date
            state.inventoryStockItemHistoryFilterData.warehouse_id = action.payload.warehouse_id
            state.inventoryStockItemHistoryFilterData.stock_item_id = action.payload.stock_item_id
        },
        setProductionIssueFilterData: (state, action) => {
            state.productionIssueFilterData.month = action.payload.month
            state.productionIssueFilterData.year = action.payload.year
            state.productionIssueFilterData.start_date = action.payload.start_date
            state.productionIssueFilterData.end_date = action.payload.end_date
            state.productionIssueFilterData.warehouse_id = action.payload.warehouse_id
        },
        setProductionIssueWarehouseFilterData: (state, action) => {
            state.productionIssueWarehouseFilterData.month = action.payload.month
            state.productionIssueWarehouseFilterData.year = action.payload.year
            state.productionIssueWarehouseFilterData.warehouse_id = action.payload.warehouse_id
            state.productionIssueFilterData.start_date = action.payload.start_date
            state.productionIssueFilterData.end_date = action.payload.end_date
        }

    },

    extraReducers: (builder) => {

        builder.addCase(getIndexEntityData.fulfilled, (state, action) => {
                state.indexEntityData = action.payload; // Store response data
                state.fetching = false; // Turn off fetching state
            })
            .addCase(getIndexEntityData.rejected, (state, action) => {
                state.error = action.payload; // Save error
            });

        builder.addCase(showEntityData.fulfilled, (state, action) => {
            state.showEntityData = action.payload.data.data
        })
    }
})

export const { setProductionIssueFilterData,setProductionIssueWarehouseFilterData,setInventorySalesWarehouseFilterData,setInventorySalesFilterData,setInventoryStockItemHistoryFilterData} = reportSlice.actions

export default reportSlice.reducer;