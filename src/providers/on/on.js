var Promise = require('bluebird'),
    _ = require('lodash'),
    OpenNebula = require('opennebula'),
    onInstanceCollection = require('./onInstanceCollection'),
    onActionCollection = require('./onActionCollection');

exports.status = function(config) {
    return new Promise(function(resolve, reject) {
        if (!config) return reject('config var must have credential information.');

        var collection = new onInstanceCollection();

        exports._init(config)
            .then(function (one) {
                one.getVMs(function (err, data) {
                    if(err) return reject (err);
                    collection.parseResponse(data, config);
                    return resolve(collection.instances);
                });
            })
            .catch(reject);
    });
};

exports.stop = function(config, id) {
    return new Promise(function(resolve, reject) {
        if (!config) return reject('config var must have credential information.');

        var actionOn = 'stop';

        exports._init(config)
            .then(function (one) {
                return _requestAction(one, id, actionOn, 'stop');
            })
            .then(resolve)
            .catch(reject);
    });
};

exports.start = function(config, id) {
    return new Promise(function(resolve, reject) {
        if (!config) return reject('config var must have credential information.');

        var actionOn = 'resume';

        exports._init(config)
            .then(function (one) {
                return _requestAction(one, id, actionOn, 'start');
            })
            .then(resolve)
            .catch(reject);
    });
};

exports.terminate = function(config, id) {
    return new Promise(function(resolve, reject) {
        if (!config) return reject('config var must have credential information.');

        var actionOn = 'delete';

        exports._init(config)
            .then(function (one) {
                return _requestAction(one, id, actionOn, 'terminate');
            })
            .then(resolve)
            .catch(reject);
    });
};


var _requestAction = function(one, id, actionOn, actionCloudman){
    return new Promise(function(resolve, reject){
        var actionCollection = new onActionCollection();

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