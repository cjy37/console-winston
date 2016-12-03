
var util = require('util');
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
  if(type == "error" || type == 'critical'){
    var err = args[0];
    var stack = err ? err.stack : undefined;
    if (!stack) {
      var error_info = {};
      Error.captureStackTrace(error_info, arguments.callee.caller);
      stack = error_info.stack;
    }
    args[0] = err;
  }

  var meta = {};
  args.push(meta);

  return args;
}


module.exports = function(level) {

  level = level || "silly";
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    level: level,
    colorize: true,
    stderrLevels: ['silly', 'debug', 'verbose', 'info', 'warn', 'error', 'critical']
  });

  console.verbose = function(){
    winston.verbose.apply(winston, processArgs('verbose', arguments));
  };
  console.silly = function(){
    winston.silly.apply(winston, processArgs('silly', arguments));
  };
  console.debug = function(){
    winston.debug.apply(winston, processArgs('debug', arguments));
  };
  console.log = function(){
    winston.debug.apply(winston, processArgs('log', arguments));
  };
  console.info = function(){
    winston.info.apply(winston, processArgs('info', arguments));
  };
  console.warn = function(){
    winston.warn.apply(winston, processArgs('warn', arguments));
  };
  console.error = function(){
    winston.error.apply(winston, processArgs('error', arguments));
  };
  console.critical = function(){
    winston.critical.apply(winston, processArgs('critical', arguments));
  };

  return winston;

};

