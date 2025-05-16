import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetailsPage from "./ProductDetailsPage";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";


function HomePage() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const [bestSellerProduct, setBestSellerProduct] = useState(null);

    useEffect(() => {
        dispatch(
          fetchProductsByFilters({
              gender: "Women",
              category: "Bottom Wear",
              limit: 8
          })
        );

        const fetchBestSeller = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
                );
                setBestSellerProduct(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchBestSeller();

    }, [dispatch]);

    return (
        <div>
            <Hero />
            <GenderCollectionSection />
            <NewArrivals />

            <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
            <div className="mb-20">
                {bestSellerProduct ? (
                    <ProductDetailsPage productId={bestSellerProduct._id} />
                ) : (
                    <div className="text-center">Loading best seller products...</div>
                )}
            </div>

            <div className="container mx-auto mb-20">
                <h2 className="text-3xl text-center font-bold mb-10">Top Wears for Women</h2>
                <ProductGrid
                    products={products}
                    loading={loading}
                    error={error}
                />
            </div>
            <FeaturedCollection />
            <FeaturesSection />
        </div>
    )
}

export default HomePage;