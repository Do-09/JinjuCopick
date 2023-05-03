const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../model/db');
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const multer = require('multer');
const path = require('path');
const fs = require('fs')

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

router.get("/mypage", function(req,res){ //마이페이지
    if(authCheck.isOwner(req,res)){
        var email = req.session.email;
        db.query('select * from information where email = ?',[email], function(err, result){ 
            if (result.length > 0) {
                res.render('mypage',{data:result})
            } else{
                res.redirect('/');
            }
        });
        return false;
    } else{
        res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
                document.location.href="/login";</script>`);
    }
})

router.get("/gifticon_upload", function(req,res){ //기프티콘 업로드 화면
    if(authCheck.isOwner(req,res)){
        var email = req.session.email;
        db.query('select * from gifticon where email = ?',[email], function(err, result){ 
            if (result.length > 0) {
                res.render('gifticon_upload',{data:result})
            } else{
                var result1 = {"email":email};
                res.render('gifticon_upload',{data:result1})
            }
        });
        return false;
    } else{
        res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
                document.location.href="/login";</script>`);
    }
})

try {
    fs.readdirSync('public/uploads');
} catch (err) {
    console.log('폴더 생성');
    fs.mkdirSync('public/uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, `public/uploads`);
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    // 용량 제한
    limits: { fieldSize: 5 * 1024 * 1024 },
});

router.post("/gifticon_upload/submit", upload.single('gifticonImg'),(req,res,next)=>{ //기프티콘 사진 업로드
    var email = req.session.email;
    var cafeName = req.body.cafeName;
    var expirationDate = req.body.expirationDate;
    var gifticonImg = `/public/uploads/${req.file.filename}`;
    console.log(req.file);
    console.log(email, cafeName, expirationDate, gifticonImg);
    
    db.query('INSERT INTO gifticon (email, name, date, gifticon) VALUES(?,?,?,?)', [email, cafeName, expirationDate,
        gifticonImg], function (error, data) {
        if (error) throw error;
            res.redirect("/gifticon_upload");
        });

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

// router.get("/community", function (req, res) {
//     res.redirect('/community/' + 1)
// });

// router.get("/community/:cur", function (req, res) {

//     //페이지당 게시물 수 : 한 페이지 당 10개 게시물
//     var page_size = 10;
//     //limit 변수
//     var no = "";
//     //전체 게시물의 숫자
//     var totalPageCount = 0;

//     db.query('select count(*) as cnt from community', function (error2, data) {

//         //전체 게시물의 숫자
//         totalPageCount = data[0].cnt

//         //현재 페이지 
//         var curPage = req.params.cur;

//         //전체 페이지 갯수
//         if (totalPageCount < 0) {
//             totalPageCount = 0
//         }

//         //현재페이지가 0 보다 작으면
//         if (curPage == 1) {
//             no = 0
//         } else {
//             //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
//             no = (curPage - 1) * 10
//         }

//         var result2 = {
//             "curPage": curPage,
//             "page_size": page_size,
//             "totalPageCount": totalPageCount,
//         };

//         if(authCheck.isOwner(req,res)){
//                     db.query('select * from community order by writeTime desc limit ?,?',[no, page_size], function(err, result){ 
//                         res.render('communityList',{data:result, community:result2})
//                         return false;
//                     });
//                 } else{
//                     res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
//                             document.location.href="/login";</script>`);
//                 }

//         // fs.readFile('list.html', 'utf-8', function (error, data) {


//         //     var queryString = 'select * from products order by id desc limit ?,?';
//         //     getConnection().query(queryString, [no, page_size], function (error, result) {
//         //         if (error) {
//         //             console.log("페이징 에러" + error);
//         //             return
//         //         }
                    
//         //         res.send(ejs.render(data, {
//         //             data: result,
//         //             pasing: result2
//         //         }));
//         //     });
//         // }); 

 

//     })

// })



router.get("/community/:nickname/:writeTime/:num", function(req,res){ //커뮤니티 게시판 상세보기 화면
    var email = req.session.email;

    if(authCheck.isOwner(req,res)){
        db.query('select * from community where nickname = ? and writeTime = ? and num = ?',[req.params.nickname,req.params.writeTime,req.params.num], function(err, result){ 
            db.query('select * from information where email = ?',[email],function (error, results) { //로그인된 이메일 확인 
                var nick = results[0].nickname; //닉네임 찾기
                var nickname = {"nick":nick}
            if(email == result[0].email){ 
                var result2 = {"edit":"1"};
                db.query('select * from comment where num = ?', [req.params.num], function(err, comm) { 
                    res.render('communityRead',{data:result, data1:result2, comm:comm, nickname:nickname})  
                });
            }else{
                var result2 = {"edit":"0"};
                db.query('select * from comment where num = ?', [req.params.num], function(err, comm) { 
                    res.render('communityRead',{data:result, data1:result2, comm:comm, nickname:nickname})   
                });
                return false; 
            }
        })
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
       
    // if(date==""){ //date가 미정일 경우 '1111-11-11' 날짜 형식으로
    //     date = '1111-11-11';
    // }

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

router.get("/community/:nickname/:writeTime/:num/modify", function(req,res){ //커뮤니티 글 수정 화면
    var email = req.session.email;

    if(authCheck.isOwner(req,res)){
        db.query('select * from community where nickname = ? and writeTime = ? and num = ?',[req.params.nickname,req.params.writeTime,req.params.num], function(err, result){ 
            if(email == result[0].email){
                var result2 = {"edit":"1"};
                res.render('communityModify',{data:result, data1:result2})
            }else{
                var result2 = {"edit":"0"};
                res.render('communityModify',{data:result, data1:result2})
                return false; 
            }
        });
    } else{
        res.send(`<script type="text/javascript">alert("로그인 후 이용가능합니다");
                document.location.href="/login";</script>`);
    }
    
})

router.post("/community/modify/submit", function(req, res) { //게시판 글 수정
    var email = req.session.email; // 로그인된 세션에서 이메일 정보 불러오기  
    var title = req.body.title;
    var people = req.body.people;
    var purpose = req.body.purpose;
    var date = req.body.date;
    var content = req.body.content;

    if (email&&title&&people&&purpose&&content&&date) {
        db.query('select * from community where num = ?',[req.body.num], function (err, result) {
            
          db.query('UPDATE community SET title=?, people=?, purpose=?, date=?, content=? WHERE num=?', [title, people, purpose, date, content, req.body.num], function (error, data) {
          if (error) throw error;
              res.send(`<script type="text/javascript">alert("수정이 완료되었습니다.");
              document.location.href="/community";</script>`);
          });
      });
    }
  })

 

  router.post("/community/:nickname/:writeTime/:num", function(req, res) { //댓글 작성
    var email = req.session.email; // 로그인된 세션에서 이메일 정보 불러오기  
    var num = req.params.num;
    var commentdata = req.body.commentdata;
    var writeTime = new Date();
  
    if (commentdata) {
        db.query('SELECT nickname FROM information WHERE email = ?', [email], function (err, result) {
            if (err) throw err;
            var nickname = result[0].nickname; // 결과에서 nickname 값을 가져옴

            db.query('SELECT * FROM community WHERE num=?', [num], function (err, result) {
                if (err) throw err;
                
                db.query('INSERT INTO comment (num, email, nickname, commentdata, writeTime) VALUES(?,?,?,?,?)',[num, email, nickname, commentdata, writeTime], function (error, result) {
                    if (error) throw error;
                    res.send(`<script type="text/javascript">alert("댓글이 등록되었습니다.");
                    location.href = location.href;</script>`);             
                });

                
            });
        });
    }
});


router.post("/community/:num/:no", function(req, res) { //선택 댓글 삭제하기
    var num = req.params.num;

    db.query('SELECT * FROM community WHERE num=?', [num], function (err, result) {
        if (err) throw err; 

        db.query('DELETE FROM comment WHERE num=? and no =?', [num, req.params.no], function (error, comm) {
          if (error) throw error; 
          res.send(`<script type="text/javascript">alert("댓글이 삭제되었습니다.");
          document.location.href="/community/${result[0].nickname}/${result[0].writeTime}/${num}";</script>`);  
        });
    });
});

router.post("/community/:nickname/:writeTime/:num/delete", function(req, res) { //선택 글 삭제하기
    var num = req.params.num;

    db.query('DELETE FROM community WHERE num=?', [num], function (err, result) {
        if (err) throw err; 
        res.send(`<script type="text/javascript">alert("글이 삭제되었습니다.");
        document.location.href="/community";</script>`); 
    });
});


module.exports = router