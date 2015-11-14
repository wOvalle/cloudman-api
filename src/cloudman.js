/*
	cloudman::
		description: here we should have a provider-less implementation for the API.


	cloudman::status  
		description: 	get status vm's (machines, instances) in provided keyNames (in the account 
						related to the keyName, see cred.js).
	
		input: Array of unique keyName  ['keyname1', 'keyname2'...] (see keyName in cred.js).

		output: Array of instances. [{}, {}...] (See src/models/instances).
	

	cloudman::stop 
		description: stop given instances.

		input: 	array of matching instances (see src/models/matchingInstance) to stop. 
		
		output: array of action request (see src/models/actionRequest) with request resolution.
		
		
	cloudman::start 
		description: start given instances.
		
		input: 	array of matching instances (see src/models/matchingInstance) to start. 
		
		output: array of start request (see src/models/actionRequest) with request resolution.
		

	cloudman::terminate 
		description: terminate (delete, dismiss) given instances.
		
		input: 	array of matching instances (see src/models/matchingInstance) to terminate. 
		
		output: array of terminate request (see src/models/actionRequest) with request resolution.


	cloudman::create 
		description: create given instances.
		
		input: 	array of matching instances (see src/models/newInstance) to create. 
		
		output: array of create request (see src/models/actionRequest) with request resolution.


	Assumptions: 
		- Everything will return promises. When pass = resolve output params. When fail = reject err.

*/