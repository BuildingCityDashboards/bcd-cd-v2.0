
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
// import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { GroupedBarChart } from '../../modules/GroupedBarChart.js'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const parseYear = d3.timeParse('%Y')
  const chartDivIds = ['education-primary-nationality']
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // ED123: Nationality of Pupils attending Primary School by County, Nationality of Pupil and Year
  const TABLE_CODE = 'ED123'

  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Nationality of Pupils attending Primary School</i>`)

    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }

    const dataset = JSONstat(json).Dataset(0)
    console.log(dataset)

    const YAXIS = ['']
    const TRACES = 'Nationality of Pupil'
    const corkLAs = ['Cork City', 'Cork County']

    const nationalityFiltered = dataset.toTable(
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
    console.log(nationalityFiltered)
    // convert long table to wide
    const nationalityNested = d3.nest()
      .key(function (d) { return d[Year] })
      .entries(nationalityFiltered)

    console.log('nationalityNested')
    console.log(nationalityNested)

    // const nationalityWide = nationalityNested.map(function (d) {
    //   const obj = {
    //     label: d.key

    //   }
    //   d.values.forEach(function (v) {
    //     // console.log(v)
    //     // obj.date = v.date
    //     obj['Number of Persons'] = v['Number of Persons']
    //     obj[v['Province County or City']] = v.value
    //   })
    //   return obj
    // })
    // // console.log(nationalityWide)

    // const nationalityContent = {
    //   elementId: 'chart-' + chartDivIds[0],
    //   data: nationalityWide,
    //   ks: corkLAs,
    //   // k: DIMENSION,
    //   xV: XAXIS,
    //   // yV: 'value',
    //   tX: XAXIS,
    //   tY: YAXIS
    // }

    // const nationalityChart = new GroupedBarChart(nationalityContent)
    // // // houseHoldsChart.tickNumber = 31

    // d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    // // // d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

    // const redraw = () => {
    //   if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
    //     nationalityChart.drawChart()
    //     // nationalityChart.addTooltip(STATS[0].split('(')[0], '', 'label')
    //     // nationalityChart.showSelectedLabelsX([1, 6, 11, 17, 21, 26, 31])
    //     // nationalityChart.hideRate(true)
    //   }
    // }
    // redraw()
    // window.addEventListener('resize', () => {
    //   redraw()
    // })
  } catch (e) {
    console.log('Error creating primary pupils nationality chart')
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
