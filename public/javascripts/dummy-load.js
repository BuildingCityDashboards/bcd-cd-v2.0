d3.csv('./data/static/population.csv')
  .then(data => {
    console.log('csv loaded with length ' + data.length)
  })
