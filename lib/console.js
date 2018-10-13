var winston = require('winston');
var Elasticsearch = require('winston-elasticsearch');
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

// winston.addColors({
//   critical: 'magenta',
//      error: 'red',
//       warn: 'yellow',
//       info: 'white',
//    verbose: 'grey',
//      debug: 'grey',
//      silly: 'grey'
// });

		  
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


    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {
      level: _level,
      colorize: false,
      stderrLevels: ['silly', 'verbose', 'debug', 'info', 'warn', 'error', 'critical']
    });
  
  
  /*var transports = [
    new winston.transports.Console({
      level: _level,
      colorize: false,
      stderrLevels: ['debug', 'info', 'warn', 'error', 'critical']
    })
  ];
  if (opt.log2ES){
    transports.push(new Elasticsearch(opt));
  }

  var _winston = new winston.Logger({ 
      'transports': transports
    });*/
	
  /*console.silly = function(){
    winston.silly.apply(_winston, processArgs('silly', arguments));
  };
  console.verbose = function(){
    winston.verbose.apply(_winston, processArgs('verbose', arguments));
  };*/
  
  console.debug = function(){
    winston.debug.apply(_winston, processArgs('debug', arguments));
  };
  console.log = function(){
    winston.debug.apply(_winston, processArgs('debug', arguments));
  };

  console.info = function(){
    winston.info.apply(_winston, processArgs('info', arguments));
  };
  console.warn = function(){
    winston.warn.apply(_winston, processArgs('warn', arguments));
  };
  console.error = function(){
    winston.error.apply(_winston, processArgs('error', arguments));
  };
  
  console.critical = function(){
    winston.critical.apply(_winston, processArgs('critical', arguments));
  };
  
  return winston;

};
