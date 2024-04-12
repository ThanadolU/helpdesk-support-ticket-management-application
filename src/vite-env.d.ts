/// <reference types="vite/client" />

namespace NodeJS {
    interface ProcessEnv {
        DB_CONN_STRING: string;
        DB_NAME: string;
        TICKETS_COLLECTION_NAME: string;
    }
}
