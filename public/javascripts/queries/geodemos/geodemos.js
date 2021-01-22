/**

**/

import { getCityLatLng } from '../../modules/bcd-maps.js'
import { getTraceDefaults, getRowChartLayout } from '../../modules/bcd-plotly-utils.js'

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

const CHART_COLOR = '#ffffff'
const CHART_FONT = {
  family: 'PT Sans',
  size: 16,
  color: '#313131'
}
const CHART_TITLE_FONT = {
  family: 'PT Sans',
  size: 20,
  color: '#313131'
}
const CHART_COLORWAY = ['#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']

const ROW_CHART_LAYOUT = {
  height: 400,
  margin: {
    l: 50,
    r: 0,
    b: 0,
    t: 0
  },
  title: {
    text: '',
    font: {
      family: null,
      size: 20
    },
    visible: false,
    xref: 'container',
    x: 0.0,
    xanchor: 'left',
    yref: 'container',
    y: 1.0,
    yanchor: 'top'
  },
  xaxis: {
    title: '',
    titlefont: {
      size: 16
    },
    visible: true,
    type: null,
    range: null,
    fixedrange: true,
    showticklabels: true,
    nticks: null,
    ticks: '',
    automargin: true,
    tickfont: {
      family: null,
      size: 12
    }
  },
  yaxis: {
    title: '',
    titlefont: {
      size: 16
    },
    visible: true,
    type: null,
    range: null,
    fixedrange: true,
    showticklabels: true,
    nticks: null,
    ticks: '',
    automargin: true,
    tickfont: {
      family: null,
      size: 12
    }
  },
  paper_bgcolor: CHART_COLOR,
  plot_bgcolor: CHART_COLOR,
  colorway: CHART_COLORWAY,
  font: CHART_FONT,
  showlegend: false,
  annotations: [],
  hovermode: 'closest'

}

async function main () {
  // Add map
  const minZoom = 7
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
  mapGeodemos.setMaxBounds(mapGeodemos.getBounds())

  // L.control.locate({
  //   strings: {
  //     title: 'Zoom to your location'
  //   }
  // }).addTo(mapGeodemos)

  // mapGeodemos.addControl(new L.Control.OSMGeocoder({
  //   placeholder: 'Enter street name, area etc.',
  //   bounds: getCityLatLng()
  // }))

  // Used when an SA is null or otherwise falsey
  // const naStyle = {
  //   fillColor: 'grey',
  //   weight: 1,
  //   opacity: 2,
  //   color: 'grey',
  //   dashArray: '1',
  //   fillOpacity: 0.5
  // }

  let mapLayers = await getEmptyLayersArray(8)
  mapLayers = await loadSmallAreas(mapLayers)
  addLayersToMap(mapLayers, mapGeodemos)
  const zScores = await d3.csv('/data/geodemos/cork_zscores.csv')
  const chartTraces = await getChartTraces(zScores)
  const chartLayout = await getChartLayout()

  Plotly.newPlot('chart-geodemos', chartTraces, chartLayout, {
    modeBar: {
      orientation: 'v',
      bgcolor: 'black',
      color: null,
      activecolor: null
    },
    responsive: true
  })

  const descriptions = await d3.json('/data/geodemos/geodemos-group-descriptions.json')

  const heatmapTraces = await getHeatmapTraces(zScores)
  const heatmapLayout = await getHeatmapLayout()
  console.log(heatmapTraces)

  // Plotly.newPlot('geodemos-heatmap', heatmapTraces, heatmapLayout)

  // add event listeners
  const dd = document.getElementById('groups-dropdown')
  dd.addEventListener('click', handleDropdownClick)
  // dd.addEventListener('touchstart', handleClick)

  function handleDropdownClick (e) {
    this.classList.toggle('show')
  }

  d3.select('#query-dropdown__content').selectAll('button').on('click', function () {
    const buttonData = $(this).attr('data') // TODO: remove jQ
    // ResetImages(buttonData)
    const groupNo = buttonData === 'all' ? 'all' : parseInt(buttonData)
    const layerNo = groupNo === 'all' ? 'all' : parseInt(groupNo) - 1
    mapLayers.forEach(l => {
      mapGeodemos.removeLayer(l)
    })

    if (layerNo !== 'all') {
      document.getElementById('current-group').innerHTML = `<p>Group ${buttonData}</p>`
      // updateGroupTxt(gn)
      mapGeodemos.addLayer(mapLayers[layerNo])
      Plotly.react('chart-geodemos', [chartTraces[layerNo]], chartLayout)
    } else {
      document.getElementById('current-group').innerHTML = '<p>All Groups</p>'
      mapLayers.forEach(l => {
        mapGeodemos.addLayer(l)
      })
      Plotly.react('chart-geodemos', chartTraces, chartLayout)
      // 'all' && cb.attr("src") == '/images/icons/ui/Icon_eye_selected.svg')
    }
    updateGroupDescription(groupNo, descriptions[groupNo])
  })
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

/* Value chart functions */

async function getChartTraces (zScores) {
  const traces = []
  let columnNames2 = {}
  columnNames2 = Object.keys(zScores[0])
  columnNames2 = columnNames2.reverse()
  columnNames2 = columnNames2.filter(e => e !== 'cluster')

  // const TRACES_DEFAULT = getTraceDefaults('scatter')

  const TRACES_DEFAULT = {
    name: 'trace',
    type: 'scatter',
    mode: 'lines+markers',
    opacity: 1.0, // default
    marker: {
      symbol: null,
      color: null, // lines + markers, defaults to colorway
      line: {
        width: null
      }
    },
    fill: null,
    fillcolor: null,
    hoveron: 'points', // 'points+fills',
    line: {
      color: null,
      shape: 'spline'
    },
    text: null,
    hoverinfo: null,
    visible: true // 'legendonly'
  }

  zScores.forEach((row, i) => {
    const trace = Object.assign({}, TRACES_DEFAULT)
    trace.type = 'scatter'
    trace.mode = 'markers+text'

    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker = {
      color: getLayerColor(i),
      size: 11
    }

    trace.x = columnNames2.map(name2 => {
      return row[name2]
    })

    trace.y = columnNames2

    traces.push(trace)
    trace.hovertemplate = `%{x:.2f}<extra>Group No: ${i + 1}</extra>`
  })
  return traces
}

async function getChartLayout () {
  const ROW_CHART_LAYOUT = getRowChartLayout()
  const chartLayout = Object.assign({}, ROW_CHART_LAYOUT)
  chartLayout.mode = 'scatter'
  chartLayout.height = 0
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
  }
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

  return chartLayout
}

/* Description functions */

function updateGroupDescription (groupNo, contentText) {
  const title = document.getElementById('geodemos-group-description__title')
  const titleText = groupNo === 'all' ? 'All Groups' : `Group ${groupNo}`
  title.innerText = titleText

  const content = document.getElementById('geodemos-group-description__content')
  content.innerHTML = contentText
}

/* Heatmap functions */

function getHeatmapLayout () {
  const heatmapLayout = Object.assign({}, ROW_CHART_LAYOUT)
  heatmapLayout.height = 500
  heatmapLayout.width = 560
  // layout.barmode = 'group';
  heatmapLayout.plot_bgcolor = '#293135'
  heatmapLayout.paper_bgcolor = '#293135'

  heatmapLayout.colorway = GEODEMOS_COLORWAY_CBSAFE
  heatmapLayout.title = Object.assign({}, ROW_CHART_LAYOUT.title)
  heatmapLayout.title.text = ''
  heatmapLayout.title.x = 0.51
  heatmapLayout.title.y = 0.99
  heatmapLayout.title.xanchor = 'center'
  heatmapLayout.title.yanchor = 'top'
  heatmapLayout.title.font = {
    color: '#6fd1f6',
    family: 'Courier New, monospace',
    size: 17
  },
  heatmapLayout.showlegend = false
  heatmapLayout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend)
  heatmapLayout.legend.xanchor = 'right'
  heatmapLayout.legend.y = 0.1
  heatmapLayout.legend.traceorder = 'reversed'
  heatmapLayout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis)
  heatmapLayout.xaxis.title = ''
  heatmapLayout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis)

  heatmapLayout.yaxis.tickfont = {
    family: 'PT Sans',
    size: 10,
    color: '#6fd1f6'
  }
  heatmapLayout.xaxis.tickfont = {
    family: 'PT Sans',
    size: 10,
    color: '#6fd1f6'
  }
  heatmapLayout.tickfont = {
    family: 'PT Sans',
    size: 10,
    color: '#6fd1f6'
  }

  heatmapLayout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont)
  heatmapLayout.yaxis.titlefont.size = 16 // bug? need to call this
  heatmapLayout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title)
  heatmapLayout.yaxis.title = ''
  heatmapLayout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)
  heatmapLayout.margin = {
    l: 20,
    r: 40, // annotations space
    t: 30,
    b: 0

  }
  return heatmapLayout
}

function getHeatmapTraces (zScores) {
  const GroupsArray = ['Group1', 'Group2', 'Group3', 'Group4', 'Group5', 'Group6', 'Group7']
  const newCsv = zScores.split('\n').map(function (line) {
    const columns = line.split(',') // get the columns
    columns.splice(0, 1) // remove total column
    return columns.reverse()
  }).join('\n')

  const rows = newCsv.split('\n')
  // alert(rows)
  // get the first row as header
  const header = rows.shift()
  // alert(header)
  // const header = columnNames;
  const numberOfColumns = header.split(',').length

  // initialize 2D-array with a fixed size
  const columnData = [...Array(numberOfColumns)].map(item => new Array())

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowData = row.split(',')

    // assuming that there's always the same
    // number of columns in data rows as in header row
    for (let j = 0; j < numberOfColumns; j++) {
      columnData[j].push((rowData[j]))
    }
  }
  const heatmapTraces = [
    {

      z: columnData,
      x: GroupsArray,
      y: header.split(','),

      hovertemplate: 'z-score: %{z:.2f}<extra></extra>',
      type: 'heatmap',
      hoverinfo: 'z',
      showscale: true,
      fixedrange: true,
      colorbar: {
        // title: 'z-scores',

        tickcolor: '#6fd1f6',
        tickfont: {
          color: '#6fd1f6',
          size: 10
        },

        ticks: 'outside',
        dtick: 0.25,
        tickwidth: 2,
        ticklen: 10,
        showticklabels: true,
        xpad: 35,

        thickness: 40,
        thicknessmode: 'pixels',
        len: 0.9,
        lenmode: 'fraction',
        outlinewidth: 0

      },
      colorscale: [

        // Let first 10% (0.1) of the values have color rgb(0, 0, 0)

        [0, 'rgb(179,24,43)'],
        [0.1, 'rgb(179,24,43)'],

        // Let values between 10-20% of the min and max of z
        // have color rgb(20, 20, 20)

        [0.1, 'rgb(214,86,77)'],
        [0.2, 'rgb(214,86,77)'],

        // Values between 20-30% of the min and max of z
        // have color rgb(40, 40, 40)

        [0.2, 'rgb(244,165,130)'],
        [0.3, 'rgb(244,165,130)'],

        [0.3, 'rgb(253,219,199)'],
        [0.4, 'rgb(253,219,199)'],

        [0.4, 'rgb(247,247,247)'],
        [0.5, 'rgb(247,247,247)'],

        [0.5, 'rgb(209,229,240)'],
        [0.6, 'rgb(209,229,240)'],

        [0.6, 'rgb(146,197,222)'],
        [0.7, 'rgb(146,197,222)'],

        [0.7, 'rgb(67,147,195)'],
        [0.8, 'rgb(67,147,195)'],

        [0.8, 'rgb(33,102,172)'],
        [1.0, 'rgb(33,102,172)']
      ]
    }
  ]
  return heatmapTraces
}

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
