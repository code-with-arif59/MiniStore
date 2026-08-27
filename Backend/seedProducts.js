import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/product.js";

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    await Product.deleteMany({}); // DB clear

    // 100+ items API se fetch karke auto generate honge
    const res = await fetch("https://dummyjson.com/products?limit=300");
    const data = await res.json();

    const formattedProducts = data.products.map((item) => ({
      title: item.title,
   price: Math.round(item.price * 20),
      description: item.description,
      category: item.category,
      stock: item.stock || 15,
      image: item.thumbnail,
    }));

    await Product.insertMany(formattedProducts);
    console.log("✅ 300+   Add Products in Database!");
    process.exit(0);
  } catch (error) {
    console.log("❌ Error:", error);
    process.exit(1);
  }
}

seedData();