//  mongod --port 27017 --dbpath=./data --smallfiles

var express = require('express')
var mongo = require('mongodb').MongoClient;
var validUrl = require('valid-url');
var app = express()
var rand, db;

mongo.connect('mongodb://localhost:27017/database', function(err, database) {
  if(err) throw err;
  db = database;
  // Start the application after the database connection is ready
  app.listen(process.env.PORT || 8080, function () {
    console.log('Example app listening on port 8080!')
  })  
});

app.all('/new/:shortenMe*', function (req, res) {
  //if valid url shorten it
  var fullUrl = req.params.shortenMe + req.params['0'];
  
  if(validUrl.isUri(fullUrl)){
      
      var urls = db.collection('urls'), url;
      
      (function insertShortenedUrl() {
        rand = Math.round(Math.random() * (10000 - 1000) + 1000);
         urls.find( { 'code': rand } ).toArray(function(error, documents) {
            if (error) throw error;
            if(documents.length === 0){
              url = {
                'code' : rand,
                'fullUrl': fullUrl
              }
               urls.insert(url, function(err, data) {
                  if(err){throw err}
                  res.send({ "original_url": fullUrl, "short_url": 'https://api-projects-moleyo1.c9users.io/' + data.ops[0].code });
                })
            }
            else{
              insertShortenedUrl();
            }
        });
      }());
  }
  else{
    res.send('You have not provided a valid url. I am dissapoint.');
  }
})

app.get('/:id', function (req, res) {
        
      var urls = db.collection('urls');
      urls.find( { 'code': +req.params.id } ).toArray(function(error, documents) {
            if (error) throw error;
            if(documents.length){
                res.redirect(documents[0].fullUrl);
                res.end();
                //res.send(documents[0].fullUrl);
            }
            //else if not on database
            else{
            res.send({"error":"The code you have used isn't on the database you cheeky lil fellah."});
            }
        });
})

app.get('/', function (req, res) {
  //homepage
  res.send('example of url to give: https://api-projects-moleyo1.c9users.io/new/http://fishsticks.com');
})