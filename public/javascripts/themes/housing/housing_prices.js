import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'
import { hasCleanValue, formatHundredThousands, formatHundredThousandsShort } from '../../modules/bcd-data.js'

async function main () {
  const chartDivIdsPrices = ['housing-price-all', 'housing-price-house', 'housing-price-apartment']
  const chartDivIdsSales = ['housing-sales-all', 'housing-sales-house', 'housing-sales-apartment']

  d3.select('#chart-' + chartDivIdsPrices[0]).style('display', 'block')
  d3.select('#chart-' + chartDivIdsPrices[1]).style('display', 'none')
  d3.select('#chart-' + chartDivIdsPrices[2]).style('display', 'none')
  d3.select('#chart-' + chartDivIdsSales[0]).style('display', 'block')
  d3.select('#chart-' + chartDivIdsSales[1]).style('display', 'none')
  d3.select('#chart-' + chartDivIdsSales[2]).style('display', 'none')

  const parseYearMonth = d3.timeParse('%YM%m')
  const STATBANK_BASE_URL =
    'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  const TABLE_CODE = 'HPM05' // gives no of outsideState and ave household size
  const STATIC_DATA_URL = '../data/static/HPM05.json'
  try {
    addSpinner('chart-' + chartDivIdsPrices[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
    addSpinner('chart-' + chartDivIdsSales[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATIC_DATA_URL)
    if (json) {
      removeSpinner('chart-' + chartDivIdsPrices[0])
      removeSpinner('chart-' + chartDivIdsSales[0])
    }

    const dataset = JSONstat(json).Dataset(0)
    // console.log('dataset')
    // console.log(dataset)
    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    // console.log('dimensions')
    // console.log(dimensions)

    const categoriesType = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })

    // console.log(categoriesType)

    const categoriesStatus = dataset.Dimension(dimensions[1]).Category().map(c => {
      return c.label
    })
    // console.log('categoriesStatus')
    // console.log(categoriesStatus)

    const categoriesStamp = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })

    const categoriesRegion = dataset.Dimension(dimensions[3]).Category().map(c => {
      return c.label
    })

    const categoriesStat = dataset.Dimension(dimensions[5]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesStat)
    const houseSalesTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[dimensions[1]] === categoriesStatus[0] &&
          d[dimensions[2]] === categoriesStamp[0] &&
          (d[dimensions[3]] === 'Cork City' ||
            d[dimensions[3]] === 'Cork County' ||
            d[dimensions[3]] === categoriesRegion[0]) &&
          (d[dimensions[5]] === categoriesStat[0] ||
            d[dimensions[5]] === categoriesStat[2]) &&
          hasCleanValue(d)) {
          d.date = parseYearMonth(d.Month)
          d.label = d.Month
          d.value = +d.value
          // console.log(d.value)

          return d
        }
      })

    const housePriceAll = {
      elementId: 'chart-' + chartDivIdsPrices[0],
      data: houseSalesTable.filter(d => {
        return d[dimensions[0]] === categoriesType[0] && d[dimensions[5]] === categoriesStat[2]
      }),
      tracenames: ['Cork City', 'Cork County', categoriesRegion[0]],
      tracekey: dimensions[3],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[2],
      formaty: 'hundredThousandsShort'
    }
    //
    const housePriceAllChart = new BCDMultiLineChart(housePriceAll)

    const housePriceHouse = {
      elementId: 'chart-' + chartDivIdsPrices[1],
      data: houseSalesTable.filter(d => {
        return d[dimensions[0]] === categoriesType[1] && d[dimensions[5]] === categoriesStat[2]
      }),
      tracenames: ['Cork City', 'Cork County', categoriesRegion[0]],
      tracekey: dimensions[3],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[2],
      formaty: 'hundredThousandsShort'
    }
    // console.log(housePriceHouse)
    const housePriceHouseChart = new BCDMultiLineChart(housePriceHouse)

    const housePriceApartment = {
      elementId: 'chart-' + chartDivIdsPrices[2],
      data: houseSalesTable.filter(d => {
        return d[dimensions[0]] === categoriesType[2] && d[dimensions[5]] === categoriesStat[2]
      }),
      tracenames: ['Cork City', 'Cork County', categoriesRegion[0]],
      tracekey: dimensions[3],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[2],
      formaty: 'hundredThousandsShort'
    }
    //
    const housePriceApartmentChart = new BCDMultiLineChart(housePriceApartment)

    const houseSalesAll = {
      elementId: 'chart-' + chartDivIdsSales[0],
      data: houseSalesTable.filter(d => {
        return d[dimensions[0]] === categoriesType[0] && d[dimensions[5]] === categoriesStat[0] && d[dimensions[3]] !== categoriesRegion[0] // exclude state figures
      }),
      tracenames: ['Cork City', 'Cork County', categoriesRegion[0]],
      tracekey: dimensions[3],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[0],
      margins: {
        left: 56
      }
    }
    //
    const houseSalesAllChart = new BCDMultiLineChart(houseSalesAll)

    const houseSalesHouse = {
      elementId: 'chart-' + chartDivIdsSales[1],
      data: houseSalesTable.filter(d => {
        return d[dimensions[0]] === categoriesType[1] && d[dimensions[5]] === categoriesStat[0] && d[dimensions[3]] !== categoriesRegion[0]
      }),
      tracenames: ['Cork City', 'Cork County', categoriesRegion[0]],
      tracekey: dimensions[3],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[0],
      margins: {
        left: 56
      }
    }

    const houseSalesHouseChart = new BCDMultiLineChart(houseSalesHouse)

    const houseSalesApartment = {
      elementId: 'chart-' + chartDivIdsSales[2],
      data: houseSalesTable.filter(d => {
        return d[dimensions[0]] === categoriesType[2] && d[dimensions[5]] === categoriesStat[0] && d[dimensions[3]] !== categoriesRegion[0]
      }),
      tracenames: ['Cork City', 'Cork County', categoriesRegion[0]],
      tracekey: dimensions[3],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[0],
      margins: {
        left: 56
      }

    }

    const houseSalesApartmentChart = new BCDMultiLineChart(houseSalesApartment)

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIdsPrices[0]).style.display !== 'none') {
        housePriceAllChart.drawChart()
        housePriceAllChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12])
        housePriceAllChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12])
        housePriceAllChart.addTooltip('All Housing Mean Price,  ', '', 'label')
        // housePriceAllChart.showSelectedLabelsX([])
      }
      if (document.querySelector('#chart-' + chartDivIdsPrices[1]).style.display !== 'none') {
        housePriceHouseChart.drawChart()
        housePriceHouseChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12])
        housePriceHouseChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12])
        housePriceHouseChart.addTooltip('House Mean Price, ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIdsPrices[2]).style.display !== 'none') {
        housePriceApartmentChart.drawChart()
        housePriceApartmentChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12])
        housePriceApartmentChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12])
        housePriceApartmentChart.addTooltip('Apartment Mean Price, ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIdsSales[0]).style.display !== 'none') {
        houseSalesAllChart.drawChart()
        houseSalesAllChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12])
        houseSalesAllChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12])
        houseSalesAllChart.addTooltip('All Housing Sales Volume,  ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIdsSales[1]).style.display !== 'none') {
        houseSalesHouseChart.drawChart()
        houseSalesHouseChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12])
        houseSalesHouseChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12])
        houseSalesHouseChart.addTooltip('House Sales Volume, ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIdsSales[2]).style.display !== 'none') {
        houseSalesApartmentChart.drawChart()
        houseSalesApartmentChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12])
        houseSalesApartmentChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12])
        houseSalesApartmentChart.addTooltip('Apartment Sales Volume, ', '', 'label')
      }
    }
    redraw()

    d3.select('#btn-' + chartDivIdsPrices[0]).on('click', function () {
      activeBtn('btn-' + chartDivIdsPrices[0], ['btn-' + chartDivIdsPrices[1], 'btn-' + chartDivIdsPrices[2]])
      d3.select('#chart-' + chartDivIdsPrices[0]).style('display', 'block')
      d3.select('#chart-' + chartDivIdsPrices[1]).style('display', 'none')
      d3.select('#chart-' + chartDivIdsPrices[2]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIdsPrices[1]).on('click', function () {
      activeBtn('btn-' + chartDivIdsPrices[1], ['btn-' + chartDivIdsPrices[0], 'btn-' + chartDivIdsPrices[2]])
      d3.select('#chart-' + chartDivIdsPrices[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIdsPrices[1]).style('display', 'block')
      d3.select('#chart-' + chartDivIdsPrices[2]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIdsPrices[2]).on('click', function () {
      activeBtn('btn-' + chartDivIdsPrices[2], ['btn-' + chartDivIdsPrices[0], 'btn-' + chartDivIdsPrices[1]])
      d3.select('#chart-' + chartDivIdsPrices[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIdsPrices[1]).style('display', 'none')
      d3.select('#chart-' + chartDivIdsPrices[2]).style('display', 'block')
      redraw()
    })

    d3.select('#btn-' + chartDivIdsSales[0]).on('click', function () {
      activeBtn('btn-' + chartDivIdsSales[0], ['btn-' + chartDivIdsSales[1], 'btn-' + chartDivIdsSales[2]])
      d3.select('#chart-' + chartDivIdsSales[0]).style('display', 'block')
      d3.select('#chart-' + chartDivIdsSales[1]).style('display', 'none')
      d3.select('#chart-' + chartDivIdsSales[2]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIdsSales[1]).on('click', function () {
      activeBtn('btn-' + chartDivIdsSales[1], ['btn-' + chartDivIdsSales[0], 'btn-' + chartDivIdsSales[2]])
      d3.select('#chart-' + chartDivIdsSales[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIdsSales[1]).style('display', 'block')
      d3.select('#chart-' + chartDivIdsSales[2]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIdsSales[2]).on('click', function () {
      activeBtn('btn-' + chartDivIdsSales[2], ['btn-' + chartDivIdsSales[0], 'btn-' + chartDivIdsSales[1]])
      d3.select('#chart-' + chartDivIdsSales[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIdsSales[1]).style('display', 'none')
      d3.select('#chart-' + chartDivIdsSales[2]).style('display', 'block')
      redraw()
    })

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating House Price chart')
    console.log(e)
    removeSpinner('chart-' + chartDivIdsPrices[0])
    removeSpinner('chart-' + chartDivIdsSales[0])
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnIDPrices = addErrorMessageButton('chart-' + chartDivIdsPrices[0], eMsg)
    const errBtnIDSales = addErrorMessageButton('chart-' + chartDivIdsSales[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnIDPrices}`).on('click', function () {
      removeErrorMessageButton('chart-' + chartDivIdsPrices[0])
      removeErrorMessageButton('chart-' + chartDivIdsSales[0])
      main()
    })
    d3.select(`#${errBtnIDSales}`).on('click', function () {
      removeErrorMessageButton('chart-' + chartDivIdsPrices[0])
      removeErrorMessageButton('chart-' + chartDivIdsSales[0])
      main()
    })
  }
}

export { main }
