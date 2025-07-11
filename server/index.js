import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import morgan from "morgan";
import categoryRoutes from './routes/category.js';

dotenv.config();

const app = express();

//db
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("DB connected"))
.catch((err)=> console.log("DB Error => ", err));

//middlewares
app.use(morgan("dev"));
app.use(express.json());

//router middleware
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);

const port =  process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Node server is running on port ${port}`);
});

