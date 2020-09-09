// /***

//   Population card

// ***/

import { hasCleanValue } from '../modules/bcd-data.js'
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js'

async function main (options) {
  // console.log('createChart')
  console.log(options)

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  const json = await fetchJsonFromUrlAsync(options.data.href)
  console.log('json')
  console.log(json)

  // if (json) {
  // removeSpinner('chart-' + chartDivIds[0])
  // }

  window.addEventListener('resize', () => {

  })

  //   //       // const info = getInfoText('#population-card a', 'The population of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

  //   //       // d3.select('#population-card__chart')
  //   //       //   .select('#card-info-text')
  //   //       //   .html('<p>' + info + '</p>')
  //   //     })
}

export { main }
