function text_load(btn) {
    const text = btn.value;
    document.getElementById("text_area").innerText = text;
}

function comment_write() {
    // textarea에서 값을 가져옴
    var text = document.getElementById("text_area").value;
    
    if (text == "") {
        alert('내용을 입력하세요!');
    }
    else {
        // 새로운 li 엘리먼트 생성 및 내용 삽입
        var li = document.createElement("li");
        li.innerHTML = '<i class="fas fa-comment" style="color: #b8e4ff;"></i> ' + text;
        li.style.listStyle = "none";
        
        // ul 엘리먼트에 li 엘리먼트 추가
        var ul = document.getElementById("review_lists");
        ul.appendChild(li);
    }
    
  }