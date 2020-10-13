// /***

//   Air quality card

// ***/
'use strict'

import { fetchCsvFromUrlAsyncTimeout } from '../modules/bcd-async.js'

async function main (options) {
  // console.log('createChart')
  // console.log(options)

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  //   const refreshInterval = 100
  //   let refreshCountdown = refreshInterval

  const updateCountdown = function () {
    // const cd = refreshCountdown / 1000
    // d3.select('#bikes-bikesCountdown').text('Update in ' + cd)
    // console.log('Countdown: ' + cd)
    // if (refreshCountdown > 0) refreshCountdown -= refreshInterval / 2
  }

  //   let refreshTimer = setInterval(updateCountdown, refreshInterval)
  const RETRY_INTERVAL = 30000
  const REFRESH_INTERVAL = 60000 * 10
  let refreshTimeout

  async function fetchData () {
    console.log('fetch data')
    let csv
    clearTimeout(refreshTimeout)
    try {
      // console.log('fetching data')
      csv = await fetchCsvFromUrlAsyncTimeout(options.displayoptions.data.href, 500)
      const json = d3.csvParse(csv)
      if (json) {
        console.log('data updated')
        console.log('json')
        console.log(json)
        const date = new Date(json[0].date)
        const lastReadTime = date.getHours() + ':' + date.getMinutes()
        // .getHour() + ':' + json[0].date.getHours() + getMinutes()
        console.log(lastReadTime)

        // // const cardElement = document.getElementById('car-parks-card')
        // // console.log('cardElement')
        // // console.log(cardElement)

        // const cardElement = document.getElementById('car-parks-card')
        // const subtitleElement = cardElement.querySelector('#subtitle')
        // subtitleElement.innerHTML = 'Latest reading ' + lastReadTime

        // const leftElement = cardElement.querySelector('#card-left')
        // leftElement.innerHTML = '<h1>' + corkData[0].aqih.split(',')[1] + '</h1>' +
        //             '<h2>Quality</h2>'

        // const rightElement = cardElement.querySelector('#card-right')
        // rightElement.innerHTML =
        //             '<h1>' + corkData[0].aqih.split(',')[0] + '</h1>' +
        //             '<h2>Index</h2>'

        // const infoElement = cardElement.querySelector('.card__info-text')
        // infoElement.innerHTML = 'The latest air quality reading in Cork city was taken at <b>' + lastReadTime + '</b>  and indicated a <b>QUALITY INDEX of ' + corkData[0].aqih.split(',')[0] + '</b> in the <b>' + corkData[0].aqih.split(',')[1].toUpperCase() + '</b> quality band'

        clearTimeout(refreshTimeout)
        refreshTimeout = setTimeout(fetchData, REFRESH_INTERVAL)
      } else csv = null
    } catch (e) {
      csv = null
      console.log('data fetch error' + e)
      refreshTimeout = setTimeout(fetchData, RETRY_INTERVAL)
    }
  }
  fetchData()
}
export { main }
