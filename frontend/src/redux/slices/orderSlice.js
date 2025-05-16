// Redux slice and async thunks to manage user orders: includes fetching user's order list and individual order details
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all orders placed by the currently logged-in user
export const fetchUserOrders = createAsyncThunk(
    "orders/fetchUserOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
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

// Async thunk to fetch details of a specific order by its ID
export const fetchOrderDetails = createAsyncThunk(
    "orders/fetchOrderDetails",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
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

// Redux slice to manage the state of orders and their details
const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],          // List of user's orders
        totalOrders: 0,      // Optional: could be used for pagination later
        orderDetails: null,  // Detailed info for a selected order
        loading: false,      // Indicates ongoing async operations
        error: null          // Stores any API error messages
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle user orders fetch lifecycle
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Handle single order detail fetch lifecycle
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    }
});

export default orderSlice.reducer;
