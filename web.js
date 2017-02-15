var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var aws = require('aws-sdk')
var app = express();

app.use(morgan('dev'));
app.set('dist', './dist');
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 5000);
/*
 *  * Load the S3 information from the environment variables.
 *  */
const S3_BUCKET = process.env.S3_BUCKET;
  
/*
  *   * Respond to GET requests to /account.
  *   * Upon request, render the 'account.html' web page in views/ directory.
  *   */
app.get('/index', (req, res) => res.render('index.html'));

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
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
/*
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in
 * a way that suits your application.
 */
app.post('/save-details', (req, res) => {
  // TODO: Read POSTed form data and do something useful
  console.log("Passed");
});
