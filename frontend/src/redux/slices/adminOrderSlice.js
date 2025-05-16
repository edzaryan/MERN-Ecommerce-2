// Redux slice and async thunks to manage admin order operations: fetch all orders, update status, and delete orders
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all orders for admin view
export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
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

// Async thunk to update the delivery status of an order by ID
export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                { status },
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

// Async thunk to delete an order by ID via the admin API
export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                }
            );

            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice to manage admin order state: list of orders, loading/error state, total orders, and total sales
const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;

                // Calculate total sales from order list
                const totalSales = action.payload.reduce((acc, order) => {
                    return acc + order.totalPrice;
                }, 0);

                state.totalSales = totalSales;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const orderIndex = state.orders.findIndex(
                    order => order._id === updatedOrder._id
                );

                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(
                    order => order._id !== action.payload
                );
            });
    }
});

export default adminOrderSlice.reducer;
