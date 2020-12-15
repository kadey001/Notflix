import cookieParser from 'cookie-parser';
import logger from 'morgan';
import express, { Express } from 'express';

import './env'; // initializes env vars using our configuration
import router from '../routes/index';
import videoRouter from '../routes/video';
import authRouter from '../routes/auth';
import cors from 'cors';

export default function (app: Express): void {
    // TODO: make this dev or prod mode
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false })); // TODO: read more about this
    app.use(cookieParser());
    app.use(cors({
        origin: '*'
    }));
    app.use('/', router);
    app.use('/video', videoRouter);
    app.use('/auth', authRouter);
}
