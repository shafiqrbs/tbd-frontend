import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getDataWithParam,
  getDataWithParamForSettingDropdown,
} from "../../services/utilityApiService.js";
import {getDataWithoutParam} from "../../services/utilityApiService";

export const getSettingDropdown = createAsyncThunk(
  "setting/select",
  async (value) => {
    try {
      const response = getDataWithParamForSettingDropdown(value);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getSettingWithoutParamDropdown = createAsyncThunk(
    "setting/select-without-param",
    async (value) => {
      try {
        const response = getDataWithoutParam(value);
        return response;
      } catch (error) {
        throw error;
      }
    }
);

export const getProductUnitDropdown = createAsyncThunk(
  "product-unit/select",
  async (value) => {
    try {
      const response = getDataWithParam(value);
      return response;
    } catch (error) {
      console.log("error", error.message);
      throw error;
    }
  }
);

export const getCurrencyDropdown = createAsyncThunk(
  "currency/select",
  async (value) => {
    try {
      const response = getDataWithParam(value);
      return response;
    } catch (error) {
      console.log("error", error.message);
      throw error;
    }
  }
);

const utilitySlice = createSlice({
  name: "utility",
  initialState: {
    isLoading: true,
    fetching: true,
    productDropdownData: [],
    accountDropdownData: [],
    motherAccountDropdownData: [],
    accountHeadDropdownData: [],
    authorizedDropdownData: [],
    businessModelDropdownData: [],
    salesProcessTypeDropdownData: [],
    currencyDropdown: [],
    productUnitDropdown: [],
    productColorDropdown: [],
    productGradeDropdown: [],
    productBrandDropdown: [],
    productSizeDropdown: [],
    moduleDropdownData: [],
    posTableData: [],
    productLocationData: [],
    utilityProductTypeDropdownData: [],
    utilityDomainTypeDropdownData: [],
    productModelDropdown: [],
    posInvoiceModeDropdownData: [],
    warehouseDropdown: [],
    settingWithoutParamDropdown: [],
  },
  reducers: {
    setFetching: (state, action) => {
      state.fetching = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getSettingDropdown.fulfilled, (state, action) => {
      if (action.payload.type === "product-type") {
        state.productDropdownData = action.payload.data.data;
        if (action.payload.url=='utility/select/setting'){
          state.utilityProductTypeDropdownData = action.payload.data.data;
        }
      }
      if (action.payload.type === "product-unit") {
        state.productUnitDropdown = action.payload.data.data;
      }
      if (action.payload.type === "domain-type") {
        state.utilityDomainTypeDropdownData = action.payload.data.data;
      }
      if (action.payload.type === "color") {
        state.productColorDropdown = action.payload.data.data;
      }
      if (action.payload.type === "product-grade") {
        state.productGradeDropdown = action.payload.data.data;
      }
      if (action.payload.type === "brand") {
        state.productBrandDropdown = action.payload.data.data;
      }
      if (action.payload.type === "table") {
        state.posTableData = action.payload.data.data;
      }
      if (action.payload.type === "location") {
        state.productLocationData = action.payload.data.data;
      }
      if (action.payload.type === "size") {
        state.productSizeDropdown = action.payload.data.data;
      }
      if (action.payload.type === "model") {
        state.productModelDropdown = action.payload.data.data;
      }

      if (action.payload.type === "account-type") {
        state.accountDropdownData = action.payload.data.data;
      }
      if (action.payload.type === "authorised-type") {
        state.authorizedDropdownData = action.payload.data.data;
      }
      if (action.payload.type === "mother-account") {
        state.motherAccountDropdownData = action.payload.data.data;
      }
      if (action.payload.type === "account-head") {
        state.accountHeadDropdownData = action.payload.data.data;
      }
      if (action.payload.type === "business-model") {
        state.businessModelDropdownData = action.payload.data.data;
      }
      if (action.payload.type === "module") {
        state.moduleDropdownData = action.payload.data.data;
      }
      if (action.payload.type === "sales-process-type") {
        state.salesProcessTypeDropdownData = action.payload.data.data;
      }
      if (action.payload.type === "pos-invoice-mode") {
        state.posInvoiceModeDropdownData = action.payload.data.data;
      }
      if (action.payload.type === "wearhouse") {
        state.warehouseDropdown = action.payload.data.data;
      }
    });

    builder.addCase(getProductUnitDropdown.fulfilled, (state, action) => {
      state.productUnitDropdown = action.payload.data;
    });

    builder.addCase(getCurrencyDropdown.fulfilled, (state, action) => {
      state.currencyDropdown = action.payload.data;
    });
    builder.addCase(getSettingWithoutParamDropdown.fulfilled, (state, action) => {
      state.settingWithoutParamDropdown = action.payload.data;
    });
  },
});

export const { setFetching, setSettingDropdownEmpty } = utilitySlice.actions;

export default utilitySlice.reducer;
