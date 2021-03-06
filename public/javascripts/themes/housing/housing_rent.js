import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { hasCleanValue } from '../../modules/bcd-data.js'
import { convertQuarterToDate, isFutureDate } from '../../modules/bcd-date.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

async function main () {
  const chartDivIds = ['rent-prices', 'rent-by-beds']
  d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
  d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

  const STATBANK_BASE_URL =
    // 'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
    'https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/43/RTB/RIQ02?query=%7B%22query%22:%5B%7B%22code%22:%22C02970V03592%22,%22selection%22:%7B%22filter%22:%22item%22,%22values%22:%5B%22-%22%5D%7D%7D,%7B%22code%22:%22C02969V03591%22,%22selection%22:%7B%22filter%22:%22item%22,%22values%22:%5B%22-%22%5D%7D%7D,%7B%22code%22:%22C03004V03625%22,%22selection%22:%7B%22filter%22:%22item%22,%22values%22:%5B%22113000%22,%22115200%22%5D%7D%7D%5D,%22response%22:%7B%22format%22:%22json-stat2%22%7D%7D'
  // RIQ02: RTB Average Monthly Rent Report by Number of Bedrooms, Property Type, Location and Quarter
  const TABLE_CODE = 'RIQ02'
  const STATIC_URL = '../../data/static/RIQ02.json'
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>RTB Average Monthly Rent Report</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATIC_URL)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }
    const dataset = JSONstat(json).Dataset(0)
    // console.log(dataset)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    // console.log(dimensions)

    const categoriesBeds = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesBeds)

    const categoriesType = dataset.Dimension(dimensions[1]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesType)
    //
    const categoriesLocation = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesLocation)

    const categoriesStat = dataset.Dimension(dimensions[4]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesStat)

    const rentTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[dimensions[1]] === categoriesType[4] && // type
          (d[dimensions[2]] === 'Cork City' ||
            d[dimensions[2]] === 'Cork') &&
          hasCleanValue(d)) {
          d.date = convertQuarterToDate(d.Quarter)
          d.label = d.Quarter
          d.value = +d.value
          return d
        }
      })

    // console.log(rentTable)
    //
    const rent = {
      elementId: 'chart-' + chartDivIds[0],
      data: rentTable.filter(d => {
        return d[dimensions[0]] === categoriesBeds[0] && !isFutureDate(d.date) // all beds
      }),
      // tracenames: ['Cork City', 'Cork County'],
      tracekey: dimensions[2],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'Monthly rent (€)'
    }
    //

    // console.log(rent)
    const rentChart = new BCDMultiLineChart(rent)

    // const rentByBeds = {
    //   elementId: 'chart-' + chartDivIds[1],
    //   data: rentTable
    //     .filter(d => {
    //       return !isFutureDate(d.date) // all beds
    //     }),
    //   tracenames: categoriesBeds,
    //   tracekey: dimensions[0],
    //   xV: 'date',
    //   yV: 'value',
    //   tX: 'Year',
    //   tY: categoriesStat[0]
    // }
    // //
    // const rentByBedsChart = new BCDMultiLineChart(rentByBeds)
    //

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        rentChart.drawChart()
        rentChart.addTooltip('Rent price,  ', '', 'label')
        rentChart.showSelectedLabelsX([0, 3, 6, 9, 12])
        rentChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10])
      }
      // if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
      //   // rentByBedsChart.drawChart()
      //   // rentByBedsChart.addTooltip('Rent price, ', '', 'label')
      //   // rentByBedsChart.showSelectedLabelsX([0, 3, 6, 9, 12])
      //   // rentByBedsChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10])
      // }
    }
    redraw()

    d3.select('#btn-' + chartDivIds[0]).on('click', function () {
      activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
      // d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIds[1]).on('click', function () {
      activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
      // d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
      redraw()
    })

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating rent charts')
    console.log(e)
    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = (e instanceof TimeoutError) ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      // console.log('retry')
      removeErrorMessageButton('chart-' + chartDivIds[0])
      main()
    })
  }
}

export { main }
