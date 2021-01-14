/**

**/

import { getCityLatLng } from '../modules/bcd-maps.js'

const minZoom = 10
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

const GEODEMOS_COLORWAY_CATEGORICAL = ['#7fc97f',
  '#beaed4',
  '#fdc086',
  '#ffff99',
  '#386cb0',
  '#f0027f',
  '#bf5b17']
const GEODEMOS_COLORWAY_CBSAFE = ['#d73027', '#f46d43', '#fdae61', '#fee090', '#abd9e9', '#74add1', '#4575b4']
const GEODEMOS_COLORWAY = GEODEMOS_COLORWAY_CATEGORICAL

// Used when an SA is null or otherwise falsey
const naStyle = {
  fillColor: 'grey',
  weight: 1,
  opacity: 2,
  color: 'grey',
  dashArray: '1',
  fillOpacity: 0.5
}

const mapLayers = getEmptyLayersArray(8)

const traces = []
const ntraces = []
let layout = {}
let hmlayout = {}
let columnNames2 = {}

d3.csv('/data/geodemos/cork_zscores.csv')
  .then((zScores) => {
    zScores.forEach((row, i) => {
      const columnNames = Object.keys(row).sort(function (a, b) { return row[a] - row[b] })

      const trace = Object.assign({}, TRACES_DEFAULT)
      // trace.type = 'bar'
      // trace.orientation = 'h'
      // trace.mode = ''
      // trace.hovertemplate= 'z-score: %{x:.2f}<extra></extra>'
      trace.mode = 'markers+text'
      trace.type = 'scatter'

      // trace.orientation = 'h'
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
      trace.marker = {
        color: getLayerColor(i) // lines + markers, defaults to colorway
      }

      trace.x = columnNames.map(name => {
        return row[name]
      })

      trace.y = columnNames

      traces.push(trace)
      trace.hovertemplate = `%{x:.2f}<extra>Group No: ${i + 1}</extra>`
    })

    layout = Object.assign({}, ROW_CHART_LAYOUT)
    // layout.mode = 'bars'
    layout.height = 500

    layout.title = Object.assign({}, ROW_CHART_LAYOUT.title)
    layout.title.text = 'Variables Value Distribution (z-scores)'
    layout.title.x = 0.51
    layout.title.y = 0.99
    layout.title.xanchor = 'center'
    layout.title.yanchor = 'top'
    layout.title.font = {
      color: '#6fd1f6',
      family: 'Roboto',
      size: 17

    },
    layout.showlegend = false
    layout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend)
    layout.legend.xanchor = 'right'

    layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis)
    layout.xaxis.title = 'value'
    layout.xaxis.range = [-2, 2.9]
    layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis)
    layout.yaxis.tickfont = {
      family: 'PT Sans',
      size: 9,
      color: '#6fd1f6'
    }
    layout.xaxis.tickfont = {
      family: 'PT Sans',
      size: 10,
      color: '#6fd1f6'
    }

    layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont)
    layout.yaxis.titlefont.size = 16 // bug? need to call this
    layout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title)

    layout.plot_bgcolor = '#293135',
    layout.paper_bgcolor = '#293135'

    layout.yaxis.title = ''
    layout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)

    layout.margin = {
      l: 40,
      r: 40, // annotations space
      t: 40,
      b: 0

    }
    // scatterHM()
    updateGroupTxt('all')
  }) // end then
let lyt = {}

function loadGeojson (file) {
  d3.csv('/data/geodemos/cork_clusters_sa_cluster.csv')
    .then((data) => {
      const idClusterLookup = {}
      data.forEach(function (d) {
        idClusterLookup[d.SMALL_AREA] = d.Clusters || 'not found'
      })
      loadSmallAreas(idClusterLookup)
    })
}

async function loadSmallAreas () {
  const features = []

  const remoteURI = 'https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Census2016_Theme5Table2_SA/FeatureServer/0/query?where=COUNTYNAME%20%3D%20\'CORK%20COUNTY\'&outFields=OBJECTID,GUID,COUNTY,COUNTYNAME,SMALL_AREA,Shape__Area,Shape__Length&outSR=4326&f=json'

  const staticURI = '/data/geodemos/cork-geodemos-clusters.geojson'

  const corkSAs = await d3.json(staticURI)

  corkSAs.features.forEach(sa => {
    try {
      const groupNo = sa.properties.cork_clusters_Clusters
      mapLayers[parseInt(groupNo) - 1].addData(sa)
    } catch (err) {
      // sa.properties.groupnumber = 'NA'
      // mapLayers[7].addData(sa)
      console.log(err)
    }
  })
}
loadSmallAreas()

function getEmptyLayersArray (total) {
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
  return GEODEMOS_COLORWAY[index]
}

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

function onEachFeature (feature, layer) {
  const customOptions =
  {
    maxWidth: '400',
    width: '250',
    className: 'popupCustom'
  }
  const popTextContent =
    '<p><b>Group ' + feature.properties.groupnumber + '</b></p>' +
    '<p><b>' + feature.properties.EDNAME + '</b></p>' +
    '<p><b>' + feature.properties.COUNTYNAME + '</b></p>' +
    '<p><b>SA ' + feature.properties.SMALL_AREA + '</b></p>'

  layer.bindPopup(popTextContent, customOptions)

  layer.on({
    click: function () {
    }
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

function AddLayersToMap () {
  mapLayers.forEach((l, k) => {
    if (!mapGeodemos.hasLayer(l)) {
      const mlay = mapLayers[k]
      // let cov=traces[k-1].x[soc_eco_val];

      mapGeodemos.addLayer(mlay)

      mlay.setStyle({
        fillColor: getLayerColor(k)// getFColor(cov)

      }

      )
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

function addHorizrntalBars (value, text) {
  // alert(value + text)
  const GroupsArray = ['Group1', 'Group2', 'Group3', 'Group4', 'Group5', 'Group6', 'Group7']
  hmlayout = Object.assign({}, ROW_CHART_LAYOUT)

  hmlayout.height = 500
  hmlayout.width = 360
  // layout.barmode = 'group';
  hmlayout.colorway = GEODEMOS_COLORWAY
  hmlayout.title = Object.assign({}, ROW_CHART_LAYOUT.title)
  hmlayout.title.text = text + ' ' + 'Value Distribution (z-scores)'
  hmlayout.showlegend = false
  hmlayout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend)
  hmlayout.legend.xanchor = 'right'
  hmlayout.legend.y = 0.1
  hmlayout.legend.traceorder = 'reversed'
  hmlayout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis)
  hmlayout.xaxis.title = ''
  // hmlayout.xaxis.range = [-2, 2]
  hmlayout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis)
  hmlayout.yaxis.tickfont = {
    family: 'PT Sans',
    size: 10,
    color: '#313131'
  }
  hmlayout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont)
  hmlayout.yaxis.titlefont.size = 16 // bug? need to call this
  hmlayout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title)
  // -hmlayout.hovermode ='closest';
  // -hmlayout.hoverinfo = "z";
  // -hmlayout.domain =[0.85,0.9];
  hmlayout.yaxis.title = ''
  hmlayout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)
  hmlayout.margin = {
    l: 20,
    r: 20, // annotations space
    t: 20,
    b: 0

  }

  d3.text('/data/geodemos/dublin_zscores.csv')
    .then((zScores) => {
      const newCsv = zScores.split('\n').map(function (line) {
        const columns = line.split(',') // get the columns
        columns.splice(0, 1) // remove total column
        return columns
      }).join('\n')

      const rows = newCsv.split('\n')
      // alert(rows)
      // get the first row as header
      const header = rows.shift() // .revers();
      // alert(header)
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
        tc.y = GroupsArray[f]
        // alert(JSON.stringify(tc))
        farr.push(tc)
      }

      const data = [
        {
          x: zArray, // columnData,
          // color: getLayerColor(GroupsArray.indexOf("Banana");),
          y: GroupsArray, // ['', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          hovertemplate: `${text}: %{x:.2f}<extra></extra>`,
          type: 'bar',
          orientation: 'h',
          indxArr: [0, 1, 2, 3, 4, 5, 6],

          marker: {
            color: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666']
          }
        }
      ]
      // Plotly.purge('chart-geodemos');
      Plotly.newPlot('chart-geodemos', data, hmlayout)
    })
}

function scatterHM () {
  d3.csv('/data/geodemos/cork_zscores.csv')
    .then((zScores) => {
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

        ntraces.push(ntrace)
        ntrace.hovertemplate = `%{x:.2f}<extra>Group No: ${i + 1}</extra>`
      })

      lyt = Object.assign({}, ROW_CHART_LAYOUT)
      lyt.mode = 'scatter'
      lyt.height = 500
      // lyt.width = 300
      lyt.plot_bgcolor = '#293135',
      lyt.paper_bgcolor = '#293135'

      lyt.title = Object.assign({}, ROW_CHART_LAYOUT.title)
      lyt.title.text = 'Variables Value Distribution (z-scores)'
      lyt.title.x = 0.51
      lyt.title.y = 0.99
      lyt.title.xanchor = 'center'
      lyt.title.yanchor = 'top'
      lyt.title.font = {
        color: '#6fd1f6',
        family: 'Roboto',
        size: 17

      },

      lyt.legend = Object.assign({}, ROW_CHART_LAYOUT.legend)
      lyt.legend.xanchor = 'right'
      lyt.legend.y = 0.1
      lyt.legend.traceorder = 'reversed'
      lyt.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis)
      lyt.xaxis.title = ''
      lyt.xaxis.range = [-2, 2.9]
      lyt.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis)
      lyt.yaxis.tickfont = {
        family: 'PT Sans',
        size: 9,
        color: '#6fd1f6'
      }
      lyt.xaxis.tickfont = {
        family: 'PT Sans',
        size: 10,
        color: '#6fd1f6'
      }

      lyt.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont)
      lyt.yaxis.titlefont.size = 16 // bug? need to call this
      lyt.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title)

      lyt.plot_bgcolor = '#293135',
      lyt.paper_bgcolor = '#293135'

      lyt.yaxis.title = ''
      lyt.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)

      lyt.margin = {
        l: 20,
        r: 60, // annotations space
        t: 40,
        b: 0

      }

      Plotly.newPlot('chart-geodemos', [ntraces[0], ntraces[1], ntraces[2], ntraces[3], ntraces[4], ntraces[5], ntraces[6]], lyt, {
        modeBar: {
          orientation: 'v',
          bgcolor: 'black',
          color: null,
          activecolor: null
        }

      })
    }) // end then
}
