import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Product from "./Pages/ProductDetails";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import ProductList from "./admin/ProductList";
import Layout from "./Layout/Layout";
import Cart from "./Pages/Cart";
import ChekoutAddress from "./Pages/ChekoutAddress";
import Chekout from "./Pages/Chekout";
import OderSuccess from "./Pages/OderSuccess";
import MyOrders from "./Pages/MyOrders"; // 1. MyOrders Component Import
import ProtectedRoute from "./Pages/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/product/:id",
        element: <Product />,
      },
      // Admin Protected Routes
      {
        path: "/admin/product",
        element: (
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/product/add",
        element: (
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/update/:id",
        element: (
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        ),
      },
      // User Checkout Routes
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/chekout",
        element: <Chekout />,
      },
      {
        path: "/checkout", // Extra safety route for spelling match
        element: <Chekout />,
      },
      {
        path: "/checkout-address",
        element: <ChekoutAddress />,
      },
      {
        path: "/order-success/:id",
        element: <OderSuccess />,
      },
      // 2. My Orders Route Added
      {
        path: "/my-orders",
        element: <MyOrders />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;