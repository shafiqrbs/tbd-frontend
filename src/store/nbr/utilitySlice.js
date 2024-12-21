import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getDataWithParamForNbrDropdown,
} from "../../services/nbrApiService.js";

export const getNbrDropdown = createAsyncThunk(
  "nbr/select",
  async (value) => {
    try {
      const response = getDataWithParamForNbrDropdown(value);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const utilitySlice = createSlice({
  name: "utility",
  initialState: {
    isLoading: true,
    fetching: true,
    tariffDropdown: [],
  },
  reducers: {
    setFetching: (state, action) => {
      state.fetching = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getNbrDropdown.fulfilled, (state, action) => {

      if (action.payload.type === "tariff") {
        state.tariffDropdown = action.payload.data.data;
      }
    });
  },
});

export const { setFetching, setSettingDropdownEmpty } = utilitySlice.actions;

export default utilitySlice.reducer;
