import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['house-price-mean', 'house-price-median']
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  const TABLE_CODE = 'HPM05' // gives no of outsideState and ave household size
  try {
    addSpinner(chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }

    const dataset = JSONstat(json).Dataset(0)
    // console.log('dataset')
    // console.log(dataset)
    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    // console.log(dimensions)

    const categoriesType = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })

    const categoriesStatus = dataset.Dimension(dimensions[1]).Category().map(c => {
      return c.label
    })

    const categoriesStamp = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })

    const categoriesRegion = dataset.Dimension(dimensions[3]).Category().map(c => {
      return c.label
    })

    const categoriesStat = dataset.Dimension(dimensions[5]).Category().map(c => {
      return c.label
    })
    //
    const housePriceTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[dimensions[0]] === categoriesType[0] &&
         d[dimensions[1]] === categoriesStatus[0] &&
         d[dimensions[2]] === categoriesStamp[0] &&
         (d[dimensions[3]] === 'Cork City' ||
           d[dimensions[3]] === 'Cork County' ||
           d[dimensions[3]] === categoriesRegion[0]) &&
         (d[dimensions[5]] === categoriesStat[2] ||
         d[dimensions[5]] === categoriesStat[3])) {
          d.date = parseYearMonth(d.Month)
          d.label = d.Month
          d.value = +d.value
          return d
        }
      })

    const housePriceMean = {
      e: '#chart-' + chartDivIds[0],
      d: housePriceTable.filter(d => {
        return d[dimensions[5]] === categoriesStat[2]
      }),
      ks: categoriesRegion,
      k: dimensions[3],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[2]
    }
    //
    const housePriceMeanChart = new MultiLineChart(housePriceMean)

    const housePriceMedian = {
      e: '#chart-' + chartDivIds[1],
      d: housePriceTable.filter(d => {
        return d[dimensions[5]] === categoriesStat[3]
      }),
      ks: categoriesRegion,
      k: dimensions[3],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[3]
    }
    //
    const housePriceMedianChart = new MultiLineChart(housePriceMedian)

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        housePriceMeanChart.drawChart()
        housePriceMeanChart.addTooltip('Mean house price,  ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
        housePriceMedianChart.drawChart()
        housePriceMedianChart.addTooltip('Median house price, ', '', 'label')
      }
    }
    redraw()

    d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

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
    console.log('Error creating House Price chart')
    console.log(e)
    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton(chartDivIds[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-' + chartDivIds[0])
      main()
    })
  }
})()
