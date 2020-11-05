import express from 'express';

import { addFilm } from '../db/postgresql';

const router = express.Router();

/*router.get('/video/:id', (req, res, next) => {
    const { id } = req.params; // Get video id from params
    res.status(200).send();
});*/

router.get('/watch/', (req, res, next) => {
    //const { videoID } = req.query.videoID; // Get video id from params
    const videoID = req.query.videoID;
    console.log("does this print to our terminal or post "+videoID);
    console.log("This is our comment ID with console dir "+req.query.commentID);
    //res.status(200).json({result: "The result of id is "+req.params.id}).send();
    res.status(200).send();
});

/*router.get('/test', (req, res, next) => {
    console.log('TEST');
    res.status(200).send();
});*/

router.post('/test', (req, res, next) => {
        const { name } = req.body as { name: string };
        console.log(name);
        res.status(200).json({result: "The result is "+name}).send();
});


//is user making vid or we generate one here and pass it into query?
router.post('/newfilm', async (req, res, next) => {
    try {
        const { filmTitle } = req.body as { filmTitle: string };
        const { filmLength } = req.body as { filmLength: number };
        const { horrorGenre } = req.body as { horrorGenre: boolean };
        const { comedyGenre } = req.body as { comedyGenre: boolean };
        const { actionGenre } = req.body as { actionGenre: boolean };
        //await addFilm(filmLength,filmTitle,actionGenre,horrorGenre,comedyGenre);
        console.log(filmTitle+", "+filmLength+", "+horrorGenre+", "+comedyGenre+", "+actionGenre);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/filterGenre', async (req, res, next) => {
    try {
        let horrorGenre = req.query.horrorGenre;
        let comedyGenre = req.query.comedyGenre;
        let actionGenre = req.query.actionGenre;
        //await filterGenre(actionGenre,horrorGenre,comedyGenre);
        console.log(horrorGenre+", "+comedyGenre+", "+actionGenre);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

/*router.get('/video/:id', (req, res, next) => {
    const { id } = req.params; // Get video id from params
    res.status(200).send();
});*/

router.get('/filterViews', async (req, res, next) => {
    try {
        let desiredViews = req.query.desiredViews
        let higherOrLower = req.query.higherOrLower
        //await filterGenre(actionGenre,horrorGenre,comedyGenre);
        console.log(desiredViews+", "+higherOrLower);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/filterLikes', async (req, res, next) => {
    try {
        let desiredLikes = req.query.desiredLikes
        let higherOrLower = req.query.higherOrLower
        //await filterGenre(actionGenre,horrorGenre,comedyGenre);
        console.log(desiredLikes+", "+higherOrLower);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

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

export default router;
