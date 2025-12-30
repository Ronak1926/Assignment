import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import topicRoutes from './routes/topicRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Behind a reverse proxy (e.g., nginx/ELB) so that req.protocol reflects HTTPS correctly
app.set('trust proxy', 1);


app.use(cors({
  origin: "https://assignment-git-master-ronak1926s-projects.vercel.app",
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Call seed function on startup (disabled after initial seeding)
// mongoose.connection.once('open', seedDatabase);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
