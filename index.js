const express = require('express');
const winston = require('winston');
require('./startup/mongoose');
const app = express();
require('./startup/routes')(app);
require('./startup/mongoose')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;



// "dev": "nodemon index.js",
// "test": "jest --watchAll --verbose --coverage",