import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['house-rppi']
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // HPM09: Residential Property Price Index by Type of Residential Property, Month and Statistic
  const TABLE_CODE = 'HPM09'
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Residential Property Price Index</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }
    const dataset = JSONstat(json).Dataset(0)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })

    const categoriesRegion = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    //
    const categoriesStat = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })

    const houseRppiTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d[dimensions[0]] === categoriesRegion[1] ||
           d[dimensions[0]] === 'South-West - houses') &&
         d[dimensions[2]] === categoriesStat[0]) {
          d.date = parseYearMonth(d.Month)
          d.label = d.Month
          d.value = +d.value
          return d
        }
      })

    const houseRppi = {
      elementId: 'chart-house-rppi',
      data: houseRppiTable.filter(d => {
        return parseInt(d.date.getFullYear()) >= 2010
      }),
      tracenames: categoriesRegion,
      tracekey: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: ''
    }

    const houseRppiChart = new MultiLineChart(houseRppi)

    const redraw = () => {
      houseRppiChart.drawChart()
      houseRppiChart.addTooltip('RPPI for ', '', 'label')
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
