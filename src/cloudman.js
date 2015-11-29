/*
 cloudman::
 description: here we should have a provider-less implementation for the API.

 Assumptions:
 - Everything will return promises. When pass = resolve output params. When fail = reject err.

 */
var _ = require('lodash'),
    Promise = require('bluebird'),
    aws = require('./providers/aws/aws'),
    _do = require('./providers/do/do'), //do is reserved in javascript, so _do it is
    credentials = {};

/*
 * cloudman::status
 *
 * description:      get status vm's (machines, instances) in provided keyNames (in the account
 *                   related to the keyName, see cred.js).
 *
 * input:    Array of unique keyName  ['keyname1', 'keyname2'...] (see keyName in cred.js).
 *
 * output:   Array of instances. [{}, {}...] (See src/models/instances).
 *
 * */
exports.status = function (keyNames) {
    return new Promise(function (resolve, reject) {
        if (!keyNames) return reject('keyNames parameter is required');
        if (!credentials) return reject('credentials is not defined. Please run cloudman.init');

        var cred = splitProvidersFromCredentials(keyNames, credentials);

        var promise_aws = _.map(cred.aws, function (cr) {
            return aws.status(cr);
        });

        var promise_do = _.map(cred.do, function (cr) {
            return _do.status(cr);
        });

        return flattenize([promise_aws, promise_do])//we have to do flattenize first because Array.map returns an array
            .then(function (data) {
                return Promise.all(data);
            })
            .then(flattenize)
            .then(resolve);
    });
};

/*
 * cloudman::start
 *
 * description:      start vm's (machines, instances) in provided matchingInstances (in the account
 *                   related to the keyName, see cred.js).
 *
 * input:    Array of matching instances (see src/models/matchingInstance) to start.
 *
 * output:   Array of instances. [{}, {}...] (See src/models/actionRequest).
 *
 * */
exports.start = function (matchingInstances) {
    return new Promise(function (resolve, reject) {
        if (!_.get(matchingInstances, '[0].keyName')) return reject('matchingInstances parameter is invalid');
        if (!credentials) return reject('credentials is not defined. Please run cloudman.init');

        var insWithCred = splitInstancesWithCredentials(matchingInstances, credentials);

        var promise_aws = _.map(insWithCred.aws, function (i) {
            return aws.start(i.cred, [i.instanceId]);
        });

        var promise_do = _.map(insWithCred.do, function (i) {
            return _do.start(i.cred, i.instanceId);
        });

        return flattenize([promise_aws, promise_do])//we have to do flattenize first because Array.map returns an array
            .then(function (data) {
                return Promise.all(data);
            })
            .then(flattenize)
            .then(resolve);
    });
};

/*
 * cloudman::stop
 *
 * description:      stop vm's (machines, instances) in provided matchingInstances (in the account
 *                   related to the keyName, see cred.js).
 *
 * input:    Array of matching instances (see src/models/matchingInstance) to stop.
 *
 * output:   Array of instances. [{}, {}...] (See src/models/actionRequest).
 *
 * */
exports.stop = function (matchingInstances) {
    return new Promise(function (resolve, reject) {
        if (!_.get(matchingInstances, '[0].keyName')) return reject('matchingInstances parameter is invalid');
        if (!credentials) return reject('credentials is not defined. Please run cloudman.init');

        var insWithCred = splitInstancesWithCredentials(matchingInstances, credentials);

        var promise_aws = _.map(insWithCred.aws, function (i) {
            return aws.stop(i.cred, [i.instanceId]);
        });

        var promise_do = _.map(insWithCred.do, function (i) {
            return _do.stop(i.cred, i.instanceId);
        });

        return flattenize([promise_aws, promise_do])//we have to do flattenize first because Array.map returns an array
            .then(function (data) {
                return Promise.all(data);
            })
            .then(flattenize)
            .then(resolve);
    });
};

/*
 * cloudman::terminate
 *
 * description:         terminate vm's (machines, instances) in provided matchingInstances (in the account
 *                      related to the keyName, see cred.js).
 *
 * input: 	Array of matching instances (see src/models/matchingInstance) to terminate.
 *
 * output: 	Array of instances. [{}, {}...] (See src/models/actionRequest).
 *
 * */
exports.terminate = function (matchingInstances) {
    return new Promise(function (resolve, reject) {
        if (!_.get(matchingInstances, '[0].keyName')) return reject('matchingInstances parameter is invalid');
        if (!credentials) return reject('credentials is not defined. Please run cloudman.init');

        var insWithCred = splitInstancesWithCredentials(matchingInstances, credentials);

        var promise_aws = _.map(insWithCred.aws, function (i) {
            return aws.terminate(i.cred, [i.instanceId]);
        });

        var promise_do = _.map(insWithCred.do, function (i) {
            return _do.terminate(i.cred, i.instanceId);
        });

        return flattenize([promise_aws, promise_do])//we have to do flattenize first because Array.map returns an array
            .then(function (data) {
                return Promise.all(data);
            })
            .then(flattenize)
            .then(resolve);
    });
};

/*
 * cloudman::create
 *
 * description:     create new instances in a given cloud provider.
 *
 * input:   array of matching instances (see src/models/newInstance) to create.
 *
 * output:  array of create request (see src/models/actionRequest) with request resolution.
 * */
exports.create = function (newInstance) {
    return new Promise(function (resolve, reject) {
        if (!_.get(newInstance, '[0].keyName')) return reject('credentials parameter is invalid');
        if (!credentials) return reject('credentials is not defined. Please run cloudman.init');

        var insWithCred = addCredentialsToProperties(newInstance, credentials);

        var promise_aws = _.map(insWithCred.aws, function (i) {
            return aws.create(i.cred, i.properties);
        });

        var promise_do = _.map(insWithCred.do, function (i) {
            return _do.create(i.cred, i.properties);
        });

        return flattenize([promise_aws, promise_do])//we have to do flattenize first because Array.map returns an array
            .then(function (data) {
                return Promise.all(data);
            })
            .then(flattenize)
            .then(resolve)
            .catch(function(err){
                console.log(err);
            });
    });
};

/*
 * cloudman::validDispositions
 *
 * description:     returns the possible values for certain fields in create instances.
 *
 * input:   [].
 *
 * output:  object with dispositions per provider.
 * */
exports.validDispositions = function () {
    return new Promise(function (resolve, reject) {

        var fields_aws = aws.getDispositions();
        var fields_do = _do.getDispositions();

        return resolve({aws: fields_aws, do : fields_do});
    });
};

/*
 * cloudman::_validProviders
 *
 * description:     return valid providers by code.
 *
 * input:   [].
 *
 * output:  valid providers.
 * */
exports._validProviders = function () {
    return ['aws', 'do'];
};

/*
 * cloudman::flattenize
 *
 * description: 	Helper to flatten arrays.
 *
 * input: 	data to flattenize.
 *
 * output: 	flattenized array.
 *
 * */
var flattenize = function (data) {
    return new Promise(function (resolve, reject) {
        return resolve(_.flatten(data));
    });
};
/*
 * cloudman::splitProvidersFromCredentials
 *
 * description:     Receives one array of keyNames and one array of credentials and
 *                  returns an array ofcredentials grouped by provider.
 *
 * input:   keyName array.
 *          credentials array.
 *
 * output:  filtered array.
 *
 * */
var splitProvidersFromCredentials = function (_keyNames, _credentials) {
    return _.filter(_credentials, function (cred) {
        return _keyNames.indexOf(cred.keyName) >= 0;
    }).reduce(function (res, cred) {
        res[cred.provider] = res[cred.provider] || [];
        res[cred.provider].push(cred);
        return res;
    }, {});
};

/*
 * cloudman::splitInstancesWithCredentials
 *
 * description:     Receives one array of instances {instanceID, keyName} and one array of
 *                  credentials and returns an each instance with their corresponding cre-
 *                  dential grouped by provider.
 *
 * input:   instance array.
 *          credentials array.
 *
 * output: 	filtered array.
 *
 * */
var splitInstancesWithCredentials = function (_instances, _credentials) {
    return _instances.map(function (instance) { //add the corresponding credential to each instance
        instance.credential = _.find(credentials, {keyName: instance.keyName});
        return instance;
    }).reduce(function (res, instance) { //return an object grouped by [provider]
        res[instance.credential.provider] = res[instance.credential.provider] || [];
        res[instance.credential.provider].push({instanceId: instance.instanceId, cred: instance.credential});
        return res;
    }, {});
};

/*
 * cloudman::addCredentialsToProperties
 *
 * description:     Receives one array of newInstances {keyName, properties} and one array
 *                  of credentials and returns an each newinstance with their corresponding
 *                  credential grouped by provider.
 *
 * input: 	newInstances array.
 * 			credentials array.
 *
 * output: 	filtered array.
 *
 * */
var addCredentialsToProperties = function (_newInstances, _credentials) {
    return _newInstances.map(function (newInstance) { //add the corresponding credential to each instance
        newInstance.credential = _.find(credentials, {keyName: newInstance.keyName});
        return newInstance;
    }).reduce(function (res, newInstance) { //return an object grouped by [provider]
        res[newInstance.credential.provider] = res[newInstance.credential.provider] || [];
        res[newInstance.credential.provider].push({cred: newInstance.credential, properties: newInstance.properties});
        return res;
    }, {});
};


/*DEPRECATED METHODS*/
/*
 * cloudman::setCredentials
 *
 * description:     Receives one array of keyNames and one array of credentials
 *                  and returns all the credentials with the given keyNames.
 *
 * input:   keyNames array
 *          credentials array.
 *
 * output: 	filtered array.
 *
 * */
var setCredentials = function (_keyNames, _credentials) {
    return _.filter(_credentials, function (cred) {
        return _keyNames.indexOf(cred.keyName) >= 0;
    });
};

/*
 * cloudman::filterProvider
 *
 * description:     Receives one array of credentials and one provider and
 *                  returns all the credentials for the given provider.
 *
 * input:   keyNames array
 *          credentials array.
 *
 * output:  filtered array.
 *
 * */
var filterProvider = function (_cred, _provider) {
    return _.filter(_cred, function (cr) {
        return cr.provider === _provider;
    });
};

/*
 * cloudman::filterMatchingInstances
 *
 * description:     Receives one array of credentials and one array of MatchingInstances and
 *                  returns all the MatchingInstances for these credentials.
 *
 * input:   credentials array.
 *          matchingInstances array.
 *
 * output: 	filtered array.
 *
 * */
var filterMatchingInstances = function (_cred, _matchingInstances) {
    var _credKeyNames = _cred.map(function (cr) {
        return cr.keyName;
    });

    return _.filter(_matchingInstances, function (mi) {
        return _credKeyNames.indexOf(mi.keyName) >= 0;
    });
};

/*
 * cloudman::init
 *
 * description:     Receives array of credentials and store them.
 *
 * input:   credentials array.
 *
 * output:  none.
 *
 * */
exports.init = function (cred) {
    credentials = cred;
};
