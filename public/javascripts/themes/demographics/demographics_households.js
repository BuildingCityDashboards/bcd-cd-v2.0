import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { hasCleanValue } from '../../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { GroupedBarChart } from '../../modules/GroupedBarChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'
import { Chart } from '../../modules/Chart.js'

(async function main () {
  const parseYear = d3.timeParse('%Y')
  const chartDivIds = ['households', 'household-size']
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // CNA33 - Number of households and number of persons resident by Type of Private Accommodation, Province County or City, CensusYear and Statistic

  const TABLE_CODE = 'CNA33' // gives no of households and ave household size
  const STATS = ['Number of Households  (Number)', 'Number of Persons Resident (Number)']
  const DIMENSION = 'Province County or City'

  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Number of households and number of persons resident</i>`)

    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }

    const dataset = JSONstat(json).Dataset(0)

    // the label on each plot trace
    const corkLAs = ['Cork City', 'Cork County']

    const householdsFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d[DIMENSION] === corkLAs[0] ||
          d[DIMENSION] === corkLAs[1]) &&
        d['Type of Private Accommodation'] === 'All households' &&
        hasCleanValue(d)) {
          d.date = parseYear(+d['Census Year'])
          d.label = +d['Census Year']
          d.value = +d.value
          return d
        }
      })
    // console.log(householdsFiltered)

    const householdsCountContent = {
      elementId: 'chart-' + chartDivIds[0],
      data: householdsFiltered.filter(d => {
        return d.Statistic === STATS[0]
      }),
      tracenames: corkLAs,
      tracekey: DIMENSION,
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: STATS[0].split('(')[0]
    }

    const householdsCountChart = new MultiLineChart(householdsCountContent)

    const residentsContent = {
      elementId: 'chart-' + chartDivIds[1],
      data: householdsFiltered.filter(d => {
        return d.Statistic === STATS[1]
      }),
      tracenames: corkLAs,
      tracekey: DIMENSION,
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: STATS[1].split('f ')[1].split('(')[0]
    }

    const residentsChart = new MultiLineChart(residentsContent)

    // const householdsSizeValid = householdsFiltered.filter(function (d) {
    //   // console.log(d)
    //   return +d['Census Year'] >= 1979
    // })

    // const householdsSizeNested = d3.nest()
    //   .key(function (d) { return d.date })
    //   .entries(householdsSizeValid)

    // console.log('householdsSizeNested')
    // console.log(householdsSizeNested)

    // [
    //   {date1 , la1, mean},
    //   {date1 , la2, mean},
    //   {date2 , la1, mean},
    //   {date2 , la2, mean},
    // ]

    // const householdsSize = householdsSizeValid.map((d) => {
    //   d[`${d.Statistic}`] = d.value
    //   return d
    // })

    // console.log('householdsSize')
    // console.log(householdsSize)

    // const householdsSizeNested = d3.nest()
    //   .key(function (d) { return d.date })
    //   .key(function (d) { return d[DIMENSION] })
    //   .entries(householdsSize)

    // console.log(householdsSizeNested)

    // householdsSizeNested.reduce()

    // const householdSizeContent = {
    //   elementId: 'chart-' + chartDivIds[1],
    //   data: householdsSizeWide.map(d => {
    //     d.mean = parseFloat((d[STATS[1]] / d[STATS[0]]).toFixed(2))
    //   }),
    //   tracenames: corkLAs,
    //   tracekey: DIMENSION,
    //   xV: 'date',
    //   yV: 'mean',
    //   tX: 'Year',
    //   tY: 'Average Household Size (Persons)'
    // }

    // const householdSizeChart = new MultiLineChart(householdSizeContent)

    d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        householdsCountChart.drawChart()
        householdsCountChart.addTooltip(STATS[0].split('(')[0], '', 'label')
        householdsCountChart.showSelectedLabelsX([1, 6, 11, 17, 21, 26, 31])
        householdsCountChart.showSelectedLabelsY([0, 2, 4, 6, 8])
      }
      if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
        residentsChart.drawChart()
        residentsChart.addTooltip(STATS[1].split('(')[0], '', 'label')
        residentsChart.showSelectedLabelsX([1, 6, 11, 17, 21, 26, 31])
        residentsChart.showSelectedLabelsY([0, 2, 4, 6, 8])
        // completionsSchemeChart.addTooltip('Scheme house completions, ', '', 'label')
      }
    }
    redraw()

    d3.select('#btn-' + chartDivIds[0]).on('click', function () {
      activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIds[1]).on('click', function () {
      activeBtn('btn-' + chartDivIds[1], ['btn-' + chartDivIds[0]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
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
