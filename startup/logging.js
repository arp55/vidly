const winston = require('winston');
// require('winston-mongodb'); //may not work with integration test
require('express-async-errors');

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughterrors.log' })
    )

    process.on('uncaughtException', (ex) => {
        console.log("uncaughtException");
        winston.error(ex.message, ex);
    })

    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    // winston.add(new winston.transports.MongoDB({ //may not work with integration test
    //     db: 'mongodb://localhost:27017/vidly',
    //     level: 'info'
    // }));
}