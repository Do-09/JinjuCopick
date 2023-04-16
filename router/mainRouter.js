const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../model/db');
const session = require('express-session')
const FileStore = require('session-file-store')(session)

var authCheck = require('../public/js/authCheck.js');

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
    if (email && password) {             // email과 pw가 입력되었는지 확인
        db.query('SELECT * FROM information WHERE email = ? AND password = ?', [email, password], function(error, results, fields) { // 이메일 및 패스워드 확인
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공    
                req.session.is_logined = true; // 세션 정보 갱신(세션 저장)
                req.session.email = email; 
                req.session.save(function () {
                res.redirect(`/`);
                });
                
            } else {              
                res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                document.location.href="javascript:history.back();";</script>`);    // 뒤로가기
            }            
        });

    } else {
        res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
        document.location.href="javascript:history.back();";</script>`);    
    }
});

router.get('/logout', function(req,res){ //로그아웃
    req.session.destroy(function(err){ //세션 삭제
        res.redirect('/');
        console.log("로그아웃");
    });
});

router.get("/signup", function(req,res){ //회원가입 화면
    res.render('signup')
})

router.post("/signup/submit", function(req,res){ //회원가입 제출

    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var nickname = req.body.nickname; 

    if (email && password1 && password2 && nickname) {
        
        db.query('SELECT * FROM information WHERE nickname = ?', [nickname], function(error, results, fields) { // DB에 같은 닉네임 있는지 확인
            if (error) throw error;
            if (results.length <= 0) { 
                db.query('SELECT * FROM information WHERE email = ?', [email], function(error, results, fields){ // DB에 같은 이메일 있는지 확인
                    if (results.length <= 0) {
                        db.query('INSERT INTO information (nickname, password, email) VALUES(?,?,?)', [nickname, password1, email], function (error, data) {
                            if (error) throw error2;
                            res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                            document.location.href="/";</script>`);
                        });
                    } 
                    else{
                        res.send(`<script type="text/javascript">alert("이미 존재하는 이메일입니다."); 
                        document.location.href="javascript:history.back();";</script>`);    
                    }
                });
            } 
            else {                                                  
                res.send(`<script type="text/javascript">alert("이미 존재하는 닉네임 입니다."); 
                document.location.href="javascript:history.back();";</script>`);    
            }            
        });

    } else {    
        res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="javascript:history.back();";</script>`);
    }
});

router.get("/main", function(req,res){ //메인화면(로그인 후)
    if(!authCheck.isOwner(req,res)){ //로그인 세션 확인 후 로그인 안 되어 있을 경우
        res.redirect('/'); //메인화면 이동(로그인 전)
        return false;
    }
    res.render('afterLogin') //메인화면 연결(로그인 후)
})

router.get("/gifticon_upload", function(req,res){ //기프티콘 업로드 화면
    if(authCheck.isOwner(req,res)){
        res.render('gifticon_upload')
        return false;
    } else{
        res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
                document.location.href="/login";</script>`);
    }
})

router.get("/community", function(req,res){ //커뮤니티 게시판 목록 화면
    if(authCheck.isOwner(req,res)){
        db.query('select * from community', function(err, result){ //게시판 데이터베이스(community) 정보 전달
            res.render('communityList',{data:result})
            return false;
        });
    } else{
        res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
                document.location.href="/login";</script>`);
    }
})

    
router.get("/community/:nickname/:writeTime", function(req,res){ //커뮤니티 게시판 상세보기 화면
    
    if(authCheck.isOwner(req,res)){
        db.query('select * from community where nickname = ? and writeTime = ?',[req.params.nickname,req.params.writeTime], function(err, result){ 
            var re = result[0].content;
            console.log(re);
            res.render('communityRead',{data:result})
            return false;   
        });
    } else{
        res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
                document.location.href="/login";</script>`);
    }
})


router.get("/community/write", function(req,res){ //커뮤니티 게시판 작성 화면
    if(authCheck.isOwner(req,res)){
        res.render('community')
        return false;
    } else{
        res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
                document.location.href="/login";</script>`);
    }
})

router.post("/community/write/submit", function(req,res){ //게시판 글 작성하기
    var email = req.session.email; // 로그인된 세션에서 이메일 정보 불러오기
    var title = req.body.title;
    var people = req.body.people;
    var purpose = req.body.purpose;
    var date = req.body.date;
    var content = req.body.content; 
    var writeTime = new Date();
      
    if(date==""){ //date가 미정일 경우 '1111-11-11' 날짜 형식으로
        date = '1111-11-11';
    }

    var nickname;    
    if (email&&title&&people&&purpose&&content&&date) {
        db.query('select * from information where email = ?',[email],function (error, results) { //로그인된 이메일 확인 
            nickname = results[0].nickname; //닉네임 찾기
            db.query('INSERT INTO community (email, nickname, title, people, purpose, date, content, writeTime) VALUES(?,?,?,?,?,?,?,?)', [email, nickname, title, people, purpose, date, content, writeTime], function (error, data) {
                if (error) throw error;
                    res.send(`<script type="text/javascript">alert("글이 등록되었습니다");
                    document.location.href="/community";</script>`);
                });
    
        });
        
    } 
})

module.exports = router