var Promise = require('bluebird'),
    _ = require('lodash'),
    ec2Collection = require('./ec2InstanceCollection'),
    ec2ActionCollection = require('./ec2ActionCollection');

/*Internal method, Pending Doc*/
var _initEC2 = function(config){
    return new Promise(function(resolve, reject) {

        if (!config) return reject('Bad configuration');
        if (!config.key) return reject('key is required.');
        if (!config.secret) return reject('secret is required.');
        if (!config.region) return reject('region is required.');

        var aws = require('aws-sdk');

        aws.config.update({
            accessKeyId: config.key,
            secretAccessKey: config.secret,
            region: config.region
        });
        resolve(new aws.EC2());
    });
};

/*Pending Doc.
    
    Input: config {
        key: Aws key.
        secret: Aws secret 
        region: Aws region.
    }

*/
var status = function (config) {
	return new Promise(function(resolve, reject) {
        if(!config) return reject('config var must have credential information.');

        _initEC2(config)
            .then(_getStatus)
            .then(function(res){
                resolve(res.instances);
            })
            .catch(handleError);

    });
};

/*
    TODO: missing documentation
*/
var stop = function (config, instancesIds) {
    return new Promise(function(resolve, reject) {
        if(!config) return reject('config var must have credential information.');
        if(!instancesIds) return reject('instancesIds must have an array of instances to stop.');

        _initEC2(config)
            .then(function(ec2){
                return _stopInstances(ec2, instancesIds);
            })
            .then(resolve)
            .catch(handleError);
    });
};

/*
    TODO: missing documentation
*/
var start = function (config, instancesIds) {
    return new Promise(function(resolve, reject) {
        if(!config) return reject('config var must have credential information.');
        if(!instancesIds) return reject('instancesIds must have an array of instances to start.');
        _initEC2(config)
            .then(function(ec2){
                return _startInstances(ec2, instancesIds);
            })
            .then(resolve)
            .catch(handleError);
    });
};

/*
    TODO: missing documentation
*/
var terminate = function (config, instancesIds) {
    return new Promise(function(resolve, reject) {
        if(!config) return reject('config var must have credential information.');
        if(!instancesIds) return reject('instancesIds must have an array of instances to terminate.');

        _initEC2(config)
            .then(function(ec2){
                return _terminateInstances(ec2, instancesIds);
            })
            .then(resolve)
            .catch(handleError);
    });
};

/*Internal method, Pending Doc*/
var _getStatus = function(ec2){
    return new Promise(function(resolve, reject){
        var collection = new ec2Collection();
        ec2.describeInstances({}, function (err, data) {
            if (err)
                return reject(err);
            else {
                collection.parseReservation(data);
                resolve(collection);
            }
        });
    });
};

/*Internal method, Pending Doc*/
var _stopInstances = function(ec2, InstanceIds){
    return new Promise(function(resolve, reject){
        var actionCollection = new ec2ActionCollection();

        var params = {InstanceIds: InstanceIds}; //todo: refactor this.
        ec2.stopInstances(params, function (err, data) {
            if (err)
                return reject(err);
            else {
                actionCollection.parseAction(data, 'stop');
                resolve(actionCollection.actions);
            }
        });
    });
};

/*Internal method, Pending Doc*/
var _startInstances = function(ec2, InstanceIds){
    return new Promise(function(resolve, reject){
        var actionCollection = new ec2ActionCollection();

        var params = {InstanceIds: InstanceIds}; //todo: refactor this.
        ec2.startInstances(params, function (err, data) {
            if (err)
                return reject(err);
            else {
                actionCollection.parseAction(data, 'start');
                resolve(actionCollection.actions);
            }
        });
    });
};

/*Internal method, Pending Doc*/
var _terminateInstances = function(ec2, InstanceIds){
    return new Promise(function(resolve, reject){
        var actionCollection = new ec2ActionCollection();

        var params = {InstanceIds: InstanceIds}; //todo: refactor this.
        ec2.terminateInstances(params, function (err, data) {
            if (err)
                return reject(err);
            else {
                actionCollection.parseAction(data, 'terminate');
                resolve(actionCollection.actions);
            }
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