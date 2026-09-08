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
import MyOrders from "./Pages/MyOrders";
import ProtectedRoute from "./Pages/ProtectedRoute";
import ForgotPassword from "./Pages/ForgotPassword";

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
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },

      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },

      {
        path: "/product/:id",
        element: (
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        ),
      },

      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },

      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Chekout />
          </ProtectedRoute>
        ),
      },

      {
        path: "/chekout",
        element: (
          <ProtectedRoute>
            <Chekout />
          </ProtectedRoute>
        ),
      },

      {
        path: "/checkout-address",
        element: (
          <ProtectedRoute>
            <ChekoutAddress />
          </ProtectedRoute>
        ),
      },

      {
        path: "/order-success/:id",
        element: (
          <ProtectedRoute>
            <OderSuccess />
          </ProtectedRoute>
        ),
      },

      {
        path: "/my-orders",
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        ),
      },

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