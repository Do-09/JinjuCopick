document.getElementById('myForm').onsubmit = function(){

    // 폼에 입력된 카페명과 유효기간 받아오기
    var cafeName = this.cafeName.value;
    var expirationDate = this.expirationDate.value;
  
    // 기프티콘 목록창에 div 생성
    var gifticonLists = document.getElementById('gifticon_lists');
    var gifticon = document.createElement('div');
    gifticon.className = 'gifticon_list';
    gifticonLists.appendChild(gifticon);
    var div = gifticonLists.lastElementChild;

    // 생성한 div 안에 p 생성
    var newP = document.createElement('p');
    newP.className = 'newP';
    div.appendChild(newP);

    // p에 체크박스 생성
    var chBox = document.createElement("input");
    chBox.setAttribute("type", 'checkbox');
    chBox.className = 'check';
    newP.appendChild(chBox);

    // div에 img 생성(이미지 업로드)
    var Img = document.getElementById('gifticonImg');
  
    var file = Img.files[0];
  
    var newImage = document.createElement("img");
    newImage.className = 'gifticonImage';
    newImage.onclick=function(){window.open(this.src)};
      
    newImage.src = URL.createObjectURL(file);
    newImage.style.width = "150px";
    newImage.style.height = "250px";
    newImage.style.padding = "20px";
    div.style.padding = "5px";
    div.style.margin = "5px";
    div.appendChild(newImage);
  
    // 폼에서 기존 파일 이름 지우기
    document.getElementById('gifticonImg').value = null; 
  
    // div에 카페명과 유효기간 출력
    var newText = document.createElement("div");
    newText.innerHTML = "카페명 : " + cafeName + "<br>" + "유효기간 : " + expirationDate;
    div.appendChild(newText);
  
    // input에 쓰여있던 모든 데이터 초기화
    this.cafeName.value = ""
    this.expirationDate.value = ""
    document.getElementById('fileName').textContent = "\u00A0";
    
    // 전체 체크
    var ch_all = document.querySelector(".ch_all");
    var list = document.querySelectorAll(".check");
  
    ch_all.onclick = () => { 
        if(ch_all.checked){
            for(var i = 0; i < list.length; i++){
                list[i].checked = true;
            }
        }
        else {
            for(var i = 0; i < list.length; i++){
                list[i].checked = false;
            }
        }
    }
  
    // 삭제 버튼
    var del_btn = document.querySelector(".del_btn");
  
    del_btn.onclick = () => {
        for(var i = 0; i < list.length; i++){
            if(list[i].checked){
                list[i].parentElement.parentElement.remove();
                ch_all.checked = false;
            }
        }
    }
  
    return false;
}

document.getElementById('gifticonImg').onchange = function(){
    // 미리 만들어둔 div에 text(파일 이름) 추가
    var file = this.files[0];
    var name = document.getElementById('fileName');
    name.textContent = file.name;
}