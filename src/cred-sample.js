/*
	cred-sample.js::
		description: array of credentials of cloud providers accounts. 
	
		properties:
			key (required): (or username) of user in cloud provider.
			secret (required): (or password) secret of the given user. That's straight forward.
			region (required): region of the machines.
			provider (required): cloud service provider (aws or do).
			keyName (required): unique name of the account. 
			tags (optional): tags that describe the accounts.
			
*/

module.exports = [{
    key: 'key',
    secret: 'secret',
    region: 'region',
    provider: 'cloud-provider',
    keyName: 'Name of this keypair, must be unique',
    tags : ['arr of tags like']
}];