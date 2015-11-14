var Promise = require('bluebird'),
    _ = require('lodash'),
    ec2Collection = require('./ec2Collection');

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

/*Missing API required stop method*/
/*Missing API required start method*/
/*Missing API required terminate method*/
/*Missing API required create method*/

/*Pending Doc*/
var handleError = function(err){
    //TODO (maybe): Errors should be logged in here.
    console.log(err.stack);
};

module.exports = {
	status: status
};