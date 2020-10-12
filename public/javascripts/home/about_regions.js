Promise.all([d3.xml('/images/home/CorkMap_Unselected.svg')])
  // ,
  // d3.json('/data/home/cork-region-data.json')])
  .then(files => {
    const xml = files[0]
    // let corkRegionsJson = files[1]
    // "xml" is the XML DOM tree
    const htmlSVG = document.getElementById('map') // the svg-element in our HTML file
    // append the "maproot" group to the svg-element in our HTML file
    htmlSVG.appendChild(xml.documentElement.getElementById('cork-zonemap'))

    // d3 objects for later use
    const corkSvg = d3.select(htmlSVG)
    const cityRoot = corkSvg.select('#cork_city')
    const countyRoot = corkSvg.select('#cork_county')

    // get the svg-element from the original SVG file
    const xmlSVG = d3.select(xml.getElementsByTagName('svg')[0])
    // copy its "viewBox" attribute to the svg element in our HTML file
    corkSvg.attr('viewBox', xmlSVG.attr('viewBox'))

    const cityPath = cityRoot.select('path')
    const countyPath = countyRoot.select('path')

    const paths = [cityPath, countyPath]
    paths.forEach(p => {
      p.on('mouseover', function () {
        d3.select(this).style('fill', 'white')
      })

      p.on('mouseout', function () {
        d3.select(this).style('fill', d3.select(this).style('black'))
      })

      p.on('click', function () {
        d3.select(this).style('fill', '#6fc6f6')
        // console.log(d3.select(this.parentNode).attr('data-name'))
        // let e = document.getElementById('about-cork__card')
        // e.scrollIntoView()
        console.log(d3.select(this.parentNode).attr('data-name'))

        const ref = d3.select(this.parentNode).attr('data-name')
        // alert(ref)
        // updateInfoText(corkRegionsJson[ref])
        // on click, remove the call to action
        d3.select('#regions-info__cta').style('display', 'none')
        d3.select('#regions-info__cta-arrow').style('display', 'none')

        // This animated transition doesn't work

        d3.select('#regions-info__card').style('display', 'flex')

        // document.getElementById('regions-info').scrollTop = 0
        // //
        d3.select('#regions-info__card').style('visibility', 'visible')
        d3.select('#regions-info__card').style('opacity', 1)
        document.getElementById('regions-info__card').scrollTop = 0
      })
    })

    //
  })
  .catch(e => {
    console.log('error' + e)
  })

function updateInfoText (d) {
  d3.select('#local__title').html(d.ENGLISH + '')
  d3.select('#local__open').html(d.ABOUT)
  d3.selectAll('#local__title__small').html(d.ENGLISH + '')
  d3.select('#local__total-popualtion').html(popFormat(d.POPULATION) + '')
  d3.select('#local__area').html(d.AREA + '')
  d3.select('#local__age').html(d.AGE + '')
  d3.selectAll('#local__income').html(d.INCOME + '')
  d3.select('#local__prePopulation').html(popFormat(d.PREVPOPULATION) + '')
  d3.select('#local__curPopulation').html(popFormat(d.POPULATION) + '')

  const change = getPerChange(d.POPULATION, d.PREVPOPULATION)

  d3.select('#local__populationIndicator').html(indicatorText(change, '#local__populationIndicator', 'increased', false))
  d3.select('#local__populationChange').html(percentage(change) + indicator_f(change, '#local__populationChange', false))

  // change = getPerChange(d.INCOME, d.PREVPINCOME)
  // d3.select('#local__incomeIndicator').html(indicatorText(localdiff, '#local__incomeIndicator', 'grew', false))
  // d3.select('#local__income__prev').html(d.PREVINCOME + '')
  // d3.select('#local__income__change').html(percentage(localdiffIncome) + indicator_f(localdiffIncome, '#local__income__change', false))
}

function getInfoText (region) {
  let text

  return text || 'test'
}
