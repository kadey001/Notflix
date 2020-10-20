import { Pool, Client } from 'pg';

export const pool = new Pool({
    max: 20,
    connectionTimeoutMillis: 1000, // 1 second
});
export const client = new Client();

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, poolClient) => {
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

// TODO move to its own query file
export const addPerson = async (name: string): Promise<void> => {
    try {
        const query = {
            text: 'INSERT INTO test(username) VALUES($1)',
            values: [name]
        };
        const result = await client.query(query);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};
