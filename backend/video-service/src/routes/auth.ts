import express from 'express';

const router = express.Router();

router.get('/login', (req, res, next) => {
    console.log('TEST');
    res.status(200).send();
});

export default router;