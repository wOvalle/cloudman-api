/*
 TODO:
 - refactor objects like IP && dns
 */

module.exports = function ()
{
	this.id = '';
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
