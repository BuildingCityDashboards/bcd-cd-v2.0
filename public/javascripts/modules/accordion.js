// TODO: move to bcd-ui module

const acc = document.getElementsByClassName('accordion')
let i

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function () {
    console.log('click on' + this)
    this.classList.toggle('open')
    const content = this.nextElementSibling
    content.classList.toggle('open')
  })
}
