import { Link } from "react-router-dom";
import featured from "../../assets/featured.webp";


function FeaturedCollection() {
    return (
        <>
            <section className="lg:px-0">
                <div className="lg:container mx-auto flex flex-col-reverse lg:flex-row bg-gray-50 lg:rounded-lg">
                    <div className="lg:w-1/2 px-14 py-12 sm:py-12 md:py-12 lg:py-34 text-center lg:text-left">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Comfort and Style</h2>
                        <h2 className="text-2xl md:text-4xl font-bold mb-6">Apparel made for your everyday life</h2>
                        <div className="text-lg text-gray-600 mb-10">
                            Discover high-quality, comfortable clothing that effortlessly blends
                            fashion and function. Designed to make you look and feel great every day.
                        </div>
                        <Link
                            to="/collections/all"
                            className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800">
                            Show Now
                        </Link>
                    </div>
                    <div
                        className="h-[300px] md:h-[400px] lg:h-auto lg:w-1/2 relative overflow-hidden
                        lg:rounded-tr-lg lg:rounded-br-lg bg-top bg-cover bg-no-repeat"
                        style={{backgroundImage: `url(${featured})`}}
                    />
                </div>
            </section>
        </>
    )
}

export default FeaturedCollection;