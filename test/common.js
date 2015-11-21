global.should = require('should-promised');
global.cloudman = require('../src/cloudman');
global.instances = [
    {
        keyName: 'main-aws',
        instanceId: 'i-9fbe3f5b'
    },
    {
        keyName: 'main-aws',
        instanceId: 'i-0ef677ca'
    }
];

global.options = {
    longTimeOut: 60000,
    midTimeOut: 30000,
    shortTimeOut: 10000
};

global.statusInstances = global.instances.map(function (instance){return instance.keyName});