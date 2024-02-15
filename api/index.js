import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
 dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('DB connected');
    }
    ).catch((err) => {
        console.log(err);
    });

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000       !!! jai shree ram');
    }); 

app.use("/api/user",userRouter);
app.use("/api/auth",authRoutes);
