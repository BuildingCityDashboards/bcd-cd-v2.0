d3.csv('./data/static/CNA13.json')
// d3.csv('https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/CNA13')
  .then(data => {
    console.log('csv loaded with length ' + data.length)
  })
