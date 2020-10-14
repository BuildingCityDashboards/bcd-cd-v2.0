'use strict'

import { TimeoutError } from './TimeoutError.js'

const fetchJsonFromUrlAsync = async (url) => {
  const res = await fetch(url)
  const json = await res.json()
  return json
}

export { fetchJsonFromUrlAsync }

const fetchJsonFromUrlAsyncTimeout = async (url, duration = 30000) => {
  try {
    if (url != null) {
      const res = await Promise.race([fetch(url), new Promise((resolve, reject) => setTimeout(() => reject(new TimeoutError(`Timeout waiting for <b>${url}</b> to respond to our request for data`)), duration)
      )])
      const json = await res.json()
      return json
    } else {
      console.log(`Error trying to fetch invalid url. url is ${url}`)
    }
  } catch (e) {
    console.log(`Error trying to fetch ${url}`)
    return e
  }
}

const fetchCsvFromUrlAsyncTimeout = async (url, duration = 30000) => {
  try {
    if (url != null) {
      const res = await Promise.race([fetch(url), new Promise((resolve, reject) =>
        setTimeout(() => reject(new TimeoutError(`Timeout waiting for <b>${url}</b> to respond to our request for data`)), duration)
      )])

      // TODO: return parsed csv as array of objects as per d3.csv()
      const csv = await res.text()
      return csv
    } else {
      console.log(`Error trying to fetch invalid url. url is ${url}`)
    }
  } catch (e) {
    console.log(`Error trying to fetch ${url}`)
    return e
  }
}

export { fetchCsvFromUrlAsyncTimeout }

export { fetchJsonFromUrlAsyncTimeout }

const forEachAsync = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index])
  }
}
export { forEachAsync }
