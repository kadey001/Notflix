import express from 'express';
import WebHDFS from 'webhdfs';
import http from 'http';
import request from 'request';

import { addFilm, filterGenre, filterviews, filterLikes, filterKeyword } from '../db/postgresql';

const router = express.Router();
const hdfs = WebHDFS.createClient({
    user: 'main',
    host: 'localhost',
    port: 9870,
    path: '/webhdfs/v1'
});

router.get('/view', (req, res, next) => {
    if (!req.query.vid) {
        res.status(400).send('Undefined vid');
    }
    const path = `/home/videos/${req.query.vid}/movie.mp4`;
    // Get stats from video w/ SQL
    const options = {
        host: 'localhost',
        path: `/webhdfs/v1${path}?op=GETFILESTATUS`,
        port: '9870',
        method: 'GET'
    }
    const statReq = http.request(options, (statRes) => {
        statRes.on('data', data => {
            const parsedData = JSON.parse(data);
            if (!parsedData) {
                res.status(400).send('Undefined parseData');
            } else if (!parsedData.FileStatus) {
                res.status(400).send('Undefined parsedData.FileStatus');
            }
            const fileSize = parsedData.FileStatus.length;
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize - 1;
                const chunksize = (end - start) + 1;
                const stream = hdfs.createReadStream(path, { offset: start, buffersize: 1, length: chunksize });
                res.on('close', () => {
                    if (!stream)
                        return;
                    stream.req.end();
                    stream.req.destroy();
                    stream.end();
                    stream.destroy();
                    console.log('Response Closed');
                });
                stream.on('error', (err: any) => {
                    console.error(err);
                    res.end('Server error');
                    next(err);
                });
                stream.on('close', () => {
                    console.log('File Closing (206 Response)');
                });
                // TODO Get Content-Type from postgres metadata
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(206, head);
                if (!stream)
                    res.end();
                else {
                    stream.pipe(res)
                        .on('error', (err: any) => {
                            console.log(err);
                            next(err);
                        }).on('finish', () => {
                            console.log('Pipe Finished');
                        });
                    console.log('File Stream Pipe Opened (206 Response)');
                }
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(200, head);
                const stream = hdfs.createReadStream(path, { buffersize: 1 });
                res.on('close', () => {
                    if (!stream)
                        return;
                    stream.req.end();
                    stream.req.destroy();
                    stream.end();
                    stream.destroy();
                    console.log('Response Closed');
                });
                stream.on('error', (err: any) => {
                    console.error(err);
                    res.end('Server error');
                    next(err);
                });
                // stream.on('close', () => { // pipe & socket additional events
                //     console.log('File Closing (200 Response)');
                // });
                if (stream == null)
                    res.end();
                else {
                    stream.pipe(res)
                        .on('error', (err: any) => {
                            console.log(err);
                            next(err);
                        }).on('finish', () => {
                            console.log('Pipe Finished');
                        });
                    console.log('File Stream Pipe Opened (200 Response)');
                }
            }
        })
    });
    statReq.on('error', (err) => {
        console.error(err);
    });
    statReq.end();
});

// router.get('/get-previous-view-time', async (req, res, next) => {
//     if (!req.query.vid) {
//         res.status(400).send('Undefined vid');
//         next();
//         return;
//     }

//     res.status(200).json({ result: 0.0 })
// });

router.get('/watch/', (req, res, next) => {
    //const { videoID } = req.query.videoID; // Get video id from params
    const videoID = req.query.videoID;
    console.log("does this print to our terminal or post " + videoID);
    console.log("This is our comment ID with console dir " + req.query.commentID);
    //res.status(200).json({result: "The result of id is "+req.params.id}).send();
    res.status(200).send();
});

router.post('/test', (req, res, next) => {
    const { name } = req.body as { name: string };
    console.log(name);
    res.status(200).json({ result: "The result is " + name }).send();
});


//is user making vid or we generate one here and pass it into query?
router.post('/newfilm', async (req, res, next) => {
    try {
        const { filmTitle } = req.body as { filmTitle: string };
        const { filmLength } = req.body as { filmLength: number };
        const { horrorGenre } = req.body as { horrorGenre: boolean };
        const { comedyGenre } = req.body as { comedyGenre: boolean };
        const { actionGenre } = req.body as { actionGenre: boolean };
        await addFilm(filmLength, filmTitle, comedyGenre, horrorGenre, actionGenre);
        console.log(filmTitle + ", " + filmLength + ", " + horrorGenre + ", " + comedyGenre + ", " + actionGenre);
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
        let horrorBool = (horrorQuery === 'true');
        let comedyBool = (comedyQuery === 'true');
        let actionBool = (actionQuery === 'true');
        await filterGenre(comedyBool, horrorBool, actionBool);
        console.log(comedyBool + ", " + horrorBool + ", " + actionBool);
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
        let desiredViewsInt = parseInt(desiredViewsQuery as string);
        let higherOrLowerBool = (higherOrLowerQuery === 'true');
        await filterviews(desiredViewsInt, higherOrLowerBool);
        console.log(desiredViewsInt + ", " + higherOrLowerBool);
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
        let desiredLikesInt = parseInt(desiredLikesQuery as string);
        let higherOrLowerBool = (higherOrLowerQuery === 'true');
        await filterLikes(desiredLikesInt, higherOrLowerBool);
        console.log(desiredLikesInt + ", " + higherOrLowerBool);
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
        let horrorBool = (horrorQuery === 'true');
        let comedyBool = (comedyQuery === 'true');
        let actionBool = (actionQuery === 'true');
        let FilmString = desiredFilmTitle as string;
        await filterKeyword(FilmString, comedyBool, horrorBool, actionBool);
        console.log();
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
