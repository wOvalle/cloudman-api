var Promise = require('bluebird'),
    _ = require('lodash'),
    ec2Collection = require('./ec2Collection');

var initEC2 = function(config){
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

var status = function (config) {
	return new Promise(function(resolve, reject) {
        if(!config) return reject('config var must have credential information.');

        var arrInstances = [],
            instance = {};

        initEC2(config)
            .then(getStatus)
            .then(resolve)
            .catch(handleError);

    });
};

var getStatus = function(ec2){
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

var handleError = function(err){
    console.log(err.stack);
};

module.exports = {
	status: status
};