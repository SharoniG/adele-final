import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/store";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import ProductEdit from "./pages/ProductEdit";
import Cart from "./pages/Cart";
import Admin from "./pages/admin/Admin";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import NewProduct from "./pages/admin/NewProduct";
import Account from "./pages/Account";
import AddUser from "./pages/admin/NewUser";
import Navbar from "./components/Navbar";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const now = Date.now();

        if (parsed.expiresAt && parsed.expiresAt < now) {
          localStorage.removeItem("user");
          dispatch(setUser(null));
          toast.error("You need to log in again");
        } else {
          dispatch(setUser(parsed));
        }
      } catch (error) {
        console.error("Cant get user from local storage", error);
      }
    }
  }, [dispatch]);

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/code/:code" element={<ProductDetails />} />
          <Route path="/products/update/:code" element={<ProductEdit />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/orders" element={<OrdersAdmin />} />
          <Route path="/admin/products" element={<ProductsAdmin />} />
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path="/admin/users/new" element={<AddUser />} />
          <Route path="/admin/products/new" element={<NewProduct />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
