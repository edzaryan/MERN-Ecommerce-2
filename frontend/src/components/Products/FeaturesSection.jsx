import { HiOutlineShoppingBag } from "react-icons/hi";
import { HiMiniArrowPathRoundedSquare } from "react-icons/hi2";
import { CgCreditCard } from "react-icons/cg";


function FeaturesSection() {
    return (
        <section className="py-16 px-4">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 text-center">
                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full mb-2">
                        <HiOutlineShoppingBag className="text-4xl" />
                    </div>
                    <h4 className="tracking-tighter mb-2">FREE INTERNATIONAL SHIPPING</h4>
                    <div className="text-gray-600 text-sm tracking-tighter">On all orders over $100.00</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full mb-2">
                        <HiMiniArrowPathRoundedSquare className="text-4xl" />
                    </div>
                    <h4 className="tracking-tighter mb-2">45 DAYS RETURN</h4>
                    <div className="text-gray-600 text-sm tracking-tighter">Money back guarantee</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full mb-2">
                        <CgCreditCard className="text-4xl" />
                    </div>
                    <h4 className="tracking-tighter mb-2">SECURE CHECKOUT</h4>
                    <div className="text-gray-600 text-sm tracking-tighter">100% secured checkout process</div>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection;