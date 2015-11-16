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
        possibleStatus = [actionCode.shuttingDown, actionCode.stopping, actionCode.stopped];
    }
    else if(action === 'start'){
        actionAWS = 'StartingInstances';
        possibleStatus = [actionCode.running];
    }
    else if(action === 'terminate'){
        actionAWS = 'TerminatingInstances';
        possibleStatus = [actionCode.terminate];
    }
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

var actionCode = {
    pending: 0,
    running: 16,
    shuttingDown: 32,
    terminated: 48,
    stopping: 64,
    stopped: 80
};

module.exports = ec2Action;