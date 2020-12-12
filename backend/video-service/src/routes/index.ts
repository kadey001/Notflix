import express from 'express';
import { UserInfo } from 'os';

import { addPerson,changePlan, Auth } from '../db/postgresql';

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
        const userInfo = req.body as Auth;
        console.log(userInfo.username);
        if(!userInfo.email || !userInfo.password || !userInfo.username)
        {
            res.status(400).send('Missing Some User Information');
            return;
        }
        await addPerson(userInfo);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/updatePlan', async (req, res, next) => {
    try {
        let userID = req.body.userID;
        let newPlan = req.body.newPlan;
        console.log("uid is "+userID+" plan is "+newPlan)
        await changePlan(userID,newPlan);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
    //console.log(name);
    //res.status(200).json({result: "The result is "+name}).send();
});

export default router;
