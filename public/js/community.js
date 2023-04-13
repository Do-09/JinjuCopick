function toggleCalendar() {
    const calendar = document.getElementById("date_input");
    calendar.disabled = !calendar.disabled;
  
    const placeholder = document.querySelector('[data-placeholder]');
    if (placeholder && placeholder.getAttribute('data-placeholder') === "날짜 선택") {
      placeholder.setAttribute('data-placeholder', "날짜 미정");
    } else {
      placeholder.setAttribute('data-placeholder', "날짜 선택");
    }
  }
  
  function toggleCheckbox() {
    const checkbox = document.getElementById("no_date");
    const calendar = document.getElementById("date_input");
  
    if (calendar.value !== "") {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  }
  
  function disableCheckbox() {
    document.querySelector("#no_date").disabled = true;
  }
  
  var now_utc = Date.now()
  var timeOff = new Date().getTimezoneOffset()*60000;
  var today = new Date(now_utc-timeOff).toISOString().split("T")[0];
  document.getElementById("date_input").setAttribute("min", today);