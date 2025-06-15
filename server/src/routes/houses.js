import { Router } from 'express';
import House from '../models/House.js';

const router = Router();

router.get('/', async (req, res) => {
  const houses = await House.find();
  res.json(houses);
});

router.post('/', async (req, res) => {
  const house = new House(req.body);
  await house.save();
  res.json(house);
});

export default router;
