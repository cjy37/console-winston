var winston = require('winston');

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

module.exports = function(level) {

  var _level = level || "debug";
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    level: _level,
    colorize: true,
    stderrLevels: ['silly', 'debug', 'verbose', 'info', 'warn', 'error', 'critical']
  });

  console.silly = function(){
    winston.silly.apply(winston, arguments);
  };
  console.debug = function(){
    winston.debug.apply(winston, arguments);
  };
  console.log = function(){
    winston.debug.apply(winston, arguments);
  };
  console.verbose = function(){
    winston.verbose.apply(winston, arguments);
  };
  console.info = function(){
    winston.info.apply(winston, arguments);
  };
  console.warn = function(){
    winston.warn.apply(winston, arguments);
  };
  console.error = function(){
    winston.error.apply(winston, arguments);
  };
  console.critical = function(){
    winston.critical.apply(winston, arguments);
  };

  return winston;

};
