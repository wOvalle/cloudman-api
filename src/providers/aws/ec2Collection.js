var models = require('../models'),
    _ = require('lodash');

var instanceCollection = function(){
    this.instances = [];
};

/*
    Todo: document this.
*/
instanceCollection.prototype.parseReservation = function(data){
    var self = this;
    if(!data || _.size(data.Reservations) < 1 || _.size(data.Reservations[0].Instances) < 1) return {};

    _.each(data.Reservations, function(reservation){
        _.each(reservation.Instances, function(ins){
            var instance = new models.instance();
            instance.id = ins.InstanceId;
            instance.imageId = ins.ImageId;
            instance.architecture  = ins.Architecture;
            instance.type = ins.InstanceType;
            instance.zone = ins.Placement.AvailabilityZone;
            instance.public_dns_name = ins.PublicDnsName;
            instance.public_ip_address = ins.PublicIpAddress;
            instance.private_dns_name = ins.PrivateDnsName;
            instance.private_ip_address = ins.PrivateIpAddress;
            instance.os = ins.Platform;
            instance.stateCode = ins.State.Code;
            instance.stateName = ins.State.Name;
            instance.upSince = ins.LaunchTime;
            instance.tags = ins.Tags;
            self.instances.push(instance);
        });
    });
};


module.exports = instanceCollection;
