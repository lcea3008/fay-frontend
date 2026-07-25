// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import SiteLayout from "@/layouts/SiteLayout";
import AdminLayout from "@/layouts/AdminLayout";
import Home from "@/pages/Home";
import ProductoDetalle from "./pages/ProductoDetalle";
import Productos from "@/pages/Productos";
import Ofertas from "@/pages/Ofertas";
import Nosotros from "@/pages/Nosotros";
import Contactanos from "@/pages/Contactanos";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProductos from "@/pages/admin/AdminProductos";
import AdminOfertas from "@/pages/admin/AdminOfertas";
import AdminPopulares from "@/pages/admin/AdminPopulares";
import NotFound from "@/pages/NotFound";
import AdminCategorias from "@/pages/admin/AdminCategorias";
import AdminConfiguracion from "@/pages/admin/AdminConfiguracion";

export const router = createBrowserRouter([
    {
        element: <SiteLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/productos", element: <Productos /> },
            { path: "/productos/:slug", element: <ProductoDetalle /> },
            { path: "/ofertas", element: <Ofertas /> },
            { path: "/nosotros", element: <Nosotros /> },
            { path: "/contactanos", element: <Contactanos /> },
            { path: "*", element: <NotFound /> },
        ],
    },
    {
        path: "/fay-admin-access",
        element: <AdminLogin />,
    },
    {
        path: "/fay-admin-access",
        element: <AdminLayout />,
        children: [
            { path: "dashboard", element: <AdminDashboard /> },
            // aquí irán productos, ofertas, pedidos del admin
            { path: "/fay-admin-access/dashboard", element: <AdminDashboard /> },
            { path: "/fay-admin-access/productos", element: <AdminProductos /> },
            { path: "/fay-admin-access/ofertas", element: <AdminOfertas /> },
            { path: "/fay-admin-access/populares", element: <AdminPopulares /> },
            { path: "/fay-admin-access/categorias", element: <AdminCategorias /> },
            { path: "/fay-admin-access/configuracion", element: <AdminConfiguracion /> },
        ],
    },
]);