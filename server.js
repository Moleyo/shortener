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

app.use('/new/:shortenMe', function (req, res) {
  //if valid url shorten it
  if(validUrl.isUri(req.params.shortenMe)){ 
      
      var urls = db.collection('urls');
      rand = Math.random() * (10000 - 1000) + 1000;
      //while rand is not unique
      while(rand == false){
          
      }
      var url = {
        'code' : rand,
        'short':  req.params.shortenMe
      }
       urls.insert(url, function(err, data) {
          if(err){throw err}
          res.send({ "original_url": req.params.shortenMe, "short_url":data });
        })
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
                res.redirect(documents[0]);
            }
            //else if not on database
            else{
            res.send({"error":"The code you have used isn't on the database you cheeky lil fellah."});
            }
        });
})

app.get('/', function (req, res) {
  //homepage
  res.send('example of url to give: https://api-projects-moleyo1.c9users.io/new//new/http://fishsticks.com');
})