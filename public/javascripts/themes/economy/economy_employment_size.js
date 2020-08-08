
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { activeBtn } from '../../modules/bcd-ui.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
let employedChart

(async () => {
  const parseYear = d3.timeParse('%Y')

  // console.log('fetch cso json')
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  const TABLE_CODE = 'BRA08'
  const STATS = ['Active Enterprises (Number)', 'Persons Engaged (Number)', 'Employees (Number)']

  const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)

  const dataset = JSONstat(json).Dataset(0)
  // the categories will be the label on each plot trace
  const categories = dataset.Dimension(0).Category().map(c => {
    return c.label
  })
  // console.log(categories)

  const EXCLUDE = categories[0] // exclude 'All size...' trace
  //
  const sizeFiltered = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if (d.County === 'Cork' &&
     d.Statistic === STATS[2] &&
     d['Employment Size'] !== EXCLUDE) {
        d.label = d.Year
        d.date = parseYear(+d.Year)
        d.value = +d.value
        return d
      }
    }
  )

  const engagedFiltered = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if (d.County === 'Dublin' &&
     d.Statistic === STATS[1] &&
     d['Employment Size'] !== EXCLUDE) {
        d.label = d.Year
        d.date = parseYear(+d.Year)
        d.value = +d.value
        return d
      }
    }
  )

  const activeFiltered = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if (d.County === 'Dublin' &&
     d.Statistic === STATS[0] &&
     d['Employment Size'] !== EXCLUDE) {
        d.label = d.Year
        d.date = parseYear(+d.Year)
        d.value = +d.value
        return d
      }
    }
  )

  const sizeContent = {
    e: '#chart-employees-by-size',
    xV: 'date',
    yV: 'value',
    d: sizeFiltered,
    k: 'Employment Size',
    ks: categories, // used for the tooltip
    tX: 'Years',
    tY: 'Persons employed'

  }
  const engagedContent = {
    e: '#chart-engaged-by-size',
    xV: 'date',
    yV: 'value',
    d: engagedFiltered,
    k: 'Employment Size',
    ks: categories, // used for the tooltip
    tX: 'Years',
    tY: 'Persons engaged'

  }

  const activeContent = {
    e: '#chart-active-enterprises',
    xV: 'date',
    yV: 'value',
    d: activeFiltered,
    k: 'Employment Size',
    ks: categories, // used for the tooltip
    tX: 'Years',
    tY: 'Active enterprises'

  }

  employedChart = new MultiLineChart(sizeContent)

  const engagedChart = new MultiLineChart(engagedContent)

  const activeChart = new MultiLineChart(activeContent)

  const chartDivIds = ['employees-by-size', 'engaged-by-size', 'active-enterprises']

  d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
  d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
  d3.select('#chart-' + chartDivIds[2]).style('display', 'none')

  const redraw = () => {
    if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
      employedChart.drawChart()
      employedChart.addTooltip(STATS[2] + ' for Year ', '', 'label')
    }
    if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
      engagedChart.drawChart()
      engagedChart.addTooltip(STATS[1] + ' for Year ', '', 'label')
    }
    if (document.querySelector('#chart-' + chartDivIds[2]).style.display !== 'none') {
      activeChart.drawChart()
      activeChart.addTooltip(STATS[0] + ' for Year ', '', 'label')
    }
  }
  redraw()

  d3.select('#btn-' + chartDivIds[0]).on('click', function () {
    activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1], 'btn-' + chartDivIds[2]])
    d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
    d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
    redraw()
  })

  d3.select('#btn-' + chartDivIds[1]).on('click', function () {
    activeBtn('btn-' + chartDivIds[1], ['btn-' + chartDivIds[2], 'btn-' + chartDivIds[0]])
    d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
    d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
    redraw()
  })

  d3.select('#btn-' + chartDivIds[2]).on('click', function () {
    activeBtn('btn-' + chartDivIds[2], ['btn-' + chartDivIds[0], 'btn-' + chartDivIds[1]])
    d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
    d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
    d3.select('#chart-' + chartDivIds[2]).style('display', 'block')
    redraw()
  })

  window.addEventListener('resize', () => {
    activeChart.drawChart()
    activeChart.addTooltip(STATS[0] + ' for Year ', '', 'label')
    engagedChart.drawChart()
    engagedChart.addTooltip(STATS[1] + ' for Year ', '', 'label')
    employedChart.drawChart()
    employedChart.addTooltip(STATS[2] + ' for Year ', '', 'label')
  })
})()
