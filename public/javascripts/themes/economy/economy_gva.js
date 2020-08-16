/** * This the Gross Value Added per Capita at Basic Prices Chart ***/
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  // console.log('fetch cso json')
  const parseYear = d3.timeParse('%Y')

  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  const TABLE_CODE = 'RAA06'
  const STAT = 'Gross Value Added (GVA) per person at Basic Prices (Euro)'

  try {
    const chartDivIds = ['gva']
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Gross Value Added (GVA) per person at Basic Prices/i>`)

    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }

    const gvaDataset = JSONstat(json).Dataset(0)

    const gvaFiltered = gvaDataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d.Region === 'South-West' ||
       d.Region === 'State') &&
       d.Statistic === STAT) {
          d.label = d.Year
          d.date = parseYear(+d.Year)
          d.value = +d.value
          return d
        }
      }
    )

    const gvaContent = {
      elementId: 'chart-gva',
      xV: 'date',
      yV: 'value',
      data: gvaFiltered,
      tracekey: 'Region',
      // tracenames: ['Dublin', 'Dublin and Mid-East', 'State'],
      tX: 'Years',
      tY: '€'

    }

    const gvaChart = new MultiLineChart(gvaContent)

    const redraw = () => {
      gvaChart.drawChart()
      gvaChart.addTooltip(STAT + 'Year:', '', 'label')
    }
    redraw()

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating GVA charts')
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
