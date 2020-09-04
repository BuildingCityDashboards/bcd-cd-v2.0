// /***

//   Population card

// ***/

import { coerceWideTable } from '../modules/bcd-data.js'
import { CardChartLine } from '../modules/CardChartLine.js'

async function createChart (options) {
  // console.log('createChart')
  function create () {
    d3.csv(options.href)
      .then(populationData => {
        const populationColumnNames = populationData.columns.slice(2)
        const populationColumnName = populationColumnNames[0]
        const populationDataSet = coerceWideTable(populationData, populationColumnNames)

        const populationConfig = {
          data: populationDataSet,
          elementid: '#population-card__chart',
          yvaluename: populationColumnName,
          xvaluename: 'date',
          // sN: 'region',
          // fV: d3.format('.2s'),
          dL: 'date'
        }

        const populationCard = new CardChartLine(populationConfig)

        // const info = getInfoText('#population-card a', 'The population of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

        // d3.select('#population-card__chart')
        //   .select('#card-info-text')
        //   .html('<p>' + info + '</p>')
      })
      .catch(e => {
        console.log('Error in population fetch')
        console.log(e)
      })

    // console.log('complteted create chart')
  }
  return create
}

export { createChart }
