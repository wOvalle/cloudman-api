var models = require('../models'),
    _ = require('lodash');

var ec2Action = function(){
    this.actions = [];
};

/*
    Todo: document this.
*/
ec2Action.prototype.parseAction = function(data, action){
    var self = this;
    var actionAWS = '';
    var possibleStatus = [];

    if(action === 'stop')//todo: finish this if for start and terminate.
    {
        actionAWS = 'StoppingInstances';
        possibleStatus = [32, 64, 80];
    }
    //else if(action === 'start')....
    else return {}; 

    if(!_.get(data, '_action_[0].InstanceId'.replace('_action_', actionAWS))) return {};

    _.each(data[actionAWS], function(data){
            var ar = new models.actionRequest();
            ar.action = action;
            ar.input = data.InstanceId;
            ar.actionProcessed = possibleStatus.indexOf(data.CurrentState.Code) > -1 ? true : false; 

            if(!ar.actionProcessed)
            {
                ar.err = data;
                ar.errMessage =  "_action_ action couldn't be processed. Current State: _currState_."
                                 .replace('_action_', action)
                                 .replace('_currState_', data.CurrentState.Name);
            }

            self.actions.push(ar);
    });
};

// var actionCodeEnum = {
//     '0' : 'pending'
//     '16' : 'running'
//     '32' : 'shutting-down'
//     '48' : 'terminated'
//     '64' : 'stopping'
//     '80' : 'stopped'
// };

module.exports = ec2Action;
