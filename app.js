const express = require('express');
const app = express(); 
const bodyParser = require('body-parser');
const ejs = require('ejs')

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/public', express.static(__dirname + '/public'));

const mainRouter = require('./router/mainRouter')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/", mainRouter)


app.listen(5000, function(req,res){
    console.log("서버 실행");
})