// /***

//   Population card

// ***/

import { hasCleanValue } from '../modules/bcd-data.js'
import { CardChartLine } from '../modules/CardChartLine.js'
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

async function main (options) {
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  const json = await fetchJsonFromUrlAsync(options.plotoptions.data.href)
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

  //   const populationFiltered = dataset.toTable(
  //     { type: 'arrobj' },
  //     (d, i) => {
  //       if (d[dimensions[3]] === 'Cork' &&
  //                 d.Statistic === categoriesStat[0] &&
  //                 d.Sex === categoriesSex[0] &&
  //                 hasCleanValue(d)) {
  //         d.date = +d['Census Year']
  //         d.value = +d.value
  //         return d
  //       }
  //     })

  //   const populationConfig = {
  //     data: populationFiltered,
  //     elementid: '#' + options.plotoptions.chartid,
  //     yvaluename: 'value',
  //     xvaluename: 'date',
  //     // sN: dimensions[1],
  //     fV: d3.format('.2s'), // format y value
  //     dL: 'date'
  //   }

  //   const populationCard = new CardChartLine(populationConfig)

  window.addEventListener('resize', () => {
    // populationCard.drawChart()
  })

  //   //       // const info = getInfoText('#population-card a', 'The population of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

  //   //       // d3.select('#population-card__chart')
  //   //       //   .select('#card-info-text')
  //   //       //   .html('<p>' + info + '</p>')
  //   //     })
}

export { main }
