import express from "express";
import  connectDB from "./config/Databse.js"
import Routes from "./Routes/authRoutes.js"
import productRoutes from "./Routes/productRoutes.js"
import CartRoutes from "./Routes/CartRoutes.js"
import AdressRoutes from './Routes/adressRoutes.js'
import oderRoutes from "./Routes/orderRoutes.js"
import cors from "cors"
const app = express();

app.use(express.json());
app.use(cors())
app.use(cors({ origin: "*" }))

app.use("/api/auth",Routes)
app.use("/api/product",productRoutes)
app.use("/api/cart",CartRoutes)
app.use("/api/address",AdressRoutes)
app.use("/api/order",oderRoutes)


connectDB()
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});