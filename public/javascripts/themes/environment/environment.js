let wasteChart, recyclingsChart, organicrecyclingsChart, waterconsChart, riverqualitiesChart, greenflagsChart, localagendasChart
let recyclings_tooltip, orChart_tooltip, wcChart_tooltip, rqChart_tooltip, greenflags_tooltip

Promise.all([
  d3.csv('../data/Environment/wastes.csv'),
  d3.csv('../data/Environment/recyclings.csv'),
  d3.csv('../data/Environment/organicrecyclings.csv'),
  d3.csv('../data/Environment/watercons.csv'),
  d3.csv('../data/Environment/riverqualities.csv'),
  d3.csv('../data/Environment/greenflags.csv'),
  d3.csv('../data/Environment/localagendas.csv')
]).then(datafiles => {
  // setup chart and data for Waste
  // process the data
  const wasteData = datafiles[0];
    const wasteType = wasteData.columns.slice(2);
    const wasteDate = wasteData.columns[0];
    const wasteRegions = wasteData.columns[1];
    const wasteDataProcessed = dataSets(wasteData, wasteType)

  wasteDataProcessed.forEach(d => {
    d.label = d[wasteDate]
    d[wasteDate] = parseYear(d[wasteDate])
  })

  // need to convert date field to readable js date format
  // nest the processed data by regions
  const wasteDataNested = d3.nest().key(d => {
    return d[wasteRegions]
    })
    .entries(wasteDataProcessed)

  // console.log("wasteDataNested " + JSON.stringify(wasteDataNested));

  const wasteContent = {
    elementId: 'chart-waste',
    yV: wasteType[0],
    xV: wasteDate,
    data: wasteDataNested,
    tX: 'years',
    tY: 'Kg'
  }

  // draw the chart
  wasteChart = new MultiLineChart(wasteContent)
  wasteChart.drawChart()
  wasteChart.addTooltip('Waste - Year ', 'thousands', 'label', '', 'Kg')

  //  Setup data and chart for recyclings
  const recyclingsData = datafiles[1];
    const recyclingsTypes = recyclingsData.columns.slice(1);
    const recyclingsDate = recyclingsData.columns[0];
    const recyclingsDataProcessed = dataSets(recyclingsData, recyclingsTypes);

    const recyclingsContent = {
      elementId: 'chart-recyclings',
      data: recyclingsDataProcessed,
      ks: recyclingsTypes,
      xV: recyclingsDate,
      yV: 'value',
      tX: 'Years',
      tY: '%',
      ySF: 'percentage'
    }

  // drawing charts for planning data.
  recyclingsChart = new GroupedBarChart(recyclingsContent)
  recyclings_tooltip = {}

  //title, format, date
  recyclings_tooltip.title = 'Recycling Rate Dry - Year';
  recyclings_tooltip.format = 'percentage';
  recyclings_tooltip.date = recyclingsDate

  recyclingsChart.addTooltip(recyclings_tooltip)
  recyclingsChart.hideRate(true)


  //  Setup data and chart for organic recyclings
  const organicrecyclingsData = datafiles[2];
    const organicrecyclingsTypes = organicrecyclingsData.columns.slice(1);
    const organicrecyclingsDate = organicrecyclingsData.columns[0];
    const organicrecyclingsDataProcessed = dataSets(organicrecyclingsData, organicrecyclingsTypes);

    const organicrecyclingsContent = {
      elementId: 'chart-organicrecyclings',
      data: organicrecyclingsDataProcessed,
      ks: organicrecyclingsTypes,
      xV: organicrecyclingsDate,
      tX: 'Years',
      tY: '%',
      ySF: 'percentage'
    }

  // drawing charts for planning data.
  organicrecyclingsChart = new GroupedBarChart(organicrecyclingsContent)
  orChart_tooltip = {}

  //title, format, date
  orChart_tooltip.title = 'Recycling Rate Organics - Year';
  orChart_tooltip.format = 'percentage';
  orChart_tooltip.date = recyclingsDate

  organicrecyclingsChart.addTooltip(orChart_tooltip)
  organicrecyclingsChart.hideRate(true)


  // data and chart for watercons
  const waterconsData = datafiles[3];
    const waterconsTypes = waterconsData.columns.slice(1);
    const waterconsDate = waterconsData.columns[0];
    const waterconsDataProcessed = dataSets(waterconsData, waterconsTypes);

    const waterconsContent = {
      elementId: 'chart-watercons',
      data: waterconsDataProcessed,
      ks: waterconsTypes,
      xV: waterconsDate,
      tX: 'Years',
      tY: 'Litres'
      // yScaleFormat: "percentage"
    }

  wcChart_tooltip = {
    // title, format, date
    title: 'Water Consumption - Year',
    format: 'thousands',
    date: waterconsDate
  }

  // drawing charts for planning data.
  waterconsChart = new GroupedBarChart(waterconsContent)

  waterconsChart.addTooltip(wcChart_tooltip)


  // data and chart for riverqualities
  const riverqualitiesData = datafiles[4];
    const riverqualitiesTypes = riverqualitiesData.columns.slice(1);
    const riverqualitiesDate = riverqualitiesData.columns[0];
    const riverqualitiesDataProcessed = dataSets(riverqualitiesData, riverqualitiesTypes);

    const riverqualitiesContent = {
      elementId: 'chart-riverqualities',
      data: riverqualitiesDataProcessed,
      ks: riverqualitiesTypes,
      xV: riverqualitiesDate,
      tX: 'Years',
      tY: '% of Surveryed Channel Length (1156.5km)'
      // yScaleFormat: "percentage"
    }

  rqChart_tooltip = {
    // title, format, date
    title: 'Water Quality - Year',
    format: 'thousands',
    date: riverqualitiesDate
  }

  // drawing charts for planning data.
  riverqualitiesChart = new GroupedBarChart(riverqualitiesContent)
  riverqualitiesChart.addTooltip(rqChart_tooltip)


  // data and chart for green flags
  const greenflagsData = datafiles[5];
    const greenflagsTypes = greenflagsData.columns.slice(1);
    const greenflagsDate = greenflagsData.columns[0];
    const greenflagsDataProcessed = dataSets(greenflagsData, greenflagsTypes);

    const greenflagsContent = {
      elementId: 'chart-greenflags',
      data: greenflagsDataProcessed,
      ks: greenflagsTypes,
      xV: greenflagsDate,
      tX: 'Years',
      tY: 'Number of Schools'
      // yScaleFormat: "percentage"
    }

  greenflags_tooltip = {
    // title, format, date
    title: 'Green Flag Schools - Year',
    format: 'thousands',
    date: greenflagsDate
  }

  // drawing charts for planning data.
  greenflagsChart = new GroupedBarChart(greenflagsContent)
  greenflagsChart.addTooltip(greenflags_tooltip)


  // data and chart for localagendas.csv
  // process the data
  const localagendasData = datafiles[6];
    const localagendasType = localagendasData.columns.slice(2);
    const localagendasDate = localagendasData.columns[0];
    const localagendasRegions = localagendasData.columns[1];
    const localagendasDataProcessed = dataSets(localagendasData, localagendasType)

  localagendasDataProcessed.forEach(d => {
    d.label = d[localagendasDate]
    d[localagendasDate] = parseYear(d[localagendasDate])
  })

  // need to convert date field to readable js date format
  // nest the processed data by regions
  const localagendasDataNested = d3.nest().key(d => {
    return d[localagendasRegions]
    })
    .entries(localagendasDataProcessed)

  // get array of keys from nest
  const localagendasRegionNames = []
  localagendasDataNested.forEach(d => {
    localagendasRegionNames.push(d.key)
  })

  const localagendasContent = {
    elementId: 'chart-localagendas',
    data: localagendasDataNested,
    xV: localagendasDate,
    yV: localagendasType[0],
    tX: 'Years',
    tY: 'Number of Projects'
  }
  // draw the chart
  // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
  localagendasChart = new MultiLineChart(localagendasContent)
  localagendasChart.drawChart()
  localagendasChart.addTooltip('Projects - Year ', 'thousands', 'label', '', '')

}).catch(function (error) {
  console.log(error)
})

function convertQuarter (q) {
  const splitted = q.split('Q')
  let year = splitted[0]
  let quarterEndMonth = splitted[1] * 3 - 2
  let date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year)
  return date
}

function qToQuarter (q) {
  const splitted = q.split('Q')
  let year = splitted[0]
  let quarter = splitted[1]
  let quarterString = ('Quarter ' + quarter + ' ' + year)

  return quarterString
}

function dataSets (data, columns) {
  coercedData = data.map(d => {
    for (var i = 0, n = columns.length; i < n; i++) {
      d[columns[i]] = +d[columns[i]]
    }
    return d
  })

  return coercedData
}

function formatQuarter (date) {
  const newDate = new Date()
  newDate.setMonth(date.getMonth() + 1)

  let year = (date.getFullYear())
  let q = Math.ceil((newDate.getMonth()) / 3)

  return 'Quarter ' + q + ' ' + year
}
