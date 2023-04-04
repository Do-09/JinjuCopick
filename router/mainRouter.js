const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../model/db');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.get("/", function(req,res){
    res.render('main')
})

router.get("/login", function(req,res){
    res.render('login')
})

router.post('/main', function(req, res) {
    var id = req.body.id;
    var password = req.body.password;
    if (id && password) {             // id와 pw가 입력되었는지 확인
        db.query('SELECT * FROM login WHERE id = ? AND password = ?', [id, password], function(error, results, fields) {
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