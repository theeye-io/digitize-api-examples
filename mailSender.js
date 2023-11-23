require('dotenv').config()
const sendmail = require('theeye-bot-sdk/core/mail/sender')
const fs = require('fs')
const path = require('path')

const main = module.exports = async (args = []) => {
  if (!args[0]) {
    throw new Error('dirname argument required')
  }

  let count = parseInt(args[1])
  if (isNaN(count)) {
    throw new Error('the documents count is required')
  }

  let dirname = args[0]
  if (dirname[ dirname.length - 1 ] === '/') {
    dirname = dirname.slice(0, -1)
  }

  const files = fs.readdirSync(dirname)
  if (!fs.existsSync(`${dirname}/uploaded`)) {
    fs.mkdirSync(`${dirname}/uploaded`)
  }

  for (let index = 0; index < count; index++) {
    const hash = new Date().getTime()
    const counter = index + 1
    const filename = `${dirname}/${files[index]}`
    console.log(`sending email ${counter}`)
    await sendmail([
      `Factura PDF AP ${hash}`,
      'theeye_dev@newsan.com.ar',
      `Factura de prueba Marzo ${hash}`,
      [ filename ]
    ])

    fs.renameSync(filename, `${dirname}/uploaded/${files[index]}`)
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).then(console.log).catch(console.error)
}
