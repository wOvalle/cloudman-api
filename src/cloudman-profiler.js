var cloudman  = require('./cloudman'),
    Promise = require('bluebird'),
    logger = require('./logger'),
    event = {};


exports.status = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = {
            method: 'status',
            event: 'start'
        };

    logEvent(event, opts);

    return cloudman.status.call(self, opts)
        .then(logSuccessfulPromise.bind(null, event))
        .then(resolve)
        .catch(logRejectedPromise.bind(null, event));
    });
};

exports.start = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = {
            method: 'start',
            event: 'start'
        };

        logEvent(event, opts);

        return cloudman.start.call(self, opts)
            .then(logSuccessfulPromise.bind(null, event))
            .then(resolve)
            .catch(logRejectedPromise.bind(null, event));
    });
};

exports.stop = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = {
            method: 'stop',
            event: 'start'
        };

        logEvent(event, opts);

        return cloudman.stop.call(self, opts)
            .then(logSuccessfulPromise.bind(null, event))
            .then(resolve)
            .catch(logRejectedPromise.bind(null, event));
    });
};


exports.terminate = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = {
            method: 'terminate',
            event: 'start'
        };

        logEvent(event, opts);

        return cloudman.terminate.call(self, opts)
            .then(logSuccessfulPromise.bind(null, event))
            .then(resolve)
            .catch(logRejectedPromise.bind(null, event));
    });
};


exports.create = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = {
            method: 'create',
            event: 'start'
        };

        logEvent(event, opts);

        return cloudman.create.call(self, opts)
            .then(logSuccessfulPromise.bind(null, event))
            .then(resolve)
            .catch(logRejectedPromise.bind(null, event));
    });
};

exports.validDispositions = function () {
    var self = this;
    return new Promise(function (resolve, reject){
        event = {
            method: 'validDispositions',
            event: 'start'
        };

        logEvent(event, opts);

        return cloudman.validDispositions.call(self)
            .then(logSuccessfulPromise.bind(null, event))
            .then(resolve)
            .catch(logRejectedPromise.bind(null, event));
    });
};

exports.validProviders = function () {
    var self = this;
    return new Promise(function (resolve, reject){
        event = {
            method: 'validProviders',
            event: 'start'
        };

        logEvent(event, opts);

        return cloudman.validProviders.call(self)
            .then(logSuccessfulPromise.bind(null, event))
            .then(resolve)
            .catch(logRejectedPromise.bind(null, event));
    });
};

exports.validAccounts = function () {
    var self = this;
    return new Promise(function (resolve, reject){
        event = {
            method: 'validAccounts',
            event: 'start'
        };

        logEvent(event, opts);

        return cloudman.validAccounts.call(self)
            .then(logSuccessfulPromise.bind(null, event))
            .then(resolve)
            .catch(logRejectedPromise.bind(null, event));
    });
};

exports.init = function (cred) {
    event = {
        method: 'init',
        event: 'start'
    };

    logEvent(event, cred);
    return cloudman.init(cred);
};

var logEvent = function(event, opts){
    if(!event.type) event.type = 'info';
    logger.log(event.type, event.event + ' event in ' + event.method + ' method at ' + getCurrentTime() + ' with valid '+(event.success?'result':'options')+ ': ' + JSON.stringify(opts));
}

var logSuccessfulPromise = function(event, result){
    return new Promise(function (resolve, reject){
        event.event = 'finish';
        event.success = true;
        logEvent(event, result);
        resolve(result);
    });
}

var logRejectedPromise = function(event, result){
    return new Promise(function (resolve, reject){
        event.event = event.type = 'error';
        logEvent(event, result);
        reject(result);
    });
}

var getCurrentTime = function(){
    return (new Date).getTime();
}