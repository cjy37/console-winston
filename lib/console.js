var winston = require('winston');
var _ = require('underscore');

winston.setLevels({
 critical: 0,
    error: 0,
     warn: 1,
     info: 2,
  verbose: 3,
    debug: 4,
    silly: 5
});

function processArgs(type, args) {		
		
  args = _.values(args);
  
  if(args.length > 1 && (type == "error" || type == 'critical')) {
    var err = args[1];
	if (typeof err === 'Error') {
		var stack = err ? err.stack : undefined;
		if (!stack) {
		  var error_info = {};
		  Error.captureStackTrace(error_info, arguments.callee.caller);
		  stack = error_info.stack;
		}
		args[1] = { error: stack };
	}
  }

  return args;
}


module.exports = function(opt) {
  var level = opt.consoleLevel || "debug";
  var colorize = false;
  var stderrLevels = ['silly', 'debug', 'verbose', 'info', 'warn', 'error', 'critical'];
  var transports = [ new winston.transports.Console({ level, colorize, stderrLevels }) ];
  var _winston = new winston.Logger({ transports });
	
  stderrLevels.forEach(function(errLevel){
	  console[errLevel] = function(){
		_winston[errLevel].apply(_winston, processArgs(errLevel, arguments));
	  };
  })
  console.log = function(){
    _winston.verbose.apply(_winston, processArgs('verbose', arguments));
  };
  
  return _winston;

};
