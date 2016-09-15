'use strict';
const express = require('express');
const bodyParser = require("body-parser");
const methodOverride = require('method-override');

let app = express();
const PORT = process.env.PORT || 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//GENERATE

function generateRandomString() {
  var char = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 7; i++){
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
  delete urlDatabase[deleteKey];
  res.redirect('/urls/');
})

app.put("/urls/:id", (req, res) => {
  let newURL = req.body.newURL
  urlDatabase[req.params.id] = newURL;
  res.redirect('/urls/');
})

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
    };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let randomString = generateRandomString()
  urlDatabase[randomString] = req.body.longURL;
  console.log(randomString);
  res.redirect(`/urls/${randomString}`);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});


// LISTENING ----------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})