const sidebarbtn = document.querySelector(".side_bars_btn_open");
const sidebar = document.querySelector(".side_bars_container");
const sidebarclosebtn = document.querySelector(".side_bars_btn_close");

function openMenu() {
  document.body.style.overflow = "hidden";
  sidebar.classList.toggle("invisible")
  sidebarclosebtn.addEventListener("click", closeMenu);
}

function closeMenu() {
  document.body.style.overflow = "visible";
  sidebar.classList.toggle("invisible")
}

sidebarbtn.addEventListener("click", openMenu);