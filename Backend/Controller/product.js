import Product from "../model/product.js";

// ! Create A New Product

export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

//! Get All Product

export async function getProduct(req, res) {
  try {
    const { search = "", category = "", page = 1, limit = 8 } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }
    if (category) filter.category = category;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      products,
      currentPage: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum) || 1,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

//! Update Product
export async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{ returnDocument : "after" });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


//! Delete Product
export async function deleteProduct(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}