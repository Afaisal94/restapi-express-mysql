const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET ALL
const getProducts = async (req, res) => {
  const name = req.query.name || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const offset = (page - 1) * limit;
  try {
    const products = await prisma.product.findMany({
      where : { 
        name: { 
          contains: name, 
        } 
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });
    const totalProducts = await prisma.product.findMany({
      where : { 
        name: { 
          contains: name, 
        } 
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ message: "No File Uploaded" });

  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ message: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ message: err.message });
    try {      
      const product = await prisma.product.create({
        data: {
          name: req.body.name,
          price: req.body.price,
          image: fileName,
          imageUrl: url,
          categoryId: parseInt(req.body.categoryId),
        },
      })
      res.status(201).json({
        message: "Product Created Successfuly",
        data: product,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const updateProduct = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (!product) return res.status(404).json({ message: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Image must be less than 5 MB" });

    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ message: err.message });
    });
  }

  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {    
    const updateProduct = await prisma.product.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: req.body.name,
        price: req.body.price,
        image: fileName,
        imageUrl: url,
        categoryId: parseInt(req.body.categoryId),
      },
    })
    res.status(200).json({ 
      message: "Product Updated Successfuly", 
      data: updateProduct 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (!product) return res.status(404).json({ message: "No Data Found" });

  try {
    // Delete old image
    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    await prisma.product.delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    res.status(200).json({ message: "Product Deleted Successfuly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
