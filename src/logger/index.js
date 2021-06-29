var _a;
import pino from 'pino';
var logger = pino({
    level: (_a = process.env.LOGGER_LEVEL) !== null && _a !== void 0 ? _a : 'info',
    prettyPrint: {
        translateTime: 'yyyy-MM-dd HH:mm:ss.l'
    }
});
export default logger;
