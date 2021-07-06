document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("campark JS imported successfully!");
  },
  false
);

// Navbar scrolling
// function navBarScrolling() {
//   const navbar = document.getElementById('navbar');
// const itemNavbar = document.getElementsByClassName('item')
// const userNavCircle = document.getElementById('user-nav-circle')

// let lastScrollTop = 0
// document.addEventListener('scroll', function() {
//   let st = window.pageYOffset || document.documentElement.scrollTop; 
//   if (st < lastScrollTop){navbar.style.background = "#1A2F3D";
//   userNavCircle.style.background = "#1A2F3D";
//   itemNavbar.forEach((item) => {
//     item.style.background = "#f2f2f2";
//   })
// }  else {
// navbar.style.background = "#f2f2f2";
// userNavCircle.style.background = "#f2f2f2";
// itemNavbar.forEach((item) => {
//   item.style.background = "#1A2F3D";
// })
// }
// });
// }


// window.addEventListener('load', () => {
//   navBarScrolling();    
// })