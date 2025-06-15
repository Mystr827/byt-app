import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import houseRoutes from './routes/houses.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/houses', houseRoutes);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/byt';

async function start() {
  await mongoose.connect(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(err => console.error(err));
