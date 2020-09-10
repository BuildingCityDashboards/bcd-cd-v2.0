// /***

//   Air quality card

// ***/
'use strict'

import { fetchJsonFromUrlAsyncTimeout } from '../modules/bcd-async.js'

async function main (options) {
  // console.log('createChart')
  console.log(options)

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  //   const refreshInterval = 100
  //   let refreshCountdown = refreshInterval

  //   const updateCountdown = function () {
  //     // const cd = refreshCountdown / 1000
  //     // d3.select('#bikes-bikesCountdown').text('Update in ' + cd)
  //     // console.log('Countdown: ' + cd)
  //     if (refreshCountdown > 0) refreshCountdown -= refreshInterval / 2
  //     else fetchData()
  //   }

  //   let refreshTimer = setInterval(updateCountdown, refreshInterval)
  const RETRY_INTERVAL = 3000
  const REFRESH_INTERVAL = 60000 * 10
  let refreshTimeout

  async function fetchData () {
    // console.log('fetch data')
    let json
    clearTimeout(refreshTimeout)
    try {
      json = await fetchJsonFromUrlAsyncTimeout(options.data.href, 500)
      if (json) {
        console.log('json')
        // console.log(json)
        //   updateDisplay(json)

        console.log(json.aqihsummary.filter((d) => {
          if (d['aqih-region'] === 'Cork_City') {
            return d
          }
        }))
        clearTimeout(refreshTimeout)
        refreshTimeout = setTimeout(fetchData, REFRESH_INTERVAL)
      } else json = null
    } catch (e) {
      json = null // nullify for GC (necessary?)
      refreshTimeout = setTimeout(fetchData, RETRY_INTERVAL)

      //   console.error('Data fetch error: ' + JSON.stringify(error))
      //     // // initialiseDisplay()
      //     // // updateInfo('#bikes-card a', 'Source did not respond with data- we will try again soon')
      // // restart the timer
      //   clearInterval(refreshTimer)
      //   refreshCountdown = refreshInterval
      //   refreshTimer = setInterval(updateCountdown, refreshInterval)
    }
    //     //   //       // const info = getInfoText('#population-card a', 'The population of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

    //     //   //       // d3.select('#population-card__chart')
    //     //   //       //   .select('#card-info-text')
    //     //   //       //   .html('<p>' + info + '</p>')
    //     //   //     })
    // }
  }
  fetchData()
}

export { main }
