const path = require('path');
const winston = require('winston');

const options = {
    file: {
        level: 'info',
        filename: path.join(__dirname, '../../app.log'),
        format: winston.format.json()
    },
    console: {
        level: 'debug'
    },

};

const logger = winston.createLogger({
    format: winston.format.simple(),     // egy sima log
    transports: [
        new winston.transports.File(options.file),       // fájlba akarjuk küldeni a logot, az options-ben megadott file elérési útra
        new winston.transports.Console(options.console)
    ],
    exitOnError: false,         // ha valami hiba van akkor ne álljon le a logolás
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    }
};

module.exports = logger