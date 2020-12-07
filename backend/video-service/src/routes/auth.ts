import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { signUp, signIn, Auth } from '../db/queries';

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
                reject(err)
            }
            else if (response) {
                resolve(response)
            } else {
                reject(new Error('Passwords do not match.'))
            }
        })
    )
}

router.post('/sign-up', async (req, res, next) => {
    try {
        const auth = req.body as Auth;
        if (!auth.email) {
            res.status(400).send('No Email Provided');
            return;
        }
        if (!auth.password) {
            res.status(400).send('No Password Provided');
            return;
        }
        if (!auth.username) {
            res.status(400).send('No Username Provided');
            return;
        }
        const hash = await hashPassword(auth.password);
        auth.password = hash;
        const token = await createToken();
        auth.token = token;
        console.log(auth);
        await signUp(auth);
        res.status(200).send();
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
            res.status(400).send('No Email Provided');
            return;
        }
        if (!auth.password) {
            res.status(400).send('No Password Provided');
            return;
        }
        const response = await signIn(auth);
        await checkPassword(auth.password, response.password)
        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
        next(err);
    }
});

export default router;