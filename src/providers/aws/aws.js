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
            .then(function(ec2){return _getStatus(ec2, config);})
            .then(function(res){
                return resolve(_.filter(res.instances, function(i){return i.state !== 'terminated'}));
            })
            .catch(reject);

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
            .catch(reject);
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
            .catch(reject);
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
            .catch(reject);
    });
};

var create = function(config, properties){
    return new Promise(function(resolve, reject){
        //todo: Make this properties dynamic
        properties.keyPair = 'node-sdk-key';
        properties.count = 1;
        properties.securityGroups = "default-security-group";

        var awsProperties = parseProperties(properties);

        if(!isValidPropertiesObject(awsProperties)) return reject ('invalid properties object');

        var actionCollection = new ec2ActionCollection();

        _initEC2(config)
            .then(function(ec2){
                ec2.runInstances(awsProperties, function(err, data){
                    if (err)
                        return reject(err);
                    else {
                        actionCollection.parseCreation(data);
                    }

                    /*Tried to do this in other then but since ec2.runInstances is async, it was entering second then first*/
                    _.each(actionCollection.actions, function(act){
                        //If creation threw an error, return; Else, create tags.
                        if(!act.actionProcessed)
                            return;

                        if(!properties.name)
                            properties.name = 'Powered by Cloudman ' + (new Date()).getTime();

                        var ids = [act.input];//set this for various machines, hardcored for now
                        var params = {
                            Resources: ids,
                            Tags:[{
                                Key: 'Name',
                                Value: properties.name
                            }]
                        };

                        ec2.createTags(params, function(err, data){
                            if (err) return reject(err);
                            else return resolve(actionCollection.actions);
                        });
                    });
                });
            })
            .catch(reject);
    });
};

/*Internal method, Pending Doc*/
var _getStatus = function(ec2, config){
    return new Promise(function(resolve, reject){
        var collection = new ec2Collection();
        ec2.describeInstances({}, function (err, data) {
            if (err)
                return reject(err);
            else {
                collection.parseReservation(data, config);
                return resolve(collection);
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
                return resolve(actionCollection.actions);
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
                return resolve(actionCollection.actions);
            }
        });
    });
};

var _images = function(ec2){
    return new Promise(function(resolve, reject){
        var actionCollection = new ec2ActionCollection();

        ec2.describeImages({}, function (err, data) {
            if (err)
                return reject(err);
            else {
                console.log(JSON.stringify(data));
                return resolve(data);
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
                return resolve(actionCollection.actions);
            }
        });
    });
};

/*Pending Doc*/
var handleError = function(err){
    //TODO (maybe): Errors should be logged in here.
    console.log(err.stack);
};

var validImages = function(){
    return [
        {
            id: 'ami-f0091d91',
            label: 'Amazon Linux AMI 2015.09.1 (HVM)'
        },
        {
            id: 'ami-4dbf9e7d',
            label: 'Red Hat Enterprise Linux 7.1 (HVM)'
        },
        {
            id: 'ami-d7450be7',
            label: 'SUSE Linux Enterprise Server 12 (HVM)'
        },
        {
            id: 'ami-5189a661',
            label: 'Ubuntu Server 14.04 LTS (HVM)'
        },
        {
            id: 'ami-f8f715cb',
            label: 'Microsoft Windows Server 2012 R2 Base '
        }
    ];
};

var validRegions = function(){
    return rawRegions().map(function(it){return {id: it.region, label: it.name}});
};

var validTypes = function(){
    return ["t1.micro", "t2.micro", "t2.small", "m1.small", "t2.medium", "m1.medium", "t2.large", "m1.large", "m1.xlarge", "m2.xlarge"]
        .map(function(it){
            return {id: it, label: it};
        });
};

var rawRegions = function(){
    return [{name: "US East (N. Virginia)", region: "us-east-1", endpoint:"ec2.us-east-1.amazonaws.com"},
        {name: "US West (Oregon)", region:"us-west-2", endpoint:"ec2.us-west-2.amazonaws.com"},
        {name: "US West (N. California)", region:"us-west-1", endpoint:"ec2.us-west-1.amazonaws.com"},
        {name: "EU (Ireland)", region:"eu-west-1", endpoint:"ec2.eu-west-1.amazonaws.com"},
        {name: "EU (Frankfurt)", region:"eu-central-1", endpoint:"ec2.eu-central-1.amazonaws.com"},
        {name: "Asia Pacific (Singapore)", region:"ap-southeast-1", endpoint:"ec2.ap-southeast-1.amazonaws.com"},
        {name: "Asia Pacific (Sydney)", region:"ap-southeast-2",	endpoint:"ec2.ap-southeast-2.amazonaws.com"},
        {name: "Asia Pacific (Tokyo)", region:"ap-northeast-1", endpoint:"ec2.ap-northeast-1.amazonaws.com"},
        {name: "South America (Sao Paulo)", region:"sa-east-1", endpoint:"ec2.sa-east-1.amazonaws.com"}];
};

var isValidPropertiesObject = function (prop){
    return _.get(prop, 'InstanceType')
        &&_.get(prop, 'ImageId')
        &&_.get(prop, 'MinCount')
        &&_.get(prop, 'MaxCount')
        &&_.get(prop, 'SecurityGroups')
        &&_.get(prop, 'KeyName');
};

var parseProperties = function (prop){
    if(!prop.count) prop.count = 1;

    return {
        ImageId: prop.image,
        MinCount: prop.count,
        MaxCount: prop.count,
        KeyName: prop.keyPair,
        SecurityGroups: [prop.securityGroups],
        InstanceType: prop.type
    };
};

var getDispositions =  function(){
    return {
        type: validTypes(),
        region: validRegions(),
        image: validImages()
    };
};

module.exports = {
    status: status,
    stop: stop,
    start: start,
    terminate: terminate,
    create: create,
    getDispositions: getDispositions
};