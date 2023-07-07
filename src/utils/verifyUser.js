const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const express = require('express')

 const verifyUser = (req, res, next) => {
  let cookie = req.cookies.access_token;
  if(!cookie){
    console.log("not verified -- verifyUser.js")
    res.render("landing")
  }
  else{
    jwt.verify(cookie, "parwez", (err, user) => {
      req.user = user;
      next();
    });
  }
};

exports.verifyUser = verifyUser;
// exports.errhandle = errhandle; start