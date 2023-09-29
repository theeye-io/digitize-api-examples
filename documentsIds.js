const fs = require('fs')
const all = require('./current.json')
const ids = [];
all.forEach(d => ids.push(d.id))
fs.writeFileSync('./document_ids', ids.join('\n'))
