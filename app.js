// const createError = require('http-errors')
const path = require('path')
const cookieParser = require('cookie-parser')
// const fs = require('fs')
const logger = require('./utils/logger')
const console = require('console')
require('dotenv').config()

// const cron = require('node-cron')
const morgan = require('morgan')
// const sm = require('sitemap');
const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())

/*
client caching of data files can be tiered based on whether the data is staic or dynamic (changing often)
* can set cache for any files in public sub-dirs
* e.g. if frequently-changed files are placed in public/static and max-age applied, stale versions may be loaded from cache
*/

/* express.static config object
* note this doesn't capture all the deafults
*/
// const staticOptions = {
//   // dotfiles: 'ignore',
//   etag: true,
//   // extensions: ['htm', 'html'],
//   // index: false,
//   maxAge: 0,
//   // redirect: false,
//   setHeaders: function (res, path, stat) {
//     res.set('cache-control', 'public')
//   }
// }

// use cached version of files if age < 1 day when placed in public/data/static dir
app.use('/data/static/', express.static(path.join(__dirname, 'public', 'data', 'static'), { maxage: '1d' }))

// uses default cache-control settings for Express
app.use('/', express.static(path.join(__dirname, 'public')))

// logger.debug("Overriding 'Express' logger");

// output http logs on the sevrer
app.use(morgan('tiny', {
  stream: logger.stream,
  skip: function (req, res) { return res.statusCode < 400 }
}))

// get routes files
const home = require('./routes/home')
const themes = require('./routes/themes')
const stories = require('./routes/stories')
const queries = require('./routes/queries')
const tools = require('./routes/tools')
const portal = require('./routes/portal')
const api = require('./routes/api')

// view engine setup
app.set('views', [path.join(__dirname, 'views'),
path.join(__dirname, 'views/themes'),
path.join(__dirname, 'views/stories'),
path.join(__dirname, 'views/queries'),
path.join(__dirname, 'views/tools'),
path.join(__dirname, 'views/portal'),
path.join(__dirname, 'views/api')])

app.set('view engine', 'pug')

app.use('/', home)
app.use('/themes', themes)
app.use('/stories', stories)
app.use('/queries', queries)
app.use('/tools', tools)
app.use('/portal', portal)
app.use('/api', api)

// //additional functionality from node modules

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next((404))
})

// error handler
app.use(function (err, req, res, next) {
  // console.log('error handler')
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // adding winston logging for this error handler
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const hour = new Date().getHours()
const min = new Date().getMinutes().toString().padStart(2, '0')
console.log('\n\ Cork Dashboard App started at ' + hour + ':' + min + '\n\n')

if (app.get('env') === 'development') {
  console.log('\n\n***App is in dev***\n\n')
} else {
  console.log('\n\n***App is in production***\n\n')
}

/************
 Fetching dublin bikes data via Derilinx API for various time resolutions and spans
 ************/
// const bikesQuery = require('./services/derilinx-api-query.js')

// // Every night at 3.45 am
// cron.schedule('45 3 * * *', () => {
//   console.log('\n\nRunning bikes cron\n\n')

//   // Generating date queries to GET each night in cron
//   const yesterdayStart = moment.utc().subtract(1, 'days').startOf('day')
//   const yesterdayEnd = moment.utc().subtract(1, 'days').endOf('day')
//   const weekStart = moment.utc().subtract(1, 'weeks').startOf('day')
//   const monthStart = moment.utc().subtract(1, 'months').startOf('day')

//   // call a function getAllStationsDataHourly from bikesQuaery
//   bikesQuery.getAllStationsDataHourly(yesterdayStart, yesterdayEnd)
//     .then((data) => {
//       if (data.length >= 1) {
//         const e = new moment(yesterdayEnd)
//         const s = new moment(yesterdayStart)
//         const durMs = moment.duration(e.diff(s))
//         const durHrs = Math.ceil(durMs / 1000 / 60 / 60)
//         // console.log("\nQuery duration (hours): " + durHrs);
//         const filePath = path.normalize('./public/data/Transport/dublinbikes/')
//         const fileName = 'day.json'
//         const fullPath = path.join(filePath, fileName)
//         fs.writeFile(fullPath, JSON.stringify(data, null, 2), (err) => {
//           if (!err) {
//             console.log(`\nFS File Write finished ${fullPath}\n`)
//           }
//         })
//       } else {
//         // res.send("Error fetching data");
//         console.log('\nWrite to file error: ' + err)
//       }
//     })
//     .catch((err) => {
//       console.log('\n\n Handling errror ' + err)
//     })

//   bikesQuery.getAllStationsDataHourly(weekStart, yesterdayEnd)
//     .then((data) => {
//       if (data.length >= 1) {
//         const e = new moment(weekStart)
//         const s = new moment(yesterdayEnd)
//         const durMs = moment.duration(e.diff(s))
//         const durHrs = Math.ceil(durMs / 1000 / 60 / 60)
//         // console.log("\nQuery duration (hours): " + durHrs);
//         const filePath = path.normalize('./public/data/Transport/dublinbikes/')
//         const fileName = 'week.json'
//         const fullPath = path.join(filePath, fileName)
//         fs.writeFile(fullPath, JSON.stringify(data, null, 2), (err) => {
//           if (!err) {
//             console.log(`\nFS File Write finished ${fullPath}\n`)
//           }
//         })
//       } else {
//         // res.send("Error fetching data")
//         console.log('\nWrite to file error: ' + err)
//       }
//     })
//     .catch((err) => {
//       console.log('\n\n Handling errror ' + err)
//     })

//   bikesQuery.getAllStationsDataHourly(monthStart, yesterdayEnd)
//     .then((data) => {
//       if (data.length >= 1) {
//         const e = new moment(monthStart)
//         const s = new moment(yesterdayEnd)
//         const durMs = moment.duration(e.diff(s))
//         const durHrs = Math.ceil(durMs / 1000 / 60 / 60)
//         // console.log("\nQuery duration (hours): " + durHrs);
//         const filePath = path.normalize('./public/data/Transport/dublinbikes/')
//         const fileName = 'month.json'
//         const fullPath = path.join(filePath, fileName)
//         fs.writeFile(fullPath, JSON.stringify(data, null, 2), (err) => {
//           if (!err) {
//             console.log(`\nFS File Write finished ${fullPath}\n`)
//           }
//         })
//       } else {
//         // res.send("Error fetching data");
//         console.log('\nWrite to file error: ' + err)
//       }
//     })
//     .catch((err) => {
//       console.log('\n\n Handling errror ' + err)
//     })
// })

// /* TODO: refactor to await/async to remove dupliation */
// cron.schedule('*/1 * * * *', function () {
//   const http = require('https')
//   const fetch = require('node-fetch')
//   const travelTimesFile = fs.createWriteStream('./public/data/Transport/traveltimes.json')
//   http.get('https://dataproxy.mtcc.ie/v1.5/api/traveltimes', function (response, error) {
//     const d = new Date()
//     if (error) {
//       return console.log('>>>Error on traveltimes GET @ ' + d + '\n')
//     }

//     // console.log(">>>Successful traveltimes GET @ " + d + "\n");
//     response.pipe(travelTimesFile)
//     //   // const {
//     //   //   statusCode
//     //   // } = response;
//     //   // response.on('end', function() {
//     //   //   apiStatus.traveltimes.status = statusCode;
//     //   //   //            console.log(JSON.stringify(apiStatus));
//     //   //   fs.writeFile(apiStatusUpdate, JSON.stringify(apiStatus, null, 2), function(err) {
//     //   //     if (err)
//     //   //       return console.log(">>>Error writing traveltimes to api-status.json\n" + err);
//     //   //   });
//     //   // });
//   })

//   const travelTimesRoadsFile = fs.createWriteStream('./public/data/Transport/traveltimesroad.json')
//   http.get('https://dataproxy.mtcc.ie/v1.5/api/fs/traveltimesroad', function (response, error) {
//     if (error) {
//       return console.log('>>>Error on traveltimesroads GET\n')
//     }
//     response.pipe(travelTimesRoadsFile)

//     //     const {
//     //       statusCode
//     //     } = response;
//     //     response.on('end', function() {
//     //       apiStatus.traveltimesroads.status = statusCode;
//     //       //            console.log(JSON.stringify(apiStatus));
//     //       fs.writeFile(apiStatusUpdate, JSON.stringify(apiStatus, null, 2), function(err) {
//     //         if (err)
//     //           return console.log(">>>Error writing traveltimesroads to api-status.json\n" + err);
//     //       });
//     //     });
//   })
// })

// // Water Levels
// // cron.schedule('*/15 * * * *', function () {
// //   var http = require('http')
// //   var fs = require('fs')
// //   var file = fs.createWriteStream('./public/data/Environment/waterlevel.json')
// //   http.get('http://waterlevel.ie/geojson/latest/', function (response) {
// //     response.pipe(file)
// //   })
// // })

// // Weather (from old Dublin Dashboard)
// // cron.schedule('*/5 * * * *', function () {
// //   let http = require('https')
// //   let file = fs.createWriteStream('./public/data/Environment/met_eireann_forecast.xml')
// //   http.get('https://dublindashboard.ie/met_eireann_forecast.xml', function (response) {
// //     response.pipe(file)
// //   })
// // })

// // Sound level readings
// cron.schedule('*/5 * * * *', function () {
//   const http = require('https')
//   const files = []
//   for (let i = 0; i < 15; i += 1) {
//     const n = i + 1
//     files[i] = fs.createWriteStream('./public/data/Environment/noise_levels/sound_reading_' + n + '.json')
//     http.get('https://dublincitynoise.sonitussystems.com/applications/api/dublinnoisedata.php?location=' + n,
//       function (response) {
//         response.pipe(files[i])
//       })
//   }
// })

// // get train data from the API evey minute
// cron.schedule('*/5 * * * *', function () {
//   var http = require('http')
//   var fs = require('fs')
//   var file = fs.createWriteStream('./public/data/Transport/Train_data.xml')
//   http.get('http://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=A', function (response) {
//     response.pipe(file)
//   })
// })

// readFileAsync()

module.exports = app
