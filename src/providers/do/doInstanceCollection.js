var models = require('../models'),
    _ = require('lodash');

var instanceCollection = function(){
    this.instances = [];
};

/*
 Todo: document this.
 */
instanceCollection.prototype.parseResponse = function(data){
    var self = this;

    if(!data || _.size(data.droplets) < 1) return {};

    _.each(data.droplets, function(droplet){
        var instance = new models.instance();
        /*Searching networks*/
        var networks = droplet.networks.v4;
        instance.private_ip_address = _.filter(networks, {type:"private"})[0].ip_address;
        instance.public_ip_address = _.filter(networks, {type:"public"})[0].ip_address;

        instance.id = droplet.id;
        instance.imageId = droplet.image.slug;
        instance.architecture  = droplet.image.name;
        instance.type = droplet.size_slug;
        instance.zone = droplet.region.slug;
        instance.os = droplet.image.distribution;
        instance.state = droplet.status;
        self.instances.push(instance);
    });
};

module.exports = instanceCollection;