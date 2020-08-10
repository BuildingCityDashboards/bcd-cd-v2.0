
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { GroupedBarChart } from '../../modules/GroupedBarChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const parseYear = d3.timeParse('%Y')
  const chartDivIds = ['households', 'householdComposition']
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // CNA29 - Private Permanent Households by Number of Persons, Province County or City and CensusYear
  const TABLE_CODE = 'CNA29' // gives no of households and ave household size
  const STATS = ['Number of Households  (Number)', 'Number of Persons Resident (Number)']
  const DIMENSION = 'Province County or City'

  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>New Dwelling Completion</i>`)

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
       d.Statistic === STATS[0] &&
       d.value !== null &&
       d['Type of Private Accommodation'] === 'All households' &&
       +d['Census Year'] >= 1986) {
          d.date = parseYear(+d['Census Year'])
          d.label = +d['Census Year']
          d.value = +d.value
          return d
        }
      })
    //  console.log(householdsFiltered)

    const houseHoldsContent = {
      e: '#chart-households',
      d: householdsFiltered,
      ks: corkLAs,
      k: DIMENSION,
      xV: 'date',
      yV: 'value',
      tX: 'Census years',
      tY: STATS[0].split('(')[0]
    }

    const houseHoldsChart = new MultiLineChart(houseHoldsContent)
    // houseHoldsChart.tickNumber = 31

    d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        houseHoldsChart.drawChart()
        houseHoldsChart.addTooltip(STATS[0].split('(')[0], '', 'label')
        houseHoldsChart.showSelectedLabels([1, 6, 11, 17, 21, 26, 31])
      }
      // if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
      //   completionsSchemeChart.drawChart()
      //   completionsSchemeChart.addTooltip('Scheme house completions, ', '', 'label')
      // }
    }
    redraw()

    // houseHoldsChart.addTooltip(houseHoldsTT)

    // d3.select('#btn-households').on('click', function () {
    //   activeBtn(this)
    //   // alert('hi99')
    //   d3.select('#chart-households').style('display', 'block')
    //   d3.select('#chart-households-size').style('display', 'none')
    //   houseHoldsChart.tickNumber = 31
    //   houseHoldsChart.drawChart()
    //   // houseHoldsChart.addTooltip(houseHoldsTT)
    //   houseHoldsChart.addTooltip(STATS[0].split('(')[0], '', 'label')
    //   houseHoldsChart.showSelectedLabels([1, 6, 11, 17, 21, 26, 31])
    // })

    // d3.select('#btn-households-size').on('click', function () {
    //   activeBtn(this)
    //   console.log(householdsFiltered)
    //   // alert('hree')
    //   d3.select('#chart-households').style('display', 'none')
    //   d3.select('#chart-households-size').style('display', 'block')
    // })

    window.addEventListener('resize', () => {
      redraw()
    })

    // if (document.getElementById('chart-householdComposition')) {
    //

    //     window.addEventListener('resize', () => {
    //       // console.log('redraw households comp')
    //       houseHoldCompositionChart = new GroupedBarChart(houseHoldCompositionContent)
    //       houseHoldCompositionChart.drawChart()
    //       houseHoldCompositionChart.addTooltip(houseHoldCompositionTT)
    //       houseHoldCompositionChart.hideRate(true)
    //     })
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
