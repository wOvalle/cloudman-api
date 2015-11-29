var cred = require('../../src/cred');

describe('cloudman', function(){
    cloudman.init(cred);
    describe('status', function(){
        it('should be a promise', function(){
            cloudman.status(statusInstances).should.be.a.Promise();
        });

        it('array should have src/models/instance.js properties', function(done){
            this.timeout(options.shortTimeOut);

            cloudman.status(statusInstances).then(function(res){
                res.should.be.an.Array();
                res[0].should.be.an.Object()
                res[0].should.have.property('id');
                res[0].should.have.property('imageId');
                res[0].should.have.property('architecture');
                res[0].should.have.property('type');
                res[0].should.have.property('zone');
                res[0].should.have.property('public_dns_name');
                res[0].should.have.property('public_ip_address');
                res[0].should.have.property('private_dns_name');
                res[0].should.have.property('private_ip_address');
                res[0].should.have.property('os');
                res[0].should.have.property('state');
                res[0].should.have.property('upSince');
                res[0].should.have.property('tags');
                done();

            }, done);
        });

        it('should fail if no instances are passed', function(){
            cloudman.status().should.be.rejected();
        });
    });

    describe('start', function(){
        it('should fail if no instances are passed', function(){
            cloudman.start().should.be.rejected();
        });

        it('should fail if wrong instances array is passed', function(){
            cloudman.start(statusInstances).should.be.rejected();
        });

        it('should be a promise', function(){
            cloudman.start(instances).should.be.a.Promise();
        });

        it('should return valid actionRequests', function(done){
            this.timeout(options.shortTimeOut);

            cloudman.start(instances).then(function(res){
                res.should.be.an.Array();
                res[0].should.be.an.Object();
                res[0].should.have.property('action');
                res[0].should.have.property('actionProcessed');
                res[0].should.have.property('err');
                res[0].should.have.property('errMessage');
                res[0].should.have.property('input');
                done();
            },function(err){
                console.log(err);
                done(err);
            });
        });

        it.skip('should actually start instances', function(done){
            this.timeout(options.longTimeOut);

            cloudman.start(instances).then(function(res){
                setTimeout(function(){ //waiting 30 seconds to instaces to start
                    cloudman.status(statusInstances).then(function(res){
                        _.each(res, function(instance){
                            instance.state.should.be.equal('16'); //running
                            done();
                        });
                    });
                }, options.shortTimeOut);

            });
        });

    });

    describe('stop', function(){
        it('should fail if no instances are passed', function(){
            cloudman.stop().should.be.rejected();
        });

        it('should fail if wrong instances array is passed', function(){
            cloudman.stop(statusInstances).should.be.rejected();
        });

        it('should be a promise', function(){
            cloudman.stop(instances).should.be.a.Promise();
        });

        it('should return valid actionRequests', function(done){
            this.timeout(options.shortTimeOut);

            cloudman.stop(instances).then(function(res){
                res.should.be.an.Array();
                res[0].should.be.an.Object();
                res[0].should.have.property('action');
                res[0].should.have.property('actionProcessed');
                res[0].should.have.property('err');
                res[0].should.have.property('errMessage');
                res[0].should.have.property('input');
                done();
            },function(err){
                console.log(err);
                done(err);
            });
        });

        it.skip('should actually stop instances', function(done){
            this.timeout(options.longTimeOut);

            cloudman.stop(instances).then(function(res){
                setTimeout(function(){ //waiting 30 seconds to instaces to start
                    cloudman.status(statusInstances).then(function(res){
                        _.each(res, function(instance){
                            instance.state.should.be.equalOneOf(32, 64, 80);
                            done();
                        });
                    });
                }, options.shortTimeOut);

            });
        });

    });

    describe('terminate', function(){});
    describe('create', function(){});

});