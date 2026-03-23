const logger            = require("./logger");

const sendError = (err, res, req, next)=>{
    logger.error(` ${err.message} - ${res.url} - ${res.method} - ${res.ip}`);
}

module.exports = sendError;