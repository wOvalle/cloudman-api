global.should = require('should-promised');
global.cloudman = require('../src/cloudman');
global.instances = [
    {
        keyName: 'amazon',
        instanceId: 'i-9fbe3f5b'
    },
    {
        keyName: 'amazon2',
        instanceId: 'i-0ef677ca'
    },
    {
        keyName: 'digitalocean',
        instanceId: '8912118'
    }
];

global.options = {
    longTimeOut: 60000,
    midTimeOut: 30000,
    shortTimeOut: 10000
};

global.statusInstances = global.instances.map(function (instance){return instance.keyName});