var Promise = require('bluebird'),
    _ = require('lodash'),
    OpenNebula = require('opennebula'),
    onInstanceCollection = require('./onInstanceCollection');

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

exports._init = function(config){
    return new Promise(function(resolve, reject){
        resolve(new OpenNebula(config.user + ':' + config.pass, config.api));
    });
};