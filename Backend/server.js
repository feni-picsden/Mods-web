import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import modsRoutes from './routes/mods.routes.js';
import contactRoutes from './routes/contact.routes.js';
import sitemapRoutes from './routes/sitemap.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.send('🚀 Mods API is running!');
});

app.use('/api/mods', modsRoutes);
app.use('/api/contact', contactRoutes); 
app.use('/sitemap.xml', sitemapRoutes);

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://192.168.29.13:${PORT}`);
});