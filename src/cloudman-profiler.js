var cloudman  = require('./cloudman'),
    Promise = require('bluebird'),
    logger = require('./logger'),
    common = require('./common'),
    event = {};


exports.status = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = common.createEvent('gen.status', opts);

        return cloudman.status.call(self, opts)
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
        });
};

exports.start = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = common.createEvent('gen.start', opts);

        return cloudman.start.call(self, opts)
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.stop = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = common.createEvent('gen.stop', opts);

        return cloudman.stop.call(self, opts)
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.terminate = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = common.createEvent('gen.terminate', opts);

        return cloudman.terminate.call(self, opts)
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.create = function (opts) {
    var self = this;
    return new Promise(function (resolve, reject){
        event = common.createEvent('gen.create', opts);

        return cloudman.create.call(self, opts)
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.validDispositions = function () {
    var self = this;
    return new Promise(function (resolve, reject){
        event = common.createEvent('gen.validDispositions');

        return cloudman.validDispositions.call(self)
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.validProviders = function () {
    var self = this;
    return new Promise(function (resolve, reject){
        event = common.createEvent('gen.validDispositions');

        return cloudman.validProviders.call(self)
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.validAccounts = function () {
    var self = this;
    return new Promise(function (resolve, reject){
        event = common.createEvent('gen.validAccounts');

        return cloudman.validAccounts.call(self)
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.init = cloudman.init;