import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['national-schools']
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // EDA56: National Schools by County, Year and Statistic
  const TABLE_CODE = 'EDA56'
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>National Schools by County, Year and Statistic</i>`)
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

    const categoriesCounty = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })

    const categoriesStat = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })

    const parseYear = d3.timeParse('%Y') // ie 2014-Jan = Wed Jan 01 2014 00:00:00

    const nationalSchoolsTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d[dimensions[0]] === 'Cork City' ||
           d[dimensions[0]] === 'Cork County' ||
           d[dimensions[0]] === categoriesCounty[0]) &&
           d[dimensions[2]] === categoriesStat[3]) {
          d.date = parseYear(+d.Year)
          d.label = d.Year
          d.value = +d.value
          return d
        }
      })

    // console.log(nationalSchoolsTable)

    const nationalSchools = {
      elementId: 'chart-' + chartDivIds[0],
      data: nationalSchoolsTable,
      // .filter(d => {
      //   return d[dimensions[5]] === categoriesStat[2]
      // }),
      ks: categoriesCounty,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[3]
    }
    //
    const nationalSchoolsChart = new MultiLineChart(nationalSchools)

    // const nationalSchoolsMedian = {
    //   elementId: 'chart-' + chartDivIds[1],
    //   data: nationalSchoolsTable.filter(d => {
    //     return d[dimensions[5]] === categoriesStat[3]
    //   }),
    //   ks: categoriesRegion,
    //   k: dimensions[3],
    //   xV: 'date',
    //   yV: 'value',
    //   tX: 'Year',
    //   tY: categoriesStat[3]
    // }
    // //
    // const nationalSchoolsMedianChart = new MultiLineChart(nationalSchoolsMedian)

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        nationalSchoolsChart.drawChart()
        nationalSchoolsChart.addTooltip(',  ', '', 'label')
      }
      // if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
      //   nationalSchoolsChart.drawChart()
      //   nationalSchoolsMedianChart.addTooltip('Median house price, ', '', 'label')
      // }
    }
    redraw()

    // d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    // d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

    // d3.select('#btn-' + chartDivIds[0]).on('click', function () {
    //   activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
    //   d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    //   d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
    //   redraw()
    // })

    // d3.select('#btn-' + chartDivIds[1]).on('click', function () {
    //   activeBtn('btn-' + chartDivIds[1], ['btn-' + chartDivIds[0]])
    //   d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
    //   d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
    //   redraw()
    // })

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating National Schools chart')
    console.log(e)
    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-' + chartDivIds[0])
      main()
    })
  }
})()
