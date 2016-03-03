var logger = require('./logger');
var hat = require('hat');

exports.resolver = function(resolve, event, result){
    event.event = 'finish';
    exports.logEvent(event, result);
    resolve(result);
}

exports.rejecter = function(reject, event, result) {
    event.event = event.type = 'error';
    exports.logEvent(event, result);
    reject(result);
}

exports.logEvent = function(event, opts){
    if(!event.type) event.type = 'info';
    logger.log(event.type, event.id + ' | ' + event.event + ' event in ' + event.method + ' method at ' + getCurrentTime() + ' with valid '+(event.type === 'error' ?'result':'options')+ ':: ' + JSON.stringify(opts));
}

exports.createEvent = function(method, opts){
    if(!opts) opts = {};

    var event = {
        id: hat(32),
        method: method,
        event: 'start'
    };

    exports.logEvent(event, opts);

    return event;
}

var getCurrentTime = function(){
    return (new Date).getTime();
}