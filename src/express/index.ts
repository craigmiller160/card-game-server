import express from 'express';
import https from 'https';
import tlsProps from './prepareTlsProps';
import logger from '../logger';

const app = express();
if (!process.env.PORT) {
	throw new Error('Must set PORT environment variable');
}
const port = parseInt(process.env.PORT, 10);

const startExpressServer = (): void => {
	const server = https.createServer(tlsProps, app);
	server.listen(port, () => {
		logger.info(`Express server running on port ${port}`);
	});
};

export default startExpressServer;
