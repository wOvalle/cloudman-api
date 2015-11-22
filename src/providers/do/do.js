var Promise = require('bluebird'),
    _ = require('lodash'),
    DigitalOcean = require('do-wrapper'),
    doInstanceCollection = require('./doInstanceCollection');

var status = function (config) {
    return new Promise(function(resolve, reject) {
        if(!config) return reject('config var must have credential information.');

        _init(config)
            .then(_getStatus)
            .then(resolve)
            .catch(handleError);
    });
};

/*
 TODO: missing documentation
 */
var stop = function (config, instancesIds) {
    return new Promise(function(resolve, reject) {
        reject("not implemented");
    });
};

/*
 TODO: missing documentation
 */
var start = function (config, instancesIds) {
    return new Promise(function(resolve, reject) {
        reject("not implemented");
    });
};

/*
 TODO: missing documentation
 */
var terminate = function (config, instancesIds) {
    return new Promise(function(resolve, reject) {
        reject("not implemented");
    });
};

var _init = function(config){
    return new Promise(function(resolve, reject){
        resolve(new DigitalOcean(config.token, config.pageSize));
    });
};

/*Internal method, Pending Doc*/
var _getStatus = function(api){
    return new Promise(function(resolve, reject){
        var collection = new doInstanceCollection();

        api.dropletsGetAll({}, function (err, res, body) {
            if (err)
                return reject(err);
            else {
                collection.parseResponse(body);
                resolve(collection.instances);
            }
        });
    });
};

/*Internal method, Pending Doc*/
var _stopInstances = function(api, InstanceIds){
    return new Promise(function(resolve, reject){
        reject("not implemented");
    });
};

/*Internal method, Pending Doc*/
var _startInstances = function(api, InstanceIds){
    return new Promise(function(resolve, reject){
        reject("not implemented");
    });
};

/*Internal method, Pending Doc*/
var _terminateInstances = function(api, InstanceIds){
    return new Promise(function(resolve, reject){
        reject("not implemented");
    });
};

/*Missing API required create method*/

/*Pending Doc*/
var handleError = function(err){
    //TODO (maybe): Errors should be logged in here.
    console.log(err.stack);
};

module.exports = {
    status: status,
    stop: stop,
    start: start,
    terminate: terminate
};