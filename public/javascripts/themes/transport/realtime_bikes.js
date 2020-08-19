
//    <!-- <script src="/dublindashboard/js/Dashboard/config.js"></script>

//     <script src="/dublindashboard/js/Dashboard/skel.min.js"></script>
//     <!-- <script src="/dublindashboard/js/Dashboard/skel-panels.min.js"></script>
//     <script src="/dublindashboard/js/Dashboard/skel-layers.min.js"></script>
//     <script src="/dublindashboard/js/Dashboard/init.js"></script>-->

// <!-- <link rel="stylesheet" href="//cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" /> -->
// <!-- <link rel="stylesheet" href="/Public_html/leaflet.css" />  -->
// <link rel="stylesheet" href="https://unpkg.com/leaflet@0.7.7/dist/leaflet.css"/>

// <style type="text/css">
//     .leaflet-popup-content {
//         /*margin: 14px 20px;*/
//         /*//overflow: scroll;*/
//         min-width: 50px;
//         /*//max-Width: 600px;*/
//         width:auto !important;
//         font-size: 18px;
//     }
//     .leaflet-control-layers-expanded {
//         padding: 6px 10px 6px 6px;
//         font: 18px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;
//         color: #333;
//         background: #fff;
//         text-align: left;
//     }

//     .leaflet-div-icon {
//         background: transparent;
//         border: none;
//         color:white;
//     }

//     .leaflet-marker-icon .number{
//         position: relative;
//         top: -44px;
//         font-size: 14px;
//         width: 25px;
//         text-align: center;
//     }

//     .legend {
//         text-align: left;
//         line-height: 18px;
//         color: #555;
//         background-color:white;
//     }
//     .legend i {
//         width: 18px;
//         height: 18px;
//         clear:both;
//         float:left;

//     }

//     .info {
//         padding: 2px 8px;

//         background: white;
//         background: rgba(255,255,255,0.8);
//         box-shadow: 0 0 15px rgba(0,0,0,0.2);
//         border-radius: 5px;
//     }
//     .info h4 {
//         margin: 0 0 5px;
//         color: #777;
//     }

// </style>

//    <!--<script src="http://code.jquery.com/jquery-1.8.1.min.js"></script> -->
// <!-- <script src="/dublindashboard/js/leaflet.js"></script> -->
//     <!-- <script src="//cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>  -->
//      <!-- <script src="/dublindashboard/js/leaflet.js"></script> -->
//      <script src="https://unpkg.com/leaflet@0.7.7/dist/leaflet.js"></script>
//     <script src="/dublindashboard/js/carparks.js"></script>
//     <script src="/dublindashboard/js/soundsites.js"></script>
//     <script src="/dublindashboard/js/M50.js"></script>
//     <script src="/dublindashboard/js/R1D1.js"></script>
//    <!-- <script src="/dublindashboard/js/leaflet_numbered_markers.js"></script> -->
//     <script src="/dublindashboard/js/TileLayer.Grayscale.js"></script>
//    <!-- <script src="/dublindashboard/js/leaflet-list-markers.js"></script> -->
//     <script src="/dublindashboard/js/carParkCapacities.js"></script>
//     <script src="/dublindashboard/js/allRoutes.js"></script>
//     <script src="/dublindashboard/js/allRoutesSegments.js"></script>
//     <script src="/dublindashboard/js/Dashboard/leaflet.markercluster-src.js"></script>
//     <link rel="stylesheet" href="/dublindashboard/css/Dashboard/MarkerCluster.css" />
//     <link rel="stylesheet" href="/dublindashboard/css/Dashboard/MarkerCluster.Default.css" />

// function get_browser_info () {
//   var ua = navigator.userAgent; var tem; var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
//   if (/trident/i.test(M[1])) {
//     tem = /\brv[ :]+(\d+)/g.exec(ua) || []
//     return { name: 'IE', version: (tem[1] || '') }
//   }
//   if (M[1] === 'Chrome') {
//     tem = ua.match(/\bOPR\/(\d+)/)
//     if (tem != null) {
//       return { name: 'Opera', version: tem[1] }
//     }
//   }
//   M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
//   if ((tem = ua.match(/version\/(\d+)/i)) != null) {
//     M.splice(1, 1, tem[1])
//   }
//   return {
//     name: M[0],
//     version: M[1]
//   }
// }

// var browser = get_browser_info()
// alert(browser.name);

// Map Stuff
// Individual AirQuality Locations

// var map = new L.Map('map');
// var map;

// highchart default colours

var cloudmadeUrl = '://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png'
var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade'
var cloudmade = new L.TileLayer(cloudmadeUrl, { maxZoom: 18, attribution: cloudmadeAttribution })

/*	var mapquestUrl = '//otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
         mapquestAttribution = "Data CC-By-SA by <a href='http://openstreetmap.org/' target='_blank'>OpenStreetMap</a>, Tiles Courtesy of <a href='http://open.mapquest.com' target='_blank'>MapQuest</a>",
         mapquestGrey = new L.TileLayer.Grayscale(mapquestUrl, {maxZoom: 18, attribution: mapquestAttribution, subdomains: ['1','2','3','4'],  bgcolor: '0x80BDE3'}),
         mapquestColour = new L.TileLayer(mapquestUrl, {maxZoom: 18, attribution: mapquestAttribution, subdomains: ['1','2','3','4'],  bgcolor: '0x80BDE3'}); */

// create the tile layer with correct attribution
// var osmUrl ='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmUrl = '//{s}.tile.osm.org/{z}/{x}/{y}.png'
//  var osmUrl ='https://tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
// var osmUrl = '://tile.openstreetmap.org/tiles/osmde/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
var osm = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib })
var osmGrey = new L.TileLayer.Grayscale(osmUrl, { maxZoom: 18, attribution: osmAttrib })

// alert(browser.version);
// alert(browser.name);

// if (browser.name == 'MSIE' && browser.version == '9') {
// // alert(browser.version);
// // alert(browser.name);
// // alert('OK');

//   map = new L.Map('map', {
//     center: new L.LatLng(51.898280, -8.473088),
//     zoom: 18,
//     layers: [osm],
//     zoomControl: true
//   })
// } else if (browser.name == 'MSIE' && browser.version == '10') {
// // alert(browser.version);
// // alert(browser.name);
// // alert('OK');

//   map = new L.Map('map', {
//     center: new L.LatLng(51.898280, -8.473088),
//     zoom: 16,
//     layers: [osm],
//     zoomControl: true
//   })
// } else if (browser.name == 'Firefox' && browser.version == '8') {
// // alert(browser.version);
// // alert(browser.name);
// // alert('OK');

//   map = new L.Map('map', {
//     center: new L.LatLng(51.898280, -8.473088),
//     zoom: 16,
//     layers: [osm],
//     zoomControl: true
//   })
// } else if (browser.name == 'Firefox' && browser.version == '7') {
// // alert(browser.version);
// // alert(browser.name);
// // alert('OK');

//   map = new L.Map('map', {
//     center: new L.LatLng(51.898280, -8.473088),
//     zoom: 16,
//     layers: [osm],
//     zoomControl: true
//   })
// } else {
//   map = new L.Map('map', {
//     center: new L.LatLng(51.898280, -8.473088),
//     zoom: 16,
//     layers: [osmGrey],
//     zoomControl: true
//   })
// }

// map.addEventListener('click', onMapClick)
// // LEGEND
// var legend = L.control({ position: 'bottomright' })
// legend.onAdd = function (map) {
//   var div = L.DomUtil.create('div', 'info legend')
//   var ttGrades = [1, 1, 2, 3, 4, 5, 6, 6]
//   var grades = [0, 20, 40, 60, 80]
//   var bikeGrades = [0, 20, 40, 60, 80]
//   var labels = []
//   var from; var to
//   labels.push('Car Parks')
//   labels.push('(Available Spaces)')
//   for (var i = 0; i < grades.length; i++) {
//     from = grades[i]
//     to = grades[i + 1]

//     labels.push('<i style="background: ' + setMarkerColor(from, 100) + '"></i> ' +
//                         from + (to ? '%&ndash;' + to + '%' : '%' + '+'))
//   }

//   labels.push('Bike Stations')
//   labels.push('(Available Bikes)')
//   for (var i = 0; i < bikeGrades.length; i++) {
//     from = grades[i]
//     to = grades[i + 1]

//     labels.push('<i style="background: ' + setBikeStationColour(from, 100) + '"></i> ' +
//                         from + (to ? '%&ndash;' + to + '%' : '%' + '+'))
//   }

/* labels.push('');
             labels.push('Travel Times');
             for (var i = 0; i < ttGrades.length; i++) {
             ttFrom = ttGrades[i];

             if(i==0){

             labels.push('<i style="background: ' + setTripsColourCSV(i) +  '"></i>  \< 1 minute(s)');
             }
             else if(i>0 && i<7){

             labels.push('<i style="background: ' + setTripsColourCSV(i) +  '"></i>  \~ ' + ttFrom +' minute(s)');
             }
             else if(i==7){

             labels.push('<i style="background: ' + setTripsColourCSV(i) +  '"></i>  \> ' + ttFrom +' minute(s)');

             }
             }
             */
//   labels.push('')
//   labels.push('<i style="background: url(\'/dublindashboard/img/Dashboard/trafficCam.png\'); background-size: 18px 18px;"></i> ' + ' Traffic Camera')

/*  labels.push('');
             labels.push('M50 Travel');
             labels.push('<i style="background: #0571b0"></i> '+ ' Free Flow');
             labels.push('<i style="background: #ca0020"></i> '+ ' Sub Free Flow');

//              */
//   div.innerHTML = labels.join('<br>')
//   return div
// }

// legend.addTo(map)

/*	popup = new L.Popup({
         maxWidth: 200
         }); */

function getName (propertyName) {
  return carparks[propertyName]
}
;

function getJunctionName (propertyName) {
  return M50[propertyName]
}
;

var bikeStations = new L.MarkerClusterGroup()
bikeStations.addTo(map)
L.stamp(bikeStations)

var baseMaps = {
// "MQ Greyscale": mapquestGrey,
// "MQ Colour": mapquestColour,
  'OSM Greyscale': osmGrey,
  'OSM Colour': osm

}

var overlayMaps = {
//   'City Centre Carparks': carParks,
  // "M50 Travel Times - South": m50South,
  // "M50 Travel Times - North": m50North,
  // "M4 Travel Times - East": m4East,
//   'Travel Time to City': trips,
//   'Traffic Cameras': trafficCams,
  'Bike Stations': bikeStations

}
layerControl = L.control.layers(baseMaps, overlayMaps)
layerControl.addTo(map)
var initial = 0 // check to add everythign initially to first map.

function myFunction () {
  bikeStations.clearLayers() // bike stations

  // Cork Bikes
  $.get('/CarParks/corkBikes', function (point) {
    obj = JSON.parse(point)
    // alert(obj.data[0].schemeId);
    var numBikeStations = obj.data.length
    // alert("num "+numBikeStations);
    for (var i = 0; i < numBikeStations; i++) {
      var stationName = obj.data[i].name
      var stationStands = obj.data[i].docksAvailable
      var stationBikes = obj.data[i].bikesAvailable
      var totalStands = obj.data[i].docksCount
      var stationLat = obj.data[i].latitude
      var stationLon = obj.data[i].longitude

      // alert(stationName+", "+stationStands+", "+stationBikes);

      //   {"schemeId":2,"schemeShortName":"Cork","stationId":2001,"name":"Gaol Walk","nameIrish":"Siúlán an Phríosúin","docksCount":29,"bikesAvailable":18,"docksAvailable":8,"status":0,"latitude":51.893604,"longitude":-8.494174,"dateStatus":"24-05-2017 16:40:00"},

      var bikeStation = { //
        type: 'Feature',
        properties: {
          amenity: 'Bike station',
          popupContent: '<table style="width:300px"><tr><td><b>' + stationName + ' Bike Station currently has ' + stationBikes + ' bikes available and ' + stationStands + ' stands available </b></td></tr></table>'
        },
        geometry: {
          type: 'Point',
          coordinates: [stationLon, stationLat]
        }
      }

      var bikeStationOptions = {
        radius: 8,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 1 // setMarkerIntensity(spaces)

      }

      var bikeIcon = L.Icon.extend({
        options: {
          iconSize: [36, 45],
          iconAnchor: [18, 45],
          popupAnchor: [-3, -46]
        }
      })

      bikeStations.addLayer(L.geoJson(bikeStation, {
        onEachFeature: onEachBikeFeature,
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: setBikeStationColour(stationBikes, totalStands) }).bindPopup(bikeStation.popupContent)
        }
      }))
    }

    function onEachBikeFeature (feature, layer) {
      popup = layer.bindPopup(layer.feature.properties.popupContent) // essential
    }

    function setBikeStationColour (bikes, totalStands) {
      var percentageFree = (bikes / totalStands) * 100

      var one = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike20.png' })
      var two = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike40.png' })
      var three = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike60.png' })
      var four = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike80.png' })
      var five = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike100.png' })
      var six = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike120.png' })

      return percentageFree < 20 ? one
        : percentageFree < 40 ? two
          : percentageFree < 60 ? three
            : percentageFree < 80 ? four
              : percentageFree < 101 ? five
              // percentageFree < 120   ? six :
                : 'six'
    }
  })

  // Cork Carprks

  $.get('/CarParks/corkCarparks', function (point) {
    obj = JSON.parse(point)

    //  [{"opening_times": "24/7", "identifier": 104, "name": "Saint Finbarr's", "notes": "", "longitude": -8.482056, "date": "2017-05-24T13:04:02.505000", "spaces": 350, "free_spaces": 60, "latitude": 51.896723, "_id": 8},

    var numOfCarparks = obj.result.records.length

    for (var i = 0; i < numOfCarparks; i++) {
      var cpName = obj.result.records[i].name
      var cpOpening = obj.result.records[i].opening_times
      var cplat = obj.result.records[i].latitude
      var cplon = obj.result.records[i].longitude
      var cpTotalSpaces = obj.result.records[i].spaces
      var cpFreeSpaces = obj.result.records[i].free_spaces
      var cp_date = obj.result.records[i].date

      // add to map
      var text = '<table style="width:300px"><tr><td><b>' + cpName + ' Car Park currently has ' + cpFreeSpaces + ' spaces (Total Spaces:' + cpTotalSpaces + ') </b></td></tr></table>'

      var carparkSite = {
        type: 'Feature',
        properties: {
          name: cpName,
          amenity: 'Car Park',
          popupContent: text
        },
        geometry: {
          type: 'Point',
          coordinates: [cplon, cplat]
        }
      }

      var carparkSiteOptions = {
        radius: 8,
        // fillColor: "#ff7800",
        fillColor: setMarkerColor(cpFreeSpaces, cpTotalSpaces), // colours[i], //
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 1 // setMarkerIntensity(spaces)
      }

      carParks.addLayer(L.geoJson(carparkSite, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, carparkSiteOptions)
        }
      }))
    }
  }
  )

  // bikes

  $.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=7189fcb899283cf1b42a97fc627eb7682ae8ff7d', function (point) {
    var key; var count = 0
    for (key in point) {
      var bikeStation = { //
        type: 'Feature',
        properties: {
          amenity: 'Bike station',
          popupContent: '<table style="width:300px"><tr><td><b>' + point[count].name + ' Bike Station currently has ' + point[count].available_bikes + ' bikes available and ' + point[count].available_bike_stands + ' stands available </b></td></tr></table>'
        },
        geometry: {
          type: 'Point',
          coordinates: [point[count].position.lng, point[count].position.lat]
        }
      }

      var bikeStationOptions = {
        radius: 8,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 1 // setMarkerIntensity(spaces)

      }

      var bikeIcon = L.Icon.extend({
        options: {
          iconSize: [36, 45],
          iconAnchor: [18, 45],
          popupAnchor: [-3, -46]
        }
      })

      bikeStations.addLayer(L.geoJson(bikeStation, {
        onEachFeature: onEachBikeFeature,
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: setBikeStationColour(point[count].available_bikes, point[count].bike_stands) }).bindPopup(bikeStation.popupContent)
        }
      }))

      count++
    } // close bikes

    function onEachBikeFeature (feature, layer) {
      popup = layer.bindPopup(layer.feature.properties.popupContent) // essential
    }

    function setBikeStationColour (bikes, totalStands) {
      var percentageFree = (bikes / totalStands) * 100

      var one = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike20.png' })
      var two = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike40.png' })
      var three = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike60.png' })
      var four = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike80.png' })
      var five = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike100.png' })
      var six = new bikeIcon({ iconUrl: '/dublindashboard/img/Dashboard/icons/bike120.png' })

      /* return percentageFree < 20 ? '#eff3ff' :
                     percentageFree < 40  ? '#c6dbef' :
                     percentageFree < 60  ? '#9ecae1' :
                     percentageFree < 80  ? '#6baed6' :
                     percentageFree < 100   ? '#3182bd' :
                     percentageFree < 120   ? '#08519c' :
                     '#000000'; */

      return percentageFree < 20 ? one
        : percentageFree < 40 ? two
          : percentageFree < 60 ? three
            : percentageFree < 80 ? four
              : percentageFree < 101 ? five
              // percentageFree < 120   ? six :
                : 'six'
    }
  })

  function onEachFeature (feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    })
    // }
  }

  function resetHighlight (e) {
    var layer = e.target
    layer.setStyle({ // highlight the feature
      weight: 1,
      color: '#666',
      dashArray: ''
      // fillOpacity: setMarkerIntensity(
    })
  }

  function highlightFeature (e) {
    var layer = e.target

    layer.setStyle({ // highlight the feature
      weight: 5,
      color: '#666',
      dashArray: ''
      // fillOpacity: 0.6
    })

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront()
    }

    popup = layer.bindPopup(layer.feature.properties.popupContent) // essential
  }

  // CARPARKS
  $.get('/CarParks/nowParking', function (point) {
    obj = JSON.parse(point)
    var date = new Date()
    // var time = date.getTime(); /use this for dynamically chaning events!
    var time = '1'

    // count how many variables (carparks) we have
    var key; var count = 0
    for (key in obj) {
      count++
    }

    var i = 0
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        // alert("OK");
        var name = prop
        var spaces = obj[prop]
        if (spaces == 'FULL') {
          spaces = 0
        }

        var text = '<table style="width:300px"><tr><td><b>' + getName(name).name + ' Car Park currently has ' + spaces + ' spaces (Total Spaces:' + getName(name).totalSpaces + ') </b></td></tr></table>'
        if (spaces == ' ') {
          var text = '<b>No Data currently availaibe for ' + getName(name).name + ' Car Park</b>'
          spaces = 10000
        }

        var carparkSite = {
          type: 'Feature',
          properties: {
            name: '' + name + ' Centre Car Park',
            amenity: 'Car Park',
            popupContent: text
          },
          geometry: {
            type: 'Point',
            coordinates: [getName(name).lat, getName(name).lon]
          }
        }

        var carparkSiteOptions = {
          radius: 8,
          // fillColor: "#ff7800",
          fillColor: setMarkerColor(spaces, getName(name).totalSpaces), // colours[i], //
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 1 // setMarkerIntensity(spaces)
        }

        carParks.addLayer(L.geoJson(carparkSite, {
          onEachFeature: onEachFeature,
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, carparkSiteOptions)
          }
        }))
      }

      i++
    } // close loop looking at json

    trafficCams.addLayer(L.geoJson(trafficCam1, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam2, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam3, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam4, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam5, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam6, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam7, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam8, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam9, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam10, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam11, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam12, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam13, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam14, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam15, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam16, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam17, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam18, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam19, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam20, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam21, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam22, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam23, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam24, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam25, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam26, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam27, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam28, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam29, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam30, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam31, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam32, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam33, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam34, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam35, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam36, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam37, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam38, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam39, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))
    trafficCams.addLayer(L.geoJson(trafficCam40, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    /* trafficCams.addLayer( L.geoJson(trafficCam41,{
                 onEachFeature: onEachTrafficCamFeature,  pointToLayer: function (feature, latlng) {
                 return L.marker(latlng, {icon:trafficIcon});
                 }})); */

    /* trafficCams.addLayer( L.geoJson(trafficCam42,{
                 onEachFeature: onEachTrafficCamFeature,  pointToLayer: function (feature, latlng) {
                 return L.marker(latlng, {icon:trafficIcon});
                 }})); */

    /* trafficCams.addLayer( L.geoJson(trafficCam43,{
                 onEachFeature: onEachTrafficCamFeature,  pointToLayer: function (feature, latlng) {
                 return L.marker(latlng, {icon:trafficIcon});
                 }})); */

    trafficCams.addLayer(L.geoJson(trafficCam44, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    trafficCams.addLayer(L.geoJson(trafficCam45, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    trafficCams.addLayer(L.geoJson(trafficCam46, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    trafficCams.addLayer(L.geoJson(trafficCam47, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    /* trafficCams.addLayer( L.geoJson(trafficCam48,{
                 onEachFeature: onEachTrafficCamFeature,  pointToLayer: function (feature, latlng) {
                 return L.marker(latlng, {icon:trafficIcon});
                 }})); */

    /* trafficCams.addLayer( L.geoJson(trafficCam49,{
                 onEachFeature: onEachTrafficCamFeature,  pointToLayer: function (feature, latlng) {
                 return L.marker(latlng, {icon:trafficIcon});
                 }}));  */

    /* trafficCams.addLayer( L.geoJson(trafficCam50,{
                 onEachFeature: onEachTrafficCamFeature,  pointToLayer: function (feature, latlng) {
                 return L.marker(latlng, {icon:trafficIcon});
                 }}));  */

    trafficCams.addLayer(L.geoJson(trafficCam51, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    trafficCams.addLayer(L.geoJson(trafficCam52, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    trafficCams.addLayer(L.geoJson(trafficCam53, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    /* trafficCams.addLayer( L.geoJson(trafficCam54,{
                 onEachFeature: onEachTrafficCamFeature,  pointToLayer: function (feature, latlng) {
                 return L.marker(latlng, {icon:trafficIcon});
                 }})); */

    /* trafficCams.addLayer( L.geoJson(trafficCam55,{
                 onEachFeature: onEachTrafficCamFeature,  pointToLayer: function (feature, latlng) {
                 return L.marker(latlng, {icon:trafficIcon});
                 }})); */

    trafficCams.addLayer(L.geoJson(trafficCam56, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    trafficCams.addLayer(L.geoJson(trafficCam57, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    trafficCams.addLayer(L.geoJson(trafficCam58, {
      onEachFeature: onEachTrafficCamFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: trafficIcon })
      }
    }))

    if (initial == 1 || map.hasLayer(carParks)) {
      carParks.addTo(map)
      trafficCams.addTo(map)
      bikeStations.addTo(map)
    }
    // carParks.addTo(map);

    function onEachTrafficCamFeature (feature, layer) {
      popup = layer.bindPopup(layer.feature.properties.popupContent) // essential
    }

    function onEachFeature (feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
      })
      // }
    }

    function resetHighlight (e) {
      var layer = e.target
      layer.setStyle({ // highlight the feature
        weight: 1,
        color: '#666',
        dashArray: ''
        // fillOpacity: setMarkerIntensity(
      })
    }

    function highlightFeature (e) {
      var layer = e.target

      layer.setStyle({ // highlight the feature
        weight: 5,
        color: '#666',
        dashArray: ''
        // fillOpacity: 0.6
      })

      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront()
      }

      popup = layer.bindPopup(layer.feature.properties.popupContent) // essential
    }

    function highlightRoadFeature (e) {
      var layer = e.target

      layer.setStyle({ // highlight the feature
        weight: 10,
        color: '#FF0000',
        dashArray: ''
        // fillOpacity: 0.6
      })

      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront()
      }

      layer.bindPopup(layer.feature.properties.popupContent) // essential
    }

    setTimeout(myFunction, 300000) // milliseconds 300000 - 5mins

    //  setTimeout(myFunction, 120000); //milliseconds 120000 - 2mins

    var divData = document.getElementById('dataSources')
    divData.innerHTML = ''
    divData.innerHTML = divData.innerHTML + '<h5>Data Sources</h5>'
    divData.innerHTML = divData.innerHTML + '<h5>The Car Park Data is supplied via Cork Smart Gateway. The colour gradient is determined by the percentage of available spaces. More information about this data can be found <a href="http://data.corkcity.ie/dataset/parking" target="_blank">here.</a></h5>'

    divData.innerHTML = divData.innerHTML + '<h5>The Traffic Camera Data is supplied directly by Transport Infrastructure Ireland. More information about this data can be found <a href="https://www.tiitraffic.ie/cams/" target="_blank">here.</a></h5>'
    divData.innerHTML = divData.innerHTML + '<h5>The Cork Bikes Data is obtained from the National Transport Authority and Coca-Cola Zero Bikes API. More information about this data can be found <a href="https://www.bikeshare.ie/cork.html" target="_blank">here.</a></h5>'
  })
} // end of myFunction

/* function setTripsColourCSV(speed){

         if(speed < 50){

         return 'blue';
         }
         else {

         return 'green';
         }

         } */

function setBikeStationColour (bikes, totalStands) {
  var percentageFree = (bikes / totalStands) * 100

  return percentageFree < 20 ? '#eff3ff'
    : percentageFree < 40 ? '#c6dbef'
      : percentageFree < 60 ? '#9ecae1'
        : percentageFree < 80 ? '#6baed6'
          : percentageFree < 101 ? '#3182bd'
            : percentageFree < 120 ? '#08519c'
              : '#000000'
}

function setTripsColourCSV (travelTime) {
  return travelTime < 1 ? '#f7fcb9'
    : travelTime < 2 ? '#d9f0a3'
      : travelTime < 3 ? '#addd8e'
        : travelTime < 4 ? '#78c679'
          : travelTime < 5 ? '#41ab5d'
            : travelTime < 6 ? '#238443'
              : travelTime < 7 ? '#006837'
                : '#004529'
}

Number.prototype.toRad = function () {
  return this * Math.PI / 180
}

function getDistance (fromLat, fromLon, toLat, toLon) {
  var lat2 = toLat
  var lon2 = toLon
  var lat1 = fromLat
  var lon1 = fromLon
  var R = 6371 // km

  var x1 = lat2 - lat1
  var dLat = x1.toRad()
  var x2 = lon2 - lon1
  var dLon = x2.toRad()
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c

  return d
}

function setMarkerColor (spaces, totalSpaces) {
  if (spaces == 10000) { // no data
    return '#000000'
  }
  var percentageFree = (spaces / totalSpaces) * 100

  /* return percentageFree < 10 ? '#fff7ec' :
             percentageFree < 20  ? '#fee8c8' :
             percentageFree < 30  ? '#fdd49e' :
             percentageFree < 40  ? '#fdbb84' :
             percentageFree < 50   ? '#fc8d59' :
             percentageFree < 60   ? '#ef6548' :
             percentageFree < 70   ? '#d7301f' :
             percentageFree < 80   ? '#b30000' :
             percentageFree < 90   ? '#8f0000' :
             percentageFree < 120  ? '#7f0000' :
             '#000000'; */

  return percentageFree < 10 ? '#7f0000'
    : percentageFree < 20 ? '#8f0000'
      : percentageFree < 30 ? '#b30000'
        : percentageFree < 40 ? '#d7301f'
          : percentageFree < 50 ? '#ef6548'
            : percentageFree < 60 ? '#fc8d59'
              : percentageFree < 70 ? '#fdbb84'
                : percentageFree < 80 ? '#fdd49e'
                  : percentageFree < 90 ? '#fee8c8'
                    : percentageFree < 120 ? '#fff7ec'
                      : '#000000'
}
