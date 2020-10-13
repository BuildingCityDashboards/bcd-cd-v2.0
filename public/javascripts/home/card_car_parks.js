/***

 Car Parks card

 TODO:
 - get latest of all readings, not just json[0]
 - add animated update trend arrows
 - blank display if data age exceeds limit
 - add countdown timer to next refresh when data old/error occurs or otherwise indicate last read was successful
***/
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

  const RETRY_INTERVAL = 20000
  const REFRESH_INTERVAL = 30000 * 1
  let refreshTimeout
  let lastReadTime
  const dataAge = 0

  let prevSpacesTotalFree
  // const indicatorUpSymbol = "<span class='up-arrow'>&#x25B2;</span>"
  // const indicatorDownSymbol = "<span class='down-arrow'>&#x25BC;</span>"
  // const indicatorRightSymbol = "<span class='right-arrow'>&#x25BA;</span>"
  // let prevBikesAvailableDirection = indicatorRightSymbol // '▶'
  // let prevStandsAvailableDirection = indicatorRightSymbol // '▶'
  // let prevBikesTrendString = ''// '(no change)'
  // let prevStandsTrendString = '' // '(no change)'

  async function fetchData () {
    // console.log('fetch data')
    let csv
    clearTimeout(refreshTimeout)
    try {
      // console.log('fetching data')
      csv = await fetchCsvFromUrlAsyncTimeout(options.displayoptions.data.href, 500)
      const json = d3.csvParse(csv)
      if (json) {
        // console.log('data updated')
        // console.log('json')
        // console.log(json)

        const date = new Date(json[0].date)
        lastReadTime = date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0')
        // .getHour() + ':' + json[0].date.getHours() + getMinutes()
        // console.log(lastReadTime)

        let spacesTotalFree = 0
        json.forEach((d) => {
          spacesTotalFree += +d.free_spaces
        })
        // console.log(spacesTotalFree)

        // update the DOM
        const cardElement = document.getElementById('car-parks-card')
        const subtitleElement = cardElement.querySelector('#subtitle')
        subtitleElement.innerHTML = 'Latest reading ' + lastReadTime

        const leftElement = cardElement.querySelector('#card-left')
        leftElement.innerHTML = '<h1>' + json.length + '</h1>' +
                    '<h2>Car Parks</h2>'

        const rightElement = cardElement.querySelector('#card-right')
        rightElement.innerHTML =
                    '<h1>' + spacesTotalFree + '</h1>' +
                    '<h2>Free Spaces</h2>'

        const infoElement = cardElement.querySelector('.card__info-text')
        infoElement.innerHTML = `As of <b>${lastReadTime}</b>, across the ${json.length} Cork city car parks there were a total of <b> ${spacesTotalFree} FREE SPACES</b>`

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
