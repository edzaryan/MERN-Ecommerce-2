import Hero from "../components/Layout/Hero.jsx";
import GenderCollectionSection from "../components/Products/GenderCollectionSection.jsx";
import NewArrivals from "../components/Products/NewArrivals.jsx";
import ProductDetailsPage from "./ProductDetailsPage.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import FeaturedCollection from "../components/Products/FeaturedCollection.jsx";
import FeaturesSection from "../components/Products/FeaturesSection.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchProductsByFilters} from "../redux/slices/productsSlice.js";
import axios from "axios";


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
            {bestSellerProduct ? (
                <ProductDetailsPage productId={bestSellerProduct._id} />
            ) : (
                <p className="text-center">Loading best seller product...</p>
            )}

            <div className="container mx-auto">
                <h2 className="text-3xl text-center font-bold mb-4">Top Wears for Women</h2>
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