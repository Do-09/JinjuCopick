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

const submitButton = document.getElementById("submit_button");
const titleInput = document.getElementById("title");
const numberInput = document.getElementById("people_num");
const selectInput = document.getElementById("purpose_list");
const dateInput = document.getElementById("date_input");
const checkboxInput = document.getElementById("no_date");
const contentInput = document.getElementById("content");
const errorMessage = document.getElementById("error_message");

function displayErrorMessage() {
errorMessage.style.display = 'block';  
setTimeout(() => {
  errorMessage.style.display = 'none';  
}, 2000);
}

submitButton.addEventListener("click", function() {
if (titleInput.value.trim() === "" || numberInput.value === "" || selectInput.value === "" || dateInput.value === "" || contentInput.value.trim() === "") {
  displayErrorMessage(); 
} else if (dateInput.value === "" && !checkboxInput.checked) {
  displayErrorMessage(); 
} else {
  errorMessage.style.display = "none";
}
});

$(document).ready(function() {
$('#submit_button').prop('disabled', true);

$('#date_input').change(function() {
  if ($('#date_input').val() !== "" || $('#no_date').is(':checked')) {
    $('#submit_button').prop('disabled', false);
    $('#error_message').hide();
  } else {
    $('#submit_button').prop('disabled', true);
  }
});

$('#no_date').change(function() {
  if ($('#date_input').val() !== "" || $('#no_date').is(':checked')) {
    $('#submit_button').prop('disabled', false);
    $('#error_message').hide();
  } else {
    $('#submit_button').prop('disabled', true);
  }

  if ($('#no_date').is(':checked')) {
    $('#date_input').prop('disabled', true);
    $('#date_input').prop('required', false);
  } else {
    $('#date_input').prop('disabled', false);
    $('#date_input').prop('required', true);
    $('#date_input').focus();
    $('#date_input').blur();
  }
});
});