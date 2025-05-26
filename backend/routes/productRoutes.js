const express = require("express");
const Product = require("../models/product");
const { protect, admin } = require("../middleware/authMiddleware");


const router = express.Router();

/**
 * @route GET /api/products
 * @desc Get all products with optional query filters
 * @access Public
 */
router.get("/", async (req, res) => {
   try {
       const { collection, size, color, gender, minPrice, maxPrice,
           sortBy, search, category, material, brand, limit} = req.query;

       let query = {};

       if (collection && collection.toLocaleLowerCase() !== "all") {
           query.collections = collection;
       }

       if (category && category.toLocaleLowerCase() !== "all") {
           query.category = category;
       }

       if (material) {
           query.material = { $in: material.split(",") };
       }

       if (brand) {
           query.brand = { $in: brand.split(",") };
       }

       if (size) {
           query.sizes = { $in: size.split(",") };
       }

       if (color) {
           query.colors = { $in: [color] };
       }

       if (gender) {
           query.gender = gender;
       }

       if (minPrice || maxPrice) {
           query.price = {};
           if (minPrice) query.price.$gte = Number(minPrice);
           if (maxPrice) query.price.$lte = Number(maxPrice);
       }

       if (search) {
           query.$or = [
               { name: { $regex: search, $options: "i" } },
               { description: { $regex: search, $options: "i" } }
           ];
       }

       let sort = {};
       if (sortBy) {
           switch (sortBy) {
               case "priceAsc":
                   sort = { price: 1 };
                   break;
               case "priceDesc":
                   sort = { price: -1 };
                   break;
               case "popularity":
                   sort = { rating: -1 }
                   break;
           }
       }

       let products = await Product.find(query)
             .sort(sort)
             .limit(Number(limit) || 0);

       res.json(products);
   } catch (error) {
        res.status(500).send("Server Error");
   }
});

/**
 * @route GET /api/products/:id
 * @desc Get a single product by ID
 * @access Public
 */

/**
 * @route GET /api/products/best-seller
 * @desc Retrieve the product with highest rating
 * @access Public
 * */
router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });
        if (bestSeller) {
            res.json(bestSeller);
        } else {
            res.status(404).json({ message: "No best seller found" });
        }
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

/**
 * @route GET /api/products/new-arrivals
 * @desc Retrieve latest 8 products - Creation date
 * @access Public
 * */
router.get("/new-arrivals", async (req, res) => {
    try {
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
        res.json(newArrivals);
    } catch(error) {
        res.status(500).send("Server Error");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

/**
 * @route GET /api/products/similar/:id
 * @desc Retrieve similar products based on the current product's gender and category
 * @access Publish
 */
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category
        }).limit(4);

        res.json(similarProducts);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private/Admin
 */
router.post("/", protect, admin, async (req, res) => {
    try {
        // Destructure product data from request body
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        // Create a new Product instance, assigning the authenticated user's ID
        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id, // the user who creates the product (admin)
        });

        // Save the product to the database
        await product.save();

        // Return the created product
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product by ID
 * @access  Private/Admin
 */
router.put("/:id", protect, admin, async (req, res) => {
    try {
        // Destructure updated fields from request body
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        // Find product by ID
        const product = await Product.findById(req.params.id);

        if (product) {
            // Update only provided fields, fallback to existing values
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // Save the updated product
            const updatedProduct = await product.save();

            // Return updated product
            res.json(updatedProduct);
        } else {
            // If product not found, return 404
            res.status(404).json({ message: "Product not found." });
        }
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by ID
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // Find product by ID
        const product = await Product.findById(req.params.id);

        if (product) {
            // Delete the product
            await product.deleteOne();
            res.json({ message: "Product removed" });
        } else {
            // If product not found, return 404
            res.status(404).json({ message: "Product not found." });
        }
    } catch (error) {
        res.status(500).send("Server Error");
    }
});


module.exports = router;
