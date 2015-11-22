var models = require('../models'),
    _ = require('lodash');

var doAction = function(){
    this.actions = [];
};

/*
 Todo: document this.
 */
doAction.prototype.parseAction = function(data, action, dropletId){
    var self = this;

    if(isErr(data)){
        var ar = new models.actionRequest();
        ar.action = action;
        ar.actionProcessed = false;
        ar.err = data.id;
        ar.errMessage = data.message;
        ar.input = dropletId;
        self.actions.push(ar);
        return;
    };

    if(!_.get(data, 'action')) return {};

    var ar = new models.actionRequest();
    ar.action = action;
    ar.input = dropletId;
    ar.actionProcessed = data.action.status === 'in-progress'? true : false;

    if(!ar.actionProcessed)
    {
        ar.err = data;
        ar.errMessage =  action + " action couldn't be processed.";
    }

    self.actions.push(ar);
};

var isErr = function(data){
    return data && data.id && data.message;
};

module.exports = doAction;