/*
	newInstance::
		description: create request model.

		properties:
			keyName: unique keyName of the account related to the cloud provider (see cred.js).
			properties: object that contains the properties with which the instance will be
						created. //arbitrary for now
	TODO:
		- define what properties object will be.

	TODO (maybe): 
		- terminate can receive custom terminate behavior (ej. force to erase (or not to) disk 
		  when terminate, for example).
*/

module.exports = function ()
{
	this.keyName = '';
    this.properties = new propertiesObj();
};

var propertiesObj = function(){
	this.name = '';
	this.image = '';
	this.ram = '';
	this.hd = '';
	this.region = '';
};
