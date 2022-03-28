const fs = require('fs')

module.exports = {
  makeId,
  saveToFile,
}

function makeId(startSymb = '', length = 13) {
  let text = startSymb
  const possible = '0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function saveToFile(path, entities) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(entities, null, 2), (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
