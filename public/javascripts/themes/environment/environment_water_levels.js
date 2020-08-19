import { ChartLinePopup } from '../../modules/bcd-chart-line-popup.js'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { getDefaultMapOptions, getLatLng } from '../../modules/bcd-maps.js'
import { toUnicode } from 'punycode'

(async () => {
  // console.log('load waterLevel charts')
  const stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'

  try {
    //  TODO: abstract to function in bcd-maps
    proj4.defs('EPSG:29902', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 \n\+x_0=200000 \n\+y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs')
    var firstProjection = 'EPSG:29902'
    var secondProjection = 'EPSG:4326'

    const waterLevelTiles = new L.TileLayer(stamenTonerUrl_Lite, getDefaultMapOptions())
    const waterLevelMap = new L.Map('map-water-level-monitors', {
      dragging: !L.Browser.mobile,
      tap: !L.Browser.mobile
    })
    waterLevelMap.setView(getLatLng(), 8)
    waterLevelMap.addLayer(waterLevelTiles)
    const waterLevelMapIcon = L.icon({
      iconUrl: './images/environment/water-15.svg',
      iconSize: [20, 20] // orig size
    // iconAnchor: [iconAX, iconAY] //,
      // popupAnchor: [-3, -76]
    })
    const WaterLevelMarker = L.Marker.extend({
      options: {
        sid: 0,
        sfn: ''
      }
    })

    const waterLevelPopupOptons = {
    // 'maxWidth': '500',
    // 'className': 'leaflet-popup'
    }

    const waterLevelSitesCluster = L.markerClusterGroup()
    const waterLevelSites = await getSites('./data/environment/waterlevel_stations.geojson')

    // console.log(waterLevelSites)
    // waterLevelSitesCluster = await waterLevelSites.features.map(async d => {
    //   let mc = L.markerClusterGroup()
    //   const marker = new WaterLevelMarker(
    //     new L.LatLng(d.geometry.coordinates[0], d.geometry.coordinates[1]), {
    //       // id: d.id,
    //       // opacity: 0.9,
    //       title: 'Water Level Monitor Site', // shown in rollover tooltip
    //       alt: 'Water Level monitor site icon',
    //       // icon: waterLevelMapIcon,
    //       type: 'Water Level Monitor'
    //     })
    //   // marker.bindPopup(getPopup(d), waterLevelPopupOptons)
    //   // marker.on('popupopen', () => {
    //   //   getPopupPlot(d)
    //   // })
    //   mc.addMarker(marker)
    //   // const siteReadings = await getSiteReadings(d)
    //   return mc
    // })
    // waterLevelMap.addLayer(mc)
    // const allSitesData = await Promise.all(allSitesPromises)
    // let allSitesFlat = allSitesData.flat(1)
    // allSitesFlat = allSitesFlat.filter((s, i) => {
    //   return isToday(s.date) && (parseInt(s.date.getHours()) < 10) // // TODO: remove demo hack
    // })
    // // console.log('allSitesFlat')
    // // console.log(allSitesFlat)

    // waterLevelMap.addLayer(waterLevelSitesLayer)
    // // waterLevelMap.fitBounds(waterLevelCluster.getBounds())
    // // console.log(allSitesFlat)

    // const waterLevelChartOptions = {
    //   elementId: 'chart-water-level-monitors',
    //   d: allSitesFlat,
    //   tracekey: 'name', // ?
    //   // tracenames: keys, // For StackedAreaChart-formatted data need to provide keys
    //   xV: 'date', // expects a date object
    //   yV: 'value',
    //   tX: 'Time today', // string axis title
    //   tY: 'dB'
    // }

    // const waterLevelChart = new MultiLineChart(waterLevelChartOptions)

    // const redraw = () => {
    //   if (document.querySelector('#chart-water-level-monitors').style.display !== 'none') {
    //     waterLevelChart.drawChart()
    //     waterLevelChart.addTooltip('waterLevel Level (Decibels) - ', '', 'label')
    //   }
    // }
    // redraw()

    // d3.select('#map-water-level-monitors').style('display', 'block')
    // d3.select('#chart-water-level-monitors').style('display', 'none')

    // d3.select('#btn-water-level-chart').on('click', function () {
    //   activeBtn(this)
    //   d3.select('#chart-water-level-monitors').style('display', 'block')
    //   d3.select('#map-water-level-monitors').style('display', 'none')
    //   waterLevelChart.drawChart()
    //   waterLevelChart.addTooltip('waterLevel level (Decibels) - ', '', 'label')
    // })

    // d3.select('#btn-water-level-map').on('click', function () {
    //   activeBtn(this)
    //   d3.select('#chart-water-level-monitors').style('display', 'none')
    //   d3.select('#map-water-level-monitors').style('display', 'block')
    // })

    // window.addEventListener('resize', () => {
    //   redraw()
    // })
  } catch (e) {
    console.log(e)
  }
})()

async function getSites (url) {
  // need to be able to look up the static data using cosit as key
  // want an array of objects for dublin counters
  const siteData = await d3.json(url)

  // siteData = siteData[key].map(site => {
  //   const obj = {
  //     id: +site.site_id,
  //     name: site.name,
  //     lat: +site.lat,
  //     lng: +site.lon
  //   }
  //   return obj
  // })
  return siteData
}

function getPopup (d_) {
  let str = ''
  if (!d_.id) {
    str += '<div class="leaflet-popup-error">' +
      '<div class="row ">' +
      "We can't get this data right now, please try again later" +
      '</div>' +
      '</div>'
    return str
  }
  str += '<div id="waterLevel-site-' + d_.id + '">'
  str += '<div class="leaflet-popup-title">'
  str += '<span><strong>' + d_.id + '. '// id for name div
  if (d_.name) {
    str += '' + d_.name
  }
  str += '</strong></span>' //
  str += '</div>' // close title div
  str += '<div id="waterLevel-site-' + d_.id + '-subtitle" class="leaflet-popup-subtitle">'
  str += '</div>' // close subtitle
  str += '<div class="leaflet-popup-chart" id="waterLevel-site-' + d_.id + '-plot">' + '' + '</div>'
  str += '</div>' // close popup

  return str
}

async function getSiteReadings (d_) {
  // console.log(d_)

  const readings = await d3.json('../data/Environment/waterLevel_levels/sound_reading_' + d_.id + '.json')
  // console.log(readings.times)

  const data = readings.dates.map((d, i) => {
    let date = d.split('/')[0]
    const m = parseInt(d.split('/')[1]) - 1
    const y = d.split('/')[2]
    date = new Date(y, m, date) // convert key date string to date

    const h = readings.times[i].split(':')[0]
    const min = readings.times[i].split(':')[1]
    date.setHours(h)
    date.setMinutes(min)
    // console.log(date)

    // let divId = `waterLevel-site-${d_.id}`
    // document.getElementById(divId + '-subtitle').innerHTML = `Latest data for ${readings.dates[0]}`
    // console.log(date)
    const datum = {
      id: d_.id,
      name: d_.name,
      date: date,
      value: +readings.aleq[i],
      label: date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')

    }
    // if (i == 0) console.log(datum)
    return datum
  })
  return data
}

const getWaterLevels = async () => {
  const FILE_NAME = './public/data/Environment/waterlevel_latest.json'
  fs.readFile(FILE_NAME, (error, data) => {
    // console.log('Async Read: starting...')
    if (error) {
      // console.log('Async Read: NOT successful!')

      console.log(error)
    } else {
      try {
        const dataJson = JSON.parse(data)
        const data_ = dataJson.features
        const regionData = data_.filter(function (d) {
          return d.properties['station.region_id'] === null || d.properties['station.region_id'] === 10
        })

        regionData.forEach(function (d, i) {
          const station_ref = d.properties['station.ref'].substring(5, 10)
          const sensor_ref = d.properties['sensor.ref']
          const fname = station_ref.concat('_', sensor_ref)

          // console.log(i + '---'+ fname);
          var file = fs.createWriteStream('./public/data/Environment/water_levels/' + fname + '.csv')
          var http = require('http')
          // http://waterlevel.ie/data/month/25017_0001.csv
          http.get('http://waterlevel.ie/data/month/' + fname + '.csv',
            function (response) {
              response.pipe(file)
            })
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
}

async function getPopupPlot (d_) {
  const divId = `waterLevel-site-${d_.id}`
  const data = await getSiteReadings(d_)

  // isToday(s.date)

  // console.log(data[0])
  if (isToday(data[0].date)) {
    document.getElementById(divId + '-subtitle').innerHTML =
    data[0].date.toString().split(' ')[0] + ' ' +
    data[1].date.toString().split(' ')[1] + ' ' +
    data[2].date.toString().split(' ')[2]
    const options = {
      data: data,
      elementId: '' + divId + '-plot',
      yV: 'value',
      xV: 'date',
      dL: 'label',
      titleLabel: 'dB'
    }
    const chart = new ChartLinePopup(options)
    return chart
  }

  const str = '<div class="popup-error">' +
          '<div class="row ">' +
          "We can't get the waterLevel monitoring data for this location right now, please try again later" +
          '</div>' +
          '</div>'
  // return d3.select('#bike-spark-' + sid_)
  //   .html(str)
  document.getElementById(divId + '-plot').innerHTML = str
  return str
}

function activeBtn (e) {
  const btn = e
  $(btn).siblings().removeClass('active')
  $(btn).addClass('active')
}
