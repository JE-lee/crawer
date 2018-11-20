
const request = require('request')
const iconv = require('iconv-lite')

function getPageHtml(url, textCoding = 'utf8'){
  let buffer = Buffer.alloc(0)
  return new Promise((resolve, reject) => {
    request.get({
      url,
      timeout: 2000
    }).on('data', chunk => {
      buffer = Buffer.concat([buffer, chunk])
    }).on('end', () => {
      let str = iconv.decode(buffer, textCoding)
      resolve(str)
    }).on('error', err => {
      reject(err)
      //Todo, 关闭流
    })
  })
}

module.exports = {
  getPageHtml
}