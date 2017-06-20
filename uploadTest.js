var express = require('express');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

var app = express();

app.use(fileUpload()); // default

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//:::::::::::::::::::::::::::::::::
app.get('/',function (req,res) {
	res.render('two.pug');
});

app.post('/', function(req, res) {
  if (!req.files || req.files.sampleFile==undefined)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.sampleFile;
  let typeOfFile = req.files.sampleFile.mimetype.toLowerCase();
  let position = typeOfFile.search('/');
  let realyType = typeOfFile.substring(position+1);

 if(typeOfFile == 'image/png' || typeOfFile == 'image/jpeg'){
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(__dirname+'/download/images/filename.'+realyType, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded! : '+typeOfFile);
  });
 }
 else{
 	res.send('its Not an Image [PNG or JPG]!');
 }
});

app.use(express.static('public'));
//::::::::::::::::::::::::::::::::::
app.use(function (req, res, next) {
  res.status(404).send("هذه الصفحة لا توجد")
});
app.listen(3000,function (err) {
	console.log('we listen to localhost:3000 ..');
});