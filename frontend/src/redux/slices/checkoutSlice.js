// Redux slice and async thunk for managing the checkout process, including session creation with backend integration
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create a checkout session on the server
export const createCheckout = createAsyncThunk(
    "checkout/createCheckout",
    async (checkoutdata, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutdata,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Redux slice to manage checkout-related state (session, loading, and errors)
const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,  // Stores checkout session details
        loading: false,  // Indicates loading state during async call
        error: null      // Captures error messages from API
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload; // Store checkout session data
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message; // Set error if API fails
            });
    }
});

export default checkoutSlice.reducer;
