var Promise = require('bluebird'),
    _ = require('lodash'),
    DigitalOcean = require('do-wrapper'),
    doInstanceCollection = require('./doInstanceCollection'),
    doActionCollection = require('./doActionCollection');

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
var stop = function (config, dropletId) {
    return new Promise(function(resolve, reject) {
        var doAction = {
            type: 'shutdown'
        };

        _init(config)
            .then(function(api){
                return _requestAction(api, dropletId, doAction, 'stop');
            })
            .then(resolve)
            .catch(handleError);
    });
};

/*
 TODO: missing documentation
 */
var start = function (config, dropletId) {
    return new Promise(function(resolve, reject) {
        var doAction = {
            type: 'power_on'
        };

        _init(config)
            .then(function(api){
                return _requestAction(api, dropletId, doAction, 'start');
            })
            .then(resolve)
            .catch(handleError);
    });
};

/*
 TODO: missing documentation
 */
var terminate = function (config, dropletId) {
    return new Promise(function(resolve, reject) {
        reject("not implemented");
    });
};

var _init = function(config){

    if (!config) return reject('Bad configuration');
    if (!config.token) return reject('token is required');

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
var _requestAction = function(api, dropletId, doAction, cmanAction){
    return new Promise(function(resolve, reject){
        var actionCollection = new doActionCollection();

        api.dropletsRequestAction(dropletId, doAction, function(err, res, body){
            if (err)
                return reject(err);
            else {
                actionCollection.parseAction(body, cmanAction, dropletId);
                resolve(actionCollection.actions);
            };
        });
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