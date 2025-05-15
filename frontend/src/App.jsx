import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import UserManagement from "./components/Admin/UserManagement.jsx";
import ProductManagement from "./components/Admin/ProductManagement.jsx";
import EditProductPage from "./components/Admin/EditProductPage.jsx";
import OrderManagement from "./components/Admin/OrderManagement.jsx";
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx";
import { Toaster } from "sonner";

import { Provider } from "react-redux";
import store from "./redux/store";


function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="collections/:collection" element={<CollectionPage />} />
                        <Route path="products/:id" element={<ProductDetailsPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route path="order-confirmation" element={<OrderConfirmationPage />} />
                        <Route path="order/:id" element={<OrderDetailsPage />} />
                        <Route path="my-orders" element={<MyOrdersPage />} />
                    </Route>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminHomePage />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="products/:id/edit" element={<EditProductPage />} />
                        <Route path="orders" element={<OrderManagement />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App
