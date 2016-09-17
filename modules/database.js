'use strict';

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";

function getLongURL(shortURL, cb) {
  MongoClient.connect(MONGODB_URI, (err, db) => {

    db.collection("urls").findOne({ shortURL }, (err, result) => {
      console.log(result);
      if(result != null){
        cb(null, result.longURL);
      } else {
        let error = "Can't find it";
        cb(error);
      }
    });

  });
}

function getDB(cb){
  MongoClient.connect(MONGODB_URI, (err, db) => {

    db.collection("urls").find().toArray((err, results) => {
      if (err) {
        cb(err);
        return;
      }
      cb(null ,results);
      return;
    });

  });
}

function deleteURL(deleteKey){
  MongoClient.connect(MONGODB_URI, (err, db) => {
    db.collection("urls").deleteOne({shortURL:deleteKey});
  });
}

function createURL(short, long) {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    db.collection("urls").insertOne({shortURL:short, longURL:long});
  });
}

function updateURL(short, long) {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    db.collection("urls").updateOne({shortURL:short},{shortURL:short, longURL:long});
  });
}

module.exports =  {getLongURL: getLongURL, getDB: getDB, deleteURL:deleteURL, createURL:createURL, updateURL:updateURL};
