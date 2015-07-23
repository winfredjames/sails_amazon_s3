  var skip = require('skipper');
  var aws = require('aws-sdk');
  var fs = require('fs');
  var aws_config = sails.config.aws;


  module.exports = {


    upload:function (req, res) {
      var originalFileName = req.file('file')._files[0].stream.filename;
      console.log(originalFileName);
      req.file('file').upload({
        adapter: require('skipper-s3'),
        bucket: 'innovadiv-local-dev',
        key: aws_config.key,
        secret: aws_config.secret,
        saveAs:originalFileName
      }, function whenDone(err, uploadedFiles) {
        if (err) return res.serverError(err);
        else return res.json({
          files: uploadedFiles,
          textParams: req.params.all()
        });
      });
    },

    download:function(req,res){
    	aws.config.update({accessKeyId: aws_config.key,
      secretAccessKey: aws_config.secret,
    });
    	var s3 = new aws.S3();
    	var params ={
    		Bucket: 'innovadiv-local-dev', Key: 'a4e457c3-2649-4b17-8175-a9932099bd5e.jpg' };
    	s3.getObject(params,function(err, data) {
      if (err === null) {
      res.attachment('test.jpeg');
      res.send(data.Body);
  } else {
     res.status(500).send(err);
  }
  });
    },


    getUrl:function(req,res){
      aws.config.update({accessKeyId: aws_config.key,
      secretAccessKey: aws_config.secret,
    });
      var s3 = new aws.S3();
      var params = {Bucket: 'innovadiv-local-dev', Key: 'testpic.png'};
      s3.getSignedUrl('getObject', params, function (err, url) {
      res.send(url);
  });
    }

  };