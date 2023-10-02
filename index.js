const fs = require('fs')
const axios = require('axios')

const currentIndex = require('./current_index.json').index
const toProcessAmount = 100

const outputName = './annotations-#/'
const output = outputName.replace('#', (currentIndex / toProcessAmount))

const main = async (file, token) => {


	fs.mkdirSync(output)

  const docs = JSON.parse(fs.readFileSync(file))

  const serie = currentIndex + toProcessAmount
  let index

  for (index = currentIndex; index < serie && index < docs.length; index++) {
    const doc = docs[index]
    console.log(`downloading #${index}:${doc.id}`)
    await annotationDownload(doc.id, token)
    await pdfDownload(doc.id, token)
  }

  fs.writeFileSync('./current_index.json', JSON.stringify({index}))
}

const pdfDownload = (id, token) => {
  return axios({
    method: 'get',
    url: 'https://tagger-api.theeye.io/api/Documents/' + id + '/original?access_token=' + token,
    responseType: 'stream'
  }).then(response => {
    const writer = fs.createWriteStream(output + id + '.pdf')
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

const annotationDownload = (id, token) => {
  return axios({
    method: 'get',
    url: 'https://tagger-api.theeye.io/api/Documents/' + id + '/annotation?access_token=' + token,
    responseType: 'stream'
  }).then(response => {
    const writer = fs.createWriteStream(output + id + '.json')
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

main(process.argv[2], process.argv[3])

