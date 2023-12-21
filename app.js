// Import required modules
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

// Create an Express app
const app = express();
const port = 3000;

// Connect to MongoDB database
mongoose.connect("mongodb://localhost:27017/sample", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err);
});

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Define the product schema
const schema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

// Create a model based on the schema
const Product = new mongoose.model("product", schema);

// Route to create a new product
app.post("/api/v1/product/new", async (req, res) => {
    try {
        // Create a new product using the request body
        const product = await Product.create(req.body);

        // Respond with a success message and the created product
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error(error);
        // Handle errors and respond with an error message
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// Route to get all products
app.get("/api/v1/products", async (req, res) => {
    try {
        // Retrieve all products from the database
        const products = await Product.find();

        // Respond with a success message and the list of products
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error(error);
        // Handle errors and respond with an error message
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// Route to update a product by ID
app.put("/api/v1/product/:id", async (req, res) => {
    try {
        // Find the product by ID
        let product = await Product.findById(req.params.id);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Update the product and return the updated document
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        // Respond with a success message and the updated product
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error(error);
        // Handle errors and respond with an error message
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// Route to delete a product by ID
app.delete("/api/v1/product/:id", async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete the product by ID
        await Product.deleteOne({ _id: req.params.id });

        // Respond with a success message
        res.status(200).json({
            success: true,
            message: "Product is deleted"
        });
    } catch (error) {
        console.error(error);
        // Handle errors and respond with an error message
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
