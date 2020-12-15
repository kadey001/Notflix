declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'development' | 'production' | 'test';
            PORT?: string;
            ORIGIN?: string;
            PGUSER?: string;
            PGHOST?: string;
            PGDATABASE?: string;
            PGPASSWORD?: string;
            PGPORT?: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { };
