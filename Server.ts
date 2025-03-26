const express = require("express");
const cors = require("cors");
const dotenv  = require('dotenv');
const connectDB = require("./src/db/connectDB");
const mongoose = require("mongoose");
const authRouters = require('./src/routes/authRoutse'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api', authRouters);

connectDB();
