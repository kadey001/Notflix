import express from 'express';

const router = express.Router();

router.get('/login', (req, res, next) => {
    console.log('Hello');
    res.status(200).send();
});

router.post('/register', (req, res, next) => {
    console.log(req.body);
    res.status(200).json({ result: "The result" }).send();
});

export default router;