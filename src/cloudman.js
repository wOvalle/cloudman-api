/*
	cloudman::
		description: here we should have a provider-less implementation for the API.
	

	cloudman::stop 
		description: stop given instances.

		input: 	array of matching instances (see src/models/matchingInstance) to stop. 
		
		output: array of action request (see src/models/actionRequest) with request resolution.
		
		
	cloudman::start 
		description: start given instances.
		
		input: 	array of matching instances (see src/models/matchingInstance) to start. 
		
		output: array of start request (see src/models/actionRequest) with request resolution.
		

	cloudman::terminate 
		description: terminate (delete, dismiss) given instances.
		
		input: 	array of matching instances (see src/models/matchingInstance) to terminate. 
		
		output: array of terminate request (see src/models/actionRequest) with request resolution.


	cloudman::create 
		description: create given instances.
		
		input: 	array of matching instances (see src/models/newInstance) to create. 
		
		output: array of create request (see src/models/actionRequest) with request resolution.


	Assumptions: 
		- Everything will return promises. When pass = resolve output params. When fail = reject err.

*/
var 	_ = require('lodash'),
 		Promise = require('bluebird'),
	 	credentials = require('./cred'),
	 	aws = require('./providers/aws/aws');


/*
* cloudman::status
*
* description: 		get status vm's (machines, instances) in provided keyNames (in the account
* 					related to the keyName, see cred.js).
*
* input: 	Array of unique keyName  ['keyname1', 'keyname2'...] (see keyName in cred.js).
*
* output: 	Array of instances. [{}, {}...] (See src/models/instances).
*
* */
exports.status = function(keyNames){
	return new Promise(function(resolve, reject){
		var cred = setCredentials(keyNames, credentials);
		var awsCred = filterProvider(cred, 'aws');

		var promise_aws = _.map(awsCred, function(cr){
			return aws.status(cr);
		});

		return Promise.all(promise_aws)
			.then(flattenize)
			.then(resolve);
	});

};

/*
 * cloudman::status
 *
 * description: 	Helper to flatten arrays.
 *
 * input: 	data to flattenize.
 *
 * output: 	flattenized array.
 *
 * */
var flattenize = function(data){
	return new Promise(function(resolve, reject){
		resolve(_.flatten(data));
	});
};

/*
 * cloudman::setCredentials
 *
 * description: 	Receives one array of keyNames and one array of credentials
  * 				and returns all the credentials with the given keyNames.
 *
 * input: 	keyNames array
 * 			credentials array.
 *
 * output: 	filtered array.
 *
 * */
var setCredentials = function(_keyNames, _credentials){
	return _.filter(_credentials, function(cred){
		return _keyNames.indexOf(cred.keyName)> -1;
	});
};

/*
 * cloudman::filterProvider
 *
 * description: 	Receives one array of credentials and one provider and
 * 					returns all the credentials for the given provider.
 *
 * input: 	keyNames array
 * 			credentials array.
 *
 * output: 	filtered array.
 *
 * */
var filterProvider = function(_cred, _provider){
	return _.filter(_cred, function(cr){
		return cr.provider === _provider;
	});
};

