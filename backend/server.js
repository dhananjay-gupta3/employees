import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import connectDB from './config/db.js';
import employee from './routes/employee.js'
const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json())

connectDB()

app.use('/api', employee)

app.listen(5000, () => console.log("Server running on port 5000"));