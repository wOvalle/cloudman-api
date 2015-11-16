var cman = require('./src/providers/aws/aws');
var beautify = require('js-beautify').js_beautify
/*test config*/
var config = require('./src/cred')[0];
var instances = ['i-9fbe3f5b', 'i-0ef677ca'];

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
	return cman.status(config)
	    .then(function(res){
			console.log('****Actual status****');
			console.log('data', beautify(JSON.stringify(res)));
	    })
	    .catch(function(err){console.log(err.stack)});
}

function startIntances(){
	return cman.start(config, instances)
	    .then(function(res){
			console.log('****Start instances****');
			console.log('data', beautify(JSON.stringify(res)));
	    })
	    .catch(function(err){console.log(err)});
}

function stopIntances(){
	return cman.stop(config, instances)
	    .then(function(res){
			console.log('****Stop instances****');
			console.log('data', beautify(JSON.stringify(res)));
	    })
	    .catch(function(err){console.log(err)});
}

function terminateIntances(){
	return cman.terminate(config, instances)
	    .then(function(res){
			console.log('data', beautify(JSON.stringify(res)));
	    })
	    .catch(function(err){console.log(err)});
}