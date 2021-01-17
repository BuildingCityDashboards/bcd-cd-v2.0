/**

**/

import { getCityLatLng } from '../../modules/bcd-maps.js'
async function main () {
  const minZoom = 8
  const maxZoom = 16
  const zoom = minZoom
  // tile layer with correct attribution
  const BASEMAP = 'https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png'
  const ATTRIBUTION = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, © <a href="https://carto.com/">CartoDB </a> contributors'

  const mapGeodemos = new L.Map('map-geodemos')
  const osmLayer = new L.TileLayer(BASEMAP, {
    minZoom: minZoom,
    maxZoom: maxZoom,
    attribution: ATTRIBUTION
  })
  mapGeodemos.setView(getCityLatLng(), zoom)
  mapGeodemos.addLayer(osmLayer)

  L.control.locate({
    strings: {
      title: 'Zoom to your location'
    }
  }).addTo(mapGeodemos)

  mapGeodemos.addControl(new L.Control.OSMGeocoder({
    placeholder: 'Enter street name, area etc.',
    bounds: getCityLatLng()
  }))

  // Used when an SA is null or otherwise falsey
  const naStyle = {
    fillColor: 'grey',
    weight: 1,
    opacity: 2,
    color: 'grey',
    dashArray: '1',
    fillOpacity: 0.5
  }

  let mapLayers = await getEmptyLayersArray(8)
  mapLayers = await loadSmallAreas(mapLayers)
  addLayersToMap(mapLayers, mapGeodemos)

  // Need to stop clicks on map propagating to div beneath
  const mapDiv = document.getElementById('map-geodemos')
  L.DomEvent.on(mapDiv, 'click', function (ev) {
    L.DomEvent.stopPropagation(ev)
  })

  const groupNames = ['Group1', 'Group2', 'Group3', 'Group4', 'Group5', 'Group6', 'Group7']
  await loadChart()
  // console.log(data)
}

main()

/* Map functions */

async function loadSmallAreas (layers) {
  // const remoteURI = 'https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Census2016_Theme5Table2_SA/FeatureServer/0/query?where=COUNTYNAME%20%3D%20\'CORK%20COUNTY\'&outFields=OBJECTID,GUID,COUNTY,COUNTYNAME,SMALL_AREA,Shape__Area,Shape__Length&outSR=4326&f=json'

  const staticURI = '/data/geodemos/cork-geodemos-clusters.geojson'

  const corkSAs = await d3.json(staticURI)

  corkSAs.features.forEach(sa => {
    try {
      const groupNo = sa.properties.cork_clusters_Clusters
      layers[parseInt(groupNo) - 1].addData(sa)
    } catch (err) {
      // sa.properties.groupnumber = 'NA'
      // mapLayers[7].addData(sa)
      console.log(err)
    }
  })
  return layers
}

async function getEmptyLayersArray (total) {
  const layersArr = []
  for (let i = 0; i < total; i += 1) {
    layersArr.push(L.geoJSON(null, {
      style: getLayerStyle(i),
      onEachFeature: onEachFeature

    })
    )
  }
  return layersArr
}

function getLayerStyle (index) {
  return {
    fillColor: getLayerColor(index),
    weight: 0.3,
    opacity: 0.9,
    color: getLayerColor(index),
    // dashArray: '1',
    fillOpacity: 0.9
  }
}

function getLayerColor (index) {
  const GEODEMOS_COLORWAY_CATEGORICAL = ['#7fc97f',
    '#beaed4',
    '#fdc086',
    '#ffff99',
    '#386cb0',
    '#f0027f',
    '#bf5b17']
  const GEODEMOS_COLORWAY_CBSAFE = ['#d73027',
    '#f46d43',
    '#fdae61',
    '#fee090',
    '#abd9e9',
    '#74add1',
    '#4575b4']

  return GEODEMOS_COLORWAY_CBSAFE[index]
}

function onEachFeature (feature, layer) {
  const customOptions =
  {
    maxWidth: '400',
    width: '250',
    className: 'popupCustom'
  }

  const popTextContent =
    '<p><b>Group ' + feature.properties.cork_clusters_Clusters + '</b></p>' +
    '<p><b>' + feature.properties.EDNAME + '</b></p>' +
    '<p><b>' + feature.properties.COUNTYNAME + '</b></p>' +
    '<p><b>SA ' + feature.properties.SMALL_AREA + '</b></p>'

  layer.bindPopup(popTextContent, customOptions)

  layer.on({
    click: function () {
    }
  })
}

function addLayersToMap (layers, map) {
  layers.forEach((l, i) => {
    if (!map.hasLayer(l)) {
      map.addLayer(l)
      l.setStyle({
        fillColor: getLayerColor(i)
      })
    }
  })
}

/* Chart functions */

async function loadChartData (groupNames) {
  d3.text('/data/geodemos/cork_zscores.csv')
    .then((zScores) => {
      const newCsv = zScores.split('\n').map(function (line) {
        const columns = line.split(',') // get the columns
        columns.splice(0, 1) // remove total column
        return columns
      }).join('\n')

      const rows = newCsv.split('\n')

      // get the first row as header
      const header = rows.shift()

      // const header = columnNames;
      const numberOfColumns = header.split(',').length

      // initialize 2D-array with a fixed size
      const columnData = [...Array(numberOfColumns)].map(item => new Array())

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const rowData = row.split(',')

        for (let j = 0; j < numberOfColumns; j++) {
          columnData[j].push((rowData[j]))
        }
      }
      const zArray = []
      for (let r = 0; r < 7; r++) {
        // alert(columnData[value][r])
        zArray.push((columnData[value][r]))
      }

      const farr = []
      // let tc ={}
      for (let f = 0; f < zArray.length; f++) {
        const tc = Object.assign({}, TRACES_DEFAULT)
        tc.type = 'bar'
        tc.orientation = 'h'
        tc.x = parseFloat(zArray[f])
        tc.y = groupNames[f]
        // alert(JSON.stringify(tc))
        farr.push(tc)
      }

      const data = [
        {
          x: zArray, // columnData,
          y: groupNames,
          hovertemplate: `${text}: %{x:.2f}<extra></extra>`,
          type: 'bar',
          orientation: 'h',
          indxArr: [0, 1, 2, 3, 4, 5, 6],
          marker: {
            color: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666']
          }
        }
      ]
      return data
    })
}

function ResetImages (imgid) {
  const imgsrcarr = ['/images/icons/ui/Icon_eye_selected-all.svg',
    '/images/icons/ui/Icon_eye_selected-1.svg',
    '/images/icons/ui/Icon_eye_selected-2.svg',
    '/images/icons/ui/Icon_eye_selected-3.svg',
    '/images/icons/ui/Icon_eye_selected-4.svg',
    '/images/icons/ui/Icon_eye_selected-5.svg',
    '/images/icons/ui/Icon_eye_selected-6.svg',
    '/images/icons/ui/Icon_eye_selected-7.svg']

  const Oimgsrcarr = ['/images/icons/sdAg.svg',
    '/images/icons/sd10.svg',
    '/images/icons/sd2.svg',
    '/images/icons/sd3.svg',
    '/images/icons/sd4.svg',
    '/images/icons/sd5.svg',
    '/images/icons/sd6.svg',
    '/images/icons/sd7.svg']

  const myimg3 = document.getElementById('all')
  myimg3.src = '/images/icons/sdAg.svg'

  for (let i = 1; i < 8; i++) {
    const myimg2 = document.getElementById(i)

    myimg2.src = Oimgsrcarr[i]// "/images/icons/sd.svg"
  }

  // if (imgid ==='all')
  // alert('----'+imgid)
  const selectedImg = document.getElementById(imgid)
  if (imgid === 'all') { imgid = 0 }
  selectedImg.src = imgsrcarr[imgid]
}

/* Heatmap functions */

function loadChart () {
  d3.csv('/data/geodemos/cork_zscores.csv')
    .then((zScores) => {
      let chartLayout = {}
      const chartTraces = []
      let columnNames2 = {}
      columnNames2 = Object.keys(zScores[0])
      columnNames2 = columnNames2.reverse()
      columnNames2 = columnNames2.filter(e => e !== 'cluster')

      zScores.forEach((row, i) => {
        const ntrace = Object.assign({}, TRACES_DEFAULT)
        ntrace.type = 'scatter'
        ntrace.mode = 'markers+text'

        ntrace.marker = Object.assign({}, TRACES_DEFAULT.marker)
        ntrace.marker = {
          color: getLayerColor(i),
          size: 11
        }

        ntrace.x = columnNames2.map(name2 => {
          return row[name2]
        })

        ntrace.y = columnNames2

        chartTraces.push(ntrace)
        ntrace.hovertemplate = `%{x:.2f}<extra>Group No: ${i + 1}</extra>`
      })

      chartLayout = Object.assign({}, ROW_CHART_LAYOUT)
      chartLayout.mode = 'scatter'
      chartLayout.height = 500
      // chartLayout.width = 300
      chartLayout.responsive = true
      chartLayout.plot_bgcolor = '#ffffff'
      chartLayout.paper_bgcolor = '#ffffff'

      chartLayout.title = Object.assign({}, ROW_CHART_LAYOUT.title)
      chartLayout.title.text = 'Variables Value Distribution (z-scores)'
      chartLayout.title.x = 0.51
      chartLayout.title.y = 0.99
      chartLayout.title.xanchor = 'center'
      chartLayout.title.yanchor = 'top'
      chartLayout.title.font = {
        color: '#e95d4f',
        family: 'Roboto',
        size: 18
      },

      chartLayout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend)
      chartLayout.legend.xanchor = 'right'
      chartLayout.legend.y = 0.1
      chartLayout.legend.traceorder = 'reversed'
      chartLayout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis)
      chartLayout.xaxis.title = ''
      chartLayout.xaxis.range = [-2, 2.9]
      chartLayout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis)
      chartLayout.yaxis.tickfont = {
        family: 'Roboto',
        size: 12,
        color: '#e95d4f'
      }
      chartLayout.xaxis.tickfont = {
        family: 'Roboto',
        size: 12,
        color: '#e95d4f'
      }

      chartLayout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont)
      chartLayout.yaxis.titlefont.size = 16 // bug? need to call this
      chartLayout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title)
      chartLayout.yaxis.title = ''
      chartLayout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)

      chartLayout.margin = {
        l: 0,
        r: 0, // annotations space
        t: 40,
        b: 0
      }

      Plotly.newPlot('chart-geodemos', chartTraces, chartLayout, {
        modeBar: {
          orientation: 'v',
          bgcolor: 'black',
          color: null,
          activecolor: null
        },
        responsive: true

      })
    }) // end then
}

/* UI functions */

function updateGroupTxt (no) {
  if (document.contains(document.getElementById('myhref'))) {
    document.getElementById('href').remove()
  }

  d3.json('/data/geodemos/geodem-text-data.json').then(function (dublinRegionsJson) {
    d3.select('#group-title').text(dublinRegionsJson[1][no]).style('font-size', '27px').style('font-weight', 'bold')
    //
    d3.select('#group-title').text(dublinRegionsJson[1][no])// .style("color",getLayerColor(no-1));
    d3.select('#group-text').text(dublinRegionsJson[0][no]).style('font-size', '15px')
  })
}

d3.select('#group-buttons').selectAll('img').on('click', function () {
  const cb = $(this)
  const myv = $(this).attr('id')
  ResetImages(myv)
  let layerNo = myv === 'all' ? 'all' : parseInt(myv) - 1

  if (layerNo !== 'all') {
    mapLayers.forEach(l => {
      mapGeodemos.removeLayer(l)
    })

    const gn = layerNo + 1

    updateGroupTxt(gn)
    mapGeodemos.addLayer(mapLayers[layerNo])

    Plotly.react('chart-geodemos', [traces[layerNo]], layout)
  }
  // }

  layerNo = myv

  if (layerNo === 'all') { // 'all' && cb.attr("src")=='/images/icons/ui/Icon_eye_selected.svg') {
    scatterHM()
    updateGroupTxt('all')
    AddLayersToMap()
  }
})
