/* eslint-disable no-console */
import app from 'app';
import env from 'config/env';

import { connectDB } from 'db/postgresql';

async function makeServer() {
    try {
        // Create client & pool
        await connectDB();
        app.listen(Number(env.PORT), env.ORIGIN);
        console.log(`http://${env.ORIGIN}:${env.PORT}`);
    } catch (e) {
        console.error(e);
        console.log('Exiting...');
    }
}

// eslint-disable-next-line no-void
void makeServer();
