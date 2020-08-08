/** * This the Gross Value Added per Capita at Basic Prices Chart ***/
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

(async () => {
  // console.log('fetch cso json')
  const parseYear = d3.timeParse('%Y')

  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  const TABLE_CODE = 'RAA06'
  const STAT = 'Gross Value Added (GVA) per person at Basic Prices (Euro)'

  try {
    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
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
      e: '#chart-gva',
      xV: 'date',
      yV: 'value',
      d: gvaFiltered,
      k: 'Region',
      // ks: ['Dublin', 'Dublin and Mid-East', 'State'],
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
    console.log(e)
  }
})()
