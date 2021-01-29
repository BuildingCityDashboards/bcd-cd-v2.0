/* TODO:
The following TODO list addresses issues #27 #22 #21 #16 #15 #14 #13
* Working bike symbology
* Working bike traces
  - Add day/ week/ month selection
* Update !bikes data periodically
* Add different icons for different transport modes
* Add car park data
  - Add day popup trace as per bikes
* Add bike station comparisons to popups
* Check API status periodically and update symbol
  - Enable/disable buttons accordingly
  - Add tooltip to say data unavailable over button
  - Animate activity symbol (when refreshing data?)
* Add current time indicator
* Add last/ next refresh time indicator
* Remove button in Bus popup
* Unify popup designs
* Redesign legend
* Convert icons to vector graphics
* Keep popups open when map data refreshes
* Place popups over controls or make them sit away from controls.
* Place icons in filter buttons
 * Test support for DOM node methods on Firefox
 */

// * **@todo: refactor to use ES6 imports ***/

/*
API activity checks that the buttons are not disabled

*/

/************************************
 * Design Pattern
 ************************************/
/************************************
 * Page load
 *** Get station list
 *** Draw markers with default icons
 *** Set timeout
 ***** Get latest snapshot (exAPI)
 ******* Draw/redraw markers with symbology on Map
 *** Marker click
 ***** Get station trend data (exAPI)
 ******* Draw marker popup
 ************************************/
'use strict'

import { fetchCsvFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { getCityLatLng, getCustomMapMarker, getCustomMapIcon } from '../../modules/bcd-maps.js'

(async function main(carparkOptions) {
  console.log('load live travel map')
  carparkOptions =
  {
    title: 'Car parks - city',
    subtitle: '',
    id: 'car-parks-card',
    icon: '/images/icons/home/icons-24px/Car_Icon_48px.svg#Layer_1',
    info: '',
    source: [
      {
        href: 'https://data.corkcity.ie/dataset/parking/resource/6cc1028e-7388-4bc5-95b7-667a59aa76dc',
        name: 'Cork Smart Gateway',
        target: '_blank'
      }],
    displayOptions: {
      displayid: 'car-parks-card__display',
      data: {
        href: '/api/car-parks/latest'
      },
      src: '',
      format: ''
    }
  }

  // console.log(carparkOptions)

  const STAMEN_TONER_URL = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
  const STAMEN_TONER_LITE_URL = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
  const OSM_ATTRIBUTION = 'Map data © <a href="http://openstreetprivateMap.org">OpenStreetMap</a> contributors'

  const liveTravelOSM = new L.TileLayer(STAMEN_TONER_LITE_URL, {
    minZoom: 2,
    maxZoom: 14, // 11 seems to fix 503 tileserver errors
    attribution: OSM_ATTRIBUTION
  })

  const liveTravelMap = new L.Map('live-travel-map')
  liveTravelMap.setView(getCityLatLng(), 12)
  liveTravelMap.addLayer(liveTravelOSM)

  liveTravelMap.on('popupopen', function (e) {
    // markerRefPublic = e.popup._source
    // console.log("ref: "+JSON.stringify(e))
  })

  const carparkIconUrl = '../images/icons/icons-24px/Car_Icon_24px.svg'
  const CustomMapIcon = getCustomMapIcon()

  // Adds an id field to the markers
  const CustomMapMarker = getCustomMapMarker()

  const customCarparkLayer = L.Layer.extend({

  })

  let carparkLayerGroup = L.layerGroup()

  const carparkPopupcarparkOptions = {
    // 'maxWidth': '500',
    className: 'carparkPopup'
  }

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

  async function fetchData() {
    //   These locations incorrectly report time (IST indicated but GMT provided)
    const OFFSET_BY_HOUR = [] // ['City Hall - Eglington Street', 'Carrolls Quay', 'Grand Parade', "Saint Finbarr's"]
    // console.log('fetch data')
    let csv
    clearTimeout(refreshTimeout)
    try {
      // console.log('fetching data')
      csv = await fetchCsvFromUrlAsyncTimeout(carparkOptions.displayOptions.data.href, 500)
      const json = d3.csvParse(csv)
      console.log()
      if (json) {
        liveTravelMap.removeLayer(carparkLayerGroup)
        carparkLayerGroup.clearLayers()
        console.log('data updated')
        console.log('json')
        console.log(json)

        const date = new Date(json[0].date)
        lastReadTime = date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0')
        // .getHour() + ':' + json[0].date.getHours() + getMinutes()
        // console.log(lastReadTime)

        let spacesTotalFree = 0
        let latestDate
        let latestDateMillis = 0
        const AGE_THRESHOLD_MILLIS = 1000 * 60 * 30 // invalidate data older than n mins
        console.log('age limit ' + AGE_THRESHOLD_MILLIS)

        /* process data, adding necessary fields and create markers for map */
        json.forEach((d) => {
          d.type = 'Car Park'
          let readingTimeMillis = new Date(d.date).getTime()
          if (OFFSET_BY_HOUR.includes(d.name)) readingTimeMillis += 1000 * 60 * 60
          const nowMillis = new Date().getTime()

          // add fields to indicate validity of data based on time
          const dataAgeMillis = nowMillis - readingTimeMillis
          d.agemillis = dataAgeMillis
          d.ageminutes = dataAgeMillis / (1000 * 60)
          // check reading isn't from the future (!) and is does not exceed age threshold
          if (!(readingTimeMillis > (nowMillis - 100)) && (dataAgeMillis < AGE_THRESHOLD_MILLIS)) {
            d.valid = true
          } else {
            d.valid = false
          }
          /// find the max/latest
          if (readingTimeMillis > latestDateMillis) {
            latestDateMillis = readingTimeMillis
            latestDate = date
          }
          spacesTotalFree += +d.free_spaces
          console.log(d.date + ' | age: ' + d.ageminutes + ' valid: ' + d.valid)

          // add a marker to the map
          const m = new CustomMapMarker(new L.LatLng(d.latitude, d.longitude), {
            icon: new CustomMapIcon({
              iconUrl: carparkIconUrl,
              className: d.valid ? 'online' : 'offline'
            }),
            title: d.type + ': ' + d.name,
            alt: d.type + ' icon'
          })

          carparkLayerGroup.addLayer(m)
          m.bindPopup(carparkPopupInit(d), carparkPopupcarparkOptions)
        })

        // update the map
        liveTravelMap.addLayer(carparkLayerGroup)

        console.log('latest date')
        console.log(latestDate)

        console.log(json)

        const nowMillis = new Date().getTime()
        const dataAgeMinutes = (nowMillis - latestDateMillis) / 1000
        console.log(nowMillis)
        console.log(latestDateMillis)
        console.log(dataAgeMinutes)
        clearTimeout(refreshTimeout)
        refreshTimeout = setTimeout(fetchData, REFRESH_INTERVAL)
      } else {
        csv = await fetchCsvFromUrlAsyncTimeout('../../data/transport/car_parks_static/6cc1028e-7388-4bc5-95b7-667a59aa76dc.csv', 500)
        const jsonStatic = d3.csvParse(csv)
        liveTravelMap.removeLayer(carparkLayerGroup)
        carparkLayerGroup.clearLayers()
        carparkLayerGroup = getMapLayerStatic(jsonStatic, carparkIconUrl)
        liveTravelMap.addLayer(carparkLayerGroup)
        csv = null // for GC
      }
    } catch (e) {
      csv = await fetchCsvFromUrlAsyncTimeout('../../data/transport/car_parks_static/6cc1028e-7388-4bc5-95b7-667a59aa76dc.csv', 500)
      const jsonStatic = d3.csvParse(csv)
      liveTravelMap.removeLayer(carparkLayerGroup)
      carparkLayerGroup.clearLayers()
      carparkLayerGroup = getMapLayerStatic(jsonStatic, carparkIconUrl)
      liveTravelMap.addLayer(carparkLayerGroup)
      console.log('data fetch error' + e)
      refreshTimeout = setTimeout(fetchData, RETRY_INTERVAL)
    }
  }
  fetchData()
})()

/* can return a generic layer with static data when request for data has faile */
function getMapLayerStatic(json, iconUrl = '') {
  // add a marker to the map
  const CustomMapMarker = getCustomMapMarker()
  const CustomMapIcon = getCustomMapIcon()
  const layerGroup = new L.LayerGroup()
  json.forEach((d) => {
    const m = new CustomMapMarker(new L.LatLng(d.latitude, d.longitude), {
      icon: new CustomMapIcon({
        iconUrl: iconUrl,
        className: 'offline'
      }),
      title: d.type + ': ' + d.name,
      alt: d.type + ' icon'
    })
    layerGroup.addLayer(m)
    // m.bindPopup(carparkPopupInit(d), carparkPopupcarparkOptions)
  })
  return layerGroup
}

function carparkPopupInit(d_) {
  console.log(d_)
  const d = new Date(d_.date)
  const simpleTime = d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0')

  // if no station id none of the mappings will work so escape
  if (!d_.name || !d_.valid) {
    const str = '<div class="map-popup-error">' +
      '<div class="row ">' +
      "We can't get the live Car Park data right now, please try again later" +
      '</div>' +
      '</div>'
    return str
  }

  let str = '<div class="map-popup">'
  if (d_.name) {
    str += '<div id="carpark-name-' + d_._id + '" class="map-popup__title">' // id for name div
    str += '<h1>' + d_.name + '</h1>'
    str += '</div>' // close bike name div
  }

  str += '<div id="carpark-spacescount-' + d_._id + '" class="map-popup__kpi" ><h1>' +
    d_.free_spaces +
    '</h1><p>Free spaces at ' + simpleTime + ' </p></div>'

  str += '<div id="carpark-info-' + d_._id + '" class="map-popup__info" >'
  str += '<p>Open: ' + d_.opening_times + '</p>'
  str += '<p> ' + d_.price + '</p>'
  str += '</div>'

  // initialise div to hold chart with id linked to station id
  if (d_.id) {
    str += '<span id="carpark-spark-' + d_._id + '"></span>'
  }
  str += '</div>' // closes container
  return str
}

// Manage periodic async data fetching

// const setIntervalAsync = SetIntervalAsync.dynamic.setIntervalAsync
// const clearIntervalAsync = SetIntervalAsync.clearIntervalAsync
// // let group = new L.LayerGroup()
// // let TrainLayerGroup = new L.LayerGroup()

// const MWayLayerGroup = new L.LayerGroup()

// const myIcon = L.icon({
//     iconUrl: 'images/pin24.png',
//     iconRetinaUrl: 'images/pin48.png',
//     iconSize: [29, 24],
//     iconAnchor: [9, 21],
//     popupAnchor: [0, -14]
// })

// /* let m50_N = new L.geoJSON(null, {
//   "style": {
//     "color": "#000000",
//     "weight": 5,
//     "opacity": 0.65
//   },

//   }

// )

// let m50_S = new L.geoJSON(null, {
//   "style": {
//     "color": "#ff0CCC",
//     "weight": 5,
//     "opacity": 0.65
//   },

// })

// let n4_N = new L.geoJSON(null, {
//   "style": {
//     "color": "#000000",
//     "weight": 5,
//     "opacity": 0.65
//   },

// })

// let n4_S = new L.geoJSON(null, {
//   "style": {
//     "color": "#bbc980",
//     "weight": 5,
//     "opacity": 0.65
//   },

// }); */
// // Update the API activity icon and time
// // called from the individual live-travel modules
// function updateAPIStatus(activity, age, isLive) {
//     const d = new Date()
//     const tf = moment(d).format('hh:mm a')
//     if (isLive) {
//         d3.select(activity).attr('src', '/images/icons/activity.svg')
//         d3.select(age)
//             .text('Live @  ' + tf)
//     } else {
//         d3.select(activity).attr('src', '/images/icons/alert-triangle.svg')
//         d3.select(age)
//             .text('No data @ ' + tf)
//     }
// }

// const bikesClusterToggle = true
// const busClusterToggle = true
// const trainClusterToggle = true
// const luasClusterToggle = false
// const carparkClusterToggle = true

// zoom = 11 // zoom on page load
// maxZoom = 26
// // the default tile layer
// const liveTravelOSM = new L.TileLayer(cartoDb, {
//     minZoom: 2,
//     maxZoom: maxZoom, // seems to fix 503 tileserver errors
//     attribution: stamenTonerAttrib
// })

// // var thunderAttr = { attribution: '© OpenStreetMap contributors. Tiles courtesy of Andy Allan' }
// // var transport = new L.tileLayer(
// //   '//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
// //   thunderAttr
// // )

// /* let liveTraveltransport = L.tileLayer(
//             '//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
//             thunderAttr
//         ); */
// /* L.tileLayer(
//     'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
//         attribution: '&copy; '+mapLink+' Contributors & '+translink,
//         maxZoom: 18,
//     }).addTo(map); */
// // const tl = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
// //   attribution: '© OpenStreetMap contributors'
// // })

// // var tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
// // {
// // attribution: false
// // })

// const liveTravelMap = new L.Map('live-travel-map')
// liveTravelMap.setView(new L.LatLng(dubLat, dubLng), zoom)
// // liveTravelMap.addLayer(liveTravelOSM)
// liveTravelMap.addLayer(liveTravelOSM)

// liveTravelMap.on('popupopen', function (e) {
//     markerRefPublic = e.popup._source
//     // console.log("ref: "+JSON.stringify(e))
// })

// /* liveTravelMap.on('click', function(e) {
//     alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
// }); */
// // add location control to global name space for testing only
// // on a production site, omit the "lc = "!
// L.control.locate({
//     strings: {
//         title: 'Zoom to your location'
//     }
// }).addTo(liveTravelMap)

// var osmGeocoder = new L.Control.OSMGeocoder({
//     placeholder: 'Enter street name, area etc.',
//     bounds: dublinBounds
// })
// liveTravelMap.addControl(osmGeocoder)

// var trafficinfo = L.control()
// trafficinfo.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'LTR') // create a div with a class "info"
//     this._div.innerHTML = '<h8> Live Traffic Info</h8>' + '<br>' +
//         '<svg  height="10" width="10"> <rect id="box" width="10" height="10" fill= "#40FF00";/> </svg>' + '<h8> Fast </h8>' + '</svg>' + '<br>' +
//         '<svg  height="10" width="10"> <rect id="box" width="10" height="10" fill= "#FF5733";/> </svg>' + ' <h8> Slow </h8>' + '</svg>' + '<br>' +
//         '<svg  height="10" width="10"> <rect id="box" width="10" height="10" fill= "#FF0000";/> </svg>' + '<h8> Slower </h8>' + '</svg>' + '<br>' +
//         '<svg height="10" width="10"> <rect  width="10"  height="10" fill= "#848484"; /> </svg>' + '<h8> No Data </h8>' + '</svg>'
//     return this._div
// }

// /* info.update = function (props) {
//   this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
//       '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
//       : 'Hover over a state')
// }; */

// trafficinfo.addTo(liveTravelMap)
// function processTravelTimes(data_) {
//     d3.keys(data_).forEach(

//         function (d) {
//             console.debug(JSON.stringify(d)) // to show meassge to web console at the "debug" log level

//             data_[d].data.forEach(function (d_) {
//                 console.debug('From ' + d_.from_name + ' to ' + d_.to_name +
//                     ' (' + d_.distance / 1000 + ' km)' +
//                     '\nFree flow ' + d_.free_flow_travel_time + ' seconds' +
//                     '\nCurrent time ' + d_.current_travel_time + ' seconds'
//                 )
//             })
//         }
//     )
// }

// const fetchtraindata2 = function () {
//     d3.xml('/data/Transport/Train_data.XML')
//         .then((data) => {
//             // updatetrainsmarkers(data)
//             // AddTrainStations_Layer(data)
//             updatetrainsmarkers(data)
//             // updateAPIStatus('#train-activity-icon', '#train-age', true)
//         })
//         .catch(function (err) {
//             updateAPIStatus('#train-activity-icon', '#train-age', false)
//         })
// }

// function updatetrainsmarkers(xmldata) {
//     const xmlDoc = xmldata
//     const l = xmlDoc.getElementsByTagName('ArrayOfObjTrainPositions')[0].childNodes
//     const x = xmlDoc.getElementsByTagName('TrainLatitude')
//     const y = xmlDoc.getElementsByTagName('TrainLongitude')

//     for (i = 0; i < l.length; i++) {
//         const lat = x[i].firstChild.nodeValue
//         const lon = y[i].firstChild.nodeValue
//         if (lat < 54 && lon > -7) {
//             var Smarker = L.marker([lat, lon], { Icon: '' })
//             // .on('mouseover', function() {
//             //  this.bindPopup(PubMsg + '<br>' + Direction).openPopup()
//             // })
//             //   trainLayerGroup.addLayer(Smarker)
//         }

//         //   trainLayerGroup.addTo(liveTravelMap)
//     }
// }

// d3.select('#bikes-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveTravelMap.hasLayer(bikesCluster)) {
//                 liveTravelMap.removeLayer(bikesCluster)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveTravelMap.hasLayer(bikesCluster)) {
//                 liveTravelMap.addLayer(bikesCluster)
//             }
//         }
//     }
// }
// )

// d3.select('#carparks-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveTravelMap.hasLayer(carparkCluster)) {
//                 liveTravelMap.removeLayer(carparkCluster)
//                 liveTravelMap.fitBounds(luasCluster.getBounds())
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveTravelMap.hasLayer(carparkCluster)) {
//                 liveTravelMap.addLayer(carparkCluster)
//             }
//         }
//     }
// })

// // TODO: catch cluster or layer
// d3.select('#luas-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveTravelMap.hasLayer(luasLineRed)) {
//                 liveTravelMap.removeLayer(luasLineRed)
//                 liveTravelMap.removeLayer(luasLineGreen)
//                 liveTravelMap.removeLayer(luasIcons)
//                 liveTravelMap.removeLayer(luasLayer)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveTravelMap.hasLayer(luasLineRed)) {
//                 liveTravelMap.addLayer(luasLineRed)
//                 liveTravelMap.addLayer(luasLineGreen)
//                 chooseLookByZoom()
//             }
//         }
//     }
// })

// d3.select('#motorways-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveTravelMap.hasLayer(MWayLayerGroup)) {
//                 liveTravelMap.removeLayer(MWayLayerGroup)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveTravelMap.hasLayer(MWayLayerGroup)) {
//                 liveTravelMap.addLayer(MWayLayerGroup)
//             }
//         }
//     }
// })

// d3.select('#trains-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveTravelMap.hasLayer(trainLayerGroup)) {
//                 liveTravelMap.removeLayer(trainLayerGroup)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveTravelMap.hasLayer(trainLayerGroup)) {
//                 liveTravelMap.addLayer(trainLayerGroup)
//             }
//         }
//     }
// })

// d3.select('#bus-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveTravelMap.hasLayer(busCluster)) {
//                 // console.log('Remove train Layrers')
//                 liveTravelMap.removeLayer(busCluster)
//                 // liveTravelMap.removeLayer(layerGroup)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveTravelMap.hasLayer(busCluster)) {
//                 // console.log('Add train Layrers')
//                 liveTravelMap.addLayer(busCluster)
//                 // liveTravelMap.addLayer(layerGroup)
//             }
//         }
//     }
// })

// function getColor(d) {
//     return d > 3000 ? '#800026'
//         : d > 500 ? '#BD0026'
//             : d > 200 ? '#E31A1C'
//                 : d > 100 ? '#FC4E2A'
//                     : d > 50 ? '#FD8D3C'
//                         : d > 20 ? '#FEB24C'
//                             : d > 10 ? '#FED976'
//                                 : '#FFEDA0'
// }

// // initalise API activity icons
// d3.json('/data/api-status.json')
//     .then(function (data) {
//         // console.log("api status "+JSON.stringify(data))
//         if (data.dublinbikes.status === 200 && !(d3.select('#bikes-checkbox').classed('disabled'))) {
//             d3.select('#bike-activity-icon').attr('src', '/images/icons/activity.svg')
//             d3.select('#bike-age')
//                 .text('Awaitng data...') // TODO: call to getAge function from here
//         } else {
//             d3.select('#bike-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
//             d3.select('#bike-age')
//                 .text('Unavailable')
//         }

//         if (data.dublinbus.status === 200 && !(d3.select('#bus-checkbox').classed('disabled'))) {
//             d3.select('#bus-activity-icon').attr('src', '/images/icons/activity.svg')
//             d3.select('#bus-age')
//                 .text('Awaitng data...') // TODO: call to getAge function from here
//         } else {
//             d3.select('#bus-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
//             d3.select('#bus-age')
//                 .text('Unavailable')
//         }

//         if (data.carparks.status === 200 && !(d3.select('#carparks-checkbox').classed('disabled'))) {
//             d3.select('#parking-activity-icon').attr('src', '/images/icons/activity.svg')
//             d3.select('#parking-age')
//                 .text('Awaitng data...') // TODO: call to getAge function from here
//         } else {
//             d3.select('#parking-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
//             d3.select('#parking-age')
//                 .text('Unavailable')
//         }

//         if (data.luas.status === 200 && !(d3.select('#luas-checkbox').classed('disabled'))) {
//             d3.select('#luas-activity-icon').attr('src', '/images/icons/activity.svg')
//             d3.select('#luas-age')
//                 .text('Awaitng data...')
//         } else {
//             d3.select('#luas-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
//             d3.select('#luas-age')
//                 .text('Unavailable')
//         }

//         if (data.train.status === 200 && !(d3.select('#trains-checkbox').classed('disabled'))) {
//             d3.select('#train-activity-icon').attr('src', '/images/icons/activity.svg')
//             d3.select('#train-age')
//                 .text('Awaitng data...')
//         } else {
//             d3.select('#train-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
//             d3.select('#train-age')
//                 .text('Unavailable')
//         }

//         if (data.traveltimes.status === 200 && !(d3.select('#motorways-checkbox').classed('disabled'))) {
//             d3.select('#motorway-activity-icon').attr('src', '/images/icons/activity.svg')
//             d3.select('#motorway-age')
//                 .text('Awaitng data...')
//         } else {
//             d3.select('#motorway-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
//             d3.select('#motorway-age')
//                 .text('Unavailable')
//         }
//     })
//     .catch(function (err) {
//         console.error('Error fetching API status file data')
//     })

// // fetchtraindata2()
