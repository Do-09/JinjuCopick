const express = require('express');
const app = express(); 

app.get("/", function(req,res){
    res.send('진주 카페 추천 웹 사이트');
})

app.listen(5000, function(req,res){
    console.log("서버 실행");
})
