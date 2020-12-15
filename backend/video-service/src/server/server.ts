/* eslint-disable no-console */
import app from '../app';
import env from '../config/env';

import { connectDB } from '../db/postgresql';
import { Server } from 'http';
import { Socket } from 'net';

async function makeServer() {
    try {
        await connectDB();
        const server: Server = app.listen(Number(env.PORT), env.ORIGIN);
        const sockets: Set<Socket> = new Set();
        server.on('connection', function (socket) {
            sockets.add(socket);
            socket.on('close', function () {
                /* remove socket when it is closed */
                sockets.delete(socket);
                // console.log('Socket Closed');
            });
            // console.log('Connection made by client');
            socket.setTimeout(10 * 1000); // 10 second timeout
        });
        process.on('uncaughtException', (err) => {
            console.log(err);
            process.exit(1);
        });
        process.on('SIGINT', () => {
            console.log('got SIGINT');
            for (const socket of sockets.values()) {
                socket.destroy();
            }
            server.close(function () {
                console.log("closed");
                process.exit(0);
            });
        });
        console.log(`http://${env.ORIGIN}:${env.PORT}`);
    } catch (e) {
        console.error(e);
        console.log('Exiting...');
    }
}

// eslint-disable-next-line no-void
void makeServer();
