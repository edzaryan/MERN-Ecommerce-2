import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import UserLayout from "./components/Layout/UserLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/ProfilePage";
import CollectionPage from "./pages/CollectionPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import { Toaster } from "sonner";


function App() {
    return (
        <>
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
        </>
    );
}

export default App;
