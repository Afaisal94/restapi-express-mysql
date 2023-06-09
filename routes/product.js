const express = require("express");
const router = express.Router();

const Product = require("../controllers/Product");

router.get("/", Product.getProducts);
router.get("/:id", Product.getProductById);
router.post("/", Product.createProduct);
router.put("/:id", Product.updateProduct);
router.delete("/:id", Product.deleteProduct);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - image
 *         - categoryId
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto Increament
 *         name:
 *           type: string
 *           description: Product name
 *         price:
 *           type: string
 *           description: Product price
 *         image:
 *           type: string
 *           format: binary
 *           description: Product image
 *         categoryId:
 *           type: string
 *           description: Product Category
 *       example:
 *         id: 1
 *         name: Shirt
 *         price: 50000
 *         image: shirt.jpg
 *         categoryId: 1
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description:
 */

// GET ALL
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all product
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

// GET BY ID
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The products id
 *     responses:
 *       200:
 *         description: The products description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The products was not found
 */

// CREATE PRODUCT
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */

// UPDATE PRODUCT BY ID
/**
 * @swagger
 * /products/{id}:
 *  put:
 *    summary: Update product by id
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: The product was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: The product was not found
 *      500:
 *        description: Some error happened
 */

// DELETE PRODUCT
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *
 *     responses:
 *       200:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 */

module.exports = router;
