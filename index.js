'use strict';
const express = require('express');
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
//MONGODB INFO ------------
const MongoClient = require("mongodb").MongoClient;
const urlDb = require('./modules/database');

let app = express();
const PORT = process.env.PORT || 8080;

//GENERATE

function generateRandomString() {
  let char = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i = 0; i < 7; i++){
    char += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return char;
}

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded());
app.set("view engine", "ejs");

//Routes --------------------------------------------Routes
app.delete("/urls/:id", (req, res) => {
  let deleteKey = req.params.id;
  urlDb.deleteURL(deleteKey)
  //delete urlDatabase[deleteKey];

  res.redirect('/urls/');
});

app.put("/urls/:id", (req, res) => {
  let newURL = req.body.newURL;
  //urlDatabase[req.params.id] = newURL;
  urlDb.updateURL(req.params.id, newURL);
  res.redirect('/urls/');
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  urlDb.getDB((err, results) =>{
      console.log('stuff' + results);
      res.render("urls_index", {all:results});
    });
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let randomString = generateRandomString()
  //urlDatabase[randomString] = req.body.longURL;
  urlDb.createURL(randomString, req.body.longURL);
  console.log(randomString);
  res.redirect(`/urls`);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  console.log(shortURL);
  urlDb.getLongURL(shortURL, (err, longURL) =>{
      console.log(err);
      if(err){
        res.send(err.message || 'Do I even exist bro? I think therefore I am.');
      } else {
        //res.render("urls_show", {long : longURL, shortURL: shortURL});
        res.redirect(longURL);
      }
    });
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  console.log(shortURL);
  urlDb.getLongURL(shortURL, (err, longURL) =>{
      console.log(err);
      if(err){
        res.send(err.message || 'Do I even exist bro? I think therefore I am.');
      } else {
        res.render("urls_show", {long : longURL, shortURL: shortURL});
      }
    });
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//ERROR HANDLING
app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

// handling 404 errors
app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
  res.send(err.message || 'Do I even exist bro? I think therefore I am.');
});


// LISTENING ----------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})