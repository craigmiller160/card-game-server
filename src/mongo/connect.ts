import { MongoClient } from 'mongodb';
import handleMongoPasswordEnv from './handleMongoPasswordEnv';
import logger from '../logger';
import * as TE from 'fp-ts/TaskEither';
import handleUnknownError from '../utils/handleUnknownError';

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

// TODO work on handler type
const connect = (handler: any) => {
    const connectString = buildMongoConnectionString();
    const options = {
        useUnifiedTopology: true
    };

    logger.debug(`Opening MongoDB connection: ${connectString}`);

    TE.tryCatch(
        () => MongoClient.connect(connectString, options),
        handleUnknownError
    );
};