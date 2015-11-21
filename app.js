var cman = require('./src/providers/aws/aws');
var cloudman = require('./src/cloudman');
var beautify = require('js-beautify').js_beautify;
/*test config*/
var instances = [{
		keyName: 'main-aws',
		instanceId: 'i-9fbe3f5b'
	}, 
	{
		keyName: 'main-aws',
		instanceId:'i-0ef677ca'
	}];


//getStatus -> startIntances -> getStatus -> stopIntances -> getStatus
getStatus().then(function(){
	startIntances().then(function(){
			//Wait for the instances to be started
			setTimeout(function() {
				getStatus().then(function(){
					stopIntances().then(function(){
						//Wait for the instances to be stopped
						setTimeout(function() {
							getStatus();
					}, 50000);
				})}	
			)}, 50000);
		})
	});

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

function startIntances(){
	return cloudman.start(instances)
	    .then(function(res){
			console.log('****Start instances****');
			console.log('data', beautify(JSON.stringify(res)));
	    })
	    .catch(function(err){console.log(err)});
}

function stopIntances(){
	return cloudman.stop(instances)
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