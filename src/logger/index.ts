import pino from 'pino';

const logger = pino({
	level: process.env.LOGGER_LEVEL ?? 'info',
	prettyPrint: {
		translateTime: 'yyyy-MM-dd HH:mm:ss.l'
	}
});

export default logger;
