import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from "./src/db/connectDB";
import authRouters from "./src/routes/authRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRouters);

connectDB();
