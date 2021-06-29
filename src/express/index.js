import express from 'express';
import https from 'https';
import tlsProps from './prepareTlsProps';
import logger from '../logger';
var app = express();
if (!process.env.PORT) {
    throw new Error('Must set PORT environment variable');
}
var port = parseInt(process.env.PORT, 10);
var startExpressServer = function () {
    var server = https.createServer(tlsProps, app);
    server.listen(port, function () {
        logger.info("Express server running on port " + port);
    });
};
export default startExpressServer;
