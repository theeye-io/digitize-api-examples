
const fs = require('fs')
const axios = require('axios')

const token = process.env.TAGGER_ACCESS_TOKEN

const main = async (file) => {

  const docs = JSON.parse(fs.readFileSync(file))

  for (let index = 0; index < docs.length; index++) {

    const doc = docs[index]
    console.log('downloading ' + doc.id)

    await annotationDownload(doc.id)
    await pdfDownload(doc.id)
  }
}

const pdfDownload = (id) => {
  return axios({
    method: 'get',
    url: 'https://tagger-api.theeye.io/api/Documents/' + id + '/original?access_token=' + token,
    responseType: 'stream'
  }).then(response => {
    const writer = fs.createWriteStream(id + '.pdf')
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close()
        reject(err)
      })
      writer.on('close', () => {
        if (!error) { resolve(true) }
      })
    })
  })
}

const annotationDownload = (id) => {
  return axios({
    method: 'get',
    url: 'https://tagger-api.theeye.io/api/Documents/' + id + '/annotation?access_token=' + token,
    responseType: 'stream'
  }).then(response => {
    const writer = fs.createWriteStream(id + '.json')
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close()
        reject(err)
      })
      writer.on('close', () => {
        if (!error) { resolve(true) }
      })
    })
  })
}

main('./febrero.json')
