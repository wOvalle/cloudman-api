/*
	----API IMPLEMENTATION----

	Here we should have a provider-less implementation for the API.

	Methods that must be implemented: 
	status -> get status of current vm's in all environments.
		input: Array of unique names of credentials (see key in cred.js array).
		output: Array of instances. See src/models/instances.
	
	stop-> stop instances.
		input: array of instances keyvalues [{key : instanceId}] to stop (see key in cred.js array). 
		output: array of stopRequest (corresponding the values passed in input) with request resolution.
		actionRequest: [{action: 'stop', actionProcessed: true/false; err: err; errMessage: messageError; inputKeyValue: inputParameter}] 

	start-> start instances.
		input: array of instances keyvalues [{key : instanceId}] to start (see key in cred.js array). 
		output: array of startRequest (corresponding the values passed in input) with request resolution.
		actionRequest: [{action: 'start', actionProcessed: true/false; err: err; errMessage: messageError; inputKeyValue: inputParameter}] 

	terminate-> start instances.
		input: array of instances keyvalues [{key : instanceId}] to start (see key in cred.js array). 
		output: array of startRequest (corresponding the values passed in input) with request resolution.
		actionRequest: [{action: 'terminate', actionProcessed: true/false; err: err; errMessage: messageError; inputKeyValue: inputParameter}] 

	create-> start instances.
		input: array of instances keyvalues [{key : instanceId, properties: properties}] being key unique connection key in cred.js and 
			   properties array of attributes that vm will have on creation. 
		output: array of createRequest (corresponding the values passed in input) with request resolution.
		actionRequest: [{action: 'create', actionProcessed: true/false; err: err; errMessage: messageError; inputKeyValue: inputParameter}] 

	TODO:
		- define actionRequest and create a model for that.
		- define what properties in createRequest will be.

	TODO (maybe): 
		- terminate can receive custom terminate behavior (ej. force to erase (or not to) disk when terminate, for example).

	Assumptions: 
		- Everything will return promises. When pass = resolve output params. When fail = reject err.

*/

/*
	For testing purposes, we're just exposing aws implementations.

	TODO: 
		- Export api implementation as described before.
*/
module.exports = require('./providers/aws/aws');