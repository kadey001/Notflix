import express from 'express';
import { release } from 'os';

import { addFilm, filterGenre, filterviews, filterLikes, filterKeyword, topVids, incrementView } from '../db/postgresql';

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
        const { releaseDate } = req.body as { releaseDate: Date };
        await addFilm(filmLength,filmTitle,comedyGenre,horrorGenre,actionGenre,releaseDate);
        console.log(filmTitle+", "+filmLength+", "+horrorGenre+", "+comedyGenre+", "+actionGenre+", "+releaseDate);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/filterGenre', async (req, res, next) => {
    try {
        let horrorQuery = req.query.horrorGenre;
        let comedyQuery = req.query.comedyGenre;
        let actionQuery = req.query.actionGenre;
        let horrorBool: boolean = (horrorQuery === 'true');
        let comedyBool: boolean = (comedyQuery === 'true');
        let actionBool: boolean = (actionQuery === 'true');
        await filterGenre(comedyBool,horrorBool,actionBool);
        console.log(comedyBool+", "+horrorBool+", "+actionBool);
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
        let desiredViewsQuery = req.query.desiredViews;
        let higherOrLowerQuery = req.query.higherOrLower;
        let desiredViewsInt: number = parseInt(desiredViewsQuery!);
        let higherOrLowerBool: boolean = (higherOrLowerQuery === 'true');
        await filterviews(desiredViewsInt,higherOrLowerBool);
        console.log(desiredViewsInt+", "+higherOrLowerBool);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/filterLikes', async (req, res, next) => {
    try {
        let desiredLikesQuery = req.query.desiredLikes;
        let higherOrLowerQuery = req.query.higherOrLower;
        let desiredLikesInt: number = parseInt(desiredLikesQuery!);
        let higherOrLowerBool: boolean = (higherOrLowerQuery === 'true');
        await filterLikes(desiredLikesInt,higherOrLowerBool);
        console.log(desiredLikesInt+", "+higherOrLowerBool);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/search', async (req, res, next) => {
    try {
        let desiredFilmTitle = req.query.filmTitle;
        let horrorQuery = req.query.horrorGenre;
        let comedyQuery = req.query.comedyGenre;
        let actionQuery = req.query.actionGenre;
        let horrorBool: boolean = (horrorQuery === 'true');
        let comedyBool: boolean = (comedyQuery === 'true');
        let actionBool: boolean = (actionQuery === 'true');
        let FilmString: string = desiredFilmTitle!;
        await filterKeyword(FilmString,comedyBool,horrorBool,actionBool);
        console.log();
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/topVideos', async (req, res, next) => {
    try {
        let desiredViewsQuery = req.query.desiredViews;
        let desiredVideosQuery = req.query.desiredVideos
        let desiredViewsInt: number = parseInt(desiredViewsQuery!);
        let desiredVideosInt: number = parseInt(desiredVideosQuery!);
        await topVids(desiredViewsInt,desiredVideosInt);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//Need to figure out how to make this compatible with uuid
router.post('/watchVid', async (req, res, next) => {
    try {
        let videoID = parseInt(req.query.vid!);
        //let videoID: number = videoIDQuery;
        await incrementView(videoID);
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
