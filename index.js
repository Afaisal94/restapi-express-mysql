const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const FileUpload = require("express-fileupload");
const PORT = process.env.PORT || 5000;

// Start Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "REST API using Node js, Express & MySQL (Prisma ORM)",
		},
		servers: [
			{
				url: "http://localhost:5000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// End Swagger

app.use(morgan("dev"));
app.use(FileUpload());
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Import Routes
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

app.get("/", (req, res) => {
  res.send("Build REST API using Node js, Express & MySQL (Prisma ORM)");
});
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
