import { Pool } from 'pg';
export const client = new Pool();

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
client.on('error', (err, poolClient) => {
    console.error('Unexpected error on idle client', err);
    console.log('Client: ', poolClient);
    process.exit(-1);
});

export const connectDB = async (): Promise<void> => {
    try {
        await client.connect();
        console.log('Client Connected Successfuly');
    } catch (err) {
        console.error(err);
    }
};
