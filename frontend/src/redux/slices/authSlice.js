// Redux slice and async thunks for managing user authentication and guest ID handling
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

// Check for an existing guest ID in localStorage or generate a new one
const initialGuestId =
    localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state for the auth slice
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Async thunk to log in a user
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                userData
            );

            // Persist user data and token in localStorage
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);

            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to register a new user
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                userData
            );

            // Persist user data and token in localStorage
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);

            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice to manage authentication state (login, registration, logout, guest ID)
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Logs out the user and resets to guest state
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId);
        },
        // Generates a new guest ID manually (if needed)
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        }
    },
    extraReducers: (builder) => {
        builder
            // Login handlers
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // Registration handlers
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    }
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
