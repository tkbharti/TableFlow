const winston         = require('winston');
const winstonRotator  = require('winston-daily-rotate-file');
var path              = require ('path');
const config          = require("../config/config.js");

const logger          = new winston.createLogger({
   'transports': [
      new winston.transports.Console({
	  colourize : true
	  }),
      new winstonRotator ({
         level       : 'error',
         filename    : path.join(config.ERROR_LOG),
         json        : false,
         datePattern : 'YYYY-MM-DD',
		 format      : winston.format.combine(
                       winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                       winston.format.align(),
                       winston.format.printf(info => `${[info.timestamp]} - ${info.message}` )),
		  maxSize    : '1mb', 
		  maxFiles    : 5
      }),
	   
   ]
});
  
module.exports = logger