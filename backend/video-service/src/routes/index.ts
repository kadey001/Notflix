import express from 'express';

import { changePlan } from '../db/queries';

const router = express.Router();

router.post('/updatePlan', async (req, res, next) => {
    try {
        let userID = req.body.userID;
        let newPlan = req.body.newPlan;
        console.log("uid is " + userID + " plan is " + newPlan)
        await changePlan(userID, newPlan);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
    //console.log(name);
    //res.status(200).json({result: "The result is "+name}).send();
});

export default router;
