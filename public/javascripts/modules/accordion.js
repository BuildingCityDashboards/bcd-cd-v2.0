const acc = document.getElementsByClassName('accordion')
let i

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function () {
    this.classList.toggle('accordion--active')
  })
}
