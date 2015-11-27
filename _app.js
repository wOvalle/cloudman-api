var cman = require('./src/providers/aws/aws');
var cman_do = require('./src/providers/do/do');
var cloudman = require('./src/cloudman');
var cred = require('./src/cred');
var beautify = require('js-beautify').js_beautify;
/*test config*/
var instances = [{
		keyName: 'amazon',
		instanceId: 'i-9fbe3f5b'
	}, 
	{
		keyName: 'amazon',
		instanceId:'i-0ef677ca'
	},
	{
		keyName: 'digitalocean',
		instanceId:'8912118'
	},
	{
		keyName: 'amazon2',
		instanceId:'i-0ef677ca'
	},
	{
		keyName: 'digitalocean',
		instanceId:'8963879'
	}
];

//var x = cloudman.splitInstancesWithCredentials(instances, cred);
//console.log(beautify(JSON.stringify(x)));
//stopIntances()
//console.log(cloudman.splitProvidersFromCredentials(instances.map(function(i){return i.keyName}), cred));
//stopIntances([instances[0], instances[2]]);
getStatus();
//cloudman.start(['a', 'b']).then(console.log(0));
//cloudman.create([{keyName: 'digitalocean', properties: {name: 'testApi', image:'ubuntu-15-10-x64', ram:"512mb", region: "nyc1", hd: "20"}}]).then(console.log(0));
//cman_do.status(cred[2]).then(console.log);
//cman_do.create(cred[2], {type: 'a', y:'t'}).then(console.log);
//cman_do.terminate(cred[2],instances[4].instanceId).then(console.log);


//getStatus -> startIntances -> getStatus -> stopIntances -> getStatus
//getStatus().then(function(){
//	startIntances().then(function(){
//			//Wait for the instances to be started
//			setTimeout(function() {
//				getStatus().then(function(){
//					stopIntances().then(function(){
//						//Wait for the instances to be stopped
//						setTimeout(function() {
//							getStatus();
//					}, 50000);
//				})}
//			)}, 50000);
//		})
//	});

function getStatus(){
	var intancesKeyNames = instances.map(function(inst){
		return inst.keyName;
	});
	return cloudman.status(intancesKeyNames)
	    .then(function(res){
			console.log('****Actual status****');
			console.log('data', beautify(JSON.stringify(res)));
	    })
	    .catch(function(err){console.log(err.stack)});
}

function startIntances(z){
	return cloudman.start(z || instances)
	    .then(function(res){
			console.log('****Start instances****');
			console.log('data', beautify(JSON.stringify(res)));
	    })
	    .catch(function(err){console.log(err.stack)});
}

function stopIntances(z){
	return cloudman.stop(z || instances)
	    .then(function(res){
			console.log('****Stop instances****');
			console.log('data', beautify(JSON.stringify(res)));
	    })
	    .catch(function(err){console.log(err)});
}

function terminateIntances(){
	return cloudman.terminate(instances)
	    .then(function(res){
			console.log('data', beautify(JSON.stringify(res)));
	    })
	    .catch(function(err){console.log(err)});
}