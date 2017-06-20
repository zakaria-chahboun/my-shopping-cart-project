// just for testing 

var download = require('download-file')
 
var url = "https://nodejs.org/static/images/logo.svg"
 
var options = {
    directory: "./download/images",
    filename: "nodejs-logo.svg"
}
 
download(url, options, function(err){
    if (err) throw err
    console.log("Download finish :)")
}) ;

console.log("Loading ...");
