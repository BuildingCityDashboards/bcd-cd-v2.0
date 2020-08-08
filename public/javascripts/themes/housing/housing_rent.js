import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['rent-prices', 'rent-by-beds']

  const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // RIQ02: RTB Average Monthly Rent Report by Number of Bedrooms, Property Type, Location and Quarter
  const TABLE_CODE = 'RIQ02'
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>RTB Average Monthly Rent Report</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)
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
        if (d[dimensions[1]] === categoriesType[0] && // type
          (d[dimensions[2]] === 'Cork City' ||
            d[dimensions[2]] === 'Cork') &&
          !isNaN(+d.value)) {
          d.date = convertQuarterToDate(d.Quarter)
          d.label = d.Quarter
          d.value = +d.value
          return d
        }
      })

    // console.log(rentTable)
    //
    const rent = {
      e: '#chart-' + chartDivIds[0],
      d: rentTable.filter(d => {
        return d[dimensions[0]] === categoriesBeds[0] // all beds
      }),
      ks: categoriesLocation,
      k: dimensions[2],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[0]
    }
    //
    const rentChart = new MultiLineChart(rent)

    const rentByBeds = {
      e: '#chart-' + chartDivIds[1],
      d: rentTable,
      // .filter(d => {
      // return parseInt(d.date.getFullYear()) >= 2010
      // }),
      ks: categoriesBeds,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[0]
    }
    //
    const rentByBedsChart = new MultiLineChart(rentByBeds)
    //

    d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        rentChart.drawChart()
        rentChart.addTooltip('Rent price,  ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
        rentByBedsChart.drawChart()
        rentByBedsChart.addTooltip('Rent price, ', '', 'label')
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
      activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
      redraw()
    })

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating rent charts')
    console.log(e)
    removeSpinner('chart-' + chartDivIds[0])
    e = (e instanceof TimeoutError) ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], e)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      // console.log('retry')
      removeErrorMessageButton('chart-' + chartDivIds[0])
      main()
    })
  }
})()
