var Promise = require('bluebird'),
    _ = require('lodash'),
    OpenNebula = require('opennebula'),
    onInstanceCollection = require('./onInstanceCollection'),
    onActionCollection = require('./onActionCollection'),
    providerName = 'on',
    common = require('../../common'),
    event = {};


exports.status = function(config) {
    return new Promise(function(resolve, reject) {
        if (!config) return reject('config var must have credential information.');

        var collection = new onInstanceCollection();
        event = common.createEvent('aws.status', config);

        exports._init(config)
            .then(function (one) {
                one.getVMs(function (err, data) {
                    if(err) return common.rejecter(reject, event, err);
                    collection.parseResponse(data, config);
                    return common.resolver(resolve, event, collection.instances);
                });
            })
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.stop = function(config, id) {
    return new Promise(function(resolve, reject) {
        if (!config) return reject('config var must have credential information.');

        var actionOn = 'stop';

        event = common.createEvent('aws.stop', config);

        exports._init(config)
            .then(function (one) {
                return _requestAction(one, id, actionOn, 'stop');
            })
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.start = function(config, id) {
    return new Promise(function(resolve, reject) {
        if (!config) return reject('config var must have credential information.');

        var actionOn = 'resume';

        event = common.createEvent('aws.start', config);

        exports._init(config)
            .then(function (one) {
                return _requestAction(one, id, actionOn, 'start');
            })
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

exports.terminate = function(config, id) {
    return new Promise(function(resolve, reject) {
        if (!config) return reject('config var must have credential information.');

        var actionOn = 'delete';
        event = common.createEvent('aws.status', config);

        exports._init(config)
            .then(function (one) {
                return _requestAction(one, id, actionOn, 'terminate');
            })
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

var _requestAction = function(one, id, actionOn, actionCloudman){
    return new Promise(function(resolve, reject){
        var actionCollection = new onActionCollection();

        if(_.isString(id)) id = _.parseInt(id);

        one.getVM(id).action(actionOn, function(err, data){
            if(err) actionCollection.parseAction(data, actionCloudman, id,  err);//return reject(err);
            else actionCollection.parseAction(data, actionCloudman, id);

            return resolve(actionCollection.actions);
        });
    });
};

exports._init = function(config){
    return new Promise(function(resolve, reject){
        resolve(new OpenNebula(config.user + ':' + config.pass, config.api));
    });
};