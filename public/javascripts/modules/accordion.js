/*
TODO: remove JQ and move to bcd-ui module | issue #124
*/

// const title = $('.accordion__heading')
// // const content = $('.accordion__content')

// title.click(function () {
//   // $(this).toggleClass('accordion__heading--active')
//   $(this).parent().toggleClass('accordion__item--active')

//   // make other accordion__items hidden
//   // $(this).parent().siblings().children('.accordion__heading').removeClass('accordion__heading--active')
//   // $(this).parent().siblings().removeClass('accordion__item--active')

//   return false
// })

const acc = document.getElementsByClassName('accordion')
let i

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function () {
    console.log('clicked' + this.id)
    this.classList.toggle('accordion--active')
  })
}
