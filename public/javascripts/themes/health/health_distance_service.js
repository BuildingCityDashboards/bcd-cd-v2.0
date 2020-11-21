
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { GroupedBarChart } from '../../modules/GroupedBarChart.js'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'
import { hasCleanValue } from '../../modules/bcd-data.js'

(async function main () {
  const chartDivIds = ['distance-health-service']
  const STATBANK_BASE_URL =
    'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // MDS02: Average Distance of Residential Dwellings to Selected Services and Infrastructure by Region and County, Type of Selected Services and Infrastructure and Year
  const TABLE_CODE = 'MDS02'

  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Average Distance of Residential Dwellings to Everyday Services</i>`)

    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }

    const dataset = JSONstat(json).Dataset(0)
    // console.log(dataset)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    // console.log(dimensions)

    const categoriesType = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesType)

    const categoriesUrban = dataset.Dimension(dimensions[1]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesUrban)
    // //
    const categoriesStat = dataset.Dimension(dimensions[3]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesStat)

    const XAXIS = ['Type of Selected Service and Infrastructure']
    const XAXIS_CATEGORIES = ['HSE Adult Emergency Department hospital', 'HSE Maternity hospital', 'Pharmacy', 'GP']
    const YAXIS = ['Average Distance of Residential Dwellings to Selected Services and Infrastructure (Kilometres)']
    const TRACES = 'Region and County'
    const INCLUDE_REGIONS = ['State', 'Dublin City', 'Cork City', 'Cork County']

    const distanceHealthServiceFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (INCLUDE_REGIONS.includes(d[TRACES]) &&
          XAXIS_CATEGORIES.includes(d[XAXIS]) &&
          hasCleanValue(d)) {
          d.value = +d.value
          return d
        }
      })
    // console.log(distanceHealthServiceFiltered)
    // convert long table to wide
    const distanceHealthServiceNested = d3.nest()
      .key(function (d) { return d[XAXIS] })
      .entries(distanceHealthServiceFiltered)

    // console.log(distanceHealthServiceNested)

    const distanceHealthServiceWide = distanceHealthServiceNested.map(function (d) {
      const obj = {
        label: d.key
      }
      d.values.forEach(function (v) {
        // console.log(v)
        // obj.date = v.date
        obj[XAXIS] = getShortName(v[XAXIS])
        obj[v[TRACES]] = v.value
      })
      return obj
    })
    // console.log(distanceHealthServiceWide)

    const distanceHealthServiceContent = {
      elementId: 'chart-' + chartDivIds[0],
      data: distanceHealthServiceWide,
      tracenames: INCLUDE_REGIONS,
      // tracekey: DIMENSION,
      xV: XAXIS,
      // yV: 'value',
      tX: getShortName(XAXIS),
      tY: getShortName(YAXIS)
    }

    const distanceHealthServiceChart = new GroupedBarChart(distanceHealthServiceContent)
    // // // houseHoldsChart.tickNumber = 31

    // d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    // // // d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        distanceHealthServiceChart.drawChart()
        distanceHealthServiceChart.hideRate(true)
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

const getShortName = function (s) {
  const SHORTS = {
    'Type of Selected Service and Infrastructure': 'Type of Service',
    'HSE Adult Emergency Department hospital': 'A&E Hosp.',
    'HSE Maternity hospital': 'Maternity Hosp.',
    'Average Distance of Residential Dwellings to Selected Services and Infrastructure (Kilometres)': 'Average Distance (Km)'
  }

  return SHORTS[s] || s
}
