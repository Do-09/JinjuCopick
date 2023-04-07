module.exprots = {
    isOwner:function(req,res){
        if(req.session.is_logined){
            return true;
        } else{
            return false;
        }
    },
    statusUI:function(req,res){
        var authStatusUI = '로그인해주세요'
        if(this.isOwner(req,res)){
            authStatusUI = '환영합니다!';
        }
        return authStatusUI
    }
}