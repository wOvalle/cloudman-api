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
        ar.action = action.type;
        ar.actionProcessed = false;
        ar.err = data.id;
        ar.errMessage = data.message;
        ar.input = dropletId;
        self.actions.push(ar);
        return;
    };


    if(isDelete(data, action)){
        var ar = new models.actionRequest();
        ar.action = action.type;
        ar.actionProcessed = true;
        ar.input = dropletId;
        self.actions.push(ar);
        return;
    };

    if(!_.get(data, 'action')) return {};

    var ar = new models.actionRequest();
    ar.action = action.type;
    ar.input = dropletId;
    ar.actionProcessed = data.action.status === 'in-progress'? true : false;

    if(!ar.actionProcessed)
    {
        ar.err = data;
        ar.errMessage =  action + " action couldn't be processed.";
    }

    self.actions.push(ar);
};

doAction.prototype.parseCreation = function(data){
    var self = this;

    if(isErr(data)){
        var ar = new models.actionRequest();
        ar.action = 'create';
        ar.actionProcessed = false;
        ar.err = data.id;
        ar.errMessage = data.message;
        ar.input = '';
        self.actions.push(ar);
        return;
    };

    if(!_.get(data, 'droplet')) return {};

    var ar = new models.actionRequest();
    ar.action = 'create';
    ar.input = data.droplet.id;
    ar.actionProcessed = true;

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

var isDelete = function(data, action){
    return !data &&  action && action.type === 'delete';
};

module.exports = doAction;