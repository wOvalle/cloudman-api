var Promise = require('bluebird'),
    _ = require('lodash'),
    OpenNebula = require('opennebula'),
    onInstanceCollection = require('./onInstanceCollection');

exports.lookupInstances = function() {
    var one = new OpenNebula('oneadmin' + ':' + 'opennebula', 'http://localhost:2633/RPC2');
    one.getVMs(function (err, data) {
        console.log(JSON.stringify(data));
    });
};

exports.status = function(config) {
    return new Promise(function(resolve, reject) {
        if (!config) return reject('config var must have credential information.');

        var collection = new onInstanceCollection();

        exports._init(config)
            .then(function (one) {
                one.getVMs(function (err, data) {
                    if(err) return reject (err);
                    collection.parseResponse(data);
                    return resolve(collection.instances);
                });
            })
            //.then(resolve)
            .catch(reject);
    });
};

exports._init = function(config){
    return new Promise(function(resolve, reject){
        resolve(new OpenNebula(config.user + ':' + config.pass, config.api));
    });
};