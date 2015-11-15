var cman = require('./src/providers/aws/aws');
var beautify = require('js-beautify').js_beautify
/*test config*/
var config = require('./src/cred')[0];

// cman.status(config)
//     .then(function(res){
// 	console.log('data', beautify(JSON.stringify(res)));
//     })
//     .catch(function(err){console.log(err.stack)});
cman.stop(config, ['i-9fbe3f5b', 'i-0ef677ca'])
    .then(function(res){
	console.log('data', beautify(JSON.stringify(res)));
    })
    .catch(function(err){console.log(err)});