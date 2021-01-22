const GEODEMOS_COLORWAY_CATEGORICAL = ['#feedde',
  '#fdd0a2',
  '#fdae6b',
  '#fd8d3c',
  '#f16913',
  '#d94801',
  '#8c2d04']
const GEODEMOS_COLORWAY_CBSAFE = ['#d73027', '#f46d43', '#fdae61', '#fee090', '#abd9e9', '#74add1', '#4575b4']
const GEODEMOS_COLORWAY = GEODEMOS_COLORWAY_CATEGORICAL
// const gToLa =['Group1','Group2','Group3','Group4','Group5','Group6','Group7']

let heatmapLayout = {}

addHeatmap()
function addHeatmap () {
  const GroupsArray = ['Group1', 'Group2', 'Group3', 'Group4', 'Group5', 'Group6', 'Group7']
  heatmapLayout = Object.assign({}, ROW_CHART_LAYOUT)
  heatmapLayout.height = 500
  heatmapLayout.width = 560
  // layout.barmode = 'group';
  heatmapLayout.plot_bgcolor = '#293135',
  heatmapLayout.paper_bgcolor = '#293135'

  heatmapLayout.colorway = GEODEMOS_COLORWAY
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

  d3.text('/data/tools/geodemographics/dublin_zscores.csv')
    .then((zScores) => {
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
      // Plotly.purge('chart-geodemos');
      Plotly.newPlot('geodemos-heatmap', heatmapTraces, heatmapLayout)
    })
}
