import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Category";
import AddCategory from "./components/form/AddCategory";
import Brands from "./pages/Brand";
import AddBrand from "./components/form/AddBrand";
import Orders from "./pages/Orders";
import Clients from "./pages/Clients";
import AddClient from "./components/form/AddClient";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import BannerList from "./components/listing/BannerList";
import AddBanner from "./components/form/AddBanner";
import RentList from "./components/listing/RentList";
import AddRent from "./components/form/AddRent";
import SaleList from "./components/listing/SaleList";
import AddSale from "./components/form/AddSale";
import ServiceList from "./components/listing/ServiceList";
import AddService from "./components/form/AddService";
import AboutusListing from "./components/listing/AboutusListing";
import Login from "./pages/Login";
import AddAboutUs from "./components/form/AddAboutUs";
import RequestQuotationListing from "./components/listing/RequestQuotationListing";
import Career from "./pages/Career";
import AddCareer from "./components/form/AddCareer";
import useAuthStore from "./Context/AuthContext";
import { useEffect, useState } from "react";
import ProductForm from "./components/formComponet/ProductForm";
import OrderDetail from "./pages/OrderDetail";

function App() {
  const { accessToken, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    setIsLoading(false);
  }, [initializeAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {accessToken ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products">
              <Route index element={<Products />} />
              <Route path="add" element={<ProductForm />} />
              <Route path="edit/:id" element={<ProductForm />} />
            </Route>
            <Route path="categories" element={<Categories />} />
            <Route path="categories/add" element={<AddCategory />} />

            <Route path="brands" element={<Brands />} />
            <Route path="brands/add" element={<AddBrand />} />
            <Route path="orders" element={<Orders />} />
            <Route path = "order/:id" element={<OrderDetail />} />
            <Route path="orders/quotation" element={<RequestQuotationListing />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/add" element={<AddClient />} />
            <Route path="banner" element={<BannerList />} />
            <Route path="banner/add" element={<AddBanner />} />
            <Route path="rent" element={<RentList />} />
            <Route path="rent/add" element={<AddRent />} />
            <Route path="sale" element={<SaleList />} />
            <Route path="sale/add" element={<AddSale />} />
            <Route path="service" element={<ServiceList />} />
            <Route path="service/add" element={<AddService />} />
            <Route path="about" element={<AboutusListing />} />
            <Route path="about/add" element={<AddAboutUs />} />
            <Route path="career" element={<Career />} />
            <Route path="career/add" element={<AddCareer />} />
            {/* Catch-all route for authenticated users */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;