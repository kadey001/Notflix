import express, { NextFunction } from 'express';
import WebHDFS from 'webhdfs';
import http from 'http';
import request from 'request';

import { addFilm, filterGenre, filterviews, filterLikes, filterKeyword, Genres, MovieInfo, countView } from '../db/queries';

const router = express.Router();
const hdfs = WebHDFS.createClient({
    user: 'main',
    host: 'localhost',
    port: 9870,
    path: '/webhdfs/v1'
});

const streamFromHDFS = (path: string, req: any, res: any, next: NextFunction) => {
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
};

router.get('/view', (req, res, next) => {
    if (!req.query.vid) {
        res.status(400).send('Undefined vid');
    }
    const path = `/home/videos/${req.query.vid}/movie.mp4`;
    streamFromHDFS(path, req, res, next);
});

router.get('/view-thumbnail', (req, res, next) => {
    if (!req.query.vid) {
        res.status(400).send('Undefined vid');
        return;
    }
    if (!req.query.filetype) {
        res.status(400).send('Undefined filetype');
        return;
    }
    const path = `/home/videos/${req.query.vid}/thumbnail.${req.query.filetype}`;
    streamFromHDFS(path, req, res, next);
});

// router.get('/get-previous-view-time', async (req, res, next) => {
//     if (!req.query.vid) {
//         res.status(400).send('Undefined vid');
//         next();
//         return;
//     }

//     res.status(200).json({ result: 0.0 })
// });

router.get('/count-view', async (req, res, next) => {
    //const { videoID } = req.query.videoID; // Get video id from params
    const vid = req.query.vid;
    await countView(vid as string);
    res.status(200).send();
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
}

//is user making vid or we generate one here and pass it into query?
router.post('/add-movie', async (req, res, next) => {
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
});

router.get('/filter-genre', async (req, res, next) => {
    try {
        const genres = req.body as Genres;
        parseGenres(genres);
        const vids: Set<any> = await filterGenre(genres);
        if (!vids) {
            res.status(400).send('Invalid Response');
            return;
        }
        // Create thumbnail link for each vid from list of vids in response
        const response: Array<{ vid: string, img: string }> = [];
        vids.forEach((vid) => {
            response.push({
                vid,
                img: `http://13.77.174.221:9864/webhdfs/v1/home/videos/${vid}/thumbnail.jpg?op=OPEN&user.name=main&namenoderpcaddress=notflix:8020&offset=0`
            })
        });
        res.status(200).send(JSON.stringify(response));
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/filter-views', async (req, res, next) => {
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

router.get('/filter-likes', async (req, res, next) => {
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
        const genres = req.body as Genres;
        // Undefined genere defaults to false
        parseGenres(genres);
        const keyword = req.query.keyword as string;
        if (keyword === '') {
            res.status(400).send('No keyword provided');
            res.end();
        }
        await filterKeyword(keyword, genres);
        console.log();
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;
