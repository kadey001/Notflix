import express from 'express';

import { addPerson } from '../db/postgresql';

const router = express.Router();

router.get('/video/:id', (req, res, next) => {
    const { id } = req.params; // Get video id from params
    res.status(200).send();
});

export default router;
