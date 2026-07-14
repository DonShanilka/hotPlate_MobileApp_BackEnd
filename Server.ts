import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";

import userRoutes from "./src/modules/user/user.routes";
import restaurantRoutes from "./src/modules/restaurant/restaurant.routes";

const itemRoutes = require("./src/routes/itemRoutse");
const orderRoutes = require("./src/routes/orderRoutse");

const app = express();

const mongoUrl = "mongodb://localhost:27017/HotPlate";

// CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});

// Middleware
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Required for multipart/form-data
app.use(
  fileUpload({
    createParentPath: true,
    parseNested: true,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  }),
);

// MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
app.use("/api", itemRoutes);
app.use("/api", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resturent", restaurantRoutes);

// Start Server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
