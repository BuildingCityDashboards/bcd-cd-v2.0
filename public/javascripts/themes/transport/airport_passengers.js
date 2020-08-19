import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { hasCleanValue } from '../../modules/bcd-data.js'

import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['airport-passengers']
  //   const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // TAQ01: Passengers by Airports in Ireland, Quarter and Statistic
  const TABLE_CODE = 'TAQ01'
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Passengers by Airports</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }
    const dataset = JSONstat(json).Dataset(0)
    console.log(dataset)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    console.log(dimensions)

    const categoriesAirport = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    console.log(categoriesAirport)
    // //
    const categoriesStat = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })
    console.log(categoriesStat)

    const airportPassengersTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[dimensions[0]] === categoriesAirport[1] &&
            d[dimensions[2]] !== categoriesStat[1] &&
            hasCleanValue(d)) {
          d.date = convertQuarterToDate(d.Quarter)
          d.label = d.Quarter
          d.value = +d.value
          d.Statistic = getTraceName(d.Statistic)
          return d
        }
      })

    console.log(airportPassengersTable)
    const airportPassengers = {
      elementId: 'chart-' + chartDivIds[0],
      data: airportPassengersTable,
      tracenames: categoriesStat,
      tracekey: dimensions[2],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'Passengers (Number)'
    }

    const airportPassengersChart = new MultiLineChart(airportPassengers)

    const redraw = () => {
      airportPassengersChart.drawChart()
    //   airportPassengersChart.addTooltip('RPPI for ', '', 'label')
    }
    redraw()

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating RPPI chart')
    console.log(e)

    removeSpinner('chart-' + chartDivIds[0])
    e = (e instanceof TimeoutError) ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], e)
    console.log('e')
    console.log(e)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-' + chartDivIds[0])
      main()
    })
  }
})()

const getTraceName = function (s) {
  const SHORTS = {
    'Passengers (Number)': 'Passenger Count',
    'Passengers Trend (Number)': 'Trend',
    'Passengers (Seasonally Adjusted) (Number)': 'Seasonally Adj.'
  }

  return SHORTS[s] || s
}
