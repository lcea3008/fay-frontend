import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ToastContainer from "@/components/ui/ToastContainer";

export default function SiteLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
            <CartDrawer />
            <ToastContainer />
        </>
    );
}