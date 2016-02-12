var models = require('../models'),
    _ = require('lodash');

var instanceCollection = function(){
    this.instances = [];
};

/*
 Todo: document this.
 */
instanceCollection.prototype.parseResponse = function(data, config){
    var self = this;

    if(!data || _.size(data.droplets) < 1) return {};

    _.each(data.droplets, function(droplet){
        var instance = new models.instance();
        /*Searching networks*/
        var networks = droplet.networks.v4;
        instance.private_ip_address = _.get(_.filter(networks, {type:"private"}), '[0].ip_address') || 'unknown';
        instance.public_ip_address = _.get(_.filter(networks, {type:"public"}), '[0].ip_address') || 'unknown';
        instance.name = droplet.name;
        instance.id = droplet.id;
        instance.imageId = _.get(droplet, 'image.slug') || 'unknown';
        instance.architecture  = _.get(droplet, 'image.name') || 'unknown';
        instance.type = _.get(droplet, 'size_slug') || 'unknown';
        instance.zone = _.get(droplet, 'region.slug') || 'unknown';
        instance.os = _.get(droplet, 'image.distribution') || 'unknown';
        instance.state = droplet.status;
        instance.cloudProvider = {provider: config.provider, keyName: config.keyName};
        self.instances.push(instance);
    });
};

module.exports = instanceCollection;