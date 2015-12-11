var models = require('../models'),
    _ = require('lodash');

var onAction = function () {
    this.actions = [];
};

/*
 Todo: document this.
 */
onAction.prototype.parseAction = function (data, action, id, err) {
    var self = this;

    var ar = new models.actionRequest();
    ar.action = action;
    ar.input = id;

    if (err) {
        ar.actionProcessed = false;
        ar.err = err;
        ar.errMessage = err.toString();
    }
    else {
        ar.actionProcessed = true;
    }

    self.actions.push(ar);
};

onAction.prototype.parseCreation = function (data) {
    throw new Error('Not Implemented');
};

module.exports = onAction;