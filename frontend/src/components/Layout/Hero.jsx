import heroImg from "../../assets/rabbit-hero.jpg";
import { Link } from "react-router-dom";


function Hero() {
    return (
        <>
            <section
                style={{backgroundImage: `url(${heroImg})`}}
                className="relative w-full h-[400px] md:h-[600px] lg:h-[750px] bg-top bg-cover bg-no-repeat">
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                        <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter uppercase mb-4
                    text-shadow-custom tracking-tightest">
                            Wear Your <br/> Confidence
                        </h1>
                        <p className="md:text-xl xl:text-2xl tracking-tighter mb-14 text-shadow-custom">
                            Elevate your style with our latest arrivals and everyday essentials.
                        </p>
                        <Link to="#" className="text-gray-950 px-7 py-3 rounded-sm text-lg shadow-md bg-white
                            hover:bg-gray-100 transition duration-150">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero;