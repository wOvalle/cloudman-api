var Promise = require('bluebird'),
    _ = require('lodash'),
    DigitalOcean = require('do-wrapper'),
    doInstanceCollection = require('./doInstanceCollection'),
    doActionCollection = require('./doActionCollection'),
    providerName = 'do',
    common = require('../../common'),
    event = {};

var status = function (config) {
    return new Promise(function(resolve, reject) {
        if(!config) return reject('config var must have credential information.');

        event = common.createEvent('do.status', config);

        _init(config)
            .then(_getStatus.bind(null, config))
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

var stop = function (config, dropletId) {
    return new Promise(function(resolve, reject) {
        var doAction = {
            type: 'shutdown'
        };

        event = common.createEvent('do.stop', {config: config, id: dropletId});

        _init(config)
            .then(_requestAction.bind(null, dropletId, doAction, 'stop'))
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

var start = function (config, dropletId) {
    return new Promise(function(resolve, reject) {
        var doAction = {
            type: 'power_on'
        };

        event = common.createEvent('do.start', {config: config, id: dropletId});

        _init(config)
            .then(_requestAction.bind(null, dropletId, doAction, 'start'))
            .then(common.resolver.bind(null, resolve, event))
            .catch(common.rejecter.bind(null, reject, event));
    });
};

var terminate = function (config, dropletId) {
    return new Promise(function(resolve, reject) {

        var actionCollection = new doActionCollection();

        event = common.createEvent('do.terminate', {config: config, id: dropletId});

        _init(config)
            .then(function(api){
                api.dropletsDelete(dropletId, function(err, res, body){
                    if (err)
                        return common.rejecter(reject, event, err);
                    else {
                        actionCollection.parseAction(body, {type: 'delete'}, dropletId);
                        return common.resolver(resolve, event, actionCollection.actions);
                    }

                });
            })
            .catch(common.rejecter.bind(null, reject, event));

    });
};

var create = function (config, properties) {
    return new Promise(function(resolve, reject) {
        var doProperties = parseProperties(properties);
        if(!isValidPropertiesObject(doProperties)) return reject ('invalid properties object');

        event = common.createEvent('do.create', {config: config, properties: properties});

        doProperties.private_networking = true;
        var actionCollection = new doActionCollection();

        _init(config)
            .then(function(api){
                api.dropletsCreate(doProperties, function(err, res, body){
                    if (err)
                        return common.rejecter(reject, event, err);
                    else {
                        actionCollection.parseCreation(body);
                        return common.resolver(resolve, event, actionCollection.actions);
                    }
                });
            })
            .catch(common.rejecter.bind(null, reject, event));
    });
};

var _init = function(config){
    if (!config) return reject('Bad configuration');
    if (!config.token) return reject('token is required');

    return new Promise(function(resolve, reject){
        return resolve(new DigitalOcean(config.token, config.pageSize));
    });
};

var _getStatus = function(config, api){
    return new Promise(function(resolve, reject){
        var collection = new doInstanceCollection();

        api.dropletsGetAll({}, function (err, res, body) {
            if (err)
                return reject(err);
            else {
                collection.parseResponse(body, config);
                return resolve(collection.instances);
            }
        });
    });
};

var _requestAction = function(dropletId, doAction, cmanAction, api){
    return new Promise(function(resolve, reject){
        var actionCollection = new doActionCollection();

        api.dropletsRequestAction(dropletId, doAction, function(err, res, body){
            if (err)
                return reject(err);
            else {
                actionCollection.parseAction(body, cmanAction, dropletId);
                return resolve(actionCollection.actions);
            };
        });
    });
};

var handleError = function(err){
    //TODO (maybe): Errors should be logged in here.
    console.log(err.stack);
};

var rawImages = function(){
    return [
            {
                "id": 14489284,
                "name": "835.7.0 (beta)",
                "distribution": "CoreOS",
                "slug": "coreos-beta",
                "public": true,
                "regions": [ "nyc1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1" ],
                "created_at": "2015-11-20T22:50:38Z",
                "min_disk_size": 20,
                "type": "snapshot"
            },
            {
                "id": 10322059,
                "name": "7.0 x64",
                "distribution": "Debian",
                "slug": "debian-7-0-x64",
                "public": true,
                "regions": [ "nyc1", "ams1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1" ],
                "created_at": "2015-01-28T16:09:29Z",
                "min_disk_size": 20,
                "type": "snapshot"
            },
            {
                "id": 12065782,
                "name": "22 x64",
                "distribution": "Fedora",
                "slug": "fedora-22-x64",
                "public": true,
                "regions": [ "nyc1", "ams1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1" ],
                "created_at": "2015-05-28T19:54:54Z",
                "min_disk_size": 20,
                "type": "snapshot"
            },
            {
                "id": 13089493,
                "name": "14.04 x64",
                "distribution": "Ubuntu",
                "slug": "ubuntu-14-04-x64",
                "public": true,
                "regions": [ "nyc1", "ams1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1"],
                "created_at": "2015-08-10T21:30:19Z",
                "min_disk_size": 20,
                "type": "snapshot"
            },
            {
                "id": 13089823,
                "name": "14.04 x32",
                "distribution": "Ubuntu",
                "slug": "ubuntu-14-04-x32",
                "public": true,
                "regions": [ "nyc1", "ams1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1"],
                "created_at": "2015-08-10T22:02:27Z",
                "min_disk_size": 20,
                "type": "snapshot"
            },
            {
                "id": 13090046,
                "name": "6.7 x64",
                "distribution": "CentOS",
                "slug": "centos-6-5-x64",
                "public": true,
                "regions": ["nyc1", "ams1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1"],
                "created_at": "2015-08-10T22:31:04Z",
                "min_disk_size": 20,
                "type": "snapshot"
            },
            {
                "id": 13321858,
                "name": "10.2",
                "distribution": "FreeBSD",
                "slug": "freebsd-10-2-x64",
                "public": true,
                "regions": [ "nyc1", "ams1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1"],
                "created_at": "2015-08-28T19:14:36Z",
                "min_disk_size": 20,
                "type": "snapshot"
            },
            {
                "id": 13887903,
                "name": "7.1 x64",
                "distribution": "CentOS",
                "slug": "centos-7-0-x64",
                "public": true,
                "regions": [ "nyc1", "ams1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1"],
                "created_at": "2015-10-09T14:45:26Z",
                "min_disk_size": 20,
                "type": "snapshot"
            },
            {
                "id": 14169855,
                "name": "15.10 x64",
                "distribution": "Ubuntu",
                "slug": "ubuntu-15-10-x64",
                "public": true,
                "regions": [ "nyc1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1"],
                "created_at": "2015-10-29T20:33:55Z",
                "min_disk_size": 20,
                "type": "snapshot"
            },
            {
                "id": 14169868,
                "name": "15.10 x32",
                "distribution": "Ubuntu",
                "slug": "ubuntu-15-10-x32",
                "public": true,
                "regions": ["nyc1", "sfo1", "nyc2", "ams2", "sgp1", "lon1", "nyc3", "ams3", "fra1", "tor1"],
                "created_at": "2015-10-29T20:35:13Z",
                "min_disk_size": 20,
                "type": "snapshot"
            }
        ]
};

var validImages = function(){
  return rawImages().map(function(img){
      return {label: img.distribution + ' ' + img.name, id: img.slug}
  });
};

var validRegions = function(){
    return _.pluck(_.where(rawImages(), {id: 13887903}), 'regions')[0]
        .map(function(it){return {id: it, label: it}});//image 13887903 is available in all regions
};

var imageIsValidInRegion = function (imageId, region){
    return _.pluck(_.where(rawImages(), {slug: imageId}), 'regions').indexOf(region) > 1 ;
};

var isValidPropertiesObject = function (prop){
    return _.get(prop, 'name') && _.get(prop, 'region') &&_.get(prop, 'size') &&_.get(prop, 'image');
};

var parseProperties = function (prop){
    return {name: prop.name, region: prop.region, size: prop.type, image: prop.image};
};

var validTypes = function (prop){
    return ["512mb", "1gb", "2gb", "4gb", "8gb", "16gb"]
        .map(function(it){return {id: it, label: it}});
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