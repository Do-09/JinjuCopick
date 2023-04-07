const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../model/db');

var authCheck = require('../public/authCheck.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));


router.get("/", function(req,res){
    res.render('main')
})

router.get("/login", function(req,res){
    res.render('login')
})

router.post('/login/result', function(req, res) { //로그인
    var id = req.body.id;
    var password = req.body.password;
    if (id && password) {             // id와 pw가 입력되었는지 확인
        db.query('SELECT * FROM information WHERE id = ? AND password = ?', [id, password], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                // req.session.is_logined = true;      // 세션 정보 갱신
                // req.session.save(function () {
                //     res.redirect(`/main`);
                // });
                res.redirect('/main');
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

// router.get('/logout', function(req,res){
//     req.session.destroy(function(err){
//         res.redirect('/');
//     });
// });

router.get("/signup", function(req,res){
    res.render('signup')
})

router.post("/signup/result", function(req,res){
    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var id = req.body.name; //확인 후 수정 필요!!!

    if (email && password1 && password2 && id) {
        
        db.query('SELECT * FROM information WHERE id = ?', [id], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password1 == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                db.query('INSERT INTO information (id, password, email) VALUES(?,?,?)', [id, password1, email], function (error, data) {
                    if (error) throw error2;
                    res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                    document.location.href="/main";</script>`);
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
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
    // if(!authCheck.isOwner(req,res)){
    //     res.redirect('/');
    //     return false;
    // }
    res.render('afterLogin')
})

router.get("/gifticon_upload", function(req,res){
    res.render('gifticon_upload')
})

router.get("/favorite", function(req,res){
    res.render('favorite')
})



module.exports = router