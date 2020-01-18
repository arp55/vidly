const config = require('config');
const wiston = require('winston');

module.exports = function () {

    if (!config.get('jwtPrivateKey')) {
        wiston.info("Fatal error: jwt private key not defined");
    }

}