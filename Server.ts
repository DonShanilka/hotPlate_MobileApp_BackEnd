import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./src/modules/user/user.routes";
import restaurantRoutes from "./src/modules/restaurant/restaurant.routes";
import menuRoutes from "./src/modules/menu/menu.routes"
import driverRoutes from "./src/modules/driver/driver.routes";
import orderRoutes from "./src/modules/order/order.routes";
import trackingRoutes from "./src/modules/tracking/tracking.routes";
import { registerTrackingSocket } from "./src/modules/tracking/tracking.socket";

const app = express();

const mongoUrl = "mongodb://localhost:27017/HotPlate";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Development only
    methods: ["GET", "POST", "PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  registerTrackingSocket(io, socket);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

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
// app.use("/api", itemRoutes);
// app.use("/api", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resturent", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/tracking",trackingRoutes);

// Start Server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
