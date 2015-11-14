/*
	models.actionRequest: 	result of interaction with each of the cloud providers. 

	action: [string] action executed: start, stop, terminate, and so on...
	actionProcessed: [boolean] If the action could be performed.
	err: [object]. Should contain the same error object as the provider's sdk (for logging purposes).
	errMessage [string]: The error message extracted from the error object.
	input: [object] Should contain the input for this result. i.e. If I'm calling startInstance 
					method in aws, an instanceId must be passed to know which instance to start, 
					input should contain that instanceId variable.
*/

module.exports = function ()
{
	this.action: '', 
	this.actionProcessed: false; 
	this.err: {}; 
	this.errMessage: ''; 
	this.input: {}''
};