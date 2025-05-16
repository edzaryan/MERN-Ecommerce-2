// Redux slice and async thunks for managing admin product operations: fetch, create, update, and delete
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// Async thunk to fetch all products for the admin dashboard
export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async () => {
        const response = await axios.get(`${API_URL}/api/admin/products`, {
            headers: {
                Authorization: USER_TOKEN
            }
        });

        return response.data;
    }
);

// Async thunk to create a new product via the admin API
export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData) => {
        const response = await axios.post(
            `${API_URL}/api/admin/products`,
            productData,
            {
                headers: {
                    Authorization: USER_TOKEN
                }
            }
        );

        return response.data;
    }
);

// Async thunk to update an existing product by ID via the admin API
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }) => {
        const response = await axios.put(
            `${API_URL}/api/admin/products/${id}`,
            productData,
            {
                headers: {
                    Authorization: USER_TOKEN
                }
            }
        );

        return response.data;
    }
);

// Async thunk to delete a product by ID via the admin API
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id) => {
        await axios.delete(`${API_URL}/api/products/${id}`, {
            headers: { Authorization: USER_TOKEN }
        });

        return id;
    }
);

// Slice to manage admin product state: list of products, loading, and error states
const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(
                    product => product._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    product => product._id !== action.payload
                );
            });
    }
});

export default adminProductSlice.reducer;
