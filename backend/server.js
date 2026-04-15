import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// SCHEMA
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
});

const Product = mongoose.model("Product", ProductSchema);

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ADD PRODUCT
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE PRODUCT
app.put("/api/products/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.listen(5000, () => console.log("Server running on port 5000"));