// /***

//   Population card

// ***/

// // - TODO: pass in args to remove hard-coded values in script, generalise script (issue #27)

async function createChart () {
  function create () {
    let populationCard

    d3.csv('/data/population.csv')
      .then(populationData => {
        const populationColumnNames = populationData.columns.slice(2)
        const populationColumnName = populationColumnNames[0]
        const populationDataSet = coerceData(populationData, populationColumnNames)

        const populationConfig = {
          data: populationDataSet,
          elementid: '#population-card__chart',
          yvaluename: populationColumnName,
          xvaluename: 'date',
          // sN: 'region',
          // fV: d3.format('.2s'),
          dL: 'date'
        }

        populationCard = new CardChartLine(populationConfig)

        // const info = getInfoText('#population-card a', 'The population of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

        d3.select('#population-card__chart')
          .select('#card-info-text')
          .html('<p>' + info + '</p>')
      })
      .catch(e => {
        console.log('Error in population fetch')
        console.log(e)
      })

    function coerceData (data, columns) {
      const coercedData = data.map(d => {
        for (var i = 0, n = columns.length; i < n; i++) {
          d[columns[i]] = +d[columns[i]]
        }
        return d
      })
      return coercedData
    }
    console.log('hello')
  }
  return create
}
