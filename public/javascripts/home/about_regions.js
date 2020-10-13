import { getPercentageChange, formatHundredThousands, formatEuros } from '../modules/bcd-data.js'

const indicatorUpSymbol = '&#x25B2;'
const indicatorDownSymbol = '&#x25BC;'

Promise.all([d3.xml('/images/home/CorkMap_Unselected.svg'),
  d3.json('/data/cork-region-data.json'),
  d3.json('../data/static/CNA13.json')])
  .then(files => {
    const xml = files[0]
    const corkRegionsJson = files[1]
    const corkPopulationJson = files[2]

    // about cork card
    const corkCard = d3.select('#about-cork__card')
    corkCard.select('#cork__area').text(corkRegionsJson.Cork.AREA)

    const populationYear = 2016
    corkCard.select('#cork__population_year')
      .text(populationYear + '')
    corkCard.select('#cork__population-count').text(formatHundredThousands(corkRegionsJson.Cork.POPULATION[populationYear]) + '')
    corkCard.select('#cork__population-change').text(formatHundredThousands(corkRegionsJson.Cork.POPULATION.change) + '')
    corkCard.select('#cork__population-change').text(formatHundredThousands(corkRegionsJson.Cork.POPULATION.change) + '')

    const percentPopChangeCork = getPercentageChange(corkRegionsJson.Cork.POPULATION[populationYear], corkRegionsJson.Cork.POPULATION['2011'])

    // TODO: abstract to a module, add nochange option
    const trendText = percentPopChangeCork > 0 ? 'an <span class=\'trend-up\'>increase</span> of <span class=\'trend-up\'>' + indicatorUpSymbol + percentPopChangeCork + '%</span>' : 'a <span class=\'trend-down\'>decrease</span> of <span class=\'trend-down\'>' + indicatorDownSymbol + Math.abs(percentPopChangeCork) + '%</span>'
    corkCard.select('#cork__population-trend-text').html(trendText + '.  ')

    // cork.select('#region__age').text(dData.AGE + '')
    // corkCard.selectAll('#region__income').text(formatEuros(corkRegionsJson[].INCOME) + '')
    // cork.select('#region__prePopulation').text(thousands(dData.PREVPOPULATION) + '')
    // cork.select('#region__populationIndicator').text(indicatorText(diff, '#region__populationIndicator', 'increased', false))
    // cork.select('#region__populationChange').text(percentage(diff) + indicator_f(diff, '#region__populationChange', false))
    // cork.select('#region__incomeIndicator').text(indicatorText(diff, '#region__incomeIndicator', 'grew', false))
    // cork.select('#region__income__prev').text(euro(dData.PREVINCOME) + '')
    // cork.select('#region__income__change').text(percentage(diffIncome) + indicator_f(diffIncome, '#region__income__change', false))

    // const bigMapDiv = d3.select('#la-map__map')

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
        d3.select(this).style('stroke', 'rgba(233, 93, 79, 1.0)')
      })

      p.on('mouseout', function () {
        d3.select(this).style('stroke', 'none')
      })

      p.on('click', function () {
        // d3.select(this).style('stroke', 'white')
        // console.log(d3.select(this.parentNode).attr('data-name'))
        // let e = document.getElementById('about-cork__card')
        // e.scrollIntoView()

        const ref = d3.select(this.parentNode).attr('data-name')
        updateInfoText(corkRegionsJson[ref])
        // on click, remove the call to action
        d3.select('#regions-info__cta-arrow').style('display', 'none')
        d3.select('#regions-info__cta').style('display', 'none')
        // show the card
        d3.select('#regions-info__card').style('display', 'flex')
        d3.select('#regions-info__card').style('visibility', 'visible')
        d3.select('#regions-info__card').style('opacity', 1)
        document.getElementById('regions-info__card').scrollTop = 0
      })
    })
  })
  .catch(e => {
    console.log('error' + e)
  })

function updateInfoText (d) {
  const percentPopChange = getPercentageChange(d.POPULATION[2016], d.POPULATION['2011'])

  const trendTextPop = percentPopChange > 0 ? 'an <span class=\'trend-up\'>increase</span> of <span class=\'trend-up\'>' + indicatorUpSymbol + percentPopChange + '%</span>' : 'a <span class=\'trend-down\'>decrease</span> of <span class=\'trend-down\'>' + indicatorDownSymbol + Math.abs(percentPopChange) + '%</span>'

  d3.select('#local__title').html(d.ENGLISH + ' (' + d.GAEILGE + ')')
  d3.select('#local__text-1').html(d.TEXT_1)
  d3.select('#local__area').html(d.AREA + '. ')
  // d3.selectAll('#local__title__small').html(d.ENGLISH + '')
  d3.select('#local__curPopulation').html(formatHundredThousands(d.POPULATION['2016']) + '')
  d3.select('#local__prePopulation').html(formatHundredThousands(d.POPULATION['2011']) + '')
  d3.select('#local__PopChange').html(trendTextPop + '')

  d3.select('#local__text-2').html(d.TEXT_2 + '')

  // d3.select('#local__age').html(d.AGE + '')
  // d3.selectAll('#local__income').html(d.INCOME + '')
  // d3.select('#local__incomeIndicator').html(indicatorText(localdiff, '#local__incomeIndicator', 'grew', false))
  // d3.select('#local__income__prev').html(d.PREVINCOME + '')
  // d3.select('#local__income__change').html(percentage(localdiffIncome) + indicator_f(localdiffIncome, '#local__income__change', false))
}
