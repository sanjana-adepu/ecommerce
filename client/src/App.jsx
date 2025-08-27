import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Toaster} from "react-hot-toast";
import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Menu from "./components/nav/Menu.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import PrivateRoute from './components/routes/PrivateRoute.jsx';
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminRoute from './components/routes/AdminRoute.jsx';
import AdminCategory from "./pages/admin/Category.jsx";
import AdminProduct from "./pages/admin/Product.jsx";
import UserProfile from "./pages/user/Profile.jsx";
import UserOrders from "./pages/user/Orders.jsx";
import AdminProducts from './pages/admin/Products.jsx';
import AdminProductUpdate from './pages/admin/productUpdate.jsx';
import Shop from './pages/Shop.jsx';
import Search from './pages/Search.jsx';
import ProductView from './pages/ProductView.jsx';
import CategoriesList from './pages/CategoriesList.jsx';
import CategoryView from './pages/CategoryView.jsx';
import Cart from './pages/Cart.jsx';

const PageNotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">404 | Page not found</div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Menu/>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/category/:slug" element={<CategoryView />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:slug" element={<ProductView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />       
        <Route path="/dashboard">
        <Route element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<UserProfile />} />
          <Route path="user/orders" element={<UserOrders />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/category" element={<AdminCategory />} />
          <Route path="admin/product" element={<AdminProduct />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/product/update/:slug" element={<AdminProductUpdate />} />
        </Route>
      </Route>
        <Route path="*" element={<PageNotFound/>} replace/>
      </Routes>
    </BrowserRouter>
  )
}

