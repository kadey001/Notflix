import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import cors from 'cors';

import { signUp, signIn, checkExisting, Auth } from '../db/queries';

const router = express.Router();

const hashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) =>
        bcrypt.hash(password, 10, (err, hash) => {
            err ? reject(err) : resolve(hash)
        })
    )
}

const createToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, data) => {
            err ? reject(err) : resolve(data.toString('base64'))
        })
    })
}

const checkPassword = (reqPassword: string, hashedPassword: string): Promise<boolean> => {
    return new Promise((resolve, reject) =>
        bcrypt.compare(reqPassword, hashedPassword, (err, response) => {
            if (err) {
                reject(err);
            }
            else if (response) {
                resolve(response);
            } else {
                reject(new Error('Passwords do not match.'));
            }
        })
    )
}

router.post('/sign-up', async (req, res, next) => {
    try {
        const auth = req.body as Auth;
        if (!auth.email) {
            res.statusMessage = 'No Email Provided'
            res.status(400).send();
            return;
        }
        if (!auth.password) {
            res.statusMessage = 'No Password Provided';
            res.status(400).send();
            return;
        }
        if (!auth.username) {
            res.statusMessage = 'No Username Provided';
            res.status(400).send();
            return;
        }
        const existingAccount = await checkExisting(auth.email);
        if (existingAccount) {
            res.statusMessage = 'Account already exists with that email';
            res.status(400).send();
            return;
        }
        const hash = await hashPassword(auth.password);
        auth.password = hash;
        const token = await createToken();
        auth.token = token;
        const response = await signUp(auth);
        // Add uid route/file to webhdfs
        res.status(200).send({
            uid: response.uid,
            token: response.token,
            username: response.username
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
        next(err);
    }
});

router.post('/sign-in', async (req, res, next) => {
    try {
        const auth = req.body as Auth;
        if (!auth.email) {
            res.statusMessage = 'No Email Provided'
            res.status(400).send();
            return;
        }
        if (!auth.password) {
            res.statusMessage = 'No Password Provided';
            res.status(400).send();
            return;
        }
        const response = await signIn(auth);
        if (!response) {
            res.statusMessage = 'Account Not Found';
            res.status(400).send();
            return;
        }
        await checkPassword(auth.password, response.password);
        res.status(200).send({
            uid: response.uid,
            token: response.token,
            username: response.username
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
        next(err);
    }
});

export default router;