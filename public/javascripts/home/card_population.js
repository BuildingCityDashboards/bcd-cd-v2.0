// /***

//   Population card

// ***/

import { coerceWideTable, hasCleanValue } from '../modules/bcd-data.js'

import { CardChartLine } from '../modules/CardChartLine.js'
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

async function main (options) {
  console.log('createChart')
  console.log(options)

  const STATBANK_BASE_URL =
    '../data/static/'
  // CNA13: Annual Rate of Population Increase by Sex, Province or County, CensusYear and Statistic
  const TABLE_CODE = 'CNA13.json'

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
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
  const categoriesSex = dataset.Dimension(dimensions[0]).Category().map(c => {
    return c.label
  })

  const categoriesStat = dataset.Dimension(dimensions[3]).Category().map(c => {
    return c.label
  })

  const populationFiltered = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if (d[dimensions[1]] === 'Cork' &&
        d.Statistic === categoriesStat[0] &&
        d.Sex === categoriesSex[0] &&
        hasCleanValue(d)) {
        d.date = +d['Census Year']
        d.value = +d.value
        return d
      }
    })

  const populationConfig = {
    data: populationFiltered,
    elementid: '#population-card__chart',
    yvaluename: 'value',
    xvaluename: 'date',
    // sN: dimensions[1],
    fV: d3.format('.2s'), // format y value
    dL: 'date'
  }

  const populationCard = new CardChartLine(populationConfig)

  //   //       // const info = getInfoText('#population-card a', 'The population of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

  //   //       // d3.select('#population-card__chart')
  //   //       //   .select('#card-info-text')
  //   //       //   .html('<p>' + info + '</p>')
  //   //     })
}

export { main }
