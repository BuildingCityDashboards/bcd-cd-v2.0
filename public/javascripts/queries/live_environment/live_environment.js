/* Cork

water levels region_id: 6, 15

*/
'use strict'

import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { getCityLatLng, getCustomMapMarker, getCustomMapIcon } from '../../modules/bcd-maps.js'

(async function main (waterLevelsOptions) {
  waterLevelsOptions =
  {
    title: 'Water Level Monitors',
    subtitle: '',
    id: '',
    icon: '/images/icons/themes/environment/water-15.svg#Layer_1',
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
        href: '/api/waterLevels/'
      },
      src: '',
      format: ''
    }
  }
  const STAMEN_TERRAIN_URL = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png'
  const ATTRIBUTION = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="https://openstreetmap.org">OpenStreetMap</a>, under <a href="https://www.openstreetmap.org/copyright">ODbL</a>.s'

  const liveEnvironmentOSM = new L.TileLayer(STAMEN_TERRAIN_URL, {
    minZoom: 2,
    maxZoom: 14,
    attribution: ATTRIBUTION
  })

  const liveEnvironmentMap = new L.Map('live-environment-map')
  liveEnvironmentMap.setView(getCityLatLng(), 8)
  liveEnvironmentMap.addLayer(liveEnvironmentOSM)

  liveEnvironmentMap.on('popupopen', function (e) {
    // markerRefPublic = e.popup._source
    // console.log("ref: "+JSON.stringify(e))
  })

  const waterLevelsIconUrl = '../images/icons/themes/environment/water-15.svg#Layer_1'
  const CustomMapIcon = getCustomMapIcon()

  // Adds an id field to the markers
  const CustomMapMarker = getCustomMapMarker()

  const customCarparkLayer = L.Layer.extend({

  })

  const waterLevelsLayerGroup = L.layerGroup()

  const waterLevelsPopupOptions = {
    // 'maxWidth': '500',
    className: 'waterLevelsPopup'
  }

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  //   const refreshInterval = 100
  //   let refreshCountdown = refreshInterval

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
    let json
    clearTimeout(refreshTimeout)
    try {
      // console.log('fetching data')

      json = await fetchJsonFromUrlAsyncTimeout('/data/environment/waterlevel_example.json', 10000)
      console.log(json)
      // if (csv.length > 0) {
      // const json = d3.csvParse(csv)

      liveEnvironmentMap.removeLayer(waterLevelsLayerGroup)
      waterLevelsLayerGroup.clearLayers()

      //   const date = new Date(json[0].date)
      //   lastReadTime = date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0')
      //   // .getHour() + ':' + json[0].date.getHours() + getMinutes()
      //   // console.log(lastReadTime)

      //   let spacesTotalFree = 0
      //   let latestDate
      //   let latestDateMillis = 0
      //   const AGE_THRESHOLD_MILLIS = 1000 * 60 * 30 // invalidate data older than n mins
      //   // console.log('age limit ' + AGE_THRESHOLD_MILLIS)

      //   /* process data, adding necessary fields and create markers for map */
      //   json.forEach((d) => {
      //     d.type = 'Car Park'
      //     let readingTimeMillis = new Date(d.date).getTime()
      //     if (OFFSET_BY_HOUR.includes(d.name)) readingTimeMillis += 1000 * 60 * 60
      //     const nowMillis = new Date().getTime()

      //     // add fields to indicate validity of data based on time
      //     const dataAgeMillis = nowMillis - readingTimeMillis
      //     d.agemillis = dataAgeMillis
      //     d.ageminutes = dataAgeMillis / (1000 * 60)
      //     // check reading isn't from the future (!) and is does not exceed age threshold
      //     if (!(readingTimeMillis > (nowMillis - 100)) && (dataAgeMillis < AGE_THRESHOLD_MILLIS)) {
      //       d.valid = true
      //     } else {
      //       d.valid = false
      //     }
      //     /// find the max/latest
      //     if (readingTimeMillis > latestDateMillis) {
      //       latestDateMillis = readingTimeMillis
      //       latestDate = date
      //     }
      //     spacesTotalFree += +d.free_spaces
      //     // console.log(d.date + ' | age: ' + d.ageminutes + ' valid: ' + d.valid)

      //     // add a marker to the map
      //     const m = new CustomMapMarker(new L.LatLng(d.latitude, d.longitude), {
      //       icon: new CustomMapIcon({
      //         iconUrl: waterLevelsIconUrl,
      //         className: d.valid ? 'online' : 'offline'
      //       }),
      //       title: d.type + ': ' + d.name,
      //       alt: d.type + ' icon'
      //     })

      //     waterLevelsLayerGroup.addLayer(m)
      //     m.bindPopup(waterLevelsPopupInit(d), waterLevelsPopupOptions)
      //   })

      //   // update the map
      //   liveEnvironmentMap.addLayer(waterLevelsLayerGroup)

      //   const nowMillis = new Date().getTime()
      //   const dataAgeMinutes = (nowMillis - latestDateMillis) / 1000
      //   clearTimeout(refreshTimeout)
      //   refreshTimeout = setTimeout(fetchData, REFRESH_INTERVAL)
      // } else {
      //   // if response not returned, create a map with static data
      //   csv = await fetchCsvFromUrlAsyncTimeout('../../data/transport/car_parks_static/6cc1028e-7388-4bc5-95b7-667a59aa76dc.csv', 500)
      //   const jsonStatic = d3.csvParse(csv)
      //   liveEnvironmentMap.removeLayer(waterLevelsLayerGroup)
      //   waterLevelsLayerGroup.clearLayers()
      //   waterLevelsLayerGroup = getMapLayerStatic(jsonStatic, waterLevelsIconUrl)
      //   liveEnvironmentMap.addLayer(waterLevelsLayerGroup)
      //   csv = null // for GC
      // }
    } catch (e) {
      // csv = await fetchCsvFromUrlAsyncTimeout('../../data/transport/car_parks_static/6cc1028e-7388-4bc5-95b7-667a59aa76dc.csv', 500)
      // const jsonStatic = d3.csvParse(csv)
      // liveEnvironmentMap.removeLayer(waterLevelsLayerGroup)
      // waterLevelsLayerGroup.clearLayers()
      // waterLevelsLayerGroup = getMapLayerStatic(jsonStatic, waterLevelsIconUrl)
      // liveEnvironmentMap.addLayer(waterLevelsLayerGroup)
      console.log('data fetch error' + e)
      refreshTimeout = setTimeout(fetchData, RETRY_INTERVAL)
    }
  }
  fetchData()
})()

/* can return a generic layer with static data when request for data has faile */
function getMapLayerStatic (json, iconUrl = '') {
  // add a marker to the map
  const CustomMapMarker = getCustomMapMarker()
  const CustomMapIcon = getCustomMapIcon()

  const waterLevelsPopupOptions = {
    // 'maxWidth': '500',
    className: 'waterLevelsPopup'
  }

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
    m.bindPopup(waterLevelsPopupInit(d), waterLevelsPopupOptions)
  })
  return layerGroup
}

function waterLevelsPopupInit (d_) {
  const d = new Date(d_.date)
  const simpleTime = d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0')

  // if no station id none of the mappings will work so escape
  if (!d_.name || !d_._id) {
    const str = '<div class="map-popup-error">' +
      "We can't get the live Car Park data right now, please try again later" +
      '</div>'
    return str
  }

  let str = '<div class="map-popup">'
  if (d_.name) {
    str += '<div id="waterLevels-name-' + d_._id + '" class="map-popup__title">' // id for name div
    str += '<h1>' + d_.name + '</h1>'
    str += '</div>' // close bike name div
  }
  str += '<div id="waterLevels-spacescount-' + d_._id + '" class="map-popup__kpi" >'
  if (d_.free_spaces) {
    str += '<h1>' +
      d_.free_spaces +
      '</h1><p>Free spaces at ' + simpleTime + ' </p>'
  } else {
    str += '<div class="map-popup-error">' +
      '<p>We can\'t get the live Car Park data right now, please try again later</p>' +
      '</div>'
  }
  str += '</div>'

  str += '<div id="waterLevels-info-' + d_._id + '" class="map-popup__info" >'
  if (d_.opening_times) {
    str += '<p>Open: ' + d_.opening_times + '</p>'
  }
  if (d_.price) {
    str += '<p> ' + d_.price + '</p>'
  }
  str += '</div>'

  // initialise div to hold chart with id linked to station id
  if (d_.id) {
    str += '<span id="waterLevels-spark-' + d_._id + '"></span>'
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
// const waterLevelsClusterToggle = true

// zoom = 11 // zoom on page load
// maxZoom = 26
// // the default tile layer
// const liveEnvironmentOSM = new L.TileLayer(cartoDb, {
//     minZoom: 2,
//     maxZoom: maxZoom, // seems to fix 503 tileserver errors
//     attribution: stamenTonerAttrib
// })

// // var thunderAttr = { attribution: '© OpenStreetMap contributors. Tiles courtesy of Andy Allan' }
// // var transport = new L.tileLayer(
// //   '//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
// //   thunderAttr
// // )

// /* let liveEnvironmenttransport = L.tileLayer(
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

// const liveEnvironmentMap = new L.Map('live-travel-map')
// liveEnvironmentMap.setView(new L.LatLng(dubLat, dubLng), zoom)
// // liveEnvironmentMap.addLayer(liveEnvironmentOSM)
// liveEnvironmentMap.addLayer(liveEnvironmentOSM)

// liveEnvironmentMap.on('popupopen', function (e) {
//     markerRefPublic = e.popup._source
//     // console.log("ref: "+JSON.stringify(e))
// })

// /* liveEnvironmentMap.on('click', function(e) {
//     alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
// }); */
// // add location control to global name space for testing only
// // on a production site, omit the "lc = "!
// L.control.locate({
//     strings: {
//         title: 'Zoom to your location'
//     }
// }).addTo(liveEnvironmentMap)

// var osmGeocoder = new L.Control.OSMGeocoder({
//     placeholder: 'Enter street name, area etc.',
//     bounds: dublinBounds
// })
// liveEnvironmentMap.addControl(osmGeocoder)

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

// trafficinfo.addTo(liveEnvironmentMap)
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

//         //   trainLayerGroup.addTo(liveEnvironmentMap)
//     }
// }

// d3.select('#bikes-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveEnvironmentMap.hasLayer(bikesCluster)) {
//                 liveEnvironmentMap.removeLayer(bikesCluster)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveEnvironmentMap.hasLayer(bikesCluster)) {
//                 liveEnvironmentMap.addLayer(bikesCluster)
//             }
//         }
//     }
// }
// )

// d3.select('#waterLevelss-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveEnvironmentMap.hasLayer(waterLevelsCluster)) {
//                 liveEnvironmentMap.removeLayer(waterLevelsCluster)
//                 liveEnvironmentMap.fitBounds(luasCluster.getBounds())
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveEnvironmentMap.hasLayer(waterLevelsCluster)) {
//                 liveEnvironmentMap.addLayer(waterLevelsCluster)
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
//             if (liveEnvironmentMap.hasLayer(luasLineRed)) {
//                 liveEnvironmentMap.removeLayer(luasLineRed)
//                 liveEnvironmentMap.removeLayer(luasLineGreen)
//                 liveEnvironmentMap.removeLayer(luasIcons)
//                 liveEnvironmentMap.removeLayer(luasLayer)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveEnvironmentMap.hasLayer(luasLineRed)) {
//                 liveEnvironmentMap.addLayer(luasLineRed)
//                 liveEnvironmentMap.addLayer(luasLineGreen)
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
//             if (liveEnvironmentMap.hasLayer(MWayLayerGroup)) {
//                 liveEnvironmentMap.removeLayer(MWayLayerGroup)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveEnvironmentMap.hasLayer(MWayLayerGroup)) {
//                 liveEnvironmentMap.addLayer(MWayLayerGroup)
//             }
//         }
//     }
// })

// d3.select('#trains-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveEnvironmentMap.hasLayer(trainLayerGroup)) {
//                 liveEnvironmentMap.removeLayer(trainLayerGroup)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveEnvironmentMap.hasLayer(trainLayerGroup)) {
//                 liveEnvironmentMap.addLayer(trainLayerGroup)
//             }
//         }
//     }
// })

// d3.select('#bus-checkbox').on('click', function () {
//     const cb = d3.select(this)
//     if (!cb.classed('disabled')) {
//         if (cb.classed('active')) {
//             cb.classed('active', false)
//             if (liveEnvironmentMap.hasLayer(busCluster)) {
//                 // console.log('Remove train Layrers')
//                 liveEnvironmentMap.removeLayer(busCluster)
//                 // liveEnvironmentMap.removeLayer(layerGroup)
//             }
//         } else {
//             cb.classed('active', true)
//             if (!liveEnvironmentMap.hasLayer(busCluster)) {
//                 // console.log('Add train Layrers')
//                 liveEnvironmentMap.addLayer(busCluster)
//                 // liveEnvironmentMap.addLayer(layerGroup)
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

//         if (data.waterLevelss.status === 200 && !(d3.select('#waterLevelss-checkbox').classed('disabled'))) {
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
