const express = require('express');
const app = express(); 
const ejs = require('ejs')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

app.set('view engine', 'ejs');
app.set('views', './views');
// app.engine('html',require('ejs').renderFile)
app.use('/public', express.static(__dirname + '/public'));

const mainRouter = require('./router/mainRouter')

app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized:true,
    store:new FileStore(),
}))

app.use("/", mainRouter)


app.listen(5000, function(req,res){
    console.log("서버 실행");
})