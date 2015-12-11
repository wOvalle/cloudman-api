/*
	instance::
		description: 	define global instances properties. Represent a virtual machine 
						in a cloud provider.

		TODO: describe all the properties
 */

module.exports = function ()
{
	this.id = '';
	this.name = '';
    this.imageId = '';
	this.architecture  = '';
	this.type = '';
	this.zone = '';
	this.public_dns_name = '';
	this.public_ip_address = '';
	this.private_dns_name = '';
	this.private_ip_address = '';
	this.os = '';
	this.state = '';
	this.upSince = '';
    this.tags = [];
};
