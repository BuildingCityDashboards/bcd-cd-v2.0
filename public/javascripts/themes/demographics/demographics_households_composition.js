
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
// import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { GroupedBarChart } from '../../modules/GroupedBarChart.js'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const parseYear = d3.timeParse('%Y')
  const chartDivIds = ['households-composition']
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // CNA29 - Private Permanent Households by Number of Persons, Province County or City and CensusYear
  const TABLE_CODE = 'CNA29'
  const XAXIS = ['Number of Persons']
  const YAXIS = ['Private Permanent Households  (Number)']
  const TRACES = 'Province County or City'
  const corkLAs = ['Cork City', 'Cork County']

  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Private Permanent Households</i>`)

    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }

    const dataset = JSONstat(json).Dataset(0)
    // console.log(dataset)

    const XAXIS = ['Number of Persons']
    const YAXIS = ['Private Permanent Households  (Number)']
    const TRACES = 'Province County or City'
    const corkLAs = ['Cork City', 'Cork County']

    const householdsCompFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d[TRACES] === corkLAs[0] ||
       d[TRACES] === corkLAs[1]) &&
       d['Number of Persons'] !== 'Total number' &&
        //  d.Statistic === STATS[0] &&
       d.value !== null &&
       +d['Census Year'] === 2016) {
          d.date = parseYear(+d['Census Year'])
          // d.label = +d['Census Year']
          d.value = +d.value
          return d
        }
      })
    // console.log(householdsCompFiltered)
    // convert long table to wide
    const householdsCompNested = d3.nest()
      .key(function (d) { return d['Number of Persons'] })
      .entries(householdsCompFiltered)

    // console.log(householdsCompNested)

    const householdsCompWide = householdsCompNested.map(function (d) {
      const obj = {
        label: d.key

      }
      d.values.forEach(function (v) {
        // console.log(v)
        // obj.date = v.date
        obj['Number of Persons'] = v['Number of Persons']
        obj[v['Province County or City']] = v.value
      })
      return obj
    })
    // console.log(householdsCompWide)

    const householdsCompContent = {
      e: '#chart-' + chartDivIds[0],
      d: householdsCompWide,
      ks: corkLAs,
      // k: DIMENSION,
      xV: XAXIS,
      // yV: 'value',
      tX: XAXIS,
      tY: 'Households (Number)'
    }

    const householdsCompChart = new GroupedBarChart(householdsCompContent)
    // // houseHoldsChart.tickNumber = 31

    d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    // // d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        householdsCompChart.drawChart()
        // householdsCompChart.addTooltip(STATS[0].split('(')[0], '', 'label')
        // householdsCompChart.showSelectedLabelsX([1, 6, 11, 17, 21, 26, 31])
        householdsCompChart.hideRate(true)
      }
    }
    redraw()
    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating household composition chart')
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
