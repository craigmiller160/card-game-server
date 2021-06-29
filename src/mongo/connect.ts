import {Db, MongoClient} from 'mongodb';
import handleMongoPasswordEnv from './handleMongoPasswordEnv';
import logger from '../logger';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import handleUnknownError from '../utils/handleUnknownError';
import {pipe} from 'fp-ts/function';

handleMongoPasswordEnv();

// TODO still work on Handler type
export type HandlerType<R> = (db: Db) => R;
export interface HandlerResult<R> {
    client: MongoClient;
    result: R;
}

const getConfig = () => ({
    mongoUser: process.env.MONGO_USER,
    mongoPass: process.env.MONGO_PASSWORD,
    mongoAuthDb: process.env.MONGO_AUTH_DB,
    mongoHost: process.env.MONGO_HOST,
    mongoPort: process.env.MONGO_PORT,
    mongoDatabase: process.env.MONGO_DATABASE,
    profile: process.env.ACTIVE_PROFILE
});

const buildMongoConnectionString = () => {
    const config = getConfig();
    const database = `${config.mongoDatabase}_${config.profile}`;

    const credsString = `${config.mongoUser}:${config.mongoPass}@`;
    const coreConnectString = `${config.mongoHost}:${config.mongoPort}/${database}?authSource=${config.mongoAuthDb}`;
    const tlsString = `&tls=true&tlsAllowInvalidCertificates=true&tlsAllowInvalidHostnames=true`;

    if (config.profile === 'test') {
        return `mongodb://${coreConnectString}`;
    }

    return `mongodb://${credsString}${coreConnectString}${tlsString}`;
};

const execute = <R>(client: MongoClient, handler: HandlerType<R>): TE.TaskEither<Error, HandlerResult<R>> => {
    const db = client.db();
    return pipe(
        E.tryCatch(
            () => handler(db),
            handleUnknownError
        ),
        TE.fromEither,
        TE.map((result: R) => ({
            client,
            result
        }))
    );
};

// TODO need better return type here
const connect = <R>(handler: HandlerType<R>): void => {
    const connectString = buildMongoConnectionString();
    const options = {
        useUnifiedTopology: true
    };

    logger.debug(`Opening MongoDB connection: ${connectString}`);

    // TODO need to close the client
    pipe(
        TE.tryCatch(
            () => MongoClient.connect(connectString, options),
            handleUnknownError
        ),
        TE.chain((client: MongoClient) => execute(client, handler))
    );
};

export default connect;