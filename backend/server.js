import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';

dotenv.config();
const app = express();
const port = process.env.port || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

//API endpoints
app.use('/api/admin', adminRouter);
// localhost:4000/api/admin

app.get('/', (req, res) => {
  res.send('Hello from server');
});

app.listen(port, () => {
  console.log('Server listening on port', port);
});
