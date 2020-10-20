import express from 'express';

import { addPerson } from '../db/postgresql';

const router = express.Router();

router.post('/test', async (req, res, next) => {
    try {
        const { name } = req.body as { name: string };
        await addPerson(name);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;
