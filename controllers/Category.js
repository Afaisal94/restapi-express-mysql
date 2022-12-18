const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCategories = async (req, res) => {
  const name = req.query.name || "";
  try {
    const categories = await prisma.category.findMany({
      where : { 
        name: { 
          contains: name, 
        } 
      },
      orderBy: [
        {
          name: 'asc',
        },
      ],
    })
    res.status(200).json({
      categories: categories,
      total_categories: categories.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const response = await prisma.category.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    })
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const name = req.body.name;
  try {
    const category = await prisma.category.create({
      data: {
        name: name,
      },
    })
    res.status(201).json({
      message: "Category Created Successfuly",
      data: category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (!category) return res.status(404).json({ message: "No Data Found" });

  const name = req.body.name;

  try {
    await prisma.category.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: name,
      },
    })
    res.status(201).json({ message: "Category Updated Successfuly" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (!category) return res.status(404).json({ message: "No Data Found" });

  try {
    await prisma.category.delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    res.status(200).json({ message: "Category Deleted Successfuly" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
