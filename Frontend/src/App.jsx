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
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/chekout",
        element: <Chekout />,
      },
      {
        path: "/checkout", 
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
    
      {
        path: "/my-orders",
        element: <MyOrders />,
      },

        {
        path: "/forgot-password",
        element: <ForgotPassword />,
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