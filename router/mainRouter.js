const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../model/db');
const session = require('express-session')
const FileStore = require('session-file-store')(session)

var authCheck = require('../public/authCheck.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.use(session({
    secret: "key",
    resave: false,
    saveUninitialized:true,
    store:new FileStore(),
}))


router.get("/", function(req,res){
    if(authCheck.isOwner(req,res)){
        res.redirect('/main');
        return false;
    } else{
        res.render('main')
        return false;
    }
})

router.get("/login", function(req,res){
    res.render('login')
})

router.post('/login/result', function(req, res) { //로그인
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {             // id와 pw가 입력되었는지 확인
        db.query('SELECT * FROM information WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                req.session.is_logined = true;      // 세션 정보 갱신
                req.session.username = email;
                req.session.save(function () {
                    res.redirect(`/`);
                    console.log("로그인");
                });
            } else {              
                res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                document.location.href="/login";</script>`);    
            }            
        });

    } else {
        res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
        document.location.href="/login";</script>`);    
    }
});

router.get('/logout', function(req,res){
    req.session.destroy(function(err){
        res.redirect('/');
        console.log("로그아웃");
    });
});

router.get("/signup", function(req,res){
    res.render('signup')
})

router.post("/signup/result", function(req,res){

    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var nickname = req.body.nickname; //확인 후 수정 필요!!!

    if (email && password1 && password2 && nickname) {
        
        db.query('SELECT * FROM information WHERE nickname = ?', [nickname], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password1 == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                db.query('INSERT INTO information (nickname, password, email) VALUES(?,?,?)', [nickname, password1, email], function (error, data) {
                    if (error) throw error2;
                    res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                    document.location.href="/";</script>`);
                });
            } else if (password1 != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                res.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
                document.location.href="/signup";</script>`);    
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                res.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/signup";</script>`);    
            }            
        });

    } else {        // 입력되지 않은 정보가 있는 경우
        res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/signup";</script>`);
    }
});

router.get("/main", function(req,res){
    if(!authCheck.isOwner(req,res)){
        res.redirect('/');
        return false;
    }
    res.render('afterLogin')
})

router.get("/gifticon_upload", function(req,res){
    if(authCheck.isOwner(req,res)){
        res.render('gifticon_upload')
        return false;
    } else{
        res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
                document.location.href="/login";</script>`);
    }
})

router.get("/favorite", function(req,res){
    res.render('favorite')
})

router.get("/community", function(req,res){
    if(authCheck.isOwner(req,res)){
        res.render('community')
        return false;
    } else{
        res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
                document.location.href="/login";</script>`);
    }
})

router.post("/community/submit", function(req,res){
    var id = req.session.username;
    var title = req.body.title;
    var people = req.body.f;
    var purpose = req.body.purpose;
    var gender = req.body.gender;
    var date = req.body.date;
    var content = req.body.content; 

    if (id&&title&&people&&purpose&&gender&&date&&content) {

        db.query('INSERT INTO community (id, title, people, purpose, gender, date, content) VALUES(?,?,?,?,?,?,?)', [id, title, people, purpose, gender, date, content], function (error, data) {
            if (error) throw error;
                res.send(`<script type="text/javascript">alert("글이 등록되었습니다");
                document.location.href="/main";</script>`);
            });

    } else {        // 입력되지 않은 정보가 있는 경우
        res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/community";</script>`);
    }

    
})



module.exports = router