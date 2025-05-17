import { Link } from "react-router-dom";


function ProductGrid({ products, loading, error }) {

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {
                    products.length > 0
                        ? products?.map((product, index) => (
                            <Link key={index} to={`/products/${product._id}`} className="block">
                                <div className="p-4">
                                    <div
                                        style={{backgroundImage: `url(${product.images[0]?.url})`}}
                                        className="w-full h-96 mb-5 bg-center bg-cover bg-no-repeat rounded-lg"
                                    />
                                    <h3 className="text-md mb-2">
                                        {product.name}
                                    </h3>
                                    <div className="text-gray-500 font-medium text-md tracking-tighter">
                                        <span className="text-gray-500">$ </span>
                                        <span className="text-black">49.99</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                        : <div>Loading...</div>
                }
            </div>
        </>
    )
}

export default ProductGrid;