const express = require('express')
const router = express.Router();
const db = require('../model/db');

router.get("/", function(req,res){
    res.render('main')
})

router.get("/login", function(req,res){
    res.render('login')
})

router.get("/join", function(req,res){
    res.render('join')
})

router.get("/join", function(req,res){
    res.render('join')
})

router.get("/main", function(req,res){
    res.render('afterLogin')
})

router.get("/gifticon", function(req,res){
    res.render('gifticon')
})

router.get("/favorite", function(req,res){
    res.render('favorite')
})



module.exports = router