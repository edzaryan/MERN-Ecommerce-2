// Redux slice and async thunks for managing shopping cart: supports guest/user carts, localStorage sync, and server sync
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] };
}

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Async thunk to fetch cart from server for either guest or logged-in user
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async ({ userId, guestId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    params: { userId, guestId }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to add a product to the cart
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                { productId, quantity, size, color, guestId, userId }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to update the quantity of a specific cart item
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                { productId, quantity, guestId, userId, size, color }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to remove a product from the cart
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
        try {
            const response = await axios({
                method: "DELETE",
                url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                data: { productId, guestId, userId, size, color }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to merge guest cart into a logged-in user cart
export const mergeCart = createAsyncThunk(
    "cart/mergeCart",
    async ({ guestId, user }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
                { guestId, user },
                {
                    header: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice to manage cart state: product list, loading status, errors, and localStorage persistence
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error: null
    },
    reducers: {
        // Clear cart data locally and from localStorage
        clearCart: (state) => {
            state.cart = { products: [] };
            localStorage.removeItem("cart");
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch cart";
            })

            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add to cart";
            })

            // Update item quantity
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update item quantity";
            })

            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove item";
            })

            // Merge guest cart with user cart
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to merge cart";
            });
    }
});

export default cartSlice.reducer;
export const { clearCart } = cartSlice.actions;
