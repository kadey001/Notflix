import express from 'express';
import fs from 'fs';
import path from 'path';
import WebHDFS from 'webhdfs';

const hdfs = WebHDFS.createClient({
    host: 'localhost',
    port: '9870',
    path: '/webhdfs/v1'
});

import processVideo from 'lib/video/index';

const router = express.Router();

router.get('/:id', (req, res, next) => {
    const { id } = req.params; // Get video id from params
    res.status(200).send();
    next();
});

router.get('/process', (req, res, next) => {
    // processVideo();
    fs.readFile('/lib/video/rat.mp4', function (error, content) {
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile('./404.html', (err, content2) => {
                    if (!err) {
                        res.end(content2, 'utf-8');
                    } else {
                        console.error(err);
                    }
                });
            } else {
                res.writeHead(500);
                res.end(
                    `Sorry, check with the site admin for error: ${error.code as string}\n`
                );
                res.end();
            }
        } else {
            res.end(content, 'utf-8');
        }
    });
    res.status(200).send();
});

router.get('/read', (req, res, next) => {
    const remoteFS = hdfs.createReadStream('/videos/rat.mp4');
    remoteFS.on('error', (err) => {
        console.error(err);
        res.status(400).send();
    });
    remoteFS.on('data', (chunk) => {
        console.log(chunk);
    });
    remoteFS.on('finish', () => {
        console.log('Done');
        res.status(200).send()
    });
})

export default router;
