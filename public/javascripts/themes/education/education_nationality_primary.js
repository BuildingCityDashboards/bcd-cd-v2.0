
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

  const getShortName = function (s) {
    const SHORTS = {
      'United Kingdom (1)': 'UK',
      'United States and Canada': 'US & Canada',
      'Africa (11)': 'Africa',
      'Asia and Middle East': 'Asia & ME',
      'EU 15 excluding Ireland and United Kingdom': 'EU 15 ex',
      'Other Europe(32)': 'Oth. Europe',
      'Australia and South Pacific': 'Australia',
      'Other America (1)': 'Oth. America',
      'Other countries': 'Other'
    }

    return SHORTS[s] || s
  }

  try {
    addSpinner('chart-education-primary-nationality', `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Nationality of Pupils attending Primary School</i>`)

    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-education-primary-nationality')
    }

    const dataset = JSONstat(json).Dataset(0)
    console.log(dataset)

    const YAXIS = ['']
    const XAXIS_DIM = 'Nationality of Pupil'

    const corkLAs = ['Cork City', 'Cork County']

    const nationalityFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((
          d.County === corkLAs[0] ||
          d.County === corkLAs[1]) &&
          d.Year === '2020' &&
          d[XAXIS_DIM] !== 'All countries' &&
          d[XAXIS_DIM] !== 'Ireland' &&
          d.value !== null) {
          d.value = +d.value
          return d
        }
      })
    console.log(nationalityFiltered)

    const nationalityNested = d3.nest()
      .key(function (d) { return d[XAXIS_DIM] })
      .entries(nationalityFiltered)

    console.log('nationalityNested')
    console.log(nationalityNested)

    const nationalityWide = nationalityNested.map(function (d) {
      const obj = {
        label: d.key

      }
      d.values.forEach(function (v) {
        // console.log(v)
        // obj.date = v.date
        obj[XAXIS_DIM] = getShortName(v[XAXIS_DIM])
        obj[v.County] = v.value
      })
      return obj
    })
    console.log(nationalityWide)

    const nationalityContent = {
      elementId: 'chart-education-primary-nationality',
      data: nationalityWide,
      tracenames: corkLAs,
      xV: XAXIS_DIM,
      yV: 'value',
      tX: XAXIS_DIM,
      tY: 'No. of puplils'
    }

    const nationalityChart = new GroupedBarChart(nationalityContent)
    nationalityChart.hideRate(true)
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
