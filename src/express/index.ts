import express from 'express';
import https from 'https';
import tlsProps from './prepareTlsProps';

const app = express();
if (!process.env.PORT) {
    throw new Error('Must set PORT environment variable');
}
const port = parseInt(process.env.PORT, 10);

const startExpressServer = () => {
    const server = https.createServer(tlsProps, app);
    server.listen(port, () => {
        // TODO add logger
    });
};

export default startExpressServer;