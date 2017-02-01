var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var aws = require('aws-sdk')
var app = express();

app.use(morgan('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 5000);
/*
 *  * Load the S3 information from the environment variables.
 *  */
const S3_BUCKET = process.env.S3_BUCKET;

app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
          Bucket: S3_BUCKET,
          Key: fileName,
          Expires: 60,
          ContentType: fileType,
          ACL: 'public-read'
        };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
          if(err){
                  console.log(err);
                  return res.end();
                }
          const returnData = {
                  signedRequest: data,
                  url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
                };
          res.write(JSON.stringify(returnData));
          res.end();
        });
});
