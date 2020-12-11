import express from 'express';
import { release } from 'os';

import { addFilm, filterGenre, filterviews, filterLikes, filterKeyword, topVids, incrementView, Genres, MovieInfo, Auth } from '../db/postgresql';

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

const parseGenres = (genres: Genres) => {
    if (!genres.action)
        genres.action = false;
    if (!genres.comedy)
        genres.comedy = false;
    if (!genres.drama)
        genres.drama = false;
    if (!genres.fantasy)
        genres.fantasy = false;
    if (!genres.documentary)
        genres.documentary = false;
    if (!genres.horror)
        genres.horror = false;
}

//is user making vid or we generate one here and pass it into query?
router.post('/newfilm', async (req, res, next) => {
    try {
        // const { title, description, length } = req.body as AddMovieRequest;
        const movieInfo = req.body as MovieInfo;
        if (!movieInfo.title || !movieInfo.length) {
            res.status(400).send('Undefined Movie Info');
            return;
        }
        let { released } = req.body as { released: string };
        if (released === '') {
            released = Date.toString();
        }
        movieInfo.releaseDate = new Date();
        parseGenres(movieInfo);
        console.log(movieInfo);
        await addFilm(movieInfo);
        // Maybe get back vid from addFilm call and return so that put webhdfs call can be made on front end (easier with fs)
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }


        /*
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
    }*/
});

router.get('/filterGenre', async (req, res, next) => {
    try {
        const genreInfo = req.body as Genres;
        parseGenres(genreInfo);
        await filterGenre(genreInfo);
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
        let desiredViewsQuery = req.body.desiredViews;
        let higherOrLowerQuery = req.body.higherOrLower;
        await filterviews(desiredViewsQuery,higherOrLowerQuery);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/filterLikes', async (req, res, next) => {
    try {
        let desiredLikesQuery = req.body.desiredLikes;
        let higherOrLowerQuery = req.body.higherOrLower;
        await filterLikes(desiredLikesQuery,higherOrLowerQuery);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});
//
router.get('/search', async (req, res, next) => {
    try {
        let desiredFilmTitle = req.body.filmTitle.toLowerCase();
        const genreInfo = req.body as Genres;
        delete genreInfo.filmTitle;
        parseGenres(genreInfo);
        await filterKeyword(desiredFilmTitle,genreInfo);
        console.log();
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/topVideos', async (req, res, next) => {
    try {
        //let desiredViewsQuery = req.body.desiredViews
        let desiredVideosQuery = req.body.desiredVideos
        await topVids(desiredVideosQuery);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//Need to figure out how to make this compatible with uuid
router.post('/watchVid', async (req, res, next) => {
    try {
        let videoID = req.body.vid;
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
