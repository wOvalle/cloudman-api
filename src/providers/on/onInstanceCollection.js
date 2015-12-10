var models = require('../models'),
    _ = require('lodash');

var instanceCollection = function(){
    this.instances = [];
};


instanceCollection.prototype.parseResponse = function(data, config){
    var self = this;

    _.each(data, function(vm){
        var instance = new models.instance();
        instance.private_ip_address = vm.TEMPLATE.NIC.IP;
        instance.public_ip_address = _.filter(networks, {type:"public"})[0].ip_address;

        instance.id = vm.ID;
        instance.imageId = vm.TEMPLATE.DISK.IMAGE;
        instance.architecture  = droplet.image.name;
        instance.type = droplet.size_slug;
        instance.zone = droplet.region.slug;
        instance.os = droplet.image.distribution;
        instance.state = droplet.status;
        instance.cloudProvider = {provider: config.provider, keyName: config.keyName};
        self.instances.push(instance);
    });
};

var stateEnum = {
    any: -2,
    anyButDone: -1,
    init: 0,
    pending: 1,
    hold: 2,
    active: 3,
    stopped: 4,
    suspended: 5,
    done: 6,
    failed: 7
};

var getStateByCode = function(code){
    return _.findKey(stateEnum, function(v){ return v == code});
};


module.exports = instanceCollection;