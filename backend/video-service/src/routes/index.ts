import express from 'express';

import { addPerson } from '../db/postgresql';

const router = express.Router();

/*router.post('/test', async (req, res, next) => {
    try {
        const { name } = req.body as { name: string };
        await addPerson(name);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});*/

router.post('/newPerson', async (req, res, next) => {
    try {
        const { name } = req.body as { name: string };
        const { email } = req.body as { email: string };
        const { password } = req.body as { password: string };
        const { planType } = req.body as { planType?: string };
        await addPerson(name,email,password,planType);
        console.log(name+", "+email+", "+password+", "+planType)
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
    //console.log(name);
    //res.status(200).json({result: "The result is "+name}).send();
});

export default router;
