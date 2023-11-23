const fs = require('fs')
const axios = require('axios')

const indexFile = './current_index.json'
if (!fs.existsSync('./current_index.json')) {
  fs.writeFileSync( indexFile, JSON.stringify({ index: 0 }) )
}

const currentIndex = require(indexFile).index

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
    const id = doc.document_id

    console.log(`downloading #${index}:${id}`)
    await pdfDownload(id, token)
    //await annotationDownload(id, token)
  }

  fs.writeFileSync('./current_index.json', JSON.stringify({index}))
}

const pdfDownload = (id, token) => {
  return axios({
    method: 'get',
    url: 'https://tagger-api-dev.theeye.io/api/Documents/' + id + '/original?access_token=' + token,
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

main(process.argv[2], process.argv[3]).catch(e => console.error(e.message))

