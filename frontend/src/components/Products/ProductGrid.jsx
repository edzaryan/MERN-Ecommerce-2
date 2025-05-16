import { Link } from "react-router-dom";


function ProductGrid({ products, loading, error }) {

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {
                products.length > 0
                    ? products?.map((product, index) => (
                        <Link key={index} to={`/products/${product._id}`} className="block">
                            <div className="bg-white p-4 rounded-lg">
                                <div className="w-full h-96 mb-4">
                                    <img
                                        src={product.images[0].url}
                                        alt={product.images[0].altText || product.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="text-sm mb-2">{product.name}</h3>
                                <div className="text-gray-500 font-medium text-sm tracking-tighter">
                                    $ {product.price}
                                </div>
                            </div>
                        </Link>
                    ))
                    : <div>Loading...</div>
            }
        </div>
    )
}

export default ProductGrid;