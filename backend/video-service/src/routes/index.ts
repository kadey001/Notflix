import express from 'express';
import authRoutes from './auth';
import videoRoutes from './video';

import { changePlan } from '../db/queries';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/video', videoRoutes);

export default router;
