// /***

//   Population card

// ***/

import { hasCleanValue } from '../modules/bcd-data.js'
import { convertQuarterToDate, getYearQuarterFromDate } from '../modules/bcd-date.js'
import { CardChartLine } from '../modules/CardChartLine.js'
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

async function main(options) {
  // console.log('createChart')
  console.log(options)

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  const json = await fetchJsonFromUrlAsync(options.data.href)
  console.log('json')
  console.log(json)

  // if (json) {
  // removeSpinner('chart-' + chartDivIds[0])
  // }

  const dataset = JSONstat(json).Dataset(0)
  // console.log(dataset)

  const dimensions = dataset.Dimension().map(dim => {
    return dim.label
  })
  const categoriesRegion = dataset.Dimension(dimensions[0]).Category().map(c => {
    return c.label
  })

  const categoriesStat = dataset.Dimension(dimensions[2]).Category().map(c => {
    return c.label
  })

  const employmentTable = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if (d[dimensions[0]] === 'Southern' &&
        hasCleanValue(d)) {
        d.date = convertQuarterToDate(d.Quarter)
        d.value = +d.value * 1000
        d.label = d.Quarter
        return d
      }
    })

  console.log(employmentTable)

  const employedCountConfig = {
    data: employmentTable.filter(d => {
      return d[dimensions[2]] === categoriesStat[0]
    }),
    elementid: '#employment-card__chart',
    yvaluename: 'value',
    xvaluename: 'date',
    // sN: dimensions[1],
    fV: d3.format('.2s'), // format y value
    dL: 'label'
  }

  const employmentnCard = new CardChartLine(employedCountConfig)

  window.addEventListener('resize', () => {
    employmentnCard.drawChart()
  })

  //   //       // const info = getInfoText('#population-card a', 'The population of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

  //   //       // d3.select('#population-card__chart')
  //   //       //   .select('#card-info-text')
  //   //       //   .html('<p>' + info + '</p>')
  //   //     })
}

export { main }
