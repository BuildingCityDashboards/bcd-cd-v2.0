/*
TODO: remove JQ and move to bcd-ui module | issue #124
*/

const title = $('.accordion__heading')
const content = $('.accordion__content')

title.click(function () {
  $(this).toggleClass('accordion__heading--active')
  $(this).parent().toggleClass('accordion__item--active')

  // make other accordion__items hidden
  $(this).parent().siblings().children('.accordion__heading').removeClass('accordion__heading--active')
  $(this).parent().siblings().removeClass('accordion__item--active')

  return false
})

// var acc = document.getElementsByClassName("accordion");
// var i;

// for (i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function() {
//     this.classList.toggle("active");
//     var panel = this.nextElementSibling;
//     if (panel.style.display === "block") {
//       panel.style.display = "none";
//     } else {
//       panel.style.display = "block";
//     }
//   });
// }
