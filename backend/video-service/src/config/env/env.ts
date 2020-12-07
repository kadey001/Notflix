import dotenv from 'dotenv';

dotenv.config();
const { env } = process;

export const defaults = {
    NODE_ENV: 'development',
    PORT: '3001',
    ORIGIN: '0.0.0.0',
    PGUSER: 'dbuser',
    PGHOST: 'localhost',
    PGDATABASE: 'mydb',
    PGPASSWORD: 'pass',
    PGPORT: '5432',
} as Readonly<Required<NodeJS.ProcessEnv>>;

export function set(key: keyof NodeJS.ProcessEnv): string {
    const environmentVar = env[key];
    const envDefault = defaults[key];
    if (envDefault === undefined) {
        throw new Error('Provided invalid environment variable name');
    }
    if (environmentVar === undefined) {
        // eslint-disable-next-line no-console
        console.warn(
            `WARN: Environment variable "${key}" is not defined, using value "${envDefault}".\
            Please define "${key}" in your .env file`
        );
    }
    return environmentVar || envDefault;
}

const resilientEnv = {
    NODE_ENV: set('NODE_ENV'),
    PORT: set('PORT'),
    ORIGIN: set('ORIGIN'),
    PGUSER: set('PGUSER'),
    PGHOST: set('PGHOST'),
    PGDATABASE: set('PGDATABASE'),
    PGPASSWORD: set('PGPASSWORD'),
    PGPORT: set('PGPORT'),
} as Required<NodeJS.ProcessEnv>;

export default resilientEnv as Readonly<Required<NodeJS.ProcessEnv>>;

export const _test = {
    env: resilientEnv,
} as { env: NodeJS.ProcessEnv };
