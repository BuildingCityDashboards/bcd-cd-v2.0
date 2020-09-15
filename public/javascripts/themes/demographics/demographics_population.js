
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { StackedAreaChart } from '../../modules/StackedAreaChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const parseYear = d3.timeParse('%Y')
  const chartDivIds = ['population', 'population-change', 'population-rate']
  const STATBANK_BASE_URL =
    'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // CNA13: Annual Rate of Population Increase by Sex, Province or County, CensusYear and Statistic
  const TABLE_CODE = 'CNA13'
  const STATIC_DATA_URL = '../data/static/CNA13.json'

  const STATS = ['Population (Number)'] // these will break out to individual charts

  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

    const json = await fetchJsonFromUrlAsync(STATIC_DATA_URL)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }

    const dataset = JSONstat(json).Dataset(0)
    // console.log(dataset)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    // console.log(dimensions)

    const categoriesSex = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesSex)

    const categoriesStat = dataset.Dimension(dimensions[3]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesStat)

    const populationFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[dimensions[1]] === 'Cork' &&
          d.value !== null &&
          +d['Census Year'] >= 1986) {
          d.date = parseYear(+d['Census Year'])
          d.label = +d['Census Year']
          d.value = +d.value
          return d
        }
      })
    // console.log('populationFiltered')
    // console.log(populationFiltered)

    const populationNested = d3.nest()
      .key(function (d) { return d.date })
      .entries(populationFiltered)

    // console.log('populationNested')
    // console.log(populationNested)

    const populationWide = populationNested.map(function (d) {
      const obj = {
        label: d.key
      }
      d.values.forEach(function (v) {
        if (v.Statistic === categoriesStat[0] & v.Sex !== categoriesSex[0]) {
          obj.date = v.date
          obj[v.Sex] = v.value
        }
      })
      return obj
    })

    // console.log('populationWide')

    // console.log(populationWide)

    const populationCountContent = {
      elementId: 'chart-' + chartDivIds[0],
      data: populationWide,
      //   .filter(d => {
      //     return d.Statistic === categoriesStat[0]
      //   }),
      tracenames: ['Male', 'Female'],
      xV: 'date',
      // yV: 'Sex',
      tX: 'Year',
      tY: 'Population'
    }
    // console.log(populationCountContent)

    const populationCountChart = new StackedAreaChart(populationCountContent)

    const populationChangeContent = {
      elementId: 'chart-' + chartDivIds[1],
      data: populationFiltered.filter(d => {
        return d.Statistic === categoriesStat[1]
      }),
      tracenames: categoriesSex,
      tracekey: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'Population change',
      ySF: 'thousands'
    }
    // console.log(populationCountContent)
    const populationChangeChart = new MultiLineChart(populationChangeContent)

    const populationRateContent = {
      elementId: 'chart-' + chartDivIds[2],
      data: populationFiltered.filter(d => {
        return d.Statistic === categoriesStat[2]
      }),
      tracenames: categoriesSex,
      tracekey: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'Rate of change (%)'
    }
    // console.log(populationCountContent)
    const populationRateChart = new MultiLineChart(populationRateContent)
    populationRateChart.hideRate(true)

    d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
    d3.select('#chart-' + chartDivIds[2]).style('display', 'none')

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        populationCountChart.drawChart()
        populationCountChart.addTooltip('test', 'test', 'label')
        populationCountChart.showSelectedLabelsX([0, 3, 6, 9, 12, 15])
        populationCountChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12])
      }
      if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
        populationChangeChart.drawChart()

        populationChangeChart.showSelectedLabelsX([0, 3, 6, 9, 12, 15])
        populationChangeChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12])
        populationChangeChart.addTooltip('Test1', 'test2', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIds[2]).style.display !== 'none') {
        populationRateChart.drawChart()
        populationRateChart.showSelectedLabelsX([0, 3, 6, 9, 12, 15])
        populationRateChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12])
        populationRateChart.addTooltip()
        populationRateChart.hideRate(true)
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
      redraw()
    })
  } catch (e) {
    console.log('Error creating household charts')
    console.log(e)
    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton(chartDivIds[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      // console.log('retry')
      removeErrorMessageButton('chart-' + chartDivIds[0])
      main()
    })
  }
})()
