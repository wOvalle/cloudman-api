var models = require('../models'),
    _ = require('lodash');

var instanceCollection = function(){
    this.instances = [];
};


instanceCollection.prototype.parseResponse = function(data, config){
    var self = this;

    _.each(data, function(vm){
        var instance = new models.instance();
        instance.private_ip_address = _.get(vm, 'TEMPLATE.NIC.IP') || 'unknown';
        instance.private_dns_name = _.get(vm, 'HISTORY_RECORDS.HISTORY.HOSTNAME') || 'unknown';
        instance.name = vm.NAME;
        instance.id = vm.ID;
        instance.imageId = _.get(vm, 'TEMPLATE.DISK.IMAGE') || 'unknown';

        instance.type = "Template:" + vm.TEMPLATE.TEMPLATE_ID;
        instance.zone = vm.UNAME;
        instance.os = _.get(vm, 'TEMPLATE.DISK.IMAGE') || 'unknown';
        instance.state = getStateByCode(vm.STATE) || 'unknown';
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