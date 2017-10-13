var winston = require('winston');
var _ = require('underscore');

winston.setLevels({
 critical: 0,
    error: 0,
     warn: 1,
     info: 2,
    debug: 3,
  verbose: 4,
    silly: 5
});

winston.addColors({
  critical: 'magenta',
     error: 'red',
      warn: 'yellow',
      info: 'white',
   verbose: 'grey',
     debug: 'grey',
     silly: 'grey'
});

		  
function processArgs(type, args) {		
		
  args = _.values(args);
  // for error messages and critical error messages
  // we need should try and provide a backtace for debugging
  // also if the we've got a full error object, try to
  // simplfy the message to something useful
  if(args.length > 1 && (type == "error" || type == 'critical')) {
    var err = args[1];
	if (typeof err === 'Error') {
		var stack = err ? err.stack : undefined;
		if (!stack) {
		  var error_info = {};
		  Error.captureStackTrace(error_info, arguments.callee.caller);
		  stack = error_info.stack;
		}
		args[1] = {type: 'log', error: stack};
	}
  }

  if(args.length == 1)
	  args.push({type: 'log'});
  return args;
}


module.exports = function(opt) {
  var _level = opt.consoleLevel || "debug";

  var transports = [
    new winston.transports.Console({
      level: _level,
      colorize: false,
      stderrLevels: ['silly', 'debug', 'verbose', 'info', 'warn', 'error', 'critical']
    })
  ];
  if (opt.log2ES){
    var Elasticsearch = require('winston-elasticsearch');
    transports.push(new winston.transports.Elasticsearch(opt));
  }

  var _winston = new winston.Logger({ 
      'level': _level,
      'transports': transports
    });
	
  console.silly = function(){
    _winston.silly.apply(_winston, processArgs('silly', arguments));
  };
  console.debug = function(){
    _winston.debug.apply(_winston, processArgs('debug', arguments));
  };
  console.log = function(){
    _winston.log.apply(_winston, processArgs('debug', arguments));
  };
  console.verbose = function(){
    _winston.verbose.apply(_winston, processArgs('verbose', arguments));
  };
  
  console.info = function(){
    _winston.info.apply(_winston, processArgs('info', arguments));
  };
  console.warn = function(){
    _winston.warn.apply(_winston, processArgs('warn', arguments));
  };
  console.error = function(){
    _winston.error.apply(_winston, processArgs('error', arguments));
  };
  console.critical = function(){
    _winston.critical.apply(_winston, processArgs('critical', arguments));
  };
  
  return _winston;

};
