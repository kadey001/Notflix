import express, { NextFunction } from 'express';
// @ts-ignore
import WebHDFS from 'webhdfs';
import http from 'http';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import { addFilm, filterGenre, filterViews, filterLikes, filterKeyword, Genres, MovieInfo, countView, topVids } from '../db/queries';

const router = express.Router();
const hdfs = WebHDFS.createClient({
    user: 'main',
    host: 'localhost',
    port: 9870,
    path: '/webhdfs/v1'
});

// Multer setup
const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (!fs.existsSync(path.join(__dirname, '/downloads'))) {
            fs.mkdirSync(path.join(__dirname, '/downloads'));
        }
        cb(null, path.join(__dirname, '/downloads/'));
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});

// eslint-disable-next-line @typescript-eslint/ban-types
const fileFilter = (
    req: unknown,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (file.mimetype === 'video/mp4') {
        cb(null, true); // Accept
    } else if (file.mimetype === 'image/jpeg') {
        cb(null, true); // Accept
    } else {
        cb(new Error('Invalid File')); // Reject
    }
};

// TODO Discuss storing locally or in memory
const fileUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 20, // 20 GB limit
    },
    fileFilter,
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
    if (!genres.horror)
        genres.horror = false;
}

//is user making vid or we generate one here and pass it into query?
router.post('/add-movie', async (req, res, next) => {
    const upload = fileUpload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]);
    // @ts-ignore
    upload(req, res, async (err) => {
        if (err) {
            console.error(err);
            res.statusMessage = 'Problem uploading file.';
            res.status(400).send();
            return;
        }
        const files = req.files;
        // @ts-ignore
        const videoFile = files['video'][0];
        // @ts-ignore
        const thumbnailFile = files['thumbnail'][0];
        const movieInfo = req.body as MovieInfo;
        console.log(movieInfo);
        if (!movieInfo.title || !movieInfo.length || !movieInfo.released) {
            res.statusMessage = 'Undefined Movie Info';
            if (videoFile) {
                fs.unlink(videoFile.path, (err) => {
                    if (err) console.error(err);
                });
            }
            if (thumbnailFile) {
                fs.unlink(thumbnailFile.path, (err) => {
                    if (err) console.error(err);
                });
            }
            res.status(400).send();
            return;
        }
        parseGenres(movieInfo);
        console.log(movieInfo);
        try {
            const vid = await addFilm(movieInfo);
            console.log(vid);
            if (!vid) {
                throw new Error('Undefined vid');
            }

            const videoFileReadStream = fs.createReadStream(videoFile.path);
            const videoRemoteFileStream = hdfs.createWriteStream(`/home/videos/${vid}/movie.mp4`);
            videoFileReadStream.pipe(videoRemoteFileStream);
            // @ts-ignore
            videoRemoteFileStream.on('error', function onError(err) {
                console.error(err);
                if (videoFile) {
                    fs.unlink(videoFile.path, (err) => {
                        if (err) console.error(err);
                    });
                }
                res.statusMessage = 'Video failed to upload to hdfs';
                res.status(400).send();
                return;
            });

            videoRemoteFileStream.on('finish', function onFinish() {
                console.log('Video Uploaded');
                if (videoFile) {
                    fs.unlink(videoFile.path, (err) => {
                        if (err) console.error(err);
                    });
                }
            });

            const thumbnailFileReadStream = fs.createReadStream(thumbnailFile.path);
            const thumbnailRemoteFileStream = hdfs.createWriteStream(`/home/videos/${vid}/thumbnail.jpg`);
            thumbnailFileReadStream.pipe(thumbnailRemoteFileStream);
            // @ts-ignore
            thumbnailRemoteFileStream.on('error', function onError(err) {
                console.error(err);
                if (thumbnailFile) {
                    fs.unlink(thumbnailFile.path, (err) => {
                        if (err) console.error(err);
                    });
                }
                res.statusMessage = 'Thumbnail failed to upload to hdfs';
                res.status(400).send();
                return;
            });

            thumbnailRemoteFileStream.on('finish', function onFinish() {
                console.log('Thumbnail Uploaded');
                if (thumbnailFile) {
                    fs.unlink(thumbnailFile.path, (err) => {
                        if (err) console.error(err);
                    });
                }
            });
            res.status(200).send();
        } catch (err) {
            console.error(err);
            // Remove files after use
            if (videoFile) {
                fs.unlink(videoFile.path, (err) => {
                    if (err) console.error(err);
                });
            }
            if (thumbnailFile) {
                fs.unlink(thumbnailFile.path, (err) => {
                    if (err) console.error(err);
                });
            }
        }
    });
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
        let desiredViewsQuery = req.body.desiredViews;
        let higherOrLowerQuery = req.body.higherOrLower;
        await filterViews(desiredViewsQuery, higherOrLowerQuery);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/filter-likes', async (req, res, next) => {
    try {
        let desiredLikesQuery = req.body.desiredLikes;
        let higherOrLowerQuery = req.body.higherOrLower;
        await filterLikes(desiredLikesQuery, higherOrLowerQuery);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/search', async (req, res, next) => {
    try {
        if (!req.query.keyword) {
            res.status(400).send();
            return;
        }
        const { keyword } = req.query;
        const genreInfo = req.body as Genres;
        parseGenres(genreInfo);
        await filterKeyword(keyword as string, genreInfo);
        console.log();
        res.status(200).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/top-videos', async (req, res, next) => {
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

export default router;
